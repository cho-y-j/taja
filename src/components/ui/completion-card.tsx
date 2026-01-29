'use client';

import { ReactNode } from 'react';
import { RotateCcw, ChevronRight, Home } from 'lucide-react';
import { StarRating, getStarRating, getStarMessage } from './star-rating';

interface Stat {
  label: string;
  value: string | number;
  improvement?: string; // e.g., "+7"
}

interface CompletionCardProps {
  accuracy: number;
  stats?: Stat[];
  onRestart?: () => void;
  onNext?: () => void;
  onHome?: () => void;
  nextLabel?: string;
  showEnterHint?: boolean;
  className?: string;
  children?: ReactNode;
}

export function CompletionCard({
  accuracy,
  stats = [],
  onRestart,
  onNext,
  onHome,
  nextLabel = '다음',
  showEnterHint = true,
  className = '',
  children,
}: CompletionCardProps) {
  const stars = getStarRating(accuracy);
  const message = getStarMessage(stars);

  return (
    <div className={`celebration animate-scale-in ${className}`}>
      {/* 타이틀 */}
      <h2 className="celebration-title">{message}</h2>

      {/* 별 */}
      <div className="celebration-stars">
        <StarRating rating={stars} size="lg" animated />
      </div>

      {/* 통계 */}
      {stats.length > 0 && (
        <div className="flex items-center justify-center gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {stat.value}
                {stat.improvement && (
                  <span className="text-sm text-[var(--color-success)] ml-1">
                    {stat.improvement}
                  </span>
                )}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 추가 컨텐츠 */}
      {children}

      {/* 버튼들 */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {onRestart && (
          <button onClick={onRestart} className="btn btn-outline">
            <RotateCcw className="w-4 h-4" />
            다시 연습
          </button>
        )}
        {onHome && (
          <button onClick={onHome} className="btn btn-outline">
            <Home className="w-4 h-4" />
            목록
          </button>
        )}
        {onNext && (
          <button onClick={onNext} className="btn btn-primary">
            {nextLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Enter 힌트 */}
      {showEnterHint && onNext && (
        <p className="text-xs text-[var(--color-text-light)] mt-3">
          Enter를 누르면 다음으로 이동
        </p>
      )}
    </div>
  );
}
