'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0-3
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export function StarRating({ rating, size = 'md', animated = false, className = '' }: StarRatingProps) {
  const stars = [1, 2, 3];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {stars.map((star, index) => {
        const isFilled = star <= rating;
        const delay = animated ? `${index * 0.15}s` : '0s';

        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} transition-all ${
              isFilled
                ? 'star star-filled fill-[var(--color-secondary)]'
                : 'star text-[var(--color-border)]'
            } ${animated && isFilled ? 'star-animated' : ''}`}
            style={animated ? { animationDelay: delay } : undefined}
          />
        );
      })}
    </div>
  );
}

// 정확도에 따른 별 개수 계산
export function getStarRating(accuracy: number): number {
  if (accuracy >= 95) return 3;
  if (accuracy >= 85) return 2;
  if (accuracy >= 70) return 1;
  return 0;
}

// 별 개수에 따른 메시지 (항상 한국어)
export function getStarMessage(stars: number): string {
  const messages: Record<number, string> = {
    0: '다시 도전해보세요!',
    1: '잘했어요!',
    2: '훌륭해요!',
    3: '완벽해요!',
  };
  return messages[stars] || messages[0];
}
