'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { TypingInput } from '@/components/typing/typing-input';
import { useDocumentStore, type UserDocument } from '@/stores/document-store';

interface Props {
  document: UserDocument;
}

export function SummaryPracticeMode({ document: doc }: Props) {
  const { updateDocument } = useDocumentStore();
  const [summary, setSummary] = useState(doc.summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 요약 생성
  const generateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: doc.content, language: doc.language }),
      });
      if (!res.ok) throw new Error('요약 생성 실패');
      const data = await res.json();
      setSummary(data.summary);
      updateDocument(doc.id, { summary: data.summary });
    } catch {
      setError('요약을 생성할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [doc.id, doc.content, doc.language, updateDocument]);

  useEffect(() => {
    if (!summary) {
      generateSummary();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  } = useTypingEngine(summary, 'summary');

  useEffect(() => {
    if (summary) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [summary, inputRef]);

  // Enter → new summary when complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateSummary();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, generateSummary]);

  const handleRestart = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[var(--color-primary)]" />
          <p className="text-[var(--color-text-muted)]">AI가 요약을 생성하고 있습니다...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-error)] mb-4">{error}</p>
          <Button onClick={generateSummary}>
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <div>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        AI가 생성한 요약문을 타이핑하세요
      </p>

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
        <Button variant="outline" onClick={generateSummary}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새 요약
        </Button>
      </div>

      {isComplete && (
        <Card className="mt-6 border-green-500 bg-green-50">
          <CardContent className="py-6 text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">요약 연습 완료!</h3>
            <p className="text-green-600 mb-2">
              정확도 {metrics.accuracy}% | {metrics.wpm} WPM
            </p>
            <p className="text-sm text-green-600 mb-4">
              Enter를 누르면 새 요약으로 연습합니다
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
              <Button onClick={generateSummary} className="bg-green-600 hover:bg-green-700">
                새 요약으로 연습
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
