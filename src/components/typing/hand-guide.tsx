'use client';

import { cn } from '@/lib/utils/cn';
import { fingerMapping } from '@/lib/typing/keyboard-practice';

interface HandGuideProps {
  activeKey?: string;
  className?: string;
}

type FingerName = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';

const fingerColors: Record<FingerName, { fill: string; active: string; glow: string; label: string }> = {
  pinky:  { fill: '#fecaca', active: '#ef4444', glow: '#fca5a5', label: '새끼' },
  ring:   { fill: '#fed7aa', active: '#f97316', glow: '#fdba74', label: '약지' },
  middle: { fill: '#fef08a', active: '#eab308', glow: '#fde047', label: '중지' },
  index:  { fill: '#bbf7d0', active: '#16a34a', glow: '#86efac', label: '검지' },
  thumb:  { fill: '#bfdbfe', active: '#2563eb', glow: '#93c5fd', label: '엄지' },
};

const fingerKeys = {
  left: {
    pinky:  ['Q', 'A', 'Z'],
    ring:   ['W', 'S', 'X'],
    middle: ['E', 'D', 'C'],
    index:  ['R', 'T', 'F', 'G', 'V', 'B'],
  },
  right: {
    index:  ['Y', 'U', 'H', 'J', 'N', 'M'],
    middle: ['I', 'K', ','],
    ring:   ['O', 'L', '.'],
    pinky:  ['P', ';', '/'],
  },
};

const leftFingerShapes: { finger: FingerName; x: number; y: number; width: number; height: number }[] = [
  { finger: 'pinky',  x: 4,  y: 58, width: 20, height: 48 },
  { finger: 'ring',   x: 28, y: 38, width: 20, height: 68 },
  { finger: 'middle', x: 52, y: 24, width: 20, height: 82 },
  { finger: 'index',  x: 76, y: 34, width: 20, height: 72 },
];

const rightFingerShapes: { finger: FingerName; x: number; y: number; width: number; height: number }[] = [
  { finger: 'index',  x: 4,  y: 34, width: 20, height: 72 },
  { finger: 'middle', x: 28, y: 24, width: 20, height: 82 },
  { finger: 'ring',   x: 52, y: 38, width: 20, height: 68 },
  { finger: 'pinky',  x: 76, y: 58, width: 20, height: 48 },
];

function HandSvg({
  side,
  activeFinger,
}: {
  side: 'left' | 'right';
  activeFinger: FingerName | null;
}) {
  const shapes = side === 'left' ? leftFingerShapes : rightFingerShapes;
  const thumbX = side === 'left' ? 88 : 0;
  const palmX = side === 'left' ? 2 : 2;
  const keys = side === 'left' ? fingerKeys.left : fingerKeys.right;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs font-semibold text-[var(--color-text-muted)]">
        {side === 'left' ? '왼손' : '오른손'}
      </span>
      <svg viewBox="0 0 100 155" width="130" height="200" aria-label={`${side === 'left' ? '왼손' : '오른손'} 가이드`}>
        {/* Glow filter for active finger */}
        <defs>
          {activeFinger && (
            <filter id={`glow-${side}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={fingerColors[activeFinger].glow} floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Fingers */}
        {shapes.map(({ finger, x, y, width, height }) => {
          const isActive = activeFinger === finger;
          const colors = fingerColors[finger];
          return (
            <g key={finger} filter={isActive ? `url(#glow-${side})` : undefined}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={10}
                ry={10}
                fill={isActive ? colors.active : colors.fill}
                stroke={isActive ? colors.active : '#e5e7eb'}
                strokeWidth={isActive ? 3 : 1}
                opacity={!activeFinger || isActive ? 1 : 0.5}
              />
              {/* Finger label */}
              <text
                x={x + width / 2}
                y={y + 16}
                textAnchor="middle"
                fontSize={isActive ? '9' : '7.5'}
                fontWeight={isActive ? '800' : '600'}
                fill={isActive ? '#fff' : '#6b7280'}
              >
                {colors.label}
              </text>
            </g>
          );
        })}

        {/* Thumb */}
        <g filter={activeFinger === 'thumb' ? `url(#glow-${side})` : undefined}>
          <rect
            x={thumbX}
            y={96}
            width={16}
            height={36}
            rx={8}
            ry={8}
            fill={activeFinger === 'thumb' ? fingerColors.thumb.active : fingerColors.thumb.fill}
            stroke={activeFinger === 'thumb' ? fingerColors.thumb.active : '#e5e7eb'}
            strokeWidth={activeFinger === 'thumb' ? 3 : 1}
            transform={side === 'left' ? 'rotate(25, 96, 114)' : 'rotate(-25, 8, 114)'}
            opacity={!activeFinger || activeFinger === 'thumb' ? 1 : 0.4}
          />
        </g>

        {/* Palm */}
        <rect
          x={palmX}
          y={106}
          width={96}
          height={40}
          rx={12}
          ry={12}
          fill="#f9fafb"
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={0.6}
        />

        {/* Key labels inside palm */}
        {(Object.entries(keys) as [FingerName, string[]][]).map(([finger, keyList], i) => {
          const shape = shapes.find((s) => s.finger === finger);
          if (!shape) return null;
          return (
            <text
              key={finger}
              x={shape.x + shape.width / 2}
              y={120 + (i % 2) * 13}
              textAnchor="middle"
              fontSize="6"
              fontWeight="500"
              fill="#9ca3af"
            >
              {keyList.slice(0, 3).join(' ')}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function HandGuide({ activeKey, className }: HandGuideProps) {
  let activeFinger: { finger: FingerName; hand: 'left' | 'right' } | null = null;

  if (activeKey) {
    const mapping = fingerMapping[activeKey.toLowerCase()];
    if (mapping) {
      activeFinger = mapping as { finger: FingerName; hand: 'left' | 'right' };
    }
  }

  return (
    <div className={cn('flex justify-center items-start gap-4', className)}>
      <HandSvg
        side="left"
        activeFinger={activeFinger?.hand === 'left' ? activeFinger.finger : null}
      />
      <div className="flex flex-col items-center justify-center self-end mb-3">
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-all',
            activeFinger?.finger === 'thumb'
              ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-300'
              : 'bg-gray-50 border-gray-200 text-gray-400'
          )}
        >
          Space
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">엄지</span>
      </div>
      <HandSvg
        side="right"
        activeFinger={activeFinger?.hand === 'right' ? activeFinger.finger : null}
      />
    </div>
  );
}
