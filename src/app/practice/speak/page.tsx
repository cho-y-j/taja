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
  Mic,
  MicOff,
  Volume2,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  getSampleSentences,
  getRandomSentence,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';
import { useThemeStore } from '@/stores/theme-store';

type Language = 'en' | 'ko';
type ViewMode = 'select' | 'practice';
type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyInfo = {
  easy: { nameKo: '쉬움', showText: true },
  medium: { nameKo: '보통', showText: true },
  hard: { nameKo: '어려움', showText: false },
};

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export default function SpeakPracticePage() {
  const router = useRouter();
  const { language: storeLanguage, setLanguage: setStoreLanguage } = useThemeStore();
  const [language, setLanguage] = useState<Language>(storeLanguage || 'ko');
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentSentence, setCurrentSentence] = useState<PracticeSentence | null>(null);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Check if speech recognition is supported & load TTS voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setSpeechSupported(false);
      }

      if (window.speechSynthesis) {
        const loadVoices = () => {
          const available = window.speechSynthesis.getVoices();
          if (available.length > 0) setVoices(available);
        };
        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
      }
    }
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ko' ? 'ko-KR' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscriptTemp = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptTemp += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(interimTranscript);
      if (finalTranscriptTemp) {
        setFinalTranscript(prev => prev + finalTranscriptTemp);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [language]);

  // Start listening
  const startListening = useCallback(() => {
    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setTranscript('');
    setFinalTranscript('');
    setShowResult(false);
    setAccuracy(null);

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      console.error('Failed to start speech recognition');
    }
  }, [initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Calculate accuracy
  const calculateAccuracy = useCallback((spoken: string, target: string): number => {
    const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
    const targetWords = target.toLowerCase().trim().split(/\s+/);

    let correctWords = 0;
    const maxLen = Math.max(spokenWords.length, targetWords.length);

    if (maxLen === 0) return 0;

    for (let i = 0; i < targetWords.length; i++) {
      if (spokenWords[i] === targetWords[i]) {
        correctWords++;
      }
    }

    return Math.round((correctWords / targetWords.length) * 100);
  }, []);

  // Submit result
  const handleSubmit = useCallback(() => {
    stopListening();
    const spokenText = finalTranscript || transcript;
    if (currentSentence && spokenText) {
      const acc = calculateAccuracy(spokenText, currentSentence.text);
      setAccuracy(acc);
      setShowResult(true);
    }
  }, [finalTranscript, transcript, currentSentence, calculateAccuracy, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 연습 시작
  const handleStartPractice = useCallback((sentence: PracticeSentence) => {
    setCurrentSentence(sentence);
    setViewMode('practice');
    setTranscript('');
    setFinalTranscript('');
    setAccuracy(null);
    setShowResult(false);
  }, []);

  // 랜덤 문장으로 연습 시작
  const handleRandomPractice = useCallback(() => {
    const sentence = getRandomSentence(language);
    if (sentence) {
      handleStartPractice(sentence);
    }
  }, [language, handleStartPractice]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    stopListening();
    setTranscript('');
    setFinalTranscript('');
    setAccuracy(null);
    setShowResult(false);
  }, [stopListening]);

  // 다음 문장
  const handleNextSentence = useCallback(() => {
    stopListening();
    handleRandomPractice();
  }, [handleRandomPractice, stopListening]);

  // 선택 화면으로
  const handleBackToSelect = useCallback(() => {
    stopListening();
    setViewMode('select');
    setCurrentSentence(null);
  }, [stopListening]);

  // 종료
  const handleExit = useCallback(() => {
    stopListening();
    router.push('/learn/basic');
  }, [router, stopListening]);

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
  }, [language, setStoreLanguage]);

  // Speak the sentence (TTS) with natural voice
  const speakSentence = useCallback(() => {
    if (!currentSentence || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSentence.text);
    utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
    utterance.rate = 0.9;

    // 자연스러운 음성 선택
    if (voices.length > 0) {
      const lang = language === 'ko' ? 'ko' : 'en';
      const langVoices = voices.filter(v => v.lang.startsWith(lang));
      const preferredNames = language === 'en'
        ? ['Google US English', 'Samantha', 'Alex', 'Daniel', 'Karen']
        : ['Google 한국어', 'Yuna'];
      const preferred = langVoices.find(v =>
        preferredNames.some(name => v.name.includes(name))
      );
      if (preferred) utterance.voice = preferred;
      else if (langVoices.length > 0) utterance.voice = langVoices[0];
    }

    window.speechSynthesis.speak(utterance);
  }, [currentSentence, language, voices]);

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
                <h1 className="text-xl font-bold">보고 말하기</h1>
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
                이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저를 사용해주세요.
              </CardContent>
            </Card>
          )}

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? '🇺🇸 English' : '🇰🇷 한글'}
            </div>
            <h2 className="text-2xl font-bold mb-2">문장을 소리 내어 읽어보세요</h2>
            <p className="text-[var(--color-text-muted)]">
              화면의 문장을 정확하게 발음해보세요
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
                {difficulty === 'easy' && '문장을 보면서 천천히 읽어보세요.'}
                {difficulty === 'medium' && '문장을 보면서 읽어보세요.'}
                {difficulty === 'hard' && '문장을 한 번 보고 기억해서 말해보세요.'}
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
                    <Mic className="w-5 h-5 text-[var(--color-primary)]" />
                    <p className="text-lg">{sentence.text}</p>
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
                  <h1 className="text-xl font-bold">보고 말하기</h1>
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
        {/* 읽을 문장 */}
        {currentSentence && difficultyInfo[difficulty].showText && (
          <Card className="mb-6">
            <CardContent className="py-6">
              <p className="text-2xl text-center font-medium">{currentSentence.text}</p>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={speakSentence}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  발음 듣기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 음성 인식 컨트롤 */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>
              <p className="text-lg text-[var(--color-text-muted)]">
                {isListening ? '듣고 있습니다... 말을 마치면 버튼을 누르세요' : '버튼을 누르고 문장을 말해보세요'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 인식된 텍스트 */}
        {(transcript || finalTranscript) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">인식된 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">
                {finalTranscript}
                <span className="text-[var(--color-text-muted)]">{transcript}</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* 제출 버튼 */}
        {(transcript || finalTranscript) && !showResult && (
          <div className="text-center mb-6">
            <Button size="lg" onClick={handleSubmit}>
              결과 확인
            </Button>
          </div>
        )}

        {/* 결과 */}
        {showResult && accuracy !== null && (
          <Card className={`mb-6 ${accuracy >= 70 ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
            <CardContent className="py-6 text-center">
              <div className="flex justify-center mb-4">
                {accuracy >= 70 ? (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                  <XCircle className="w-16 h-16 text-orange-500" />
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${accuracy >= 70 ? 'text-green-700' : 'text-orange-700'}`}>
                {accuracy >= 90 ? '완벽해요!' : accuracy >= 70 ? '잘했어요!' : '다시 도전해보세요!'}
              </h3>
              <p className={`text-lg mb-4 ${accuracy >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                정확도: {accuracy}%
              </p>

              {/* 비교 */}
              <div className="text-left bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">원본:</p>
                <p className="text-lg mb-3">{currentSentence?.text}</p>
                <p className="text-sm text-[var(--color-text-muted)] mb-1">말한 내용:</p>
                <p className="text-lg">{finalTranscript || transcript || '(인식된 내용 없음)'}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 연습
                </Button>
                <Button onClick={handleNextSentence} className={accuracy >= 70 ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}>
                  다음 문장
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 하단 컨트롤 */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 연습
          </Button>
          <Button variant="outline" onClick={handleBackToSelect}>
            문장 선택
          </Button>
        </div>
      </main>
    </div>
  );
}
