'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, Timer, Pencil, Check, X } from 'lucide-react';
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
  const [customMinutes, setCustomMinutes] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 1) return `${seconds}초`;
    return `${mins}분`;
  };

  const formatTimeLabel = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins === 1) return '짧은 연습';
    if (mins === 3) return '보통 연습';
    if (mins === 5) return '긴 연습';
    if (mins <= 2) return '빠른 연습';
    if (mins <= 10) return '집중 연습';
    return '마라톤 연습';
  };

  useEffect(() => {
    if (isEditingCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingCustom]);

  const handlePresetClick = (seconds: number) => {
    setSelectedPreset(seconds);
    setIsEditingCustom(false);
    // 짧은 딜레이 후 시작 (시각적 피드백)
    setTimeout(() => onSelect(seconds), 150);
  };

  const handleCustomSubmit = () => {
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0 && minutes <= 60) {
      onSelect(minutes * 60);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCustom(false);
      setCustomMinutes('');
    }
  };

  const handleCustomCardClick = () => {
    setIsEditingCustom(true);
    setSelectedPreset(null);
  };

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] mb-4">
          <Timer className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-[var(--color-text-muted)]">{description}</p>
        {itemCount !== undefined && (
          <p className="text-sm text-[var(--color-primary)] mt-2 font-medium">
            총 {itemCount}개 {itemLabel}
          </p>
        )}
      </div>

      {/* 시간 선택 그리드 */}
      <div className={cn(
        'grid gap-4 mb-6',
        customEnabled ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
      )}>
        {/* 프리셋 시간들 */}
        {presets.map((seconds) => (
          <Card
            key={seconds}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden',
              selectedPreset === seconds && 'ring-2 ring-[var(--color-primary)] scale-[1.02]'
            )}
            onClick={() => handlePresetClick(seconds)}
          >
            <CardContent className="py-6 text-center relative">
              {/* 배경 그라데이션 */}
              <div className={cn(
                'absolute inset-0 opacity-5',
                seconds === 60 && 'bg-gradient-to-br from-green-500 to-green-600',
                seconds === 180 && 'bg-gradient-to-br from-blue-500 to-blue-600',
                seconds === 300 && 'bg-gradient-to-br from-purple-500 to-purple-600'
              )} />

              <Clock className={cn(
                'w-8 h-8 mx-auto mb-2',
                seconds === 60 && 'text-green-500',
                seconds === 180 && 'text-blue-500',
                seconds === 300 && 'text-purple-500',
                !presets.slice(0, 3).includes(seconds) && 'text-[var(--color-primary)]'
              )} />
              <p className="text-3xl font-bold mb-1">{formatTime(seconds)}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {formatTimeLabel(seconds)}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* 사용자 지정 시간 카드 */}
        {customEnabled && (
          <Card
            className={cn(
              'cursor-pointer transition-all duration-200 overflow-hidden',
              isEditingCustom
                ? 'ring-2 ring-[var(--color-secondary)] scale-[1.02] shadow-lg'
                : 'hover:shadow-lg hover:scale-[1.02]',
              'border-dashed border-2'
            )}
            onClick={!isEditingCustom ? handleCustomCardClick : undefined}
          >
            <CardContent className="py-6 text-center relative">
              {/* 배경 */}
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-orange-500 to-amber-500" />

              {!isEditingCustom ? (
                <>
                  <Pencil className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-lg font-bold mb-1">직접 설정</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    원하는 시간
                  </p>
                </>
              ) : (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <Pencil className="w-6 h-6 mx-auto text-orange-500" />
                  <div className="flex items-center justify-center gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      onKeyDown={handleCustomKeyDown}
                      placeholder="0"
                      min={1}
                      max={60}
                      className="w-16 h-10 text-2xl font-bold text-center border-2 border-[var(--color-border)] rounded-lg
                               focus:border-[var(--color-secondary)] focus:outline-none bg-[var(--color-surface)]"
                    />
                    <span className="text-lg font-medium text-[var(--color-text-muted)]">분</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleCustomSubmit}
                      disabled={!customMinutes || parseInt(customMinutes) < 1 || parseInt(customMinutes) > 60}
                      className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      시작
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingCustom(false);
                        setCustomMinutes('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    1~60분 사이
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 도움말 */}
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        카드를 클릭하면 바로 연습이 시작됩니다
      </p>
    </div>
  );
}
