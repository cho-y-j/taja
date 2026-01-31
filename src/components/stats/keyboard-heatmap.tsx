'use client';

import { useMemo } from 'react';

interface KeyStats {
  key: string;
  errorCount: number;
  totalAttempts: number;
  errorRate: number;
}

interface KeyboardHeatmapProps {
  data: KeyStats[];
  layout?: 'qwerty' | 'korean';
}

// QWERTY 키보드 레이아웃
const QWERTY_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

// 한글 키보드 레이아웃 (두벌식)
const KOREAN_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', '[', ']', '\\'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', ';', "'"],
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', ',', '.', '/'],
  [' '],
];

// 에러율에 따른 색상
function getHeatColor(errorRate: number): string {
  if (errorRate === 0) return 'var(--color-surface)';
  if (errorRate < 10) return 'rgba(34, 197, 94, 0.3)'; // green
  if (errorRate < 25) return 'rgba(234, 179, 8, 0.4)'; // yellow
  if (errorRate < 50) return 'rgba(249, 115, 22, 0.5)'; // orange
  return 'rgba(239, 68, 68, 0.6)'; // red
}

export function KeyboardHeatmap({ data, layout = 'qwerty' }: KeyboardHeatmapProps) {
  const keyboardLayout = layout === 'korean' ? KOREAN_LAYOUT : QWERTY_LAYOUT;

  // 키별 데이터 맵핑
  const keyDataMap = useMemo(() => {
    const map = new Map<string, KeyStats>();
    data.forEach((d) => {
      map.set(d.key.toLowerCase(), d);
    });
    return map;
  }, [data]);

  // 최대 에러율 (색상 스케일용)
  const maxErrorRate = useMemo(() => {
    return Math.max(...data.map((d) => d.errorRate), 1);
  }, [data]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1"
            style={{ paddingLeft: rowIndex === 2 ? '1rem' : rowIndex === 3 ? '2rem' : 0 }}
          >
            {row.map((key, keyIndex) => {
              const keyData = keyDataMap.get(key.toLowerCase());
              const errorRate = keyData?.errorRate || 0;
              const isSpace = key === ' ';

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  className={`
                    relative flex items-center justify-center rounded-md border border-[var(--color-border)]
                    font-mono text-sm font-medium transition-all
                    ${isSpace ? 'w-48 h-10' : 'w-10 h-10'}
                    ${errorRate > 0 ? 'shadow-sm' : ''}
                  `}
                  style={{
                    backgroundColor: getHeatColor(errorRate),
                    color: errorRate > 25 ? 'white' : 'var(--color-text)',
                  }}
                  title={keyData ? `${key}: ${keyData.errorCount}회 오류 (${errorRate}%)` : key}
                >
                  {isSpace ? 'Space' : key.toUpperCase()}
                  {errorRate > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-error)] text-white text-[10px] rounded-full flex items-center justify-center">
                      {keyData?.errorCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }} />
          <span>&lt;10%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.4)' }} />
          <span>&lt;25%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.5)' }} />
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }} />
          <span>50%+</span>
        </div>
      </div>
    </div>
  );
}
