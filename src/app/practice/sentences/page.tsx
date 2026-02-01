'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Target,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsDropdown, UserMenu } from '@/components/layout';
import { useThemeStore } from '@/stores/theme-store';
import { useTTS } from '@/hooks/use-tts';
import {
  sentenceCategories,
  getSentencesByCategory,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';
import { PracticeResult, PracticeMetrics, PracticeControls, TimeSelector } from '@/components/practice';
import { saveSession } from '@/lib/utils/save-stats';

type ViewMode = 'category' | 'time' | 'practice' | 'result';

interface SessionStats {
  totalSentences: number;
  totalCharacters: number;
  correctCharacters: number;
  totalTime: number; // ms
}

export default function SentencePracticePage() {
  const router = useRouter();
  const language = useThemeStore((s) => s.language) || 'ko';

  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [practiceTime, setPracticeTime] = useState<number>(0); // seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // seconds
  const [isPaused, setIsPaused] = useState(false);

  // Current sentence
  const [sentences, setSentences] = useState<PracticeSentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
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

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isFinishedRef = useRef(false);
  const isComposingRef = useRef(false); // 한글 IME 조합 중인지

  // TTS & 번역
  const [autoListen, setAutoListen] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // 현재 문장 번역
  const currentTranslation = sentences[currentSentenceIndex]?.translation || '';

  // TTS 훅 사용
  const { speak: speakTTS, ttsEnabled } = useTTS({ language: language as 'ko' | 'en' });

  // TTS 함수 래퍼
  const speakSentence = useCallback((text: string) => {
    if (!text) return;
    speakTTS(text, language as 'ko' | 'en');
  }, [language, speakTTS]);

  // 카테고리별 문장 목록 가져오기 및 섞기
  const loadSentences = useCallback((category: string) => {
    const categoryData = getSentencesByCategory(language, category);
    // 섞기
    const shuffled = [...categoryData].sort(() => Math.random() - 0.5);
    setSentences(shuffled);
    setCurrentSentenceIndex(0);
    if (shuffled.length > 0) {
      setCurrentText(shuffled[0].text);
    }
  }, [language]);

  // speakSentence를 ref로 저장 (의존성 배열 문제 방지)
  const speakSentenceRef = useRef(speakSentence);
  speakSentenceRef.current = speakSentence;

  // 자동 읽기 - 문장이 바뀌면 읽기
  useEffect(() => {
    if (autoListen && currentText && viewMode === 'practice') {
      speakSentenceRef.current(currentText);
    }
  }, [autoListen, currentText, viewMode]);

  // 카테고리 선택
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    loadSentences(categoryId);
    setViewMode('time');
  }, [loadSentences]);

  // 시간 선택 및 연습 시작
  const handleTimeSelect = useCallback((seconds: number) => {
    setPracticeTime(seconds);
    setTimeRemaining(seconds);
    setViewMode('practice');
    setUserInput('');
    setIsStarted(false);
    setIsPaused(false);
    setCurrentWpm(0);
    isFinishedRef.current = false;
    setSessionStats({
      totalSentences: 0,
      totalCharacters: 0,
      correctCharacters: 0,
      totalTime: 0,
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // 세션 종료
  const finishSession = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wpmTimerRef.current) {
      clearInterval(wpmTimerRef.current);
      wpmTimerRef.current = null;
    }

    const totalTime = Date.now() - startTimeRef.current;

    // Update stats and save to DB
    setSessionStats((prev) => {
      const accuracy = prev.totalCharacters > 0
        ? (prev.correctCharacters / prev.totalCharacters) * 100
        : 0;
      const minutes = totalTime / 60000;
      const wpm = minutes > 0 ? Math.round((prev.correctCharacters / 5) / minutes) : 0;

      // Save to local store and DB
      saveSession({
        type: 'sentences',
        locale: language,
        wpm,
        accuracy,
        duration: totalTime,
        charactersTyped: prev.totalCharacters,
        errorsCount: prev.totalCharacters - prev.correctCharacters,
      });

      return {
        ...prev,
        totalTime,
      };
    });

    setViewMode('result');
  }, [language]);

  // 타이머 시작
  useEffect(() => {
    if (viewMode !== 'practice' || !isStarted || isPaused) {
      return;
    }

    // 카운트다운 타이머
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // WPM 실시간 업데이트 (500ms 마다)
    wpmTimerRef.current = setInterval(() => {
      if (startTimeRef.current > 0) {
        setSessionStats((stats) => {
          const elapsed = (Date.now() - startTimeRef.current) / 60000; // minutes
          if (elapsed > 0 && stats.correctCharacters > 0) {
            const wpm = Math.round((stats.correctCharacters / 5) / elapsed);
            setCurrentWpm(wpm);
          }
          return stats;
        });
      }
    }, 500);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (wpmTimerRef.current) {
        clearInterval(wpmTimerRef.current);
        wpmTimerRef.current = null;
      }
    };
  }, [viewMode, isStarted, isPaused, finishSession]);

  // 다음 문장으로 이동
  const moveToNextSentence = useCallback(() => {
    const nextIndex = currentSentenceIndex + 1;
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex);
      setCurrentText(sentences[nextIndex].text);
      setUserInput('');
    } else {
      // 문장 다 썼으면 다시 섞어서 처음부터
      const shuffled = [...sentences].sort(() => Math.random() - 0.5);
      setSentences(shuffled);
      setCurrentSentenceIndex(0);
      setCurrentText(shuffled[0].text);
      setUserInput('');
    }
    // 입력 필드 포커스
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentSentenceIndex, sentences]);

  // 실제 입력 처리
  const processInput = useCallback((value: string) => {
    if (isFinishedRef.current) return;

    if (!isStarted) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    setUserInput(value);

    // 문장 완료 체크
    if (value.length >= currentText.length) {
      // 정확도 계산
      let correct = 0;
      for (let i = 0; i < currentText.length; i++) {
        if (value[i] === currentText[i]) correct++;
      }

      setSessionStats((prev) => {
        const newStats = {
          ...prev,
          totalSentences: prev.totalSentences + 1,
          totalCharacters: prev.totalCharacters + currentText.length,
          correctCharacters: prev.correctCharacters + correct,
        };

        // WPM 즉시 업데이트
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0) {
          setCurrentWpm(Math.round((newStats.correctCharacters / 5) / elapsed));
        }

        return newStats;
      });

      // 다음 문장으로
      setTimeout(() => moveToNextSentence(), 200);
    }
  }, [isStarted, currentText, moveToNextSentence]);

  // 한글 IME 조합 시작
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // 한글 IME 조합 완료
  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // 조합 완료 후 입력 처리
    const value = e.currentTarget.value;
    processInput(value);
  }, [processInput]);

  // 입력 처리 (한글 IME 지원)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 한글 조합 중이면 UI만 업데이트 (완료 체크 안함)
    if (isComposingRef.current) {
      setUserInput(value);
      if (!isStarted) {
        setIsStarted(true);
        startTimeRef.current = Date.now();
      }
      return;
    }

    // 영문이나 조합 완료된 한글
    processInput(value);
  }, [isStarted, processInput]);

  // 일시정지/재개
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // 다시 시작
  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);

    setViewMode('category');
    setSelectedCategory('');
    setPracticeTime(0);
    setTimeRemaining(0);
    setCurrentSentenceIndex(0);
    setUserInput('');
    setIsStarted(false);
    setIsPaused(false);
    setCurrentWpm(0);
    setSentences([]);
    isFinishedRef.current = false;
    setSessionStats({
      totalSentences: 0,
      totalCharacters: 0,
      correctCharacters: 0,
      totalTime: 0,
    });
  }, []);

  // 시간 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 결과 계산
  const getResults = () => {
    const accuracy = sessionStats.totalCharacters > 0
      ? Math.round((sessionStats.correctCharacters / sessionStats.totalCharacters) * 100)
      : 0;
    const minutes = practiceTime / 60;
    const wpm = minutes > 0
      ? Math.round((sessionStats.correctCharacters / 5) / minutes)
      : 0;
    return { accuracy, wpm };
  };

  // 글자별 피드백 생성
  const getCharacterFeedback = () => {
    return currentText.split('').map((char, index) => {
      if (index < userInput.length) {
        const isCorrect = userInput[index] === char;
        return {
          char,
          status: isCorrect ? 'correct' : 'incorrect',
        };
      }
      if (index === userInput.length) {
        return { char, status: 'current' };
      }
      return { char, status: 'pending' };
    });
  };

  // 현재 정확도 계산
  const getCurrentAccuracy = () => {
    if (sessionStats.totalCharacters === 0) return 100;
    return Math.round((sessionStats.correctCharacters / sessionStats.totalCharacters) * 100);
  };

  // === 렌더링 ===

  // 카테고리 선택 화면
  if (viewMode === 'category') {
    const displayCategories = sentenceCategories.filter(
      (c) => c.id !== 'custom' && c.id !== 'ai'
    );

    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/learn/basic">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-xl font-bold">문장 연습</h1>
                <span className="text-sm bg-[var(--color-primary)] text-white px-3 py-1 rounded-full">
                  {language === 'en' ? '🇺🇸 영문' : '🇰🇷 한글'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">연습할 주제를 선택하세요</h2>
            <p className="text-[var(--color-text-muted)]">
              선택한 주제의 문장들이 랜덤으로 나옵니다
            </p>
          </div>

          <div className="grid gap-4">
            {displayCategories.map((category) => {
              const count = getSentencesByCategory(language, category.id).length;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="py-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{category.nameKo}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {category.description} ({count}개)
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[var(--color-text-muted)]" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // 시간 선택 화면
  if (viewMode === 'time') {
    const selectedCategoryName = sentenceCategories.find(
      (c) => c.id === selectedCategory
    )?.nameKo;

    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setViewMode('category')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold">문장 연습</h1>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {selectedCategoryName}
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
            itemCount={sentences.length}
            itemLabel="문장"
            customEnabled
          />
        </main>
      </div>
    );
  }

  // 연습 화면
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
                <Button variant="ghost" size="icon" onClick={handleRestart}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">문장 연습</h1>
              </div>
              <div className="flex items-center gap-2">
                {/* 일시정지 */}
                <Button variant="outline" size="icon" onClick={togglePause}>
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
                <SettingsDropdown />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* 진행 바 */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          {/* 상단 통계 패널 */}
          <PracticeMetrics
            wpm={currentWpm}
            accuracy={getCurrentAccuracy()}
            timeRemaining={timeRemaining}
            variant="grid"
            className="mb-6"
          />

          {/* 완료 문장 수 */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Trophy className="w-4 h-4" />
              완료: {sessionStats.totalSentences}문장
            </span>
          </div>

          {/* 일시정지 오버레이 */}
          {isPaused && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8 text-center">
                <Pause className="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" />
                <h2 className="text-2xl font-bold mb-4">일시정지</h2>
                <p className="text-[var(--color-text-muted)] mb-4">
                  남은 시간: {formatTime(timeRemaining)}
                </p>
                <Button onClick={togglePause} size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  계속하기
                </Button>
              </Card>
            </div>
          )}

          {/* 타이핑 영역 */}
          <Card className="mb-4">
            <CardContent className="py-6">
              {/* 문장 표시 */}
              <div className="typing-text-display typing-text-lg mb-2 min-h-[80px]">
                {feedback.map((item, index) => (
                  <span
                    key={index}
                    className={`${
                      item.status === 'correct'
                        ? 'text-green-600'
                        : item.status === 'incorrect'
                        ? 'text-red-500 bg-red-100'
                        : item.status === 'current'
                        ? 'bg-yellow-300 text-[var(--color-text)] animate-pulse'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.char}
                  </span>
                ))}
              </div>

              {/* 해석 표시 */}
              {showTranslation && currentTranslation && (
                <div className="text-center mb-4 text-[var(--color-text-muted)] text-sm">
                  ({currentTranslation})
                </div>
              )}

              {/* 입력 필드 */}
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
                         bg-[var(--color-surface)]"
                placeholder={!isStarted ? '타이핑을 시작하면 타이머가 시작됩니다!' : ''}
                autoFocus
              />
            </CardContent>
          </Card>

          {/* 컨트롤 버튼 */}
          <PracticeControls
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRestart={handleRestart}
            ttsEnabled={autoListen}
            onToggleTTS={() => setAutoListen(!autoListen)}
            translationVisible={showTranslation}
            onToggleTranslation={() => setShowTranslation(!showTranslation)}
          />
        </main>
      </div>
    );
  }

  // 결과 화면
  if (viewMode === 'result') {
    const { accuracy, wpm } = getResults();

    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <PracticeResult
          wpm={wpm}
          accuracy={accuracy}
          totalTime={practiceTime}
          correctCount={sessionStats.totalSentences}
          totalCount={sessionStats.totalCharacters}
          countLabel="문장"
          onRestart={handleRestart}
          onBack={() => router.push('/learn/basic')}
          showStars
        />
      </div>
    );
  }

  return null;
}
