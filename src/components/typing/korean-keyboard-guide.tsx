'use client';

import { cn } from '@/lib/utils/cn';
import { koreanFingerMapping, korToEngMap } from '@/lib/typing/korean-keyboard';

interface KoreanKeyboardGuideProps {
  activeKey?: string;
  showFingers?: boolean;
  className?: string;
}

// 한글 키보드 레이아웃 (두벌식) - 실제 키보드 배열
const koreanKeyboardLayout = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],  // q w e r t y u i o p
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],         // a s d f g h j k l
  ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],                    // z x c v b n m
];

// 홈로우 키
const homeKeys = ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'];

// 손가락 색상
const fingerColors: Record<string, string> = {
  pinky: '#ef4444',
  ring: '#f97316',
  middle: '#eab308',
  index: '#22c55e',
  thumb: '#3b82f6',
};

export function KoreanKeyboardGuide({
  activeKey,
  showFingers = true,
  className,
}: KoreanKeyboardGuideProps) {
  const isHomeKey = (key: string) => homeKeys.includes(key);

  const getFingerColor = (key: string) => {
    const mapping = koreanFingerMapping[key];
    if (!mapping || !showFingers) return undefined;
    return fingerColors[mapping.finger];
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      {koreanKeyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-1"
          style={{ marginLeft: rowIndex === 1 ? '20px' : rowIndex === 2 ? '50px' : 0 }}
        >
          {row.map((key) => {
            const isActive = activeKey === key;
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
                {key}
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
          스페이스
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
