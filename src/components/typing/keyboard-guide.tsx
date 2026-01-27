'use client';

import { cn } from '@/lib/utils/cn';
import { homeRowKeys } from '@/lib/typing/home-row';
import { fingerMapping } from '@/lib/typing/keyboard-practice';
import type { Locale } from '@/types/typing';

interface KeyboardGuideProps {
  locale: Locale;
  activeKey?: string;
  showFingers?: boolean;
  className?: string;
}

// 영문 키보드 레이아웃
const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

// 손가락 색상
const fingerColors: Record<string, string> = {
  pinky: '#ef4444',    // 빨강
  ring: '#f97316',     // 주황
  middle: '#eab308',   // 노랑
  index: '#22c55e',    // 초록
  thumb: '#3b82f6',    // 파랑
};

export function KeyboardGuide({
  locale,
  activeKey,
  showFingers = true,
  className,
}: KeyboardGuideProps) {
  const homeKeys = homeRowKeys[locale];
  const allHomeKeys = [...homeKeys.left, ...homeKeys.right];

  const isHomeKey = (key: string) => {
    // 영어 키보드 기준
    return ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'].includes(key);
  };

  const getFingerColor = (key: string) => {
    const mapping = fingerMapping[key];
    if (!mapping || !showFingers) return undefined;
    return fingerColors[mapping.finger];
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      {keyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-1"
          style={{ marginLeft: rowIndex === 1 ? '20px' : rowIndex === 2 ? '40px' : 0 }}
        >
          {row.map((key) => {
            const isActive = activeKey?.toLowerCase() === key;
            const isHome = isHomeKey(key);
            const fingerColor = getFingerColor(key);

            return (
              <div
                key={key}
                className={cn(
                  'keyboard-key',
                  isActive && 'keyboard-key--active',
                  isHome && 'keyboard-key--home'
                )}
                style={{
                  borderColor: fingerColor && !isActive ? fingerColor : undefined,
                }}
                aria-label={`${key} 키${isHome ? ' (홈로우)' : ''}${isActive ? ' (다음 입력)' : ''}`}
              >
                {key.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}

      {/* 스페이스바 */}
      <div className="flex justify-center mt-1">
        <div
          className={cn(
            'keyboard-key w-64',
            activeKey === ' ' && 'keyboard-key--active'
          )}
          aria-label="스페이스바"
        >
          SPACE
        </div>
      </div>

      {/* 범례 */}
      {showFingers && (
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {Object.entries(fingerColors).map(([finger, color]) => (
            <div key={finger} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-[var(--color-text-muted)]">
                {finger === 'pinky' && '새끼'}
                {finger === 'ring' && '약지'}
                {finger === 'middle' && '중지'}
                {finger === 'index' && '검지'}
                {finger === 'thumb' && '엄지'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
