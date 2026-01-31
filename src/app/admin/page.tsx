'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/admin';
import { RefreshCw, Clock, Users, Sparkles } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalCreditsUsed: number;
  totalRevenue: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    totalCreditsUsed: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            대시보드
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            서비스 현황을 한눈에 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString('ko-KR')} 업데이트
            </span>
          )}
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <section className="mb-8">
        <StatsCards stats={stats} isLoading={isLoading} />
      </section>

      {/* 최근 활동 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 최근 가입자 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-bold text-[var(--color-text)]">최근 가입자</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-border)]" />
                    <div className="flex-1">
                      <div className="w-24 h-4 rounded bg-[var(--color-border)] mb-1" />
                      <div className="w-32 h-3 rounded bg-[var(--color-border)]" />
                    </div>
                  </div>
                </div>
              ))
            ) : stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="px-5 py-3 hover:bg-[var(--color-background)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text)] truncate">
                        {user.name || '이름 없음'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[var(--color-text-muted)]">
                아직 가입한 사용자가 없습니다
              </div>
            )}
          </div>
        </section>

        {/* 최근 AI 사용 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" />
            <h2 className="font-bold text-[var(--color-text)]">최근 AI 사용</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse">
                  <div className="w-full h-4 rounded bg-[var(--color-border)] mb-1" />
                  <div className="w-20 h-3 rounded bg-[var(--color-border)]" />
                </div>
              ))
            ) : stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="px-5 py-3 hover:bg-[var(--color-background)] transition-colors">
                  <p className="text-sm text-[var(--color-text)]">
                    {activity.description}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {new Date(activity.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[var(--color-text-muted)]">
                아직 AI 사용 기록이 없습니다
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
