'use client';

import { Clock, Target, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PracticeMetricsProps {
  wpm: number;
  accuracy: number;
  timeRemaining?: number;
  elapsedTime?: number;
  errorCount?: number;
  variant?: 'compact' | 'grid';
  className?: string;
}

export function PracticeMetrics({
  wpm,
  accuracy,
  timeRemaining,
  elapsedTime,
  errorCount,
  variant = 'grid',
  className,
}: PracticeMetricsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return formatTime(seconds);
  };

  const isUrgent = timeRemaining !== undefined && timeRemaining <= 10;

  // Compact variant - inline metrics for header
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-center gap-4', className)}>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--color-text-muted)]">WPM</span>
          <span className="text-sm font-bold text-[var(--color-text)]">{wpm}</span>
        </div>
        <div className="w-px h-4 bg-[var(--color-border)]" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--color-text-muted)]">정확도</span>
          <span
            className={cn('text-sm font-bold', {
              'text-[var(--color-success)]': accuracy >= 90,
              'text-[var(--color-warning)]': accuracy >= 70 && accuracy < 90,
              'text-[var(--color-error)]': accuracy < 70,
            })}
          >
            {accuracy}%
          </span>
        </div>
        {(timeRemaining !== undefined || elapsedTime !== undefined) && (
          <>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">시간</span>
              <span className={cn('text-sm font-bold', { 'text-red-600': isUrgent })}>
                {timeRemaining !== undefined
                  ? formatTime(timeRemaining)
                  : formatElapsedTime(elapsedTime!)}
              </span>
            </div>
          </>
        )}
        {errorCount !== undefined && (
          <>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--color-text-muted)]">오류</span>
              <span
                className={cn('text-sm font-bold', {
                  'text-[var(--color-success)]': errorCount === 0,
                  'text-[var(--color-error)]': errorCount > 0,
                })}
              >
                {errorCount}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  // Grid variant - 4-column grid with icons
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {/* Timer (spans 2 cols when timeRemaining is present) */}
      {timeRemaining !== undefined && (
        <div
          className={cn(
            'col-span-2 rounded-xl p-4 text-center transition-all',
            isUrgent
              ? 'bg-red-100 border-2 border-red-400 animate-pulse'
              : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className={cn('w-6 h-6', isUrgent ? 'text-red-600' : 'text-[var(--color-primary)]')} />
            <span className={cn('text-4xl font-mono font-bold', { 'text-red-600': isUrgent })}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">남은 시간</p>
        </div>
      )}

      {/* Elapsed time (when no countdown) */}
      {timeRemaining === undefined && elapsedTime !== undefined && (
        <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-3xl font-bold">{formatElapsedTime(elapsedTime)}</span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">시간</p>
        </div>
      )}

      {/* WPM */}
      <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center justify-center gap-1">
          <Zap className="w-5 h-5 text-[var(--color-secondary)]" />
          <span className="text-3xl font-bold text-[var(--color-secondary)]">{wpm}</span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
      </div>

      {/* Accuracy */}
      <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="flex items-center justify-center gap-1">
          <Target className="w-5 h-5 text-[var(--color-success)]" />
          <span
            className={cn('text-3xl font-bold', {
              'text-[var(--color-success)]': accuracy >= 90,
              'text-[var(--color-warning)]': accuracy >= 70 && accuracy < 90,
              'text-[var(--color-error)]': accuracy < 70,
            })}
          >
            {accuracy}%
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">정확도</p>
      </div>

      {/* Error count */}
      {errorCount !== undefined && (
        <div className="rounded-xl p-4 text-center bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-center gap-1">
            <AlertCircle
              className={cn('w-5 h-5', {
                'text-[var(--color-success)]': errorCount === 0,
                'text-[var(--color-error)]': errorCount > 0,
              })}
            />
            <span
              className={cn('text-3xl font-bold', {
                'text-[var(--color-success)]': errorCount === 0,
                'text-[var(--color-error)]': errorCount > 0,
              })}
            >
              {errorCount}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">오류</p>
        </div>
      )}
    </div>
  );
}
