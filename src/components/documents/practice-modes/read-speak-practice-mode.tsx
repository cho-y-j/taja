'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { extractSentences, extractWords } from '@/lib/documents/document-utils';
import { loadVoices, speakText } from '@/lib/speech/tts-utils';
import type { UserDocument } from '@/stores/document-store';

type SpeakMode = 'words' | 'sentences';

interface Props {
  document: UserDocument;
}

function calculateAccuracy(spoken: string, target: string): number {
  const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
  const targetWords = target.toLowerCase().trim().split(/\s+/);
  if (targetWords.length === 0) return 0;

  let correct = 0;
  for (let i = 0; i < targetWords.length; i++) {
    if (spokenWords[i] === targetWords[i]) correct++;
  }
  return Math.round((correct / targetWords.length) * 100);
}

export function ReadSpeakPracticeMode({ document: doc }: Props) {
  const [speakMode, setSpeakMode] = useState<SpeakMode>('words');
  const allWords = useMemo(() => extractWords(doc.content), [doc.content]);
  const allSentences = useMemo(() => extractSentences(doc.content), [doc.content]);
  const items = speakMode === 'words' ? allWords : allSentences;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [result, setResult] = useState<{ accuracy: number } | null>(null);
  const [sttSupported, setSttSupported] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentItem = items[currentIdx] || '';

  useEffect(() => {
    loadVoices().then(setVoices);
    if (
      typeof window !== 'undefined' &&
      !window.SpeechRecognition &&
      !(window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition
    ) {
      setSttSupported(false);
    }
  }, []);

  // Reset on item/mode change
  useEffect(() => {
    setTranslation(null);
    setShowTranslation(false);
  }, [currentIdx, speakMode]);

  // Enter → next when result shown
  useEffect(() => {
    if (!result) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < items.length - 1) {
          setCurrentIdx(prev => prev + 1);
          handleReset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [result, currentIdx, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModeChange = useCallback((mode: SpeakMode) => {
    setSpeakMode(mode);
    setCurrentIdx(0);
    setTranscript('');
    setInterimTranscript('');
    setResult(null);
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSpeak = useCallback(() => {
    speakText(currentItem, doc.language, voices);
  }, [currentItem, doc.language, voices]);

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
        body: JSON.stringify({ text: currentItem, from, to }),
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
  }, [currentItem, doc.language, translation, showTranslation]);

  const startListening = useCallback(() => {
    if (!sttSupported) return;

    const SpeechRecognitionClass =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = doc.language === 'ko' ? 'ko-KR' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript('');
    setInterimTranscript('');
    setResult(null);
  }, [doc.language, sttSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);

    const finalText = transcript || interimTranscript;
    if (finalText) {
      const accuracy = calculateAccuracy(finalText, currentItem);
      setResult({ accuracy });
    }
  }, [transcript, interimTranscript, currentItem]);

  const handleReset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setResult(null);
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIdx < items.length - 1) {
      setCurrentIdx(currentIdx + 1);
      handleReset();
    }
  }, [currentIdx, items.length, handleReset]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      handleReset();
    }
  }, [currentIdx, handleReset]);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            문서에서 추출할 {speakMode === 'words' ? '단어' : '문장'}이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!sttSupported) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--color-error)] mb-2">
            이 브라우저는 음성 인식을 지원하지 않습니다.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Chrome 브라우저를 사용해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayText = transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const label = speakMode === 'words' ? '단어' : '문장';

  return (
    <div>
      {/* 모드 선택 + 진행 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[var(--color-border)] rounded-lg p-1">
            <button
              onClick={() => handleModeChange('words')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                speakMode === 'words'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              단어
            </button>
            <button
              onClick={() => handleModeChange('sentences')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                speakMode === 'sentences'
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
          <Button variant="outline" size="sm" onClick={handleSpeak}>
            <Volume2 className="w-4 h-4" />
          </Button>
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

      {/* 읽을 텍스트 표시 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-2xl font-mono leading-relaxed text-center text-[var(--color-text)]">
            {currentItem}
          </p>
        </CardContent>
      </Card>

      {/* 마이크 버튼 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
              : 'bg-[var(--color-primary)] hover:brightness-110'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
        {isListening ? '듣고 있습니다... 다 말했으면 정지 버튼을 누르세요' : `마이크 버튼을 누르고 ${label}을 읽어주세요`}
      </p>

      {/* 인식된 텍스트 */}
      {displayText && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">
              인식된 텍스트:
            </p>
            <p className="text-lg font-mono text-[var(--color-text)]">
              {displayText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 결과 */}
      {result && (
        <Card
          className={`mb-6 ${
            result.accuracy >= 70
              ? 'border-green-500 bg-green-50'
              : 'border-orange-500 bg-orange-50'
          }`}
        >
          <CardContent className="py-6 text-center">
            <h3
              className={`text-xl font-bold mb-2 ${
                result.accuracy >= 90
                  ? 'text-green-700'
                  : result.accuracy >= 70
                  ? 'text-green-600'
                  : 'text-orange-700'
              }`}
            >
              {result.accuracy >= 90
                ? '완벽해요!'
                : result.accuracy >= 70
                ? '잘했어요!'
                : '다시 도전해보세요!'}
            </h3>
            <p className="text-lg font-bold mb-2">정확도: {result.accuracy}%</p>
            {currentIdx < items.length - 1 && (
              <p className="text-sm text-green-600 mb-3">
                Enter를 누르면 다음으로 이동합니다
              </p>
            )}
            <div className="text-left p-3 bg-white rounded-lg">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">원문:</p>
              <p className="font-mono text-sm mb-2">{currentItem}</p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">내 발음:</p>
              <p className="font-mono text-sm">{displayText}</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
              {currentIdx < items.length - 1 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  다음 {label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
