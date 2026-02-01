'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Target, Zap, Trophy, Play, Pause, Globe } from 'lucide-react';
import { TimeSelector, PracticeControls, PracticeResult } from '@/components/practice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SettingsDropdown, UserMenu } from '@/components/layout';
import { useTTS } from '@/hooks/use-tts';
import { wordLevels, getRandomWordsWithMeaning, type WordWithMeaning } from '@/lib/typing/word-practice';
import { useThemeStore } from '@/stores/theme-store';
import { playErrorSound, playKeySound } from '@/lib/utils/sound';

type Language = 'en' | 'ko';
type ViewMode = 'level' | 'time' | 'practice' | 'result';

interface SessionStats {
  totalWords: number;
  totalCharacters: number;
  correctCharacters: number;
  totalTime: number;
}

export default function WordPracticePage() {
  const router = useRouter();
  const { language: storeLanguage, setLanguage: setStoreLanguage } = useThemeStore();
  const [language, setLanguage] = useState<Language>(storeLanguage || 'en');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('level');

  // Words data
  const [wordsWithMeaning, setWordsWithMeaning] = useState<WordWithMeaning[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  // Timer
  const [practiceTime, setPracticeTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Stats
  const [currentWpm, setCurrentWpm] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalWords: 0,
    totalCharacters: 0,
    correctCharacters: 0,
    totalTime: 0,
  });

  // Options
  const [showTranslation, setShowTranslation] = useState(false);
  const [autoListen, setAutoListen] = useState(false);

  const currentLevelData = wordLevels[currentLevel - 1];
  const currentWord = wordsWithMeaning[currentWordIndex]?.word || '';
  const currentMeaning = wordsWithMeaning[currentWordIndex]?.meaning || '';

  // TTS
  const { speak: speakTTS, stop: stopTTS, ttsEnabled } = useTTS({ language });

  const speakWord = useCallback((word: string) => {
    if (!word) return;
    speakTTS(word, language);
  }, [language, speakTTS]);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFinishedRef = useRef(false);
  const isComposingRef = useRef(false);
  const prevInputRef = useRef('');

  // Cleanup
  useEffect(() => {
    return () => {
      stopTTS();
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    };
  }, [stopTTS]);

  // Store language sync
  useEffect(() => {
    if (storeLanguage && storeLanguage !== language) {
      setLanguage(storeLanguage);
    }
  }, [storeLanguage, language]);

  // Initialize words for level
  const initializeWords = useCallback(() => {
    const words = getRandomWordsWithMeaning(language, currentLevel, 50);
    setWordsWithMeaning(words);
    setCurrentWordIndex(0);
    setUserInput('');
    prevInputRef.current = '';
  }, [language, currentLevel]);

  // Level selection -> Time selection
  const handleLevelSelect = useCallback((level: number) => {
    setCurrentLevel(level);
    setViewMode('time');
  }, []);

  // Time selection -> Practice
  const handleTimeSelect = useCallback((seconds: number) => {
    setPracticeTime(seconds);
    setTimeRemaining(seconds);
    initializeWords();
    setViewMode('practice');
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
    stopTTS();
    setSessionStats(prev => ({ ...prev, totalTime: Date.now() - startTimeRef.current }));
    setViewMode('result');
  }, [stopTTS]);

  // Timer effect
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

  // Move to next word
  const moveToNextWord = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < wordsWithMeaning.length) {
      setCurrentWordIndex(nextIndex);
      const nextWord = wordsWithMeaning[nextIndex]?.word || '';
      if (autoListen) speakWord(nextWord);
    } else {
      // Get more words
      const newWords = getRandomWordsWithMeaning(language, currentLevel, 50);
      setWordsWithMeaning(newWords);
      setCurrentWordIndex(0);
      if (autoListen) speakWord(newWords[0]?.word || '');
    }
    setUserInput('');
    prevInputRef.current = '';
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentWordIndex, wordsWithMeaning, language, currentLevel, autoListen, speakWord]);

  // Check word completion
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

  // Input handlers
  const handleCompositionStart = useCallback(() => { isComposingRef.current = true; }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    setUserInput(value);
    checkWordCompletion(value);
  }, [checkWordCompletion]);

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

  // Controls
  const togglePause = useCallback(() => setIsPaused(prev => !prev), []);

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    stopTTS();
    setViewMode('time');
    isFinishedRef.current = false;
  }, [stopTTS]);

  const handleBackToLevel = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    stopTTS();
    setViewMode('level');
    isFinishedRef.current = false;
  }, [stopTTS]);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
    setStoreLanguage(newLang);
    setCurrentLevel(1);
  }, [language, setStoreLanguage]);

  // Helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const getResults = () => {
    const accuracy = sessionStats.totalCharacters > 0
      ? Math.round((sessionStats.correctCharacters / sessionStats.totalCharacters) * 100)
      : 0;
    const minutes = practiceTime / 60;
    const wpm = minutes > 0 ? Math.round((sessionStats.correctCharacters / 5) / minutes) : 0;
    return { accuracy, wpm };
  };

  // Level selection screen
  if (viewMode === 'level') {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-xl font-bold">단어 연습</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleLanguage}>
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? '한글로 전환' : 'English'}
                </Button>
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? '🇺🇸 영어 단어' : '🇰🇷 한글 단어'}
            </div>
            <h2 className="text-2xl font-bold mb-2">난이도를 선택하세요</h2>
            <p className="text-[var(--color-text-muted)]">
              쉬운 단어부터 시작해서 점점 어려운 단어로 연습하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordLevels.map((level) => (
              <Card
                key={level.level}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  currentLevel === level.level ? 'ring-2 ring-[var(--color-primary)]' : ''
                }`}
                onClick={() => handleLevelSelect(level.level)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                      Lv.{level.level}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {level.descriptionKo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    목표 정확도: {level.targetAccuracy}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Time selection screen
  if (viewMode === 'time') {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBackToLevel}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
                    <h1 className="text-xl font-bold">단어 연습</h1>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    레벨 {currentLevel}: {currentLevelData?.descriptionKo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <TimeSelector
            presets={[60, 180, 300]}
            onSelect={handleTimeSelect}
            itemLabel="단어"
            customEnabled
          />
        </main>
      </div>
    );
  }

  // Practice screen
  if (viewMode === 'practice') {
    const feedback = getCharacterFeedback();
    const progressPercent = practiceTime > 0 ? ((practiceTime - timeRemaining) / practiceTime) * 100 : 0;
    const isUrgent = timeRemaining <= 10;

    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBackToLevel}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
                    <h1 className="text-xl font-bold">단어 연습</h1>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    레벨 {currentLevel}: {currentLevelData?.descriptionKo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleLanguage}>
                  <Globe className="w-4 h-4 mr-2" />
                  {language === 'en' ? '한글' : 'EN'}
                </Button>
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-2xl">
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
            <CardContent className="py-8">
              {/* Target word - Large display */}
              <div className="typing-text-display text-4xl md:text-5xl mb-4 text-center min-h-[80px] flex items-center justify-center">
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
              {showTranslation && currentMeaning && (
                <div className="text-center mb-4 text-[var(--color-text-muted)] text-lg">
                  ({currentMeaning})
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
          <PracticeControls
            isPaused={isPaused}
            isComplete={false}
            onTogglePause={togglePause}
            onRestart={handleRestart}
            ttsEnabled={autoListen}
            onToggleTTS={() => {
              setAutoListen(!autoListen);
              if (!autoListen) speakWord(currentWord);
            }}
            translationVisible={showTranslation}
            onToggleTranslation={() => setShowTranslation(!showTranslation)}
          />
        </main>
      </div>
    );
  }

  // Result screen
  if (viewMode === 'result') {
    const { accuracy, wpm } = getResults();
    const isPassed = accuracy >= (currentLevelData?.targetAccuracy || 90);

    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBackToLevel}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
                    <h1 className="text-xl font-bold">단어 연습 결과</h1>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    레벨 {currentLevel}: {currentLevelData?.descriptionKo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <PracticeResult
            wpm={wpm}
            accuracy={accuracy}
            totalTime={practiceTime}
            correctCount={sessionStats.totalWords}
            totalCount={sessionStats.totalCharacters}
            countLabel="단어"
            onRestart={handleRestart}
            showStars
          />

          {/* Level pass feedback */}
          <Card className={`mt-6 ${isPassed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
            <CardContent className="py-6 text-center">
              {isPassed ? (
                <>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    레벨 {currentLevel} 통과!
                  </h3>
                  <p className="text-green-600 mb-4">
                    정확도 {accuracy}%로 목표({currentLevelData?.targetAccuracy}%)를 달성했습니다.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleRestart}>
                      다시 연습
                    </Button>
                    {currentLevel < wordLevels.length ? (
                      <Button
                        onClick={() => {
                          setCurrentLevel(currentLevel + 1);
                          setViewMode('time');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        다음 레벨
                      </Button>
                    ) : (
                      <Button onClick={handleBackToLevel} className="bg-green-600 hover:bg-green-700">
                        레벨 선택
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">
                    다시 도전!
                  </h3>
                  <p className="text-orange-600 mb-4">
                    정확도 {accuracy}% (목표: {currentLevelData?.targetAccuracy}%)
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRestart} className="bg-orange-600 hover:bg-orange-700">
                      다시 연습
                    </Button>
                    <Button variant="outline" onClick={handleBackToLevel}>
                      레벨 선택
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return null;
}
