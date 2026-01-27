'use client';

import { useRef, useCallback, useEffect } from 'react';

interface TypingInputProps {
  language: 'en' | 'ko';
  isComplete: boolean;
  isPaused: boolean;
  isStarted: boolean;
  processInput: (char: string) => void;
  processBackspace: () => void;
  startSession: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
}

/**
 * Hidden input component that correctly handles both Korean IME and English input.
 *
 * Korean: Uses browser IME composition events (compositionEnd) to get
 * fully composed syllables (e.g., "한" instead of "ㅎ","ㅏ","ㄴ").
 *
 * English: Uses keyDown event with preventDefault for direct character handling.
 */
export function TypingInput({
  language,
  isComplete,
  isPaused,
  isStarted,
  processInput,
  processBackspace,
  startSession,
  inputRef,
  autoFocus = true,
}: TypingInputProps) {
  const isComposingRef = useRef(false);
  const justEndedCompositionRef = useRef(false);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus, inputRef]);

  // KeyDown handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isComplete || isPaused) return;

      // Backspace works in both languages
      if (e.key === 'Backspace') {
        e.preventDefault();
        processBackspace();
        return;
      }

      // Ignore non-character keys
      if (e.key.length !== 1) return;

      if (language === 'ko') {
        // Non-letter characters (space, numbers, punctuation):
        // Handle directly in keyDown — they don't participate in IME composition
        if (!/[a-zA-Z]/.test(e.key)) {
          e.preventDefault();
          if (!isStarted) startSession();
          processInput(e.key);
          return;
        }
        // Letter keys → let IME handle (compositionEnd processes the result)
        if (!isStarted) startSession();
        return;
      }

      // English: handle directly via keyDown
      e.preventDefault();
      if (!isStarted) startSession();
      processInput(e.key);
    },
    [language, isComplete, isPaused, isStarted, processInput, processBackspace, startSession]
  );

  // Composition events for Korean IME
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      justEndedCompositionRef.current = true;

      if (isComplete || isPaused) return;

      const data = e.data;
      if (data) {
        if (!isStarted) startSession();
        for (const char of data) {
          processInput(char);
        }
      }

      // Clear input after composition ends (use rAF to let browser finish internal handling)
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      });
    },
    [isComplete, isPaused, isStarted, processInput, startSession, inputRef]
  );

  // onChange for non-composition input in Korean mode (spaces, punctuation)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (language !== 'ko') {
        // English: input handled by keyDown, just clear
        e.target.value = '';
        return;
      }

      // Skip if currently composing
      if (isComposingRef.current) return;

      // Skip if this change is from compositionEnd (already processed)
      if (justEndedCompositionRef.current) {
        justEndedCompositionRef.current = false;
        return;
      }

      if (isComplete || isPaused) {
        e.target.value = '';
        return;
      }

      // Direct input: space, punctuation, numbers
      const value = e.target.value;
      if (value) {
        if (!isStarted) startSession();
        for (const char of value) {
          processInput(char);
        }
        e.target.value = '';
      }
    },
    [language, isComplete, isPaused, isStarted, processInput, startSession]
  );

  return (
    <input
      ref={inputRef}
      type="text"
      className="absolute opacity-0 w-0 h-0"
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onChange={handleChange}
      aria-label="타이핑 입력"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );
}
