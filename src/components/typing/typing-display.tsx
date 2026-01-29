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

  // Auto-scroll: keep current typing position at top 1/3 of container
  useEffect(() => {
    if (currentRef.current && containerRef.current) {
      const container = containerRef.current;
      const current = currentRef.current;
      const targetScrollTop =
        current.offsetTop - container.offsetTop - container.clientHeight / 3;

      if (targetScrollTop > 0) {
        container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      } else {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [feedback]);

  // Find current index for ref assignment
  const currentIndex = feedback.findIndex((f) => f.status === 'current');

  return (
    <div
      ref={containerRef}
      className={cn(
        'font-mono text-2xl leading-[2.5] tracking-wide p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] max-h-48 overflow-y-auto scrollbar-hide break-all',
        className
      )}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
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
          style={
            char.status === 'correct'
              ? { opacity: 0.5 }
              : undefined
          }
        >
          {char.status === 'incorrect' && char.userChar ? (
            <span className="relative">
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
