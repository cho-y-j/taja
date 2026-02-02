'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  X,
  Globe,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { PracticeControls, PracticeResult } from '@/components/practice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { SettingsDropdown, UserMenu } from '@/components/layout';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { useTTS } from '@/hooks/use-tts';
import {
  getSampleSentences,
  getRandomSentence,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';
import { useThemeStore } from '@/stores/theme-store';
import { useSettingsStore } from '@/stores/settings-store';

type Language = 'en' | 'ko';
type ViewMode = 'select' | 'practice';
type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyInfo = {
  easy: { nameKo: '쉬움', repeats: 3, speed: 0.8, showHint: true },
  medium: { nameKo: '보통', repeats: 2, speed: 1.0, showHint: false },
  hard: { nameKo: '어려움', repeats: 1, speed: 1.2, showHint: false },
};

export default function ListenWritePracticePage() {
  const router = useRouter();
  const { language: storeLanguage, setLanguage: setStoreLanguage } = useThemeStore();
  const [language, setLanguage] = useState<Language>(storeLanguage || 'ko');
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentSentence, setCurrentSentence] = useState<PracticeSentence | null>(null);
  const [practiceText, setPracticeText] = useState('');
  const [showHint, setShowHint] = useState(false);

  // TTS 훅 사용
  const { speak: speakTTS, stop: stopTTS, isSpeaking, isSupported: speechSupported } = useTTS({ language });
  const { getTTSRate } = useSettingsStore();

  const {
    metrics,
    isComplete,
    isPaused,
    isStarted,
    userInput,
    currentIndex,
    errors,
    reset,
    pause,
    resume,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'listen-write');

  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const [inputValue, setInputValue] = useState('');

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

  // Speak the sentence (TTS 훅 사용)
  const speakSentence = useCallback(() => {
    if (!currentSentence || !speechSupported) return;
    speakTTS(currentSentence.text, language);
  }, [currentSentence, language, speechSupported, speakTTS]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    stopTTS();
  }, [stopTTS]);


  // 연습 시작
  const handleStartPractice = useCallback((sentence: PracticeSentence) => {
    setCurrentSentence(sentence);
    setPracticeText(sentence.text);
    setViewMode('practice');
    setShowHint(difficultyInfo[difficulty].showHint);
    reset();
  }, [difficulty, reset]);

  // 랜덤 문장으로 연습 시작
  const handleRandomPractice = useCallback(() => {
    const sentence = getRandomSentence(language);
    if (sentence) {
      handleStartPractice(sentence);
    }
  }, [language, handleStartPractice]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    reset();
    setShowHint(difficultyInfo[difficulty].showHint);
    stopSpeaking();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [difficulty, reset, stopSpeaking]);

  // 다음 문장
  const handleNextSentence = useCallback(() => {
    stopSpeaking();
    handleRandomPractice();
  }, [handleRandomPractice, stopSpeaking]);

  // 선택 화면으로
  const handleBackToSelect = useCallback(() => {
    stopSpeaking();
    setViewMode('select');
    setCurrentSentence(null);
    reset();
  }, [reset, stopSpeaking]);

  // 종료
  const handleExit = useCallback(() => {
    stopSpeaking();
    router.push('/learn/basic');
  }, [router, stopSpeaking]);

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
    reset();
  }, [language, reset, setStoreLanguage]);

  // 연습 화면 진입 시 자동으로 읽기
  useEffect(() => {
    if (viewMode === 'practice' && currentSentence && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        speakSentence();
      }, 500);
    }
  }, [viewMode, currentSentence, speakSentence]);

  const sentences = getSampleSentences(language).filter(s => s.difficulty === difficulty);

  // 선택 화면
  if (viewMode === 'select') {
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
                <h1 className="text-xl font-bold">듣고 쓰기</h1>
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
          {!speechSupported && (
            <Card className="mb-6 border-orange-500 bg-orange-50">
              <CardContent className="py-4 text-orange-700">
                이 브라우저는 음성 합성을 지원하지 않습니다. Chrome, Edge, Safari 등 최신 브라우저를 사용해주세요.
              </CardContent>
            </Card>
          )}

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? '🇺🇸 English' : '🇰🇷 한글'}
            </div>
            <h2 className="text-2xl font-bold mb-2">문장을 듣고 받아쓰세요</h2>
            <p className="text-[var(--color-text-muted)]">
              음성으로 들려주는 문장을 정확하게 타이핑하세요
            </p>
          </div>

          {/* 난이도 선택 */}
          <div className="flex justify-center gap-4 mb-8">
            {(Object.keys(difficultyInfo) as Difficulty[]).map((d) => (
              <Button
                key={d}
                variant={difficulty === d ? 'primary' : 'outline'}
                onClick={() => setDifficulty(d)}
              >
                {difficultyInfo[d].nameKo}
              </Button>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>난이도: {difficultyInfo[difficulty].nameKo}</CardTitle>
              <CardDescription>
                {difficulty === 'easy' && '문장을 3번 들려드리고, 힌트를 보여드립니다.'}
                {difficulty === 'medium' && '문장을 2번 들려드립니다.'}
                {difficulty === 'hard' && '문장을 1번만 들려드립니다.'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* 문장 목록 - 미리보기 텍스트 숨김 */}
          <div className="space-y-3 mb-8">
            {sentences.slice(0, 8).map((sentence, idx) => (
              <Card
                key={sentence.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStartPractice(sentence)}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
                    <p className="text-lg">문장 {idx + 1}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 랜덤 연습 버튼 */}
          <div className="text-center">
            <Button size="lg" onClick={handleRandomPractice} disabled={!speechSupported}>
              <Play className="w-5 h-5 mr-2" />
              랜덤 문장으로 시작
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
                  <h1 className="text-xl font-bold">듣고 쓰기</h1>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  난이도: {difficultyInfo[difficulty].nameKo}
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
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="w-4 h-4 mr-2" />
                종료
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 음성 컨트롤 */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={isSpeaking ? stopSpeaking : speakSentence}
                className={isSpeaking ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5 mr-2" />
                    멈추기
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 mr-2" />
                    다시 듣기
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? (
                  <>
                    <EyeOff className="w-5 h-5 mr-2" />
                    힌트 숨기기
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    힌트 보기
                  </>
                )}
              </Button>
            </div>
            {isSpeaking && (
              <p className="text-center mt-3 text-[var(--color-primary)] animate-pulse">
                문장을 듣고 있습니다...
              </p>
            )}
          </CardContent>
        </Card>

        {/* 힌트 */}
        {showHint && currentSentence && (
          <Card className="mb-6 border-[var(--color-accent)] bg-yellow-50">
            <CardContent className="py-4 text-center">
              <p className="text-lg font-medium text-yellow-800">{currentSentence.text}</p>
            </CardContent>
          </Card>
        )}

        {/* 받아쓰기 진행 상황 */}
        <Card className="mb-6">
          <CardContent className="py-6">
            {/* 진행 상황 표시 (위) - 타이핑한 글자만 보여주고 나머지는 ● */}
            <div className="typing-text-display typing-text-lg p-4 bg-gray-50 rounded-lg border border-[var(--color-border)] mb-4 min-h-[80px]">
              {practiceText.split('').map((targetChar, index) => {
                if (index < currentIndex) {
                  const isError = errors.includes(index);
                  const typedChar = userInput[index] || targetChar;
                  return (
                    <span
                      key={index}
                      className={isError ? 'text-red-500 bg-red-100' : 'text-green-600'}
                    >
                      {typedChar === ' ' ? '\u00A0' : typedChar}
                    </span>
                  );
                }
                if (index === currentIndex) {
                  return (
                    <span key={index} className="bg-yellow-300 animate-pulse">
                      {targetChar === ' ' ? '\u00A0' : '●'}
                    </span>
                  );
                }
                return (
                  <span key={index} className="text-gray-400">
                    {targetChar === ' ' ? '\u00A0' : '●'}
                  </span>
                );
              })}
            </div>

            <p className="text-center mb-4 text-sm text-[var(--color-text-muted)]">
              {currentIndex} / {practiceText.length} 글자
            </p>

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
              placeholder={!isStarted ? (language === 'en' ? 'Type what you hear...' : '들은 내용을 입력하세요...') : ''}
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
          backLabel="문장 선택"
          className="mt-8"
        />

        {/* 완료 결과 */}
        {isComplete && (
          <div className="mt-6">
            {/* 정답 비교 */}
            <Card className="mb-4 border-[var(--color-border)]">
              <CardContent className="py-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">정답:</p>
                <p className="text-lg mb-3 font-medium">{currentSentence?.text}</p>
                <p className="text-sm text-[var(--color-text-muted)] mb-1">입력한 내용:</p>
                <p className="text-lg">
                  {userInput.split('').map((char, i) => {
                    const isError = errors.includes(i);
                    return (
                      <span key={i} className={isError ? 'text-red-500' : 'text-green-600'}>
                        {char}
                      </span>
                    );
                  })}
                </p>
              </CardContent>
            </Card>

            <PracticeResult
              wpm={metrics.wpm}
              accuracy={metrics.accuracy}
              totalTime={Math.round(metrics.elapsedTime / 1000)}
              correctCount={practiceText.length - errors.length}
              totalCount={practiceText.length}
              countLabel="글자"
              onRestart={handleRestart}
              onNext={handleNextSentence}
              nextLabel="다음 문장"
              showStars
            />
          </div>
        )}
      </main>
    </div>
  );
}
