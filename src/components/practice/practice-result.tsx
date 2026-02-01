'use client';

import { RotateCcw, Home, Zap, Target, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating, getStarRating, getStarMessage } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils/cn';
import { useThemeStore } from '@/stores/theme-store';

const uiContent = {
  ko: {
    accuracy: '정확도',
    time: '시간',
    restart: '다시 연습',
    back: '돌아가기',
    next: '다음',
    total: '총',
    of: '개 중',
    completed: '개 완료',
    practiceTime: '연습 시간:',
    items: '항목',
  },
  en: {
    accuracy: 'Accuracy',
    time: 'Time',
    restart: 'Restart',
    back: 'Go Back',
    next: 'Next',
    total: 'Total',
    of: 'of',
    completed: 'completed',
    practiceTime: 'Practice time:',
    items: 'items',
  },
};

interface PracticeResultProps {
  wpm: number;
  accuracy: number;
  totalTime: number; // seconds
  correctCount?: number;
  totalCount?: number;
  countLabel?: string; // "문장", "단어" etc.
  onRestart: () => void;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showStars?: boolean;
  className?: string;
}

export function PracticeResult({
  wpm,
  accuracy,
  totalTime,
  correctCount,
  totalCount,
  countLabel,
  onRestart,
  onBack,
  onNext,
  nextLabel,
  showStars = true,
  className,
}: PracticeResultProps) {
  const { uiLanguage } = useThemeStore();
  const t = uiContent[uiLanguage];
  const stars = getStarRating(accuracy);
  const message = getStarMessage(stars, uiLanguage);
  const effectiveCountLabel = countLabel || t.items;
  const effectiveNextLabel = nextLabel || t.next;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('max-w-lg mx-auto', className)}>
      <Card className="animate-scale-in">
        <CardContent className="py-8 text-center">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">{message}</h2>

          {/* Stars */}
          {showStars && (
            <div className="mb-6">
              <StarRating rating={stars} size="lg" animated />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[var(--color-secondary)]">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{wpm}</p>
              <p className="text-xs text-[var(--color-text-muted)]">WPM</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[var(--color-success)]">
                <Target className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-xs text-[var(--color-text-muted)]">{t.accuracy}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[var(--color-primary)]">
                {correctCount !== undefined ? <Trophy className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <p className="text-3xl font-bold">
                {correctCount !== undefined ? correctCount : formatTime(totalTime)}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {correctCount !== undefined ? effectiveCountLabel : t.time}
              </p>
            </div>
          </div>

          {/* Additional info */}
          {totalCount !== undefined && correctCount !== undefined && (
            <div className="text-sm text-[var(--color-text-muted)] mb-6">
              <p>{uiLanguage === 'ko' ? `총 ${totalCount}개 중 ${correctCount}개 완료` : `${correctCount} of ${totalCount} completed`}</p>
              <p>{t.practiceTime} {formatTime(totalTime)}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.restart}
            </Button>
            {onNext && (
              <Button onClick={onNext}>
                {effectiveNextLabel}
              </Button>
            )}
            {onBack && (
              <Button variant="primary" onClick={onBack}>
                <Home className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
