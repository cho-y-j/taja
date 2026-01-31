'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DailyStat {
  date: string;
  sessionsCount: number;
  totalTime: number;
  avgWpm: number;
  avgAccuracy: number;
}

interface ProgressChartProps {
  data: DailyStat[];
  metric: 'wpm' | 'accuracy';
}

export function ProgressChart({ data, metric }: ProgressChartProps) {
  const chartData = useMemo(() => {
    // 최근 7일 데이터만 표시
    const recentData = data.slice(0, 7).reverse();

    // 최대값 계산 (차트 스케일용)
    const values = recentData.map((d) =>
      metric === 'wpm' ? d.avgWpm : d.avgAccuracy
    );
    const maxValue = Math.max(...values, metric === 'wpm' ? 50 : 100);
    const minValue = Math.min(...values, 0);

    return { recentData, maxValue, minValue };
  }, [data, metric]);

  // 추세 계산
  const trend = useMemo(() => {
    if (chartData.recentData.length < 2) return 'neutral';
    const first = metric === 'wpm'
      ? chartData.recentData[0]?.avgWpm || 0
      : chartData.recentData[0]?.avgAccuracy || 0;
    const last = metric === 'wpm'
      ? chartData.recentData[chartData.recentData.length - 1]?.avgWpm || 0
      : chartData.recentData[chartData.recentData.length - 1]?.avgAccuracy || 0;

    if (last > first * 1.05) return 'up';
    if (last < first * 0.95) return 'down';
    return 'neutral';
  }, [chartData.recentData, metric]);

  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-[var(--color-text-muted)]">
        <p className="text-sm">아직 데이터가 없습니다</p>
      </div>
    );
  }

  const { recentData, maxValue, minValue } = chartData;

  return (
    <div>
      {/* 추세 표시 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <span className="flex items-center gap-1 text-sm text-[var(--color-success)]">
              <TrendingUp className="w-4 h-4" />
              상승 추세
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center gap-1 text-sm text-[var(--color-error)]">
              <TrendingDown className="w-4 h-4" />
              하락 추세
            </span>
          )}
          {trend === 'neutral' && (
            <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
              <Minus className="w-4 h-4" />
              안정
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          최근 {recentData.length}일
        </span>
      </div>

      {/* 차트 */}
      <div className="h-32 flex items-end gap-2">
        {recentData.map((day, index) => {
          const value = metric === 'wpm' ? day.avgWpm : day.avgAccuracy;
          const height = maxValue > 0
            ? Math.max((value / maxValue) * 100, 5)
            : 5;

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="w-full h-24 flex items-end">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    backgroundColor:
                      metric === 'wpm'
                        ? 'var(--color-primary)'
                        : 'var(--color-success)',
                  }}
                  title={`${day.date}: ${value}${metric === 'accuracy' ? '%' : ''}`}
                />
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {new Date(day.date).toLocaleDateString('ko-KR', {
                  month: 'numeric',
                  day: 'numeric',
                })}
              </span>
            </div>
          );
        })}
      </div>

      {/* 값 표시 */}
      <div className="mt-2 flex justify-between text-xs text-[var(--color-text-muted)]">
        <span>
          평균:{' '}
          {Math.round(
            recentData.reduce(
              (sum, d) => sum + (metric === 'wpm' ? d.avgWpm : d.avgAccuracy),
              0
            ) / (recentData.length || 1)
          )}
          {metric === 'accuracy' ? '%' : ''}
        </span>
        <span>
          최고:{' '}
          {Math.round(
            Math.max(
              ...recentData.map((d) =>
                metric === 'wpm' ? d.avgWpm : d.avgAccuracy
              )
            )
          )}
          {metric === 'accuracy' ? '%' : ''}
        </span>
      </div>
    </div>
  );
}
