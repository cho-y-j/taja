'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { TypingInput } from '@/components/typing/typing-input';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { extractWords } from '@/lib/documents/document-utils';
import { getPreferredVoice } from '@/lib/speech/tts-utils';
import type { UserDocument } from '@/stores/document-store';

interface Props {
  document: UserDocument;
}

export function WordPracticeMode({ document: doc }: Props) {
  const words = useMemo(() => extractWords(doc.content), [doc.content]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [autoListen, setAutoListen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentWord = words[currentIdx] || '';

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
  } = useTypingEngine(currentWord, 'words');

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIdx, inputRef]);

  // Reset translation when word changes
  useEffect(() => {
    setTranslation(null);
  }, [currentIdx]);

  // Speak function
  const speakWord = useCallback(() => {
    if (!currentWord || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentWord);
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
  }, [currentWord, doc.language, voices]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Auto-listen when word changes
  useEffect(() => {
    if (autoListen && currentWord) {
      speakWord();
    }
  }, [currentIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch translation when showTranslation is enabled and word changes
  useEffect(() => {
    if (showTranslation && !translation && !isTranslating) {
      fetchTranslation();
    }
  }, [showTranslation, currentIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enter/Space → next word when complete
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentIdx < words.length - 1) {
          setCurrentIdx(prev => prev + 1);
          reset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isComplete, currentIdx, words.length, reset]);

  // Toggle auto-listen
  const handleToggleAutoListen = useCallback(() => {
    if (autoListen) {
      stopSpeaking();
      setAutoListen(false);
    } else {
      setAutoListen(true);
      speakWord();
    }
  }, [autoListen, speakWord, stopSpeaking]);

  const fetchTranslation = useCallback(async () => {
    setIsTranslating(true);
    try {
      const from = doc.language === 'ko' ? 'ko' : 'en';
      const to = doc.language === 'ko' ? 'en' : 'ko';
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentWord, from, to }),
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
  }, [currentWord, doc.language]);

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

  const handleNext = useCallback(() => {
    if (currentIdx < words.length - 1) {
      setCurrentIdx(currentIdx + 1);
      reset();
    }
  }, [currentIdx, words.length, reset]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      reset();
    }
  }, [currentIdx, reset]);

  if (words.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">문서에서 추출할 단어가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* 진행 상태 + 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          단어 {currentIdx + 1} / {words.length}
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
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIdx === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentIdx >= words.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="w-full h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
          style={{ width: `${((currentIdx + (isComplete ? 1 : 0)) / words.length) * 100}%` }}
        />
      </div>

      {/* 번역 표시 */}
      {showTranslation && translation && (
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-lg font-medium">
            {translation}
          </span>
        </div>
      )}

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
        <div className="p-8 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] text-center">
          <TypingDisplay feedback={getCharacterFeedback()} />
        </div>
        {!isStarted && (
          <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
            클릭하고 단어를 입력하세요
          </p>
        )}
      </div>

      {/* 컨트롤 */}
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

      {/* 완료 */}
      {isComplete && (
        <Card className="mt-6 border-green-500 bg-green-50">
          <CardContent className="py-6 text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">단어 완료!</h3>
            <p className="text-green-600 mb-2">
              정확도 {metrics.accuracy}%
            </p>
            {currentIdx < words.length - 1 && (
              <p className="text-sm text-green-600 mb-4">
                Enter 또는 Space를 누르면 다음 단어로 이동합니다
              </p>
            )}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRestart}>다시 연습</Button>
              {currentIdx < words.length - 1 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  다음 단어
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
