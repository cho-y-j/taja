'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { TypingInput } from '@/components/typing/typing-input';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { extractSentences } from '@/lib/documents/document-utils';
import { loadVoices, speakText } from '@/lib/speech/tts-utils';
import type { UserDocument } from '@/stores/document-store';

interface Props {
  document: UserDocument;
}

export function SentencePracticeMode({ document: doc }: Props) {
  const sentences = useMemo(() => extractSentences(doc.content), [doc.content]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const practiceText = sentences[currentIdx] || '';

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
  } = useTypingEngine(practiceText, 'sentences');

  useEffect(() => {
    loadVoices().then(setVoices);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIdx, inputRef]);

  const handleRestart = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  const handleNext = useCallback(() => {
    if (currentIdx < sentences.length - 1) {
      setCurrentIdx(currentIdx + 1);
      reset();
    }
  }, [currentIdx, sentences.length, reset]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      reset();
    }
  }, [currentIdx, reset]);

  // Enter → next sentence when complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < sentences.length - 1) {
          setCurrentIdx(prev => prev + 1);
          reset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, currentIdx, sentences.length, reset]);

  const handleSpeak = useCallback(() => {
    speakText(practiceText, doc.language, voices);
  }, [practiceText, doc.language, voices]);

  if (sentences.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">문서에서 추출할 문장이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          문장 {currentIdx + 1} / {sentences.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSpeak}>
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIdx === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentIdx >= sentences.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
        <TypingDisplay feedback={getCharacterFeedback()} />
        {!isStarted && (
          <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
            클릭하고 타이핑을 시작하세요
          </p>
        )}
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
            <h3 className="text-xl font-bold text-green-700 mb-2">문장 완료!</h3>
            <p className="text-green-600 mb-2">
              정확도 {metrics.accuracy}% | {metrics.wpm} WPM
            </p>
            {currentIdx < sentences.length - 1 && (
              <p className="text-sm text-green-600 mb-4">
                Enter를 누르면 다음 문장으로 이동합니다
              </p>
            )}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
              {currentIdx < sentences.length - 1 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  다음 문장
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
