'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface AnalyticsData {
  dailyActiveUsers: Array<{ date: string; count: number }>;
  aiUsageByType: Array<{ type: string; count: number }>;
  signupsPerDay: Array<{ date: string; count: number }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?period=${period}`);
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            이용 현황
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            서비스 이용 통계를 분석합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--color-text-muted)]" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)]"
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
          </select>
        </div>
      </div>

      {/* 차트 플레이스홀더 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 일일 활성 사용자 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-bold text-[var(--color-text)]">일일 활성 사용자</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">차트 준비 중</p>
                <p className="text-xs">Recharts 연동 예정</p>
              </div>
            </div>
          )}
        </section>

        {/* AI 사용량 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" />
            <h2 className="font-bold text-[var(--color-text)]">AI 기능별 사용량</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">차트 준비 중</p>
                <p className="text-xs">Recharts 연동 예정</p>
              </div>
            </div>
          )}
        </section>

        {/* 신규 가입 추이 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
            <h2 className="font-bold text-[var(--color-text)]">신규 가입 추이</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">차트 준비 중</p>
                <p className="text-xs">Recharts 연동 예정</p>
              </div>
            </div>
          )}
        </section>

        {/* 연습 유형별 분포 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[var(--color-warning)]" />
            <h2 className="font-bold text-[var(--color-text)]">연습 유형별 분포</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">차트 준비 중</p>
                <p className="text-xs">Recharts 연동 예정</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
