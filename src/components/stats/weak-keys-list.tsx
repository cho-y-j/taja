'use client';

import { AlertTriangle } from 'lucide-react';

interface WeakKey {
  key: string;
  errorCount: number;
  totalAttempts: number;
  errorRate: number;
}

interface WeakKeysListProps {
  keys: WeakKey[];
}

export function WeakKeysList({ keys }: WeakKeysListProps) {
  if (keys.length === 0) {
    return (
      <div className="text-center py-6 text-[var(--color-text-muted)]">
        <p className="text-sm">아직 취약 키 데이터가 없습니다</p>
        <p className="text-xs mt-1">연습을 시작하면 분석됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {keys.map((k, index) => (
        <div
          key={k.key}
          className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded-lg"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-[var(--color-text)]">
                {k.key === ' ' ? 'Space' : k.key.toUpperCase()}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {k.errorCount}회 오류
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(k.errorRate, 100)}%`,
                    backgroundColor:
                      k.errorRate > 50
                        ? 'var(--color-error)'
                        : k.errorRate > 25
                          ? 'var(--color-warning)'
                          : 'var(--color-secondary)',
                  }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--color-text-muted)] w-12 text-right">
                {k.errorRate}%
              </span>
            </div>
          </div>
        </div>
      ))}

      {keys.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-[var(--color-warning)]/10 rounded-lg text-sm">
          <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] mt-0.5 flex-shrink-0" />
          <p className="text-[var(--color-text-muted)]">
            위 키들을 집중적으로 연습해보세요. 홈로우 연습에서 해당 키가 포함된 연습을 하면 도움이 됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
