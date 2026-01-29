'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, RotateCcw } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';

interface Metric {
  label: string;
  value: string | number;
  color?: 'default' | 'success' | 'warning' | 'error' | 'primary';
}

interface PracticeLayoutProps {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  backHref?: string;
  metrics?: Metric[];
  onRestart?: () => void;
  onSettings?: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  default: 'text-[var(--color-text)]',
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  error: 'text-[var(--color-error)]',
  primary: 'text-[var(--color-primary)]',
};

export function PracticeLayout({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  backHref = '/learn/basic',
  metrics,
  onRestart,
  onSettings,
  headerActions,
  children,
  className = '',
}: PracticeLayoutProps) {
  const { language, toggleMode } = useThemeStore();

  const displayTitle = language === 'ko' ? title : (titleEn || title);
  const displaySubtitle = language === 'ko' ? subtitle : (subtitleEn || subtitle);

  return (
    <div className={`min-h-screen bg-[var(--color-background)] flex flex-col ${className}`}>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* 뒤로가기 + 제목 */}
            <Link href={backHref} className="icon-btn flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[var(--color-text)] truncate">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {displaySubtitle}
                </p>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
              {onRestart && (
                <button onClick={onRestart} className="icon-btn" title="다시 시작">
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
              {onSettings && (
                <button onClick={onSettings} className="icon-btn" title="설정">
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 메트릭 바 */}
          {metrics && metrics.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-6 py-2 px-4 bg-[var(--color-border-light)] rounded-lg">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {metric.label}
                  </span>
                  <span className={`text-sm font-bold ${colorClasses[metric.color || 'default']}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
