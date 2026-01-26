'use client';

import { cn } from '@/lib/utils/cn';
import type { TypingMetrics } from '@/types/typing';

interface MetricsDisplayProps {
  metrics: TypingMetrics;
  className?: string;
}

export function MetricsDisplay({ metrics, className }: MetricsDisplayProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-4',
        className
      )}
      aria-live="polite"
    >
      <MetricCard
        label="WPM"
        value={metrics.wpm}
        description="분당 타수"
      />
      <MetricCard
        label="정확도"
        value={`${metrics.accuracy}%`}
        description="정확도"
        variant={metrics.accuracy >= 90 ? 'success' : metrics.accuracy >= 70 ? 'warning' : 'error'}
      />
      <MetricCard
        label="시간"
        value={formatTime(metrics.elapsedTime)}
        description="경과 시간"
      />
      <MetricCard
        label="오류"
        value={metrics.errorCount}
        description="오류 수"
        variant={metrics.errorCount === 0 ? 'success' : 'error'}
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

function MetricCard({ label, value, description, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: 'text-[var(--color-text)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    error: 'text-[var(--color-error)]',
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] p-4 text-center border border-[var(--color-border)]">
      <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={cn('text-3xl font-bold', variantStyles[variant])}>{value}</p>
      <span className="sr-only">{description}</span>
    </div>
  );
}
