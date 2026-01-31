'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CharacterFeedback {
  char: string;
  status: 'correct' | 'incorrect' | 'current' | 'pending';
  userChar?: string;
}

interface TypingAreaProps {
  feedback: CharacterFeedback[];
  variant?: 'default' | 'large' | 'compact';
  className?: string;
  showExpectedOnError?: boolean;
}

const variantStyles = {
  default: 'typing-text-display typing-text-lg',
  large: 'typing-text-display typing-text-xl',
  compact: 'typing-text-display typing-text-md',
};

export function TypingArea({
  feedback,
  variant = 'default',
  className,
  showExpectedOnError = false,
}: TypingAreaProps) {
  const currentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: keep current typing position visible
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

  const currentIndex = feedback.findIndex((f) => f.status === 'current');

  return (
    <div
      ref={containerRef}
      className={cn(
        variantStyles[variant],
        'p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] min-h-[60px] max-h-[200px] overflow-y-auto scrollbar-hide',
        className
      )}
      aria-label="타이핑 영역"
    >
      {feedback.map((item, index) => (
        <span
          key={index}
          ref={index === currentIndex ? currentRef : undefined}
          className={cn({
            'text-[var(--color-success)]': item.status === 'correct',
            'text-[var(--color-error)] bg-red-100': item.status === 'incorrect',
            'bg-yellow-300 text-[var(--color-text)] animate-pulse': item.status === 'current',
            'text-gray-400': item.status === 'pending',
          })}
        >
          {item.status === 'incorrect' && showExpectedOnError && item.userChar ? (
            <span className="relative">
              {item.userChar === ' ' ? '\u00A0' : item.userChar}
              <span className="typing-char--expected">
                {item.char === ' ' ? '\u00A0' : item.char}
              </span>
            </span>
          ) : (
            item.char === ' ' ? '\u00A0' : item.char
          )}
        </span>
      ))}
    </div>
  );
}
