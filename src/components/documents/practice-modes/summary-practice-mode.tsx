'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Loader2, RefreshCw, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { TypingInput } from '@/components/typing/typing-input';
import { getPreferredVoice } from '@/lib/speech/tts-utils';
import { useDocumentStore, type UserDocument } from '@/stores/document-store';

interface Props {
  document: UserDocument;
}

export function SummaryPracticeMode({ document: doc }: Props) {
  const { updateDocument } = useDocumentStore();
  const [summary, setSummary] = useState(doc.summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoListen, setAutoListen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 요약 생성
  const generateSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTranslation(null);
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

  // Speak function
  const speakSummary = useCallback(() => {
    if (!summary || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = doc.language === 'ko' ? 'ko-KR' : 'en-US';

    const voice = getPreferredVoice(voices, doc.language);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [summary, doc.language, voices]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Auto-listen when summary changes
  useEffect(() => {
    if (autoListen && summary && !isLoading) {
      speakSummary();
    }
  }, [summary]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch translation when showTranslation is enabled
  useEffect(() => {
    if (showTranslation && !translation && !isTranslating && summary) {
      fetchTranslation();
    }
  }, [showTranslation, summary]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Toggle auto-listen
  const handleToggleAutoListen = useCallback(() => {
    if (autoListen) {
      stopSpeaking();
      setAutoListen(false);
    } else {
      setAutoListen(true);
      speakSummary();
    }
  }, [autoListen, speakSummary, stopSpeaking]);

  const fetchTranslation = useCallback(async () => {
    setIsTranslating(true);
    try {
      const from = doc.language === 'ko' ? 'ko' : 'en';
      const to = doc.language === 'ko' ? 'en' : 'ko';
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, from, to }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslation(data.translation);
      }
    } catch {
      // silently fail
    } finally {
      setIsTranslating(false);
    }
  }, [summary, doc.language]);

  const handleTranslate = useCallback(() => {
    if (!showTranslation) {
      setShowTranslation(true);
      if (!translation && !isTranslating) {
        fetchTranslation();
      }
    } else {
      setShowTranslation(false);
    }
  }, [showTranslation, translation, isTranslating, fetchTranslation]);

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
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          AI가 생성한 요약문을 타이핑하세요
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={autoListen ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleAutoListen}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant={showTranslation ? 'primary' : 'outline'}
            size="sm"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {showTranslation ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 번역 표시 */}
      {showTranslation && translation && (
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-lg font-medium">
            {translation}
          </span>
        </div>
      )}

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
