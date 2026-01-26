'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  X,
  Globe,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { engToKorMap } from '@/lib/typing/korean-keyboard';
import {
  getSampleSentences,
  getRandomSentence,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';

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
  const [language, setLanguage] = useState<Language>('ko');
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentSentence, setCurrentSentence] = useState<PracticeSentence | null>(null);
  const [practiceText, setPracticeText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  const {
    metrics,
    isComplete,
    isPaused,
    isStarted,
    getCharacterFeedback,
    reset,
    pause,
    resume,
    inputRef,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'listen-write');

  // Speak the sentence
  const speakSentence = useCallback(() => {
    if (!currentSentence || !speechSupported || typeof window === 'undefined') return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentSentence.text);
    utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = difficultyInfo[difficulty].speed;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [currentSentence, language, difficulty, speechSupported]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

      if (e.key.length !== 1) return;

      if (!isStarted) {
        startSession();
      }

      if (language === 'ko') {
        const specialChars = ['.', ',', '!', '?', ' ', ':', ';', '"', "'", '(', ')', '-'];
        if (specialChars.includes(e.key)) {
          processInput(e.key);
        } else {
          const koreanKey = engToKorMap[e.key.toLowerCase()];
          if (koreanKey) {
            processInput(koreanKey);
          }
        }
      } else {
        processInput(e.key);
      }
    },
    [isComplete, isPaused, isStarted, language, processInput, processBackspace, startSession]
  );

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
  }, [difficulty, reset, inputRef, stopSpeaking]);

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
    router.push('/');
  }, [router, stopSpeaking]);

  // 언어 전환
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
    reset();
  }, [reset]);

  // 연습 화면 진입 시 자동으로 읽기
  useEffect(() => {
    if (viewMode === 'practice' && currentSentence && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        speakSentence();
      }, 500);
    }
  }, [viewMode, currentSentence, inputRef, speakSentence]);

  const sentences = getSampleSentences(language).filter(s => s.difficulty === difficulty);

  // 선택 화면
  if (viewMode === 'select') {
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
                <h1 className="text-xl font-bold">듣고 쓰기</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글로 전환' : 'English'}
              </Button>
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

          {/* 문장 목록 */}
          <div className="space-y-3 mb-8">
            {sentences.slice(0, 8).map((sentence) => (
              <Card
                key={sentence.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStartPractice(sentence)}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
                    <p className="text-lg">{sentence.text.substring(0, 30)}...</p>
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

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          className="w-full p-4 mb-4 text-lg border-2 border-[var(--color-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? "Type what you hear..." : "들은 내용을 입력하세요..."}
          aria-label="받아쓰기 입력"
          autoFocus
        />

        {/* 메트릭 표시 */}
        <MetricsDisplay metrics={metrics} className="mb-6" />

        {/* 타이핑 영역 (진행 상황) */}
        <div onClick={() => inputRef.current?.focus()} className="cursor-text">
          <TypingDisplay feedback={getCharacterFeedback()} />
          {!isStarted && (
            <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
              {language === 'en' ? 'Listen and start typing' : '들은 내용을 입력하세요'}
            </p>
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
            문장 선택
          </Button>
        </div>

        {/* 완료 결과 */}
        {isComplete && (
          <Card className="mt-6 border-green-500 bg-green-50">
            <CardContent className="py-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                완료!
              </h3>
              <p className="text-green-600 mb-4">
                정확도 {metrics.accuracy}% | 속도 {metrics.wpm} WPM
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  다시 연습
                </Button>
                <Button onClick={handleNextSentence} className="bg-green-600 hover:bg-green-700">
                  다음 문장
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
