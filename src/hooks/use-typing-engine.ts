'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useStatsStore } from '@/stores/stats-store';
import { playErrorSound, playKeySound } from '@/lib/utils/sound';
import type { CharacterFeedback, PracticeType } from '@/types/typing';

export function useTypingEngine(targetText: string, practiceType: PracticeType) {
  const store = useTypingStore();
  const addSession = useStatsStore((s) => s.addSession);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const savedRef = useRef(false);

  // 세션 초기화
  useEffect(() => {
    if (targetText) {
      store.initSession(practiceType, targetText);
      savedRef.current = false;
    }
  }, [targetText, practiceType]);

  // 완료 시 통계 저장
  useEffect(() => {
    if (store.isComplete && !savedRef.current && store.metrics.totalCharacters > 0) {
      savedRef.current = true;
      addSession({
        practiceType,
        wpm: store.metrics.wpm,
        accuracy: store.metrics.accuracy,
        duration: store.metrics.elapsedTime,
        errorCount: store.metrics.errorCount,
        totalChars: store.metrics.totalCharacters,
      });
    }
  }, [store.isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // processInput with sound effects — this is what all components actually call
  const processInputWithSound = useCallback(
    (char: string) => {
      const expected = store.targetText[store.currentIndex];
      if (char !== expected) {
        playErrorSound();
      } else {
        playKeySound();
      }
      store.processInput(char);
    },
    [store.targetText, store.currentIndex]
  );

  // 문자별 피드백 생성
  const getCharacterFeedback = useCallback((): CharacterFeedback[] => {
    return store.targetText.split('').map((char, index) => {
      if (index < store.userInput.length) {
        const isError = store.errors.includes(index);
        return {
          char,
          userChar: store.userInput[index],
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
    processInput: processInputWithSound,
    inputRef,
    handleKeyDown: () => {}, // deprecated — sound is now in processInput
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
