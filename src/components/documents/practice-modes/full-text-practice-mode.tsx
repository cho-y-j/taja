'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Clock, Target, Zap, Trophy, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractParagraphs } from '@/lib/documents/document-utils';
import { getPreferredVoice } from '@/lib/speech/tts-utils';
import { playErrorSound, playKeySound } from '@/lib/utils/sound';
import type { UserDocument } from '@/stores/document-store';
import { TimeSelector, PracticeControls, PracticeResult } from '@/components/practice';

type ViewMode = 'time' | 'practice' | 'result';

interface SessionStats {
  totalParagraphs: number;
  totalCharacters: number;
  correctCharacters: number;
  totalTime: number;
}

interface Props {
  document: UserDocument;
}

export function FullTextPracticeMode({ document: doc }: Props) {
  const allParagraphs = useMemo(() => extractParagraphs(doc.content), [doc.content]);

  const [viewMode, setViewMode] = useState<ViewMode>('time');
  const [practiceTime, setPracticeTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Current paragraph
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [currentParagraph, setCurrentParagraph] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  // Real-time metrics
  const [currentWpm, setCurrentWpm] = useState(0);

  // Session stats
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalParagraphs: 0,
    totalCharacters: 0,
    correctCharacters: 0,
    totalTime: 0,
  });

  // Audio
  const [autoListen, setAutoListen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFinishedRef = useRef(false);
  const isComposingRef = useRef(false);
  const prevInputRef = useRef('');

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    };
  }, []);

  // Speak paragraph (Chrome 버그 우회 포함)
  const speakParagraph = useCallback((text: string) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = doc.language === 'ko' ? 'ko-KR' : 'en-US';
      const voice = getPreferredVoice(voices, doc.language);
      if (voice) utterance.voice = voice;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [doc.language, voices]);

  // Initialize paragraphs (순서대로)
  const initializeParagraphs = useCallback(() => {
    setParagraphs(allParagraphs);
    setCurrentParagraphIndex(0);
    setCurrentParagraph(allParagraphs[0] || '');
  }, [allParagraphs]);

  // Time selection
  const handleTimeSelect = useCallback((seconds: number) => {
    setPracticeTime(seconds);
    setTimeRemaining(seconds);
    initializeParagraphs();
    setViewMode('practice');
    setUserInput('');
    setIsStarted(false);
    setIsPaused(false);
    setCurrentWpm(0);
    isFinishedRef.current = false;
    setSessionStats({ totalParagraphs: 0, totalCharacters: 0, correctCharacters: 0, totalTime: 0 });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [initializeParagraphs]);

  // Finish session
  const finishSession = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (wpmTimerRef.current) { clearInterval(wpmTimerRef.current); wpmTimerRef.current = null; }
    window.speechSynthesis?.cancel();
    setSessionStats(prev => ({ ...prev, totalTime: Date.now() - startTimeRef.current }));
    setViewMode('result');
  }, []);

  // Timer
  useEffect(() => {
    if (viewMode !== 'practice' || !isStarted || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { finishSession(); return 0; }
        return prev - 1;
      });
    }, 1000);

    wpmTimerRef.current = setInterval(() => {
      if (startTimeRef.current > 0) {
        setSessionStats(stats => {
          const elapsed = (Date.now() - startTimeRef.current) / 60000;
          if (elapsed > 0 && stats.correctCharacters > 0) {
            setCurrentWpm(Math.round((stats.correctCharacters / 5) / elapsed));
          }
          return stats;
        });
      }
    }, 500);

    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (wpmTimerRef.current) { clearInterval(wpmTimerRef.current); wpmTimerRef.current = null; }
    };
  }, [viewMode, isStarted, isPaused, finishSession]);

  // Move to next paragraph
  const moveToNextParagraph = useCallback(() => {
    const nextIndex = currentParagraphIndex + 1;
    if (nextIndex < paragraphs.length) {
      setCurrentParagraphIndex(nextIndex);
      setCurrentParagraph(paragraphs[nextIndex]);
      if (autoListen) speakParagraph(paragraphs[nextIndex]);
    } else {
      // 다시 처음부터
      setCurrentParagraphIndex(0);
      setCurrentParagraph(paragraphs[0] || '');
      if (autoListen) speakParagraph(paragraphs[0]);
    }
    setUserInput('');
    prevInputRef.current = '';
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentParagraphIndex, paragraphs, autoListen, speakParagraph]);

  // Input handlers
  const handleCompositionStart = useCallback(() => { isComposingRef.current = true; }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    setUserInput(value);
    checkParagraphCompletion(value);
  }, []);

  const checkParagraphCompletion = useCallback((value: string) => {
    if (isFinishedRef.current || !currentParagraph) return;

    // Play sound for each new character
    if (value.length > prevInputRef.current.length) {
      const newCharIndex = value.length - 1;
      if (newCharIndex < currentParagraph.length) {
        if (value[newCharIndex] === currentParagraph[newCharIndex]) {
          playKeySound();
        } else {
          playErrorSound();
        }
      }
    }
    prevInputRef.current = value;

    if (value.length >= currentParagraph.length) {
      let correct = 0;
      for (let i = 0; i < currentParagraph.length; i++) {
        if (value[i] === currentParagraph[i]) correct++;
      }

      setSessionStats(prev => {
        const newStats = {
          ...prev,
          totalParagraphs: prev.totalParagraphs + 1,
          totalCharacters: prev.totalCharacters + currentParagraph.length,
          correctCharacters: prev.correctCharacters + correct,
        };
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0) setCurrentWpm(Math.round((newStats.correctCharacters / 5) / elapsed));
        return newStats;
      });

      setTimeout(() => moveToNextParagraph(), 200);
    }
  }, [currentParagraph, moveToNextParagraph]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    if (isComposingRef.current) return;
    checkParagraphCompletion(value);
  }, [isStarted, checkParagraphCompletion]);

  // Pause/Resume
  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  // Restart
  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    window.speechSynthesis?.cancel();
    setViewMode('time');
    isFinishedRef.current = false;
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get results
  const getResults = () => {
    const accuracy = sessionStats.totalCharacters > 0
      ? Math.round((sessionStats.correctCharacters / sessionStats.totalCharacters) * 100)
      : 0;
    const minutes = practiceTime / 60;
    const wpm = minutes > 0 ? Math.round((sessionStats.correctCharacters / 5) / minutes) : 0;
    return { accuracy, wpm };
  };

  // Character feedback
  const getCharacterFeedback = () => {
    return currentParagraph.split('').map((char, index) => {
      if (index < userInput.length) {
        return { char, status: userInput[index] === char ? 'correct' : 'incorrect' };
      }
      if (index === userInput.length) return { char, status: 'current' };
      return { char, status: 'pending' };
    });
  };

  const getCurrentAccuracy = () => {
    if (sessionStats.totalCharacters === 0) return 100;
    return Math.round((sessionStats.correctCharacters / sessionStats.totalCharacters) * 100);
  };

  // Empty document
  if (allParagraphs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">문서 내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // Time selection screen
  if (viewMode === 'time') {
    return (
      <TimeSelector
        presets={[60, 180, 300]}
        onSelect={handleTimeSelect}
        itemCount={allParagraphs.length}
        itemLabel="문단"
        customEnabled
      />
    );
  }

  // Practice screen
  if (viewMode === 'practice') {
    const feedback = getCharacterFeedback();
    const progressPercent = practiceTime > 0 ? ((practiceTime - timeRemaining) / practiceTime) * 100 : 0;
    const isUrgent = timeRemaining <= 10;

    return (
      <div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 mb-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats panel */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className={`col-span-2 rounded-xl p-3 text-center transition-all ${
            isUrgent ? 'bg-red-100 border-2 border-red-400 animate-pulse' : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-[var(--color-primary)]'}`} />
              <span className={`text-3xl font-mono font-bold ${isUrgent ? 'text-red-600' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">남은 시간</p>
          </div>
          <div className="rounded-xl p-3 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-[var(--color-secondary)]" />
              <span className="text-2xl font-bold text-[var(--color-secondary)]">{currentWpm}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
          </div>
          <div className="rounded-xl p-3 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-[var(--color-success)]" />
              <span className="text-2xl font-bold text-[var(--color-success)]">{getCurrentAccuracy()}%</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">정확도</p>
          </div>
        </div>

        {/* Paragraph count */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm">
            <Trophy className="w-4 h-4" />
            완료: {sessionStats.totalParagraphs}문단 | 현재: {currentParagraphIndex + 1}/{paragraphs.length}
          </span>
        </div>

        {/* Pause overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center">
              <Pause className="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" />
              <h2 className="text-2xl font-bold mb-4">일시정지</h2>
              <Button onClick={togglePause} size="lg">
                <Play className="w-5 h-5 mr-2" />
                계속하기
              </Button>
            </Card>
          </div>
        )}

        {/* Typing area */}
        <Card className="mb-4">
          <CardContent className="py-6">
            {/* Target paragraph */}
            <div className="typing-text-display typing-text-md mb-6 min-h-[100px] max-h-[200px] overflow-auto">
              {feedback.map((item, index) => (
                <span
                  key={index}
                  className={`${
                    item.status === 'correct' ? 'text-green-600'
                    : item.status === 'incorrect' ? 'text-red-500 bg-red-100'
                    : item.status === 'current' ? 'bg-yellow-300 animate-pulse'
                    : 'text-gray-400'
                  }`}
                >
                  {item.char === ' ' ? '\u00A0' : item.char}
                </span>
              ))}
            </div>

            {/* Input */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              disabled={isPaused}
              className="w-full p-4 text-lg border-2 border-[var(--color-border)] rounded-lg
                       focus:border-[var(--color-primary)] focus:outline-none
                       bg-[var(--color-surface)] font-mono min-h-[100px] resize-none"
              placeholder={!isStarted ? '타이핑을 시작하면 타이머가 시작됩니다' : ''}
              autoFocus
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <PracticeControls
          isPaused={isPaused}
          isComplete={false}
          onTogglePause={togglePause}
          onRestart={handleRestart}
          ttsEnabled={autoListen}
          onToggleTTS={() => {
            setAutoListen(!autoListen);
            if (!autoListen) speakParagraph(currentParagraph);
          }}
        />
      </div>
    );
  }

  // Result screen
  if (viewMode === 'result') {
    const { accuracy, wpm } = getResults();

    return (
      <PracticeResult
        wpm={wpm}
        accuracy={accuracy}
        totalTime={practiceTime}
        correctCount={sessionStats.totalParagraphs}
        totalCount={sessionStats.totalCharacters}
        countLabel="문단"
        onRestart={handleRestart}
        showStars
      />
    );
  }

  return null;
}
