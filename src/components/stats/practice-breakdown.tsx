'use client';

import {
  Keyboard,
  Type,
  FileText,
  Headphones,
  Mic,
  BarChart3,
} from 'lucide-react';

interface TypeStat {
  type: string;
  count: number;
  avgWpm: number;
  avgAccuracy: number;
}

interface PracticeBreakdownProps {
  data: TypeStat[];
}

const TYPE_INFO: Record<string, { label: string; icon: typeof Keyboard; color: string }> = {
  'home-row': {
    label: '홈로우',
    icon: Keyboard,
    color: 'var(--color-primary)',
  },
  'words': {
    label: '단어',
    icon: Type,
    color: 'var(--color-secondary)',
  },
  'sentences': {
    label: '문장',
    icon: FileText,
    color: 'var(--color-success)',
  },
  'listen-write': {
    label: '듣고쓰기',
    icon: Headphones,
    color: 'var(--color-warning)',
  },
  'speak': {
    label: '보고말하기',
    icon: Mic,
    color: 'var(--color-error)',
  },
  'document': {
    label: '문서',
    icon: FileText,
    color: 'var(--color-info)',
  },
};

export function PracticeBreakdown({ data }: PracticeBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-[var(--color-text-muted)]">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">아직 연습 기록이 없습니다</p>
      </div>
    );
  }

  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-4">
      {/* 도넛 차트 대신 바 차트 */}
      <div className="space-y-3">
        {data.map((stat) => {
          const info = TYPE_INFO[stat.type] || {
            label: stat.type,
            icon: BarChart3,
            color: 'var(--color-text-muted)',
          };
          const Icon = info.icon;
          const percentage = totalCount > 0 ? (stat.count / totalCount) * 100 : 0;

          return (
            <div key={stat.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: info.color }} />
                  <span className="font-medium text-[var(--color-text)]">
                    {info.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
                  <span>{stat.count}회</span>
                  <span className="text-xs">
                    {stat.avgWpm} WPM · {stat.avgAccuracy}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: info.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 요약 */}
      <div className="pt-3 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
        총 <span className="font-medium text-[var(--color-text)]">{totalCount}</span>회 연습
      </div>
    </div>
  );
}
