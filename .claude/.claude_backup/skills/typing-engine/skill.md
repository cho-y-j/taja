# typing-engine Skill

## 목적
타이핑 연습의 핵심 엔진을 구현한다. WPM, 정확도, 시간 측정 및 실시간 피드백을 제공한다.

## 핵심 기능

### 1. 측정 지표

```typescript
interface TypingMetrics {
  wpm: number;           // Words Per Minute
  cpm: number;           // Characters Per Minute
  accuracy: number;      // 정확도 (%)
  errorCount: number;    // 오류 수
  totalCharacters: number;
  correctCharacters: number;
  elapsedTime: number;   // 경과 시간 (ms)
}

// WPM 계산 (표준: 5글자 = 1단어)
function calculateWPM(characters: number, timeMs: number): number {
  const minutes = timeMs / 60000;
  const words = characters / 5;
  return Math.round(words / minutes);
}

// 정확도 계산
function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100 * 10) / 10;
}
```

### 2. 입력 처리

```typescript
interface TypingState {
  targetText: string;
  currentIndex: number;
  userInput: string;
  errors: number[];      // 오류 발생 인덱스
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
}

function processInput(state: TypingState, char: string): TypingState {
  const { targetText, currentIndex, userInput, errors } = state;
  const expectedChar = targetText[currentIndex];

  const isCorrect = char === expectedChar;
  const newErrors = isCorrect ? errors : [...errors, currentIndex];

  return {
    ...state,
    currentIndex: currentIndex + 1,
    userInput: userInput + char,
    errors: newErrors,
    startTime: state.startTime ?? Date.now(),
    isComplete: currentIndex + 1 >= targetText.length,
    endTime: currentIndex + 1 >= targetText.length ? Date.now() : null,
  };
}
```

### 3. 실시간 피드백

```typescript
interface CharacterFeedback {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'current';
  index: number;
}

function getCharacterFeedback(
  targetText: string,
  userInput: string,
  currentIndex: number
): CharacterFeedback[] {
  return targetText.split('').map((char, index) => {
    if (index < userInput.length) {
      return {
        char,
        status: userInput[index] === char ? 'correct' : 'incorrect',
        index,
      };
    }
    if (index === currentIndex) {
      return { char, status: 'current', index };
    }
    return { char, status: 'pending', index };
  });
}
```

### 4. 키보드 하이라이트

```typescript
// 다음 입력할 키 하이라이트
interface KeyHighlight {
  key: string;
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' |
          'right-index' | 'right-middle' | 'right-ring' | 'right-pinky' |
          'thumb';
  hand: 'left' | 'right';
}

const keyFingerMap: Record<string, KeyHighlight> = {
  'a': { key: 'a', finger: 'left-pinky', hand: 'left' },
  's': { key: 's', finger: 'left-ring', hand: 'left' },
  'd': { key: 'd', finger: 'left-middle', hand: 'left' },
  'f': { key: 'f', finger: 'left-index', hand: 'left' },
  'j': { key: 'j', finger: 'right-index', hand: 'right' },
  'k': { key: 'k', finger: 'right-middle', hand: 'right' },
  'l': { key: 'l', finger: 'right-ring', hand: 'right' },
  ';': { key: ';', finger: 'right-pinky', hand: 'right' },
  // ... 모든 키 매핑
};
```

## React Hook

```typescript
// hooks/useTypingEngine.ts
export function useTypingEngine(targetText: string) {
  const [state, setState] = useState<TypingState>(initialState);
  const [metrics, setMetrics] = useState<TypingMetrics>(initialMetrics);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (state.isComplete) return;

    const char = e.key;
    if (char.length !== 1) return; // 특수키 무시

    setState(prev => processInput(prev, char));
  }, [state.isComplete]);

  // 실시간 메트릭 업데이트
  useEffect(() => {
    if (!state.startTime || state.isComplete) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - state.startTime!;
      setMetrics(calculateMetrics(state, elapsed));
    }, 100);

    return () => clearInterval(interval);
  }, [state]);

  return {
    state,
    metrics,
    feedback: getCharacterFeedback(targetText, state.userInput, state.currentIndex),
    reset: () => setState(initialState),
  };
}
```

## 사용 Agent
- Frontend-Dev: 구현

## 체크리스트
- [ ] 메트릭 계산 로직
- [ ] 입력 처리 로직
- [ ] 실시간 피드백
- [ ] 키보드 하이라이트
- [ ] React Hook 구현
- [ ] 성능 최적화 (< 16ms 응답)
