'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { TypingInput } from '@/components/typing/typing-input';
import { extractSentences, extractWords } from '@/lib/documents/document-utils';
import { loadVoices, speakText } from '@/lib/speech/tts-utils';
import type { UserDocument } from '@/stores/document-store';

type ListenMode = 'words' | 'sentences';

interface Props {
  document: UserDocument;
}

export function ListenWritePracticeMode({ document: doc }: Props) {
  const [listenMode, setListenMode] = useState<ListenMode>('words');
  const allWords = useMemo(() => extractWords(doc.content), [doc.content]);
  const allSentences = useMemo(() => extractSentences(doc.content), [doc.content]);
  const items = listenMode === 'words' ? allWords : allSentences;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const practiceText = items[currentIdx] || '';

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
    inputRef,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'listen-write');

  useEffect(() => {
    loadVoices().then(setVoices);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIdx, inputRef]);

  // Reset on item change
  useEffect(() => {
    setTranslation(null);
    setShowTranslation(false);
    setShowHint(false);
  }, [currentIdx, listenMode]);

  // Enter → next when complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < items.length - 1) {
          setCurrentIdx(prev => prev + 1);
          reset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, currentIdx, items.length, reset]);

  // Reset index when switching mode
  const handleModeChange = useCallback((mode: ListenMode) => {
    setListenMode(mode);
    setCurrentIdx(0);
    reset();
  }, [reset]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    speakText(practiceText, doc.language, voices, {
      rate: listenMode === 'words' ? 0.8 : 0.9,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [practiceText, doc.language, voices, isSpeaking, listenMode]);

  const handleTranslate = useCallback(async () => {
    if (translation) {
      setShowTranslation(!showTranslation);
      return;
    }
    setIsTranslating(true);
    try {
      const from = doc.language === 'ko' ? 'ko' : 'en';
      const to = doc.language === 'ko' ? 'en' : 'ko';
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: practiceText, from, to }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslation(data.translation);
        setShowTranslation(true);
      }
    } catch {
      // silently fail
    } finally {
      setIsTranslating(false);
    }
  }, [practiceText, doc.language, translation, showTranslation]);

  const handleRestart = useCallback(() => {
    reset();
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  const handleNext = useCallback(() => {
    if (currentIdx < items.length - 1) {
      setCurrentIdx(currentIdx + 1);
      reset();
    }
  }, [currentIdx, items.length, reset]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      reset();
    }
  }, [currentIdx, reset]);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            문서에서 추출할 {listenMode === 'words' ? '단어' : '문장'}이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* 모드 선택 + 진행 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[var(--color-border)] rounded-lg p-1">
            <button
              onClick={() => handleModeChange('words')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                listenMode === 'words'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              단어
            </button>
            <button
              onClick={() => handleModeChange('sentences')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                listenMode === 'sentences'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              문장
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            {currentIdx + 1} / {items.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
            title="번역 보기"
          >
            {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIdx === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentIdx >= items.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 번역 표시 */}
      {showTranslation && translation && (
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-base font-medium">
            {translation}
          </span>
        </div>
      )}

      {/* 재생 버튼 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSpeak}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isSpeaking
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-[var(--color-primary)] hover:brightness-110'
          }`}
        >
          {isSpeaking ? (
            <VolumeX className="w-8 h-8 text-white" />
          ) : (
            <Volume2 className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
        재생 버튼을 누르고 들리는 {listenMode === 'words' ? '단어' : '문장'}을 받아쓰세요
      </p>

      {/* 힌트 토글 */}
      <div className="flex justify-center mb-4">
        <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
          {showHint ? '힌트 숨기기' : '힌트 보기'}
        </Button>
      </div>

      {/* 마스킹된 타이핑 영역 */}
      <div onClick={() => inputRef.current?.focus()} className="cursor-text relative mb-6">
        <TypingInput
          language={doc.language}
          isComplete={isComplete}
          isPaused={isPaused}
          isStarted={isStarted}
          processInput={processInput}
          processBackspace={processBackspace}
          startSession={startSession}
          inputRef={inputRef}
        />
        <div className="font-mono text-2xl leading-[2.5] tracking-wide p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          {practiceText.split('').map((char, index) => {
            if (index < userInput.length) {
              const isError = errors.includes(index);
              return (
                <span
                  key={index}
                  className={isError ? 'typing-char typing-char--error' : 'typing-char typing-char--correct'}
                >
                  {userInput[index] === ' ' ? '\u00A0' : userInput[index]}
                </span>
              );
            }
            if (index === currentIndex) {
              return (
                <span key={index} className="typing-char typing-char--current">
                  {showHint ? (char === ' ' ? '\u00A0' : char) : '●'}
                </span>
              );
            }
            return (
              <span key={index} className="typing-char typing-char--pending">
                {showHint ? (char === ' ' ? '\u00A0' : char) : '●'}
              </span>
            );
          })}
        </div>
        <p className="text-right text-xs text-[var(--color-text-muted)] mt-1">
          {userInput.length} / {practiceText.length}자
        </p>
      </div>

      <MetricsDisplay metrics={metrics} className="mb-6" />

      <div className="flex justify-center gap-4">
        {!isComplete && isStarted && (
          <Button variant="outline" onClick={isPaused ? resume : pause}>
            {isPaused ? '계속' : '일시정지'}
          </Button>
        )}
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          다시 연습
        </Button>
      </div>

      {isComplete && (
        <Card className="mt-6 border-green-500 bg-green-50">
          <CardContent className="py-6 text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">받아쓰기 완료!</h3>
            <p className="text-green-600 mb-2">
              정확도 {metrics.accuracy}% | {metrics.wpm} WPM
            </p>
            {currentIdx < items.length - 1 && (
              <p className="text-sm text-green-600 mb-3">
                Enter를 누르면 다음으로 이동합니다
              </p>
            )}
            <div className="mt-3 p-3 bg-white rounded-lg text-left">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">정답:</p>
              <p className="font-mono text-sm">{practiceText}</p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-2 mb-1">내 입력:</p>
              <p className="font-mono text-sm">{userInput}</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
              {currentIdx < items.length - 1 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  다음 {listenMode === 'words' ? '단어' : '문장'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
