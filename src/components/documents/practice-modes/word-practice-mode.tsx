'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RotateCcw, Clock, Target, Zap, Trophy, Play, Pause, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractWords } from '@/lib/documents/document-utils';
import { getPreferredVoice } from '@/lib/speech/tts-utils';
import { StarRating, getStarRating, getStarMessage } from '@/components/ui/star-rating';
import { playErrorSound, playKeySound } from '@/lib/utils/sound';
import type { UserDocument } from '@/stores/document-store';

type ViewMode = 'time' | 'practice' | 'result';

interface SessionStats {
  totalWords: number;
  totalCharacters: number;
  correctCharacters: number;
  totalTime: number;
}

interface Props {
  document: UserDocument;
}

export function WordPracticeMode({ document: doc }: Props) {
  const allWords = useMemo(() => extractWords(doc.content), [doc.content]);

  const [viewMode, setViewMode] = useState<ViewMode>('time');
  const [practiceTime, setPracticeTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Current word
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  // Real-time metrics
  const [currentWpm, setCurrentWpm] = useState(0);

  // Session stats
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalWords: 0,
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

  // Speak word
  const speakWord = useCallback((word: string) => {
    if (!word || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = doc.language === 'ko' ? 'ko-KR' : 'en-US';
    const voice = getPreferredVoice(voices, doc.language);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [doc.language, voices]);

  // Initialize words
  const initializeWords = useCallback(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentWordIndex(0);
    setCurrentWord(shuffled[0] || '');
  }, [allWords]);

  // Time selection
  const handleTimeSelect = useCallback((seconds: number) => {
    setPracticeTime(seconds);
    setTimeRemaining(seconds);
    initializeWords();
    setViewMode('practice');
    setUserInput('');
    setIsStarted(false);
    setIsPaused(false);
    setCurrentWpm(0);
    isFinishedRef.current = false;
    setSessionStats({ totalWords: 0, totalCharacters: 0, correctCharacters: 0, totalTime: 0 });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [initializeWords]);

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

  // Fetch translation for word
  const fetchTranslation = useCallback(async (word: string) => {
    if (!word) return;
    setTranslation('번역 중...');
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: word,
          from: doc.language,
          to: doc.language === 'en' ? 'ko' : 'en',
        }),
      });
      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
      } else {
        setTranslation('번역 실패');
      }
    } catch {
      setTranslation('번역 오류');
    }
  }, [doc.language]);

  // Move to next word
  const moveToNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    let nextWord = '';
    if (nextIndex < words.length) {
      setCurrentWordIndex(nextIndex);
      setCurrentWord(words[nextIndex]);
      nextWord = words[nextIndex];
    } else {
      // Reshuffle and restart
      const shuffled = [...allWords].sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setCurrentWordIndex(0);
      setCurrentWord(shuffled[0] || '');
      nextWord = shuffled[0] || '';
    }
    setUserInput('');
    prevInputRef.current = '';
    setTranslation('');
    if (autoListen) speakWord(nextWord);
    if (showTranslation) fetchTranslation(nextWord);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentWordIndex, words, allWords, autoListen, speakWord, showTranslation, fetchTranslation]);

  // Input handlers
  const handleCompositionStart = useCallback(() => { isComposingRef.current = true; }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    setUserInput(value);
    checkWordCompletion(value);
  }, []);

  // Previous input for sound comparison
  const prevInputRef = useRef('');

  const checkWordCompletion = useCallback((value: string) => {
    if (isFinishedRef.current || !currentWord) return;

    // Play sound for each new character
    if (value.length > prevInputRef.current.length) {
      const newCharIndex = value.length - 1;
      if (newCharIndex < currentWord.length) {
        if (value[newCharIndex] === currentWord[newCharIndex]) {
          playKeySound();
        } else {
          playErrorSound();
        }
      }
    }
    prevInputRef.current = value;

    if (value.length >= currentWord.length) {
      let correct = 0;
      for (let i = 0; i < currentWord.length; i++) {
        if (value[i] === currentWord[i]) correct++;
      }

      setSessionStats(prev => {
        const newStats = {
          ...prev,
          totalWords: prev.totalWords + 1,
          totalCharacters: prev.totalCharacters + currentWord.length,
          correctCharacters: prev.correctCharacters + correct,
        };
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0) setCurrentWpm(Math.round((newStats.correctCharacters / 5) / elapsed));
        return newStats;
      });

      setTimeout(() => moveToNextWord(), 150);
    }
  }, [currentWord, moveToNextWord]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    if (isComposingRef.current) return;
    checkWordCompletion(value);
  }, [isStarted, checkWordCompletion]);

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
    return currentWord.split('').map((char, index) => {
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
    const timeOptions = [
      { seconds: 60, label: '1분' },
      { seconds: 180, label: '3분' },
      { seconds: 300, label: '5분' },
    ];

    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold mb-2">연습 시간을 선택하세요</h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          단어 {allWords.length}개 | 시간이 끝나면 결과를 보여드려요
        </p>
        <div className="flex justify-center gap-4">
          {timeOptions.map(({ seconds, label }) => (
            <Card
              key={seconds}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 w-32"
              onClick={() => handleTimeSelect(seconds)}
            >
              <CardContent className="py-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                <p className="text-xl font-bold">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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

        {/* Word count */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm">
            <Trophy className="w-4 h-4" />
            완료: {sessionStats.totalWords}단어
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
            {/* Target word */}
            <div className="text-4xl leading-relaxed mb-2 font-mono tracking-wide text-center min-h-[60px]">
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
              className="w-full p-4 text-2xl border-2 border-[var(--color-border)] rounded-lg
                       focus:border-[var(--color-primary)] focus:outline-none
                       bg-[var(--color-surface)] font-mono text-center"
              placeholder={!isStarted ? '타이핑을 시작하면 타이머가 시작됩니다' : ''}
              autoFocus
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={togglePause}>
            {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
            {isPaused ? '계속' : '일시정지'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setAutoListen(!autoListen); if (!autoListen) speakWord(currentWord); }}
          >
            {autoListen ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
            {autoListen ? '음성 끄기' : '음성 듣기'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowTranslation(!showTranslation);
              if (!showTranslation && currentWord) {
                fetchTranslation(currentWord);
              }
            }}
          >
            {showTranslation ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showTranslation ? '해석 숨기기' : '해석 보기'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-1" />
            다시 시작
          </Button>
        </div>
      </div>
    );
  }

  // Result screen
  if (viewMode === 'result') {
    const { accuracy, wpm } = getResults();
    const stars = getStarRating(accuracy);
    const message = getStarMessage(stars);

    return (
      <div className="py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <div className="mb-6">
              <StarRating rating={stars} size="lg" animated />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto text-[var(--color-primary)]" />
                <p className="text-3xl font-bold">{wpm}</p>
                <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto text-[var(--color-success)]" />
                <p className="text-3xl font-bold">{accuracy}%</p>
                <p className="text-xs text-[var(--color-text-muted)]">정확도</p>
              </div>
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto text-[var(--color-secondary)]" />
                <p className="text-3xl font-bold">{sessionStats.totalWords}</p>
                <p className="text-xs text-[var(--color-text-muted)]">단어</p>
              </div>
            </div>

            <div className="text-sm text-[var(--color-text-muted)] mb-6">
              <p>총 {sessionStats.totalCharacters}자 입력</p>
              <p>연습 시간: {formatTime(practiceTime)}</p>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 연습
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
