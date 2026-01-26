'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Play, Home, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { KeyboardGuide } from '@/components/typing/keyboard-guide';
import { KoreanKeyboardGuide } from '@/components/typing/korean-keyboard-guide';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { rowLevels, rowNames, generateRowPracticeText, type KeyboardRow } from '@/lib/typing/keyboard-practice';
import { koreanRowLevels, koreanRowNames, generateKoreanPracticeText, engToKorMap } from '@/lib/typing/korean-keyboard';

type Language = 'en' | 'ko';

export default function KeyboardPracticePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const [selectedRow, setSelectedRow] = useState<KeyboardRow>('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [practiceText, setPracticeText] = useState('');
  const [showRowSelect, setShowRowSelect] = useState(true);

  // 현재 언어에 맞는 레벨 데이터
  const levels = language === 'en' ? rowLevels[selectedRow] : koreanRowLevels[selectedRow];
  const currentLevelData = levels[currentLevel - 1];
  const currentRowNames = language === 'en' ? rowNames : koreanRowNames;

  // 연습 텍스트 생성
  useEffect(() => {
    if (!showRowSelect) {
      const text = language === 'en'
        ? generateRowPracticeText(selectedRow, currentLevel, 40)
        : generateKoreanPracticeText(selectedRow, currentLevel, 40);
      setPracticeText(text);
    }
  }, [selectedRow, currentLevel, showRowSelect, language]);

  const {
    metrics,
    isComplete,
    isPaused,
    isStarted,
    getCharacterFeedback,
    getNextKey,
    handleKeyDown: originalHandleKeyDown,
    reset,
    pause,
    resume,
    inputRef,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'home-row');

  // 한글 입력 처리를 위한 커스텀 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isComplete || isPaused) return;

      // 백스페이스 처리
      if (e.key === 'Backspace') {
        e.preventDefault();
        processBackspace();
        return;
      }

      // 특수 키 무시
      if (e.key.length !== 1) return;

      // 첫 입력 시 자동 시작
      if (!isStarted) {
        startSession();
      }

      if (language === 'ko') {
        // 한글 모드: 영문 키 -> 한글로 변환
        const koreanKey = e.key === ' ' ? ' ' : engToKorMap[e.key.toLowerCase()];
        if (koreanKey) {
          processInput(koreanKey);
        }
      } else {
        // 영문 모드
        processInput(e.key);
      }
    },
    [isComplete, isPaused, isStarted, language, processInput, processBackspace, startSession]
  );

  // 연습 화면 진입 시 자동 포커스
  useEffect(() => {
    if (!showRowSelect && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showRowSelect, inputRef]);

  // 연습 시작
  const handleStart = useCallback(() => {
    setShowRowSelect(false);
    const text = language === 'en'
      ? generateRowPracticeText(selectedRow, currentLevel, 40)
      : generateKoreanPracticeText(selectedRow, currentLevel, 40);
    setPracticeText(text);
  }, [selectedRow, currentLevel, language]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    const text = language === 'en'
      ? generateRowPracticeText(selectedRow, currentLevel, 40)
      : generateKoreanPracticeText(selectedRow, currentLevel, 40);
    setPracticeText(text);
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedRow, currentLevel, language, reset, inputRef]);

  // 다음 레벨
  const handleNextLevel = useCallback(() => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentLevel, levels.length, reset, inputRef]);

  // 행 선택 화면으로
  const handleBackToSelect = useCallback(() => {
    setShowRowSelect(true);
    setCurrentLevel(1);
    reset();
  }, [reset]);

  // 종료
  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // 언어 전환
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
    setCurrentLevel(1);
    reset();
  }, [reset]);

  const isPassed = isComplete && metrics.accuracy >= currentLevelData?.targetAccuracy;

  // 행 선택 화면
  if (showRowSelect) {
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
                <h1 className="text-xl font-bold">키보드 기본 연습</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글로 전환' : 'English'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? '🇺🇸 영문 자판' : '🇰🇷 한글 자판'}
            </div>
            <h2 className="text-2xl font-bold mb-2">연습할 행을 선택하세요</h2>
            <p className="text-[var(--color-text-muted)]">
              홈로우부터 시작해서 윗줄, 아랫줄 순서로 연습하는 것을 권장합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(currentRowNames) as KeyboardRow[]).map((row) => {
              const rowLevelData = language === 'en' ? rowLevels[row] : koreanRowLevels[row];
              const name = language === 'en' ? rowNames[row] : koreanRowNames[row];

              return (
                <Card
                  key={row}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRow === row ? 'ring-2 ring-[var(--color-primary)]' : ''
                  }`}
                  onClick={() => setSelectedRow(row)}
                >
                  <CardHeader>
                    <CardTitle>{typeof name === 'object' ? name.ko : name}</CardTitle>
                    {typeof name === 'object' && <CardDescription>{name.en}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {rowLevelData[rowLevelData.length - 1].keys.slice(0, 10).map((key, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center w-8 h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-sm font-mono"
                        >
                          {key === ' ' ? '␣' : language === 'en' ? key.toUpperCase() : key}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                      {rowLevelData.length}단계 연습
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleStart}>
              <Play className="w-5 h-5 mr-2" />
              {typeof currentRowNames[selectedRow] === 'object'
                ? currentRowNames[selectedRow].ko
                : currentRowNames[selectedRow]} 연습 시작
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 연습 화면
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBackToSelect}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
                  <h1 className="text-xl font-bold">
                    {typeof currentRowNames[selectedRow] === 'object'
                      ? currentRowNames[selectedRow].ko
                      : currentRowNames[selectedRow]}
                  </h1>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  레벨 {currentLevel} / {levels.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글' : 'EN'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="w-4 h-4 mr-2" />
                종료
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 레벨 정보 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              레벨 {currentLevel}: {currentLevelData.descriptionKo}
            </CardTitle>
            <CardDescription>
              목표 정확도: {currentLevelData.targetAccuracy}% | 연습 키: {currentLevelData.keys.map(k => k === ' ' ? '␣' : (language === 'en' ? k.toUpperCase() : k)).join(' ')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          className="w-full p-4 mb-4 text-lg border-2 border-[var(--color-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? "Click here and start typing..." : "여기를 클릭하고 타이핑을 시작하세요..."}
          aria-label="타이핑 입력"
          autoFocus
        />

        {/* 메트릭 표시 */}
        <MetricsDisplay metrics={metrics} className="mb-6" />

        {/* 타이핑 영역 */}
        <div onClick={() => inputRef.current?.focus()} className="cursor-text">
          <TypingDisplay feedback={getCharacterFeedback()} />
          {!isStarted && (
            <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
              {language === 'en' ? 'Click input and start typing' : '위 입력창을 클릭하고 타이핑을 시작하세요'}
            </p>
          )}
        </div>

        {/* 키보드 가이드 */}
        <div className="mt-6">
          {language === 'en' ? (
            <KeyboardGuide
              locale="en"
              activeKey={getNextKey() || undefined}
              showFingers={true}
            />
          ) : (
            <KoreanKeyboardGuide
              activeKey={getNextKey() || undefined}
              showFingers={true}
            />
          )}
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex justify-center gap-4 mt-8">
          {!isComplete && isStarted && (
            <Button variant="outline" onClick={isPaused ? resume : pause}>
              {isPaused ? '계속' : '일시정지'}
            </Button>
          )}
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 연습
          </Button>
          <Button variant="outline" onClick={handleBackToSelect}>
            <Home className="w-4 h-4 mr-2" />
            행 선택
          </Button>
        </div>

        {/* 완료 결과 */}
        {isComplete && (
          <Card className={`mt-6 ${isPassed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
            <CardContent className="py-6 text-center">
              {isPassed ? (
                <>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    레벨 {currentLevel} 통과!
                  </h3>
                  <p className="text-green-600 mb-4">
                    정확도 {metrics.accuracy}%로 목표({currentLevelData.targetAccuracy}%)를 달성했습니다.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleRestart}>
                      다시 연습
                    </Button>
                    {currentLevel < levels.length ? (
                      <Button onClick={handleNextLevel} className="bg-green-600 hover:bg-green-700">
                        다음 레벨
                      </Button>
                    ) : (
                      <Button onClick={handleBackToSelect} className="bg-green-600 hover:bg-green-700">
                        다른 행 연습
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
                    정확도 {metrics.accuracy}% (목표: {currentLevelData.targetAccuracy}%)
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRestart} className="bg-orange-600 hover:bg-orange-700">
                      다시 연습
                    </Button>
                    <Button variant="outline" onClick={handleBackToSelect}>
                      행 선택
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* 레벨 선택 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">레벨 선택</h3>
          <div className="flex flex-wrap gap-2">
            {levels.map((_, index) => (
              <Button
                key={index}
                variant={currentLevel === index + 1 ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentLevel(index + 1);
                  reset();
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
              >
                Lv.{index + 1}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
