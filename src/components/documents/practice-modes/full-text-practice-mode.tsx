'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { TypingInput } from '@/components/typing/typing-input';
import { extractParagraphs } from '@/lib/documents/document-utils';
import type { UserDocument } from '@/stores/document-store';

interface Props {
  document: UserDocument;
}

export function FullTextPracticeMode({ document: doc }: Props) {
  const paragraphs = useMemo(() => extractParagraphs(doc.content), [doc.content]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const practiceText = paragraphs[currentIdx] || '';

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
  } = useTypingEngine(practiceText, 'document');

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIdx, inputRef]);

  const handleRestart = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  const handleNext = useCallback(() => {
    if (currentIdx < paragraphs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      reset();
    }
  }, [currentIdx, paragraphs.length, reset]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      reset();
    }
  }, [currentIdx, reset]);

  // Enter → next paragraph when complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < paragraphs.length - 1) {
          setCurrentIdx(prev => prev + 1);
          reset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, currentIdx, paragraphs.length, reset]);

  // 진행률
  const progress = Math.round(
    ((currentIdx + (isComplete ? 1 : 0)) / paragraphs.length) * 100
  );

  if (paragraphs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">문서 내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* 진행 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-[var(--color-text-muted)]">
            문단 {currentIdx + 1} / {paragraphs.length}
          </p>
          <p className="text-sm font-medium text-[var(--color-primary)]">
            {progress}% 완료
          </p>
        </div>
        <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIdx === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentIdx >= paragraphs.length - 1}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 타이핑 영역 */}
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
            {currentIdx < paragraphs.length - 1 ? (
              <>
                <h3 className="text-xl font-bold text-green-700 mb-2">문단 완료!</h3>
                <p className="text-green-600 mb-2">
                  정확도 {metrics.accuracy}% | {metrics.wpm} WPM
                </p>
                <p className="text-sm text-green-600 mb-4">
                  Enter를 누르면 다음 문단으로 이동합니다
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
                  <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                    다음 문단
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-green-700 mb-2">전체 문서 완료!</h3>
                <p className="text-green-600 mb-4">
                  정확도 {metrics.accuracy}% | {metrics.wpm} WPM
                </p>
                <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
