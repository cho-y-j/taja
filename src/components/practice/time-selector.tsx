'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface TimeSelectorProps {
  presets?: number[]; // seconds
  onSelect: (seconds: number) => void;
  itemCount?: number;
  itemLabel?: string; // "단어", "문장" etc.
  customEnabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_PRESETS = [60, 180, 300]; // 1, 3, 5 minutes

export function TimeSelector({
  presets = DEFAULT_PRESETS,
  onSelect,
  itemCount,
  itemLabel = '항목',
  customEnabled = true,
  title = '연습 시간 선택',
  description = '시간이 끝나면 결과를 보여드립니다',
  className,
}: TimeSelectorProps) {
  const [customTime, setCustomTime] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 1) return `${seconds}초`;
    return `${mins}분`;
  };

  const handleCustomSubmit = () => {
    const seconds = parseInt(customTime, 10) * 60; // input is in minutes
    if (seconds > 0 && seconds <= 3600) {
      onSelect(seconds);
    }
  };

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-[var(--color-text-muted)]">{description}</p>
        {itemCount !== undefined && (
          <p className="text-sm text-[var(--color-primary)] mt-2">
            총 {itemCount}개 {itemLabel}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {presets.map((seconds) => (
          <Card
            key={seconds}
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
            onClick={() => onSelect(seconds)}
          >
            <CardContent className="py-8 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
              <p className="text-2xl font-bold">{formatTime(seconds)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {customEnabled && (
        <div className="text-center">
          {!showCustom ? (
            <Button variant="outline" onClick={() => setShowCustom(true)}>
              직접 입력
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="분"
                min={1}
                max={60}
                className="w-20 p-2 border rounded-lg text-center"
              />
              <span className="text-[var(--color-text-muted)]">분</span>
              <Button onClick={handleCustomSubmit} disabled={!customTime}>
                시작
              </Button>
              <Button variant="ghost" onClick={() => setShowCustom(false)}>
                취소
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
