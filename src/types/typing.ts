// 타이핑 관련 타입 정의

export type PracticeType =
  | 'home-row'
  | 'words'
  | 'sentences'
  | 'listen-write'
  | 'speak'
  | 'document'
  | 'summary';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Locale = 'ko' | 'en' | 'ja';

// 타이핑 측정 지표
export interface TypingMetrics {
  wpm: number;           // Words Per Minute
  cpm: number;           // Characters Per Minute
  accuracy: number;      // 정확도 (%)
  errorCount: number;    // 오류 수
  totalCharacters: number;
  correctCharacters: number;
  elapsedTime: number;   // 경과 시간 (ms)
}

// 타이핑 상태
export interface TypingState {
  targetText: string;
  currentIndex: number;
  userInput: string;
  errors: number[];      // 오류 발생 인덱스
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  isPaused: boolean;
}

// 문자 피드백
export interface CharacterFeedback {
  char: string;
  userChar?: string;
  status: 'pending' | 'correct' | 'incorrect' | 'current';
  index: number;
}

// 키보드 하이라이트
export interface KeyHighlight {
  key: string;
  finger: Finger;
  hand: 'left' | 'right';
}

export type Finger =
  | 'pinky'
  | 'ring'
  | 'middle'
  | 'index'
  | 'thumb';

// 홈로우 키 연습 레벨
export interface HomeRowLevel {
  level: number;
  keys: string[];
  targetAccuracy: number;
  description: string;
}

// 연습 세션 결과
export interface PracticeResult {
  type: PracticeType;
  metrics: TypingMetrics;
  locale: Locale;
  contentId?: string;
  completedAt: Date;
}
