'use client';

import { Users, Activity, Coins, TrendingUp } from 'lucide-react';

interface StatsData {
  totalUsers: number;
  activeToday: number;
  totalCreditsUsed: number;
  totalRevenue: number;
}

interface StatsCardsProps {
  stats: StatsData;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: '전체 사용자',
      value: stats.totalUsers,
      icon: Users,
      color: 'var(--color-primary)',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: '오늘 활성 사용자',
      value: stats.activeToday,
      icon: Activity,
      color: 'var(--color-success)',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: '총 크레딧 사용',
      value: stats.totalCreditsUsed,
      icon: Coins,
      color: 'var(--color-secondary)',
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: '총 매출',
      value: stats.totalRevenue,
      icon: TrendingUp,
      color: 'var(--color-warning)',
      format: (v: number) => `${v.toLocaleString()}원`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]"
          >
            {isLoading ? (
              <div className="animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-border)] mb-3" />
                <div className="w-20 h-4 rounded bg-[var(--color-border)] mb-2" />
                <div className="w-16 h-6 rounded bg-[var(--color-border)]" />
              </div>
            ) : (
              <>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {card.format(card.value)}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
