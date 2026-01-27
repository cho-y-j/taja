'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CharacterFeedback } from '@/types/typing';

interface TypingDisplayProps {
  feedback: CharacterFeedback[];
  className?: string;
}

export function TypingDisplay({ feedback, className }: TypingDisplayProps) {
  const currentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current character position
  useEffect(() => {
    if (currentRef.current && containerRef.current) {
      const container = containerRef.current;
      const current = currentRef.current;
      const containerRect = container.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();

      // Scroll if current char is outside visible area
      if (
        currentRect.top < containerRect.top ||
        currentRect.bottom > containerRect.bottom
      ) {
        current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [feedback]);

  // Find current index for ref assignment
  const currentIndex = feedback.findIndex((f) => f.status === 'current');

  return (
    <div
      ref={containerRef}
      className={cn(
        'font-mono text-2xl leading-[2.5] tracking-wide p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] max-h-64 overflow-y-auto',
        className
      )}
      aria-label="타이핑 영역"
    >
      {feedback.map((char, index) => (
        <span
          key={index}
          ref={index === currentIndex ? currentRef : undefined}
          className={cn('typing-char', {
            'typing-char--correct': char.status === 'correct',
            'typing-char--error': char.status === 'incorrect',
            'typing-char--current': char.status === 'current',
            'typing-char--pending': char.status === 'pending',
          })}
        >
          {char.status === 'incorrect' && char.userChar ? (
            <span className="relative inline-block">
              {char.userChar === ' ' ? '␣' : char.userChar}
              <span className="typing-char--expected">
                {char.char === ' ' ? '␣' : char.char}
              </span>
            </span>
          ) : (
            char.char === ' ' ? '\u00A0' : char.char
          )}
        </span>
      ))}
    </div>
  );
}
