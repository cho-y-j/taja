# multimodal-handler Skill

## 목적
TTS(Text-to-Speech)와 STT(Speech-to-Text)를 통합하여 듣고쓰기, 보고말하기 기능을 구현한다.

## Web Speech API 활용

### 1. TTS (Text-to-Speech)

```typescript
// lib/speech/tts.ts
interface TTSOptions {
  text: string;
  locale: 'ko-KR' | 'en-US' | 'ja-JP';
  rate?: number;   // 0.1 ~ 10 (기본: 1)
  pitch?: number;  // 0 ~ 2 (기본: 1)
  volume?: number; // 0 ~ 1 (기본: 1)
}

export function speak(options: TTSOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('TTS not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(options.text);
    utterance.lang = options.locale;
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    // 해당 언어 음성 선택
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(options.locale.split('-')[0]));
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    speechSynthesis.speak(utterance);
  });
}

// 음성 일시정지/재개
export const pauseSpeech = () => speechSynthesis.pause();
export const resumeSpeech = () => speechSynthesis.resume();
export const stopSpeech = () => speechSynthesis.cancel();
```

### 2. STT (Speech-to-Text)

```typescript
// lib/speech/stt.ts
interface STTOptions {
  locale: 'ko-KR' | 'en-US' | 'ja-JP';
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

export function createSpeechRecognition(options: STTOptions) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error('STT not supported');
  }

  const recognition = new SpeechRecognition();
  recognition.lang = options.locale;
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? true;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const text = result[0].transcript;
    const isFinal = result.isFinal;
    options.onResult?.(text, isFinal);
  };

  recognition.onerror = (event) => {
    options.onError?.(new Error(event.error));
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  };
}
```

## 듣고쓰기 모드

```typescript
// 듣고쓰기 흐름
interface ListenWriteSession {
  sentence: string;
  locale: string;
  playCount: number;      // 재생 횟수
  maxPlays: number;       // 최대 재생 횟수
  userInput: string;
  isPlaying: boolean;
  isComplete: boolean;
}

// hooks/useListenWrite.ts
export function useListenWrite(sentence: string, locale: string) {
  const [session, setSession] = useState<ListenWriteSession>({
    sentence,
    locale,
    playCount: 0,
    maxPlays: 3,
    userInput: '',
    isPlaying: false,
    isComplete: false,
  });

  const playSentence = async () => {
    if (session.playCount >= session.maxPlays) return;

    setSession(prev => ({ ...prev, isPlaying: true }));
    await speak({ text: sentence, locale: locale as TTSOptions['locale'] });
    setSession(prev => ({
      ...prev,
      isPlaying: false,
      playCount: prev.playCount + 1,
    }));
  };

  const handleInput = (input: string) => {
    setSession(prev => ({
      ...prev,
      userInput: input,
      isComplete: input === sentence,
    }));
  };

  return { session, playSentence, handleInput };
}
```

## 보고말하기 모드

```typescript
// 보고말하기 흐름
interface SpeakPracticeSession {
  sentence: string;
  locale: string;
  userSpeech: string;
  isListening: boolean;
  attempts: number;
  maxAttempts: number;
  accuracy: number;       // 발음 정확도
  isComplete: boolean;
}

// hooks/useSpeakPractice.ts
export function useSpeakPractice(sentence: string, locale: string) {
  const [session, setSession] = useState<SpeakPracticeSession>({...});
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition>>();

  const startListening = () => {
    recognitionRef.current = createSpeechRecognition({
      locale: locale as STTOptions['locale'],
      onResult: (text, isFinal) => {
        setSession(prev => ({
          ...prev,
          userSpeech: text,
          isListening: !isFinal,
        }));

        if (isFinal) {
          const accuracy = calculateSimilarity(sentence, text);
          setSession(prev => ({
            ...prev,
            accuracy,
            isComplete: accuracy >= 80,
            attempts: prev.attempts + 1,
          }));
        }
      },
    });
    recognitionRef.current.start();
    setSession(prev => ({ ...prev, isListening: true }));
  };

  return { session, startListening, stopListening };
}

// 텍스트 유사도 계산 (레벤슈타인 거리 기반)
function calculateSimilarity(original: string, spoken: string): number {
  // 정규화 후 비교
  const a = original.toLowerCase().trim();
  const b = spoken.toLowerCase().trim();
  // 레벤슈타인 거리 계산 후 유사도 반환
  return Math.round((1 - levenshtein(a, b) / Math.max(a.length, b.length)) * 100);
}
```

## UI 컴포넌트

```typescript
// 듣고쓰기 UI
<ListenWriteMode
  sentence={sentence}
  locale={locale}
  onComplete={handleComplete}
/>

// 보고말하기 UI
<SpeakPracticeMode
  sentence={sentence}
  locale={locale}
  showHint={true}      // 첫 글자 힌트
  onComplete={handleComplete}
/>
```

## 브라우저 호환성

| 기능 | Chrome | Safari | Firefox | Edge |
|-----|--------|--------|---------|------|
| TTS | ✅ | ✅ | ✅ | ✅ |
| STT | ✅ | ✅ (iOS 14.5+) | ❌ | ✅ |

> Firefox STT 미지원 → 대체 UI 제공 (텍스트 입력)

## 사용 Agent
- Frontend-Dev: 구현
- AI-Integrator: 고급 음성 서비스 연동 (추후)

## 체크리스트
- [ ] TTS 구현
- [ ] STT 구현
- [ ] 듣고쓰기 모드 구현
- [ ] 보고말하기 모드 구현
- [ ] 브라우저 호환성 처리
- [ ] 폴백 UI (미지원 브라우저)
