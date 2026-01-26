'use client';

import { cn } from '@/lib/utils/cn';
import type { CharacterFeedback } from '@/types/typing';

interface TypingDisplayProps {
  feedback: CharacterFeedback[];
  className?: string;
}

export function TypingDisplay({ feedback, className }: TypingDisplayProps) {
  return (
    <div
      className={cn(
        'font-mono text-2xl leading-relaxed tracking-wide p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)]',
        className
      )}
      aria-label="타이핑 영역"
    >
      {feedback.map((char, index) => (
        <span
          key={index}
          className={cn('typing-char', {
            'typing-char--correct': char.status === 'correct',
            'typing-char--error': char.status === 'incorrect',
            'typing-char--current': char.status === 'current',
            'typing-char--pending': char.status === 'pending',
          })}
        >
          {char.char === ' ' ? '\u00A0' : char.char}
        </span>
      ))}
    </div>
  );
}
