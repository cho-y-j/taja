'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseIMEInputOptions {
  onInput: (char: string) => void;
  onBackspace: () => void;
  onStart?: () => void;
  disabled?: boolean;
}

interface UseIMEInputReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  isComposing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
  resetInput: () => void;
  focus: () => void;
}

export function useIMEInput({
  onInput,
  onBackspace,
  onStart,
  disabled = false,
}: UseIMEInputOptions): UseIMEInputReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const [inputValue, setInputValue] = useState('');
  const [prevLength, setPrevLength] = useState(0);

  // Track length for backspace detection
  useEffect(() => {
    setPrevLength(inputValue.length);
  }, [inputValue]);

  // Handle composition start (Korean IME)
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // Handle composition end (Korean IME)
  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      if (disabled) return;

      isComposingRef.current = false;
      const value = e.currentTarget.value;
      setInputValue(value);

      // Process new characters
      for (let i = prevLength; i < value.length; i++) {
        onInput(value[i]);
      }
    },
    [disabled, prevLength, onInput]
  );

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const value = e.target.value;
      setInputValue(value);

      // Start callback
      if (onStart && value.length > 0 && prevLength === 0) {
        onStart();
      }

      // Skip if composing (handled by compositionEnd)
      if (isComposingRef.current) return;

      // Handle backspace
      if (value.length < prevLength) {
        const diff = prevLength - value.length;
        for (let i = 0; i < diff; i++) {
          onBackspace();
        }
        return;
      }

      // Handle new characters
      for (let i = prevLength; i < value.length; i++) {
        onInput(value[i]);
      }
    },
    [disabled, prevLength, onInput, onBackspace, onStart]
  );

  // Reset input
  const resetInput = useCallback(() => {
    setInputValue('');
    setPrevLength(0);
  }, []);

  // Focus input
  const focus = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return {
    inputRef,
    inputValue,
    setInputValue,
    isComposing: isComposingRef.current,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    resetInput,
    focus,
  };
}
