'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Clock,
  Target,
  Zap,
  Trophy,
  Home,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useThemeStore } from '@/stores/theme-store';
import {
  sentenceCategories,
  getSentencesByCategory,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';
import { StarRating, getStarRating, getStarMessage } from '@/components/ui/star-rating';

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

    const elapsed = Date.now() - startTimeRef.current;
    setSessionStats((prev) => ({
      ...prev,
      totalTime: elapsed,
    }));
    setViewMode('result');
  }, []);

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
            <div className="flex items-center gap-4">
              <Link href="/learn/basic">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">문장 연습</h1>
              <span className="ml-auto text-sm bg-[var(--color-primary)] text-white px-3 py-1 rounded-full">
                {language === 'en' ? '🇺🇸 영문' : '🇰🇷 한글'}
              </span>
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
    const timeOptions = [
      { seconds: 60, label: '1분' },
      { seconds: 180, label: '3분' },
      { seconds: 300, label: '5분' },
      { seconds: 600, label: '10분' },
    ];

    const selectedCategoryName = sentenceCategories.find(
      (c) => c.id === selectedCategory
    )?.nameKo;

    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('category')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">연습 시간 선택</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-light)] rounded-full mb-4">
              <Target className="w-4 h-4" />
              {selectedCategoryName}
            </div>
            <h2 className="text-2xl font-bold mb-2">얼마나 연습할까요?</h2>
            <p className="text-[var(--color-text-muted)]">
              시간이 끝나면 평균 타수와 정확도를 보여드려요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {timeOptions.map(({ seconds, label }) => (
              <Card
                key={seconds}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                onClick={() => handleTimeSelect(seconds)}
              >
                <CardContent className="py-8 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                  <p className="text-2xl font-bold">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <div className="flex items-center gap-4">
                {/* 일시정지 */}
                <Button variant="outline" size="icon" onClick={togglePause}>
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
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
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* 타이머 - 크고 눈에 띄게 */}
            <div className={`col-span-2 rounded-xl p-4 text-center transition-all ${
              isUrgent
                ? 'bg-red-100 border-2 border-red-400 animate-pulse'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <Clock className={`w-6 h-6 ${isUrgent ? 'text-red-600' : 'text-[var(--color-primary)]'}`} />
                <span className={`text-4xl font-mono font-bold ${isUrgent ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">남은 시간</p>
            </div>

            {/* 현재 타수 */}
            <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-[var(--color-secondary)]" />
                <span className="text-3xl font-bold text-[var(--color-secondary)]">
                  {currentWpm}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
            </div>

            {/* 정확도 */}
            <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-5 h-5 text-[var(--color-success)]" />
                <span className="text-3xl font-bold text-[var(--color-success)]">
                  {getCurrentAccuracy()}%
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">정확도</p>
            </div>
          </div>

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
              <div className="text-2xl leading-relaxed mb-6 font-mono tracking-wide min-h-[80px]">
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

          {/* 힌트 */}
          <p className="text-center text-[var(--color-text-muted)] text-sm">
            문장을 완성하면 자동으로 다음 문장이 나옵니다
          </p>
        </main>
      </div>
    );
  }

  // 결과 화면
  if (viewMode === 'result') {
    const { accuracy, wpm } = getResults();
    const stars = getStarRating(accuracy);
    const message = getStarMessage(stars);

    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="celebration animate-scale-in">
            <CardContent className="py-8 text-center">
              {/* 타이틀 */}
              <h2 className="text-2xl font-bold mb-4">{message}</h2>

              {/* 별 */}
              <div className="mb-6">
                <StarRating rating={stars} size="lg" animated />
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[var(--color-primary)]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-bold">{wpm}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[var(--color-success)]">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-bold">{accuracy}%</p>
                  <p className="text-xs text-[var(--color-text-muted)]">정확도</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[var(--color-secondary)]">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-bold">{sessionStats.totalSentences}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">문장</p>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="text-sm text-[var(--color-text-muted)] mb-6">
                <p>총 {sessionStats.totalCharacters}자 입력</p>
                <p>연습 시간: {formatTime(practiceTime)}</p>
              </div>

              {/* 버튼들 */}
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 연습
                </Button>
                <Link href="/learn/basic">
                  <Button variant="primary">
                    <Home className="w-4 h-4 mr-2" />
                    학습 목록
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
