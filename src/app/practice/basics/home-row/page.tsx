'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Play, Home, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyboardGuide } from '@/components/typing/keyboard-guide';
import { KoreanKeyboardGuide } from '@/components/typing/korean-keyboard-guide';
import { HandGuide } from '@/components/typing/hand-guide';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { rowLevels, rowNames, generateRowPracticeText, type KeyboardRow } from '@/lib/typing/keyboard-practice';
import { koreanRowLevels, koreanRowNames, generateKoreanPracticeText, korToEngMap } from '@/lib/typing/korean-keyboard';
import { useThemeStore } from '@/stores/theme-store';

const uiContent = {
  ko: {
    pageTitle: '키보드 기본 연습',
    switchToKo: '한글로 전환',
    switchToEn: 'English',
    enKeyboard: '🇺🇸 영문 자판',
    koKeyboard: '🇰🇷 한글 자판',
    selectRow: '연습할 행을 선택하세요',
    selectRowDesc: '홈로우부터 시작해서 윗줄, 아랫줄 순서로 연습하는 것을 권장합니다',
    levelPractice: '단계 연습',
    startPractice: '연습 시작',
    accuracy: '정확도',
    time: '시간',
    errors: '오류',
    continue: '계속',
    pause: '일시정지',
    practiceKeys: '연습 키:',
    target: '목표',
    levelPassed: '레벨 통과!',
    tryAgain: '다시 도전!',
    nextLevel: '다음 레벨',
    otherRow: '다른 행 연습',
    restart: '다시 연습',
    selectOther: '행 선택',
    enterNext: 'Enter로 다음 레벨',
    enterRetry: 'Enter로 다시 연습',
    startTyping: '타이핑 시작...',
  },
  en: {
    pageTitle: 'Keyboard Practice',
    switchToKo: 'Switch to Korean',
    switchToEn: 'English',
    enKeyboard: '🇺🇸 English Keyboard',
    koKeyboard: '🇰🇷 Korean Keyboard',
    selectRow: 'Select a row to practice',
    selectRowDesc: 'Start with home row, then top row and bottom row',
    levelPractice: '-level practice',
    startPractice: 'Start Practice',
    accuracy: 'Accuracy',
    time: 'Time',
    errors: 'Errors',
    continue: 'Resume',
    pause: 'Pause',
    practiceKeys: 'Keys:',
    target: 'Target',
    levelPassed: 'Level Passed!',
    tryAgain: 'Try Again!',
    nextLevel: 'Next Level',
    otherRow: 'Other Rows',
    restart: 'Restart',
    selectOther: 'Select Row',
    enterNext: 'Press Enter for next level',
    enterRetry: 'Press Enter to retry',
    startTyping: 'Start typing...',
  },
};

type Language = 'en' | 'ko';

export default function KeyboardPracticePage() {
  const router = useRouter();
  const { language: storeLanguage, setLanguage: setStoreLanguage, uiLanguage } = useThemeStore();
  const [language, setLanguage] = useState<Language>(storeLanguage || 'en');
  const [selectedRow, setSelectedRow] = useState<KeyboardRow>('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [practiceText, setPracticeText] = useState('');
  const [showRowSelect, setShowRowSelect] = useState(true);
  const t = uiContent[uiLanguage];

  const levels = language === 'en' ? rowLevels[selectedRow] : koreanRowLevels[selectedRow];
  const currentLevelData = levels[currentLevel - 1];
  const currentRowNames = language === 'en' ? rowNames : koreanRowNames;

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
    userInput,
    getCharacterFeedback,
    getNextKey,
    reset,
    pause,
    resume,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'home-row');

  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!showRowSelect && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showRowSelect]);

  // userInput이 리셋되면 inputValue도 리셋
  useEffect(() => {
    if (userInput === '') {
      setInputValue('');
    }
  }, [userInput]);

  // 한글 IME 조합 시작
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // 한글 IME 조합 완료
  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    setInputValue(value);

    const currentLen = userInput.length;
    for (let i = currentLen; i < value.length; i++) {
      processInput(value[i]);
    }
  }, [userInput, processInput]);

  // 입력 변경 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!isStarted && value.length > 0) {
      startSession();
    }

    if (isComposingRef.current) return;

    if (value.length < userInput.length) {
      const diff = userInput.length - value.length;
      for (let i = 0; i < diff; i++) {
        processBackspace();
      }
      return;
    }

    for (let i = userInput.length; i < value.length; i++) {
      processInput(value[i]);
    }
  }, [isStarted, userInput, processInput, processBackspace, startSession]);

  const handleStart = useCallback(() => {
    setShowRowSelect(false);
    const text = language === 'en'
      ? generateRowPracticeText(selectedRow, currentLevel, 40)
      : generateKoreanPracticeText(selectedRow, currentLevel, 40);
    setPracticeText(text);
  }, [selectedRow, currentLevel, language]);

  const handleRestart = useCallback(() => {
    const text = language === 'en'
      ? generateRowPracticeText(selectedRow, currentLevel, 40)
      : generateKoreanPracticeText(selectedRow, currentLevel, 40);
    setPracticeText(text);
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedRow, currentLevel, language, reset, inputRef]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentLevel, levels.length, reset, inputRef]);

  const handleBackToSelect = useCallback(() => {
    setShowRowSelect(true);
    setCurrentLevel(1);
    reset();
  }, [reset]);

  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // 스토어 언어가 변경되면 로컬 상태도 동기화
  useEffect(() => {
    if (storeLanguage && storeLanguage !== language) {
      setLanguage(storeLanguage);
    }
  }, [storeLanguage]);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
    setStoreLanguage(newLang);
    setCurrentLevel(1);
    reset();
  }, [language, reset, setStoreLanguage]);

  // Enter → next level or restart on complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const isPassed = metrics.accuracy >= currentLevelData?.targetAccuracy;
        if (isPassed && currentLevel < levels.length) {
          handleNextLevel();
        } else {
          handleRestart();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, metrics.accuracy, currentLevelData?.targetAccuracy, currentLevel, levels.length, handleNextLevel, handleRestart]);

  const isPassed = isComplete && metrics.accuracy >= currentLevelData?.targetAccuracy;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // ─── Row select screen ───
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
                <h1 className="text-xl font-bold">{t.pageTitle}</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? t.switchToKo : t.switchToEn}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? t.enKeyboard : t.koKeyboard}
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.selectRow}</h2>
            <p className="text-[var(--color-text-muted)]">
              {t.selectRowDesc}
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
                    <CardTitle>{typeof name === 'object' ? (uiLanguage === 'en' ? name.en : name.ko) : name}</CardTitle>
                    {typeof name === 'object' && <CardDescription>{uiLanguage === 'en' ? name.ko : name.en}</CardDescription>}
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
                      {rowLevelData.length}{t.levelPractice}
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
                ? (uiLanguage === 'en' ? currentRowNames[selectedRow].en : currentRowNames[selectedRow].ko)
                : currentRowNames[selectedRow]} {t.startPractice}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Practice screen (single viewport) ───
  const rowDisplayName = typeof currentRowNames[selectedRow] === 'object'
    ? currentRowNames[selectedRow].ko
    : currentRowNames[selectedRow];

  return (
    <div className="h-screen flex flex-col bg-[var(--color-background)] overflow-hidden">
      {/* ── Header: back + row + levels + metrics + actions ── */}
      <header className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Left: back + row name + level pills */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" onClick={handleBackToSelect} className="w-7 h-7">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
            <h1 className="font-bold text-sm">{rowDisplayName}</h1>
            <div className="flex items-center gap-0.5 ml-1">
              {levels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentLevel(index + 1);
                    reset();
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                    currentLevel === index + 1
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Center: metrics */}
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">WPM</span>
              <span className="text-sm font-bold text-[var(--color-text)]">{metrics.wpm}</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">{t.accuracy}</span>
              <span className={`text-sm font-bold ${
                metrics.accuracy >= 90 ? 'text-[var(--color-success)]'
                  : metrics.accuracy >= 70 ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-error)]'
              }`}>{metrics.accuracy}%</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">{t.time}</span>
              <span className="text-sm font-bold text-[var(--color-text)]">{formatTime(metrics.elapsedTime)}</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">{t.errors}</span>
              <span className={`text-sm font-bold ${
                metrics.errorCount === 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`}>{metrics.errorCount}</span>
            </div>
            {!isComplete && isStarted && (
              <>
                <div className="w-px h-4 bg-[var(--color-border)]" />
                <button
                  onClick={isPaused ? resume : pause}
                  className="text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                >
                  {isPaused ? t.continue : t.pause}
                </button>
              </>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="w-7 h-7" title={language === 'en' ? '한글 전환' : 'English'}>
              <Globe className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRestart} className="w-7 h-7" title="다시 연습">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBackToSelect} className="w-7 h-7" title="행 선택">
              <Home className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleExit} className="w-7 h-7" title="종료">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Level info bar (thin) ── */}
      <div className="shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-1">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>{uiLanguage === 'en' ? currentLevelData.description : currentLevelData.descriptionKo}</span>
          <div className="flex items-center gap-3">
            <span>
              {t.practiceKeys} {currentLevelData.keys.map(k => k === ' ' ? '␣' : (language === 'en' ? k.toUpperCase() : k)).join(' ')}
            </span>
            <span className="text-[var(--color-primary)] font-medium">
              {t.target} {currentLevelData.targetAccuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content (flex-1, no scroll) ── */}
      <main className="flex-1 flex flex-col min-h-0 px-4 py-2 max-w-6xl mx-auto w-full">
        {/* Typing area - relative for overlay */}
        <div className="relative shrink-0 mb-2">
          {/* 목표 텍스트 (위) */}
          <div className="typing-text-display p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] mb-2 max-h-32 overflow-auto">
            {getCharacterFeedback().map((item, index) => (
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
                {item.char === ' ' ? '\u00A0' : item.char}
              </span>
            ))}
          </div>

          {/* 입력 필드 (아래) */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            disabled={isPaused || isComplete}
            className="w-full p-3 text-lg border-2 border-[var(--color-border)] rounded-lg
                     focus:border-[var(--color-primary)] focus:outline-none
                     bg-[var(--color-surface)] font-mono"
            placeholder={!isStarted ? t.startTyping : ''}
            autoFocus
          />

          {/* ── Completion overlay ── */}
          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-[var(--radius-lg)] backdrop-blur-sm">
              <div className="text-center px-6">
                {isPassed ? (
                  <>
                    <p className="text-base font-bold text-green-700 mb-1">
                      {uiLanguage === 'en' ? `Level ${currentLevel} Passed!` : `레벨 ${currentLevel} 통과!`}
                    </p>
                    <p className="text-sm text-green-600 mb-2">
                      {t.accuracy} {metrics.accuracy}% ({t.target} {currentLevelData.targetAccuracy}%)
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleRestart}>{t.restart}</Button>
                      {currentLevel < levels.length ? (
                        <Button size="sm" onClick={handleNextLevel} className="bg-green-600 hover:bg-green-700">
                          {t.nextLevel}
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleBackToSelect} className="bg-green-600 hover:bg-green-700">
                          {t.otherRow}
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-green-500 mt-1">{currentLevel < levels.length ? t.enterNext : t.enterRetry}</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-bold text-orange-700 mb-1">{t.tryAgain}</p>
                    <p className="text-sm text-orange-600 mb-2">
                      {t.accuracy} {metrics.accuracy}% ({t.target} {currentLevelData.targetAccuracy}%)
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button size="sm" onClick={handleRestart} className="bg-orange-600 hover:bg-orange-700">
                        {t.restart}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleBackToSelect}>{t.selectOther}</Button>
                    </div>
                    <p className="text-[11px] text-orange-500 mt-1">{t.enterRetry}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Hand guide + Keyboard guide (spread evenly in remaining space) ── */}
        <div className="flex-1 flex flex-col items-center justify-evenly min-h-0">
          {/* Hand guide - 영어/한글 모두 표시 */}
          <div className="shrink-0">
            <HandGuide
              activeKey={
                language === 'en'
                  ? (getNextKey() || undefined)
                  : (getNextKey() ? korToEngMap[getNextKey()!] || getNextKey()! : undefined)
              }
            />
          </div>

          {/* Keyboard */}
          <div className="shrink-0">
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
        </div>
      </main>
    </div>
  );
}
