'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import type { CharacterFeedback, PracticeType } from '@/types/typing';

export function useTypingEngine(targetText: string, practiceType: PracticeType) {
  const store = useTypingStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 세션 초기화
  useEffect(() => {
    if (targetText) {
      store.initSession(practiceType, targetText);
    }
  }, [targetText, practiceType]);

  // 타이머 - 시작하면 계속 시간 업데이트
  useEffect(() => {
    if (store.isStarted && !store.isComplete && !store.isPaused) {
      timerRef.current = setInterval(() => {
        store.updateElapsedTime();
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [store.isStarted, store.isComplete, store.isPaused]);

  // 키 입력 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (store.isComplete || store.isPaused) return;

      // 특수 키 무시
      if (e.key.length !== 1 && e.key !== 'Backspace') return;

      // Backspace는 현재 지원하지 않음
      if (e.key === 'Backspace') {
        e.preventDefault();
        return;
      }

      // 첫 입력 시 자동으로 세션 시작
      if (!store.isStarted) {
        store.startSession();
      }

      store.processInput(e.key);
    },
    [store.isComplete, store.isPaused, store.isStarted]
  );

  // 문자별 피드백 생성
  const getCharacterFeedback = useCallback((): CharacterFeedback[] => {
    return store.targetText.split('').map((char, index) => {
      if (index < store.userInput.length) {
        const isError = store.errors.includes(index);
        return {
          char,
          status: isError ? 'incorrect' : 'correct',
          index,
        };
      }
      if (index === store.currentIndex) {
        return { char, status: 'current', index };
      }
      return { char, status: 'pending', index };
    });
  }, [store.targetText, store.userInput, store.currentIndex, store.errors]);

  // 다음 키 정보
  const getNextKey = useCallback(() => {
    if (store.currentIndex >= store.targetText.length) return null;
    return store.targetText[store.currentIndex];
  }, [store.currentIndex, store.targetText]);

  // 포커스 유지
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return {
    ...store,
    inputRef,
    handleKeyDown,
    getCharacterFeedback,
    getNextKey,
    focusInput,
    startSession: store.startSession,
    processBackspace: store.processBackspace,
    reset: store.reset,
    pause: store.pause,
    resume: store.resume,
  };
}
