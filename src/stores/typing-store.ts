import { create } from 'zustand';
import type { TypingMetrics, PracticeType } from '@/types/typing';

interface TypingSessionState {
  // 현재 세션 정보
  practiceType: PracticeType | null;
  targetText: string;
  currentIndex: number;
  userInput: string;
  errors: number[];
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  isPaused: boolean;
  isStarted: boolean;

  // 메트릭
  metrics: TypingMetrics;

  // 액션
  initSession: (type: PracticeType, text: string) => void;
  startSession: () => void;
  processInput: (char: string) => void;
  processBackspace: () => void;
  updateElapsedTime: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  complete: () => void;
}

const initialMetrics: TypingMetrics = {
  wpm: 0,
  cpm: 0,
  accuracy: 100,
  errorCount: 0,
  totalCharacters: 0,
  correctCharacters: 0,
  elapsedTime: 0,
};

export const useTypingStore = create<TypingSessionState>((set, get) => ({
  practiceType: null,
  targetText: '',
  currentIndex: 0,
  userInput: '',
  errors: [],
  startTime: null,
  endTime: null,
  isComplete: false,
  isPaused: false,
  isStarted: false,
  metrics: initialMetrics,

  initSession: (type, text) => {
    set({
      practiceType: type,
      targetText: text,
      currentIndex: 0,
      userInput: '',
      errors: [],
      startTime: null,
      endTime: null,
      isComplete: false,
      isPaused: false,
      isStarted: false,
      metrics: initialMetrics,
    });
  },

  startSession: () => {
    set({
      startTime: Date.now(),
      isStarted: true,
    });
  },

  processInput: (char) => {
    const state = get();
    if (state.isComplete || state.isPaused || !state.isStarted) return;

    const expectedChar = state.targetText[state.currentIndex];
    const isCorrect = char === expectedChar;
    const newErrors = isCorrect ? state.errors : [...state.errors, state.currentIndex];
    const newIndex = state.currentIndex + 1;
    const isComplete = newIndex >= state.targetText.length;

    // 메트릭 계산
    const elapsedTime = Date.now() - state.startTime!;
    const totalCharacters = newIndex;
    const correctCharacters = totalCharacters - newErrors.length;
    const accuracy = totalCharacters > 0
      ? Math.round((correctCharacters / totalCharacters) * 100 * 10) / 10
      : 100;
    const minutes = elapsedTime / 60000;
    const wpm = minutes > 0 ? Math.round((correctCharacters / 5) / minutes) : 0;
    const cpm = minutes > 0 ? Math.round(correctCharacters / minutes) : 0;

    set({
      currentIndex: newIndex,
      userInput: state.userInput + char,
      errors: newErrors,
      endTime: isComplete ? Date.now() : null,
      isComplete,
      metrics: {
        wpm,
        cpm,
        accuracy,
        errorCount: newErrors.length,
        totalCharacters,
        correctCharacters,
        elapsedTime,
      },
    });
  },

  // 백스페이스 처리
  processBackspace: () => {
    const state = get();
    if (state.currentIndex === 0 || state.isComplete || state.isPaused) return;

    const newIndex = state.currentIndex - 1;
    const newUserInput = state.userInput.slice(0, -1);
    // 해당 인덱스가 에러였으면 에러 목록에서 제거
    const newErrors = state.errors.filter(e => e !== newIndex);

    // 메트릭 재계산
    const elapsedTime = state.startTime ? Date.now() - state.startTime : 0;
    const totalCharacters = newIndex;
    const correctCharacters = totalCharacters - newErrors.length;
    const accuracy = totalCharacters > 0
      ? Math.round((correctCharacters / totalCharacters) * 100 * 10) / 10
      : 100;
    const minutes = elapsedTime / 60000;
    const wpm = minutes > 0 && correctCharacters > 0 ? Math.round((correctCharacters / 5) / minutes) : 0;
    const cpm = minutes > 0 && correctCharacters > 0 ? Math.round(correctCharacters / minutes) : 0;

    set({
      currentIndex: newIndex,
      userInput: newUserInput,
      errors: newErrors,
      metrics: {
        wpm,
        cpm,
        accuracy,
        errorCount: newErrors.length,
        totalCharacters,
        correctCharacters,
        elapsedTime,
      },
    });
  },

  // 시간 업데이트 (외부 interval에서 호출)
  updateElapsedTime: () => {
    const state = get();
    if (!state.isStarted || state.isComplete || state.isPaused || !state.startTime) return;

    const elapsedTime = Date.now() - state.startTime;
    const totalCharacters = state.currentIndex;
    const correctCharacters = totalCharacters - state.errors.length;
    const minutes = elapsedTime / 60000;
    const wpm = minutes > 0 && correctCharacters > 0 ? Math.round((correctCharacters / 5) / minutes) : 0;
    const cpm = minutes > 0 && correctCharacters > 0 ? Math.round(correctCharacters / minutes) : 0;

    set({
      metrics: {
        ...state.metrics,
        elapsedTime,
        wpm,
        cpm,
      },
    });
  },

  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),

  reset: () => {
    set({
      currentIndex: 0,
      userInput: '',
      errors: [],
      startTime: null,
      endTime: null,
      isComplete: false,
      isPaused: false,
      isStarted: false,
      metrics: initialMetrics,
    });
  },

  complete: () => {
    set({
      isComplete: true,
      endTime: Date.now(),
    });
  },
}));
