'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Flame,
  Trophy,
  Clock,
  Target,
  Zap,
  Trash2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useStatsStore,
  getTodaySessions,
  getStreak,
  getDailyStats,
  getPracticeTypeStats,
} from '@/stores/stats-store';

const PRACTICE_TYPE_LABELS: Record<string, string> = {
  'home-row': '홈로우',
  words: '단어',
  sentences: '문장',
  summary: '요약',
  document: '전체',
  'listen-write': '듣고쓰기',
  'read-speak': '보고말하기',
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}분 ${remainSeconds}초`;
  const hours = Math.floor(minutes / 60);
  return `${hours}시간 ${minutes % 60}분`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function DashboardPage() {
  const { sessions, clearAll } = useStatsStore();

  const today = useMemo(() => getTodaySessions(sessions), [sessions]);
  const streak = useMemo(() => getStreak(sessions), [sessions]);
  const daily7 = useMemo(() => getDailyStats(sessions, 7), [sessions]);
  const daily30 = useMemo(() => getDailyStats(sessions, 30), [sessions]);
  const typeStats = useMemo(() => getPracticeTypeStats(sessions), [sessions]);

  const todayAvgWpm = today.length > 0
    ? Math.round(today.reduce((s, t) => s + t.wpm, 0) / today.length)
    : 0;
  const todayAvgAccuracy = today.length > 0
    ? Math.round((today.reduce((s, t) => s + t.accuracy, 0) / today.length) * 10) / 10
    : 0;
  const todayTotalTime = today.reduce((s, t) => s + t.duration, 0);

  const allAvgWpm = sessions.length > 0
    ? Math.round(sessions.reduce((s, t) => s + t.wpm, 0) / sessions.length)
    : 0;
  const allAvgAccuracy = sessions.length > 0
    ? Math.round((sessions.reduce((s, t) => s + t.accuracy, 0) / sessions.length) * 10) / 10
    : 0;

  const pieData = typeStats.map((t) => ({
    name: PRACTICE_TYPE_LABELS[t.type] || t.type,
    value: t.count,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
                <h1 className="text-xl font-bold text-[var(--color-text)]">대시보드</h1>
              </div>
            </div>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('모든 통계를 초기화하시겠습니까?')) clearAll();
                }}
                className="text-[var(--color-text-muted)]"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                초기화
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                아직 연습 기록이 없습니다
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                연습을 완료하면 여기에 통계가 표시됩니다
              </p>
              <Link href="/">
                <Button>연습 시작하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* 오늘의 요약 카드 */}
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">오늘의 연습</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-3xl font-bold text-[var(--color-text)]">{today.length}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">세션</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-3xl font-bold text-[var(--color-text)]">{todayAvgWpm}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">평균 WPM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-3xl font-bold text-[var(--color-text)]">{todayAvgAccuracy}%</p>
                    <p className="text-sm text-[var(--color-text-muted)]">평균 정확도</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-3xl font-bold text-[var(--color-text)]">
                      {formatTime(todayTotalTime)}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">연습 시간</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 연속 기록 */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center">
                      <Flame className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-700">{streak.current}일</p>
                      <p className="text-sm text-orange-600">연속 연습</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-yellow-700">{streak.longest}일</p>
                      <p className="text-sm text-yellow-600">최장 연속</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-700">{sessions.length}</p>
                      <p className="text-sm text-blue-600">총 세션</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 주간 WPM / 정확도 차트 */}
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">주간 추이</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">
                      타자 속도 (WPM)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={daily7}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          tick={{ fontSize: 12 }}
                          stroke="var(--color-text-muted)"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
                        <Tooltip
                          labelFormatter={(label) => formatDate(String(label))}
                          formatter={(value) => [`${value} WPM`, '속도']}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgWpm"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">
                      정확도 (%)
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={daily7}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          tick={{ fontSize: 12 }}
                          stroke="var(--color-text-muted)"
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 12 }}
                          stroke="var(--color-text-muted)"
                        />
                        <Tooltip
                          labelFormatter={(label) => formatDate(String(label))}
                          formatter={(value) => [`${value}%`, '정확도']}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgAccuracy"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 월간 연습량 */}
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">월간 연습량</h2>
              <Card>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={daily30}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{ fontSize: 11 }}
                        stroke="var(--color-text-muted)"
                        interval={4}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="var(--color-text-muted)"
                        allowDecimals={false}
                      />
                      <Tooltip
                        labelFormatter={(label) => formatDate(String(label))}
                        formatter={(value) => [`${value}회`, '세션']}
                      />
                      <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            {/* 연습 유형 분포 + 전체 평균 */}
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">연습 분석</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 유형별 분포 파이 차트 */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">
                      연습 유형 분포
                    </h3>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}회`, '세션']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-[var(--color-text-muted)] py-8">
                        데이터 없음
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* 전체 평균 */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">
                      전체 평균
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-muted)]">평균 속도</span>
                        <span className="text-xl font-bold text-[var(--color-text)]">
                          {allAvgWpm} WPM
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-border)] rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(allAvgWpm, 150) / 1.5}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-text-muted)]">평균 정확도</span>
                        <span className="text-xl font-bold text-[var(--color-text)]">
                          {allAvgAccuracy}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-border)] rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${allAvgAccuracy}%` }}
                        />
                      </div>
                      <div className="pt-4 border-t border-[var(--color-border)]">
                        <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
                          유형별 성적
                        </h4>
                        <div className="space-y-2">
                          {typeStats.map((t) => (
                            <div key={t.type} className="flex justify-between text-sm">
                              <span className="text-[var(--color-text-muted)]">
                                {PRACTICE_TYPE_LABELS[t.type] || t.type}
                              </span>
                              <span className="text-[var(--color-text)]">
                                {t.avgWpm} WPM · {t.avgAccuracy}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 최근 세션 */}
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">최근 연습 기록</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">
                            날짜
                          </th>
                          <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">
                            유형
                          </th>
                          <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">
                            WPM
                          </th>
                          <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">
                            정확도
                          </th>
                          <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">
                            시간
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.slice(0, 20).map((s) => {
                          const d = new Date(s.date);
                          return (
                            <tr
                              key={s.id}
                              className="border-b border-[var(--color-border)] last:border-0"
                            >
                              <td className="py-2 text-[var(--color-text)]">
                                {d.getMonth() + 1}/{d.getDate()} {d.getHours()}:
                                {String(d.getMinutes()).padStart(2, '0')}
                              </td>
                              <td className="py-2 text-[var(--color-text)]">
                                {PRACTICE_TYPE_LABELS[s.practiceType] || s.practiceType}
                              </td>
                              <td className="py-2 text-right font-mono text-[var(--color-text)]">
                                {s.wpm}
                              </td>
                              <td className="py-2 text-right font-mono text-[var(--color-text)]">
                                {s.accuracy}%
                              </td>
                              <td className="py-2 text-right text-[var(--color-text-muted)]">
                                {formatTime(s.duration)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
