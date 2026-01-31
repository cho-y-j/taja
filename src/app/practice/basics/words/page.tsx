'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Home, X, Globe } from 'lucide-react';
import { PracticeControls } from '@/components/practice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useTTS } from '@/hooks/use-tts';
import { useIMEInput } from '@/hooks/use-ime-input';
import { wordLevels, getRandomWordsWithMeaning, type WordWithMeaning } from '@/lib/typing/word-practice';
import { useThemeStore } from '@/stores/theme-store';

type Language = 'en' | 'ko';

export default function WordPracticePage() {
  const router = useRouter();
  const { language: storeLanguage, setLanguage: setStoreLanguage } = useThemeStore();
  const [language, setLanguage] = useState<Language>(storeLanguage || 'en');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [practiceText, setPracticeText] = useState('');
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [wordsWithMeaning, setWordsWithMeaning] = useState<WordWithMeaning[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [autoListen, setAutoListen] = useState(false);

  const currentLevelData = wordLevels[currentLevel - 1];

  // TTS 훅
  const { speak: speakWord } = useTTS({ language });

  // 연습 텍스트 생성
  useEffect(() => {
    if (!showLevelSelect) {
      const words = getRandomWordsWithMeaning(language, currentLevel, 10);
      setWordsWithMeaning(words);
      setPracticeText(words.map(w => w.word).join(' '));
    }
  }, [currentLevel, showLevelSelect, language]);

  const {
    metrics,
    isComplete,
    isPaused,
    isStarted,
    userInput,
    getCharacterFeedback,
    reset,
    pause,
    resume,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'words');

  // 현재 단어 위치 기반으로 해석 가져오기
  const currentWordIndex = useMemo(() => {
    const typed = practiceText.substring(0, userInput?.length || 0);
    const spacesBeforeCurrent = (typed.match(/ /g) || []).length;
    return Math.min(spacesBeforeCurrent, wordsWithMeaning.length - 1);
  }, [practiceText, userInput, wordsWithMeaning.length]);

  const currentMeaning = wordsWithMeaning[currentWordIndex]?.meaning || '';
  const currentWord = wordsWithMeaning[currentWordIndex]?.word || '';

  // 자동 읽기 - 현재 단어가 바뀌면 읽기
  useEffect(() => {
    if (autoListen && currentWord && !showLevelSelect) {
      speakWord(currentWord);
    }
  }, [autoListen, currentWord, showLevelSelect, speakWord]);

  // IME 입력 처리 훅
  const {
    inputRef,
    inputValue,
    handleChange: handleInputChange,
    handleCompositionStart,
    handleCompositionEnd,
    resetInput,
    focus: focusInput,
  } = useIMEInput({
    onInput: processInput,
    onBackspace: processBackspace,
    onStart: startSession,
    disabled: isPaused || isComplete,
  });

  // userInput이 리셋되면 inputValue도 리셋
  useEffect(() => {
    if (userInput === '') {
      resetInput();
    }
  }, [userInput, resetInput]);

  // 연습 화면 진입 시 자동 포커스
  useEffect(() => {
    if (!showLevelSelect) {
      focusInput();
    }
  }, [showLevelSelect, focusInput]);

  // 연습 시작
  const handleStart = useCallback(() => {
    setShowLevelSelect(false);
    const words = getRandomWordsWithMeaning(language, currentLevel, 10);
    setWordsWithMeaning(words);
    setPracticeText(words.map(w => w.word).join(' '));
  }, [currentLevel, language]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    const words = getRandomWordsWithMeaning(language, currentLevel, 10);
    setWordsWithMeaning(words);
    setPracticeText(words.map(w => w.word).join(' '));
    reset();
    focusInput();
  }, [currentLevel, language, reset, focusInput]);

  // 다음 레벨
  const handleNextLevel = useCallback(() => {
    if (currentLevel < wordLevels.length) {
      setCurrentLevel(currentLevel + 1);
      reset();
      focusInput();
    }
  }, [currentLevel, reset, focusInput]);

  // 레벨 선택 화면으로
  const handleBackToSelect = useCallback(() => {
    setShowLevelSelect(true);
    setCurrentLevel(1);
    reset();
  }, [reset]);

  // 종료
  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // 스토어 언어가 변경되면 로컬 상태도 동기화
  useEffect(() => {
    if (storeLanguage && storeLanguage !== language) {
      setLanguage(storeLanguage);
    }
  }, [storeLanguage]);

  // 언어 전환
  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
    setStoreLanguage(newLang);
    setCurrentLevel(1);
    reset();
  }, [language, reset, setStoreLanguage]);

  const isPassed = isComplete && metrics.accuracy >= currentLevelData?.targetAccuracy;

  // 레벨 선택 화면
  if (showLevelSelect) {
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
                onClick={() => setCurrentLevel(level.level)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                      Lv.{level.level}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? level.descriptionKo : level.descriptionKo}
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

          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleStart}>
              <Play className="w-5 h-5 mr-2" />
              레벨 {currentLevel} 시작
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
                  <h1 className="text-xl font-bold">단어 연습</h1>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  레벨 {currentLevel} / {wordLevels.length}
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
              목표 정확도: {currentLevelData.targetAccuracy}%
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 타이핑 영역 */}
        <Card className="mb-6">
          <CardContent className="py-6">
            {/* 목표 텍스트 (위) */}
            <div className="typing-text-display typing-text-xl mb-2 min-h-[60px] text-center">
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

            {/* 해석 표시 */}
            {showTranslation && currentMeaning && (
              <div className="text-center mb-4 text-[var(--color-text-muted)] text-sm">
                ({currentMeaning})
              </div>
            )}

            {/* 입력 필드 (아래) */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              disabled={isPaused || isComplete}
              className="w-full p-4 text-xl border-2 border-[var(--color-border)] rounded-lg
                       focus:border-[var(--color-primary)] focus:outline-none
                       bg-[var(--color-surface)] font-mono"
              placeholder={!isStarted ? (language === 'en' ? 'Start typing here...' : '여기에 입력하세요...') : ''}
              autoFocus
            />
          </CardContent>
        </Card>

        {/* 메트릭 표시 */}
        <MetricsDisplay metrics={metrics} className="mb-6" />

        {/* 컨트롤 버튼 */}
        <PracticeControls
          isPaused={isPaused}
          isComplete={isComplete}
          onTogglePause={!isComplete && isStarted ? (isPaused ? resume : pause) : undefined}
          onRestart={handleRestart}
          onBack={handleBackToSelect}
          ttsEnabled={autoListen}
          onToggleTTS={() => { setAutoListen(!autoListen); if (!autoListen && currentWord) speakWord(currentWord); }}
          translationVisible={showTranslation}
          onToggleTranslation={() => setShowTranslation(!showTranslation)}
          className="mt-8"
        />

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
                    {currentLevel < wordLevels.length ? (
                      <Button onClick={handleNextLevel} className="bg-green-600 hover:bg-green-700">
                        다음 레벨
                      </Button>
                    ) : (
                      <Button onClick={handleBackToSelect} className="bg-green-600 hover:bg-green-700">
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
                    정확도 {metrics.accuracy}% (목표: {currentLevelData.targetAccuracy}%)
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRestart} className="bg-orange-600 hover:bg-orange-700">
                      다시 연습
                    </Button>
                    <Button variant="outline" onClick={handleBackToSelect}>
                      레벨 선택
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
            {wordLevels.map((level) => (
              <Button
                key={level.level}
                variant={currentLevel === level.level ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setCurrentLevel(level.level);
                  reset();
                  focusInput();
                }}
              >
                Lv.{level.level}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
