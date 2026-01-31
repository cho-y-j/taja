'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Clock, Target, Zap, Trophy, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractSentences } from '@/lib/documents/document-utils';
import { getPreferredVoice } from '@/lib/speech/tts-utils';
import { playErrorSound, playKeySound } from '@/lib/utils/sound';
import { useDocumentStore, type UserDocument } from '@/stores/document-store';
import { TimeSelector, PracticeControls, PracticeResult } from '@/components/practice';

type ViewMode = 'time' | 'practice' | 'result';

interface SessionStats {
  totalSentences: number;
  totalCharacters: number;
  correctCharacters: number;
  totalTime: number;
}

interface Props {
  document: UserDocument;
}

// 구조화된 문장 데이터
interface StructuredSentence {
  original: string;
  translation: string;
}

export function SentencePracticeMode({ document: doc }: Props) {
  const { addTranslation, getTranslation } = useDocumentStore();

  // 구조화된 데이터가 있으면 사용, 없으면 기존 방식
  const hasStructuredSentences = doc.structured?.sentences && doc.structured.sentences.length > 0;
  const structuredSentences: StructuredSentence[] = doc.structured?.sentences || [];
  const allSentences = useMemo(() => {
    if (hasStructuredSentences) {
      return structuredSentences.map(s => s.original);
    }
    return extractSentences(doc.content);
  }, [doc.content, hasStructuredSentences, structuredSentences]);

  // 구조화된 문장에서 번역 찾기
  const getStructuredTranslation = useCallback((sentence: string): string | null => {
    if (!hasStructuredSentences) return null;
    const found = structuredSentences.find(s => s.original === sentence);
    return found?.translation || null;
  }, [hasStructuredSentences, structuredSentences]);

  const [viewMode, setViewMode] = useState<ViewMode>('time');
  const [practiceTime, setPracticeTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Current sentence
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  // Real-time metrics
  const [currentWpm, setCurrentWpm] = useState(0);

  // Session stats
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalSentences: 0,
    totalCharacters: 0,
    correctCharacters: 0,
    totalTime: 0,
  });

  // Audio
  const [autoListen, setAutoListen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Translation
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const prevInputRef = useRef('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFinishedRef = useRef(false);
  const isComposingRef = useRef(false);

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

  // Speak sentence
  const speakSentence = useCallback((text: string) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = doc.language === 'ko' ? 'ko-KR' : 'en-US';
    const voice = getPreferredVoice(voices, doc.language);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [doc.language, voices]);

  // Initialize sentences
  const initializeSentences = useCallback(() => {
    const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
    setSentences(shuffled);
    setCurrentSentenceIndex(0);
    setCurrentSentence(shuffled[0] || '');
  }, [allSentences]);

  // Time selection
  const handleTimeSelect = useCallback((seconds: number) => {
    setPracticeTime(seconds);
    setTimeRemaining(seconds);
    initializeSentences();
    setViewMode('practice');
    setUserInput('');
    setIsStarted(false);
    setIsPaused(false);
    setCurrentWpm(0);
    isFinishedRef.current = false;
    setSessionStats({ totalSentences: 0, totalCharacters: 0, correctCharacters: 0, totalTime: 0 });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [initializeSentences]);

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

  // Fetch translation for sentence (with cache)
  const fetchTranslation = useCallback(async (text: string) => {
    if (!text) return;

    // 1. 구조화된 데이터에서 먼저 확인
    const structuredTrans = getStructuredTranslation(text);
    if (structuredTrans) {
      setTranslation(structuredTrans);
      return;
    }

    // 2. 캐시 확인
    const cached = getTranslation(doc.id, text);
    if (cached) {
      setTranslation(cached);
      return;
    }

    // 3. API 호출
    setTranslation('번역 중...');
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          from: doc.language,
          to: doc.language === 'en' ? 'ko' : 'en',
        }),
      });
      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
        addTranslation(doc.id, text, data.translation);
      } else {
        setTranslation('번역 실패');
      }
    } catch {
      setTranslation('번역 오류');
    }
  }, [doc.id, doc.language, getTranslation, addTranslation, getStructuredTranslation]);

  // Move to next sentence
  const moveToNextSentence = useCallback(() => {
    const nextIndex = currentSentenceIndex + 1;
    let nextSentence = '';
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(sentences[nextIndex]);
      nextSentence = sentences[nextIndex];
      if (autoListen) speakSentence(sentences[nextIndex]);
    } else {
      const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
      setSentences(shuffled);
      setCurrentSentenceIndex(0);
      setCurrentSentence(shuffled[0] || '');
      nextSentence = shuffled[0] || '';
      if (autoListen) speakSentence(shuffled[0]);
    }
    setUserInput('');
    prevInputRef.current = '';
    setTranslation('');
    if (showTranslation) fetchTranslation(nextSentence);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentSentenceIndex, sentences, allSentences, autoListen, speakSentence, showTranslation, fetchTranslation]);

  // Input handlers
  const handleCompositionStart = useCallback(() => { isComposingRef.current = true; }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    setUserInput(value);
    checkSentenceCompletion(value);
  }, []);

  const checkSentenceCompletion = useCallback((value: string) => {
    if (isFinishedRef.current || !currentSentence) return;

    // Play sound for each new character
    if (value.length > prevInputRef.current.length) {
      const newCharIndex = value.length - 1;
      if (newCharIndex < currentSentence.length) {
        if (value[newCharIndex] === currentSentence[newCharIndex]) {
          playKeySound();
        } else {
          playErrorSound();
        }
      }
    }
    prevInputRef.current = value;

    if (value.length >= currentSentence.length) {
      let correct = 0;
      for (let i = 0; i < currentSentence.length; i++) {
        if (value[i] === currentSentence[i]) correct++;
      }

      setSessionStats(prev => {
        const newStats = {
          ...prev,
          totalSentences: prev.totalSentences + 1,
          totalCharacters: prev.totalCharacters + currentSentence.length,
          correctCharacters: prev.correctCharacters + correct,
        };
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0) setCurrentWpm(Math.round((newStats.correctCharacters / 5) / elapsed));
        return newStats;
      });

      setTimeout(() => moveToNextSentence(), 200);
    }
  }, [currentSentence, moveToNextSentence]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    if (isComposingRef.current) return;
    checkSentenceCompletion(value);
  }, [isStarted, checkSentenceCompletion]);

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
    return currentSentence.split('').map((char, index) => {
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

  // Time selection screen
  if (viewMode === 'time') {
    return (
      <TimeSelector
        presets={[60, 180, 300]}
        onSelect={handleTimeSelect}
        itemCount={allSentences.length}
        itemLabel="문장"
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

        {/* Sentence count */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm">
            <Trophy className="w-4 h-4" />
            완료: {sessionStats.totalSentences}문장
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
            {/* Target sentence */}
            <div className="typing-text-display typing-text-lg mb-2 min-h-[80px]">
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

            {/* Translation hint */}
            {showTranslation && (
              <div className="text-center mb-4 text-[var(--color-text-muted)] text-sm">
                {translation || '...'}
              </div>
            )}

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              disabled={isPaused}
              className="w-full p-4 text-xl border-2 border-[var(--color-border)] rounded-lg
                       focus:border-[var(--color-primary)] focus:outline-none
                       bg-[var(--color-surface)] font-mono"
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
            if (!autoListen) speakSentence(currentSentence);
          }}
          translationVisible={showTranslation}
          onToggleTranslation={() => {
            setShowTranslation(!showTranslation);
            if (!showTranslation && currentSentence) {
              fetchTranslation(currentSentence);
            }
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
        correctCount={sessionStats.totalSentences}
        totalCount={sessionStats.totalCharacters}
        countLabel="문장"
        onRestart={handleRestart}
        showStars
      />
    );
  }

  return null;
}
