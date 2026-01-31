'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Sparkles,
  Calendar,
  Coins,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AnalyticsData {
  dailyActiveUsers: Array<{ date: string; count: number }>;
  aiUsageByType: Array<{ type: string; count: number }>;
  signupsPerDay: Array<{ date: string; count: number }>;
  practiceByType: Array<{ type: string; count: number }>;
  dailyPerformance: Array<{ date: string; avgWpm: number; avgAccuracy: number }>;
  dailyCreditUsage: Array<{ date: string; total: number }>;
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const PRACTICE_TYPE_LABELS: Record<string, string> = {
  'home-row': '홈로우',
  'words': '단어',
  'sentences': '문장',
  'document': '문서',
  'listen-write': '듣고쓰기',
  'speak': '보고말하기',
  'unknown': '기타',
};

const AI_TYPE_LABELS: Record<string, string> = {
  'translate': '번역',
  'summarize': '요약',
  'generate-document': '문서 생성',
  'extract-content': '콘텐츠 추출',
  'generate-sentences': '문장 생성',
  'unknown': '기타',
};

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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

      {/* 차트 그리드 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 일일 활성 사용자 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-bold text-[var(--color-text)]">일일 활성 사용자</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.dailyActiveUsers && data.dailyActiveUsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ko-KR')}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  name="활성 사용자"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
            </div>
          )}
        </section>

        {/* AI 기능별 사용량 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" />
            <h2 className="font-bold text-[var(--color-text)]">AI 기능별 사용량</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.aiUsageByType && data.aiUsageByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.aiUsageByType.map(item => ({
                    ...item,
                    name: AI_TYPE_LABELS[item.type] || item.type,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="name"
                >
                  {data.aiUsageByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.signupsPerDay && data.signupsPerDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.signupsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ko-KR')}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="신규 가입" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.practiceByType && data.practiceByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.practiceByType.map(item => ({
                    ...item,
                    name: PRACTICE_TYPE_LABELS[item.type] || item.type,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="name"
                >
                  {data.practiceByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
            </div>
          )}
        </section>

        {/* WPM/정확도 추이 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[var(--color-error)]" />
            <h2 className="font-bold text-[var(--color-text)]">평균 WPM / 정확도</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.dailyPerformance && data.dailyPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis yAxisId="left" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ko-KR')}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgWpm"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="WPM"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgAccuracy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="정확도 (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
            </div>
          )}
        </section>

        {/* 일별 크레딧 사용량 */}
        <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-[var(--color-secondary)]" />
            <h2 className="font-bold text-[var(--color-text)]">일별 크레딧 사용량</h2>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          ) : data?.dailyCreditUsage && data.dailyCreditUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.dailyCreditUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="var(--color-text-muted)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ko-KR')}
                />
                <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="크레딧 사용" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-text-muted)]">
              <p className="text-sm">데이터가 없습니다</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
