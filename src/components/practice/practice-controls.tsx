'use client';

import { Play, Pause, RotateCcw, Volume2, VolumeX, Eye, EyeOff, Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useThemeStore } from '@/stores/theme-store';

const uiContent = {
  ko: {
    continue: '계속',
    pause: '일시정지',
    ttsOff: '음성 끄기',
    ttsOn: '음성 듣기',
    hideTranslation: '해석 숨기기',
    showTranslation: '해석 보기',
    restart: '다시 시작',
    selection: '선택 화면',
    exit: '종료',
  },
  en: {
    continue: 'Resume',
    pause: 'Pause',
    ttsOff: 'TTS Off',
    ttsOn: 'TTS On',
    hideTranslation: 'Hide Translation',
    showTranslation: 'Show Translation',
    restart: 'Restart',
    selection: 'Selection',
    exit: 'Exit',
  },
};

interface PracticeControlsProps {
  isPaused?: boolean;
  isComplete?: boolean;
  onTogglePause?: () => void;
  onRestart: () => void;
  onExit?: () => void;
  onBack?: () => void;
  backLabel?: string;
  // TTS controls
  ttsEnabled?: boolean;
  onToggleTTS?: () => void;
  // Translation controls
  translationVisible?: boolean;
  onToggleTranslation?: () => void;
  className?: string;
}

export function PracticeControls({
  isPaused,
  isComplete,
  onTogglePause,
  onRestart,
  onExit,
  onBack,
  backLabel,
  ttsEnabled,
  onToggleTTS,
  translationVisible,
  onToggleTranslation,
  className,
}: PracticeControlsProps) {
  const { uiLanguage } = useThemeStore();
  const t = uiContent[uiLanguage];
  const effectiveBackLabel = backLabel || t.selection;
  return (
    <div className={cn('flex justify-center gap-3 flex-wrap', className)}>
      {/* Pause/Resume */}
      {onTogglePause && !isComplete && (
        <Button variant="outline" size="sm" onClick={onTogglePause}>
          {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
          {isPaused ? t.continue : t.pause}
        </Button>
      )}

      {/* TTS Toggle */}
      {onToggleTTS && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTTS}
          className={cn({
            'bg-blue-500 text-white border-blue-500 hover:bg-blue-600': ttsEnabled,
          })}
        >
          {ttsEnabled ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
          {ttsEnabled ? t.ttsOff : t.ttsOn}
        </Button>
      )}

      {/* Translation Toggle */}
      {onToggleTranslation && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTranslation}
          className={cn({
            'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600': translationVisible,
          })}
        >
          {translationVisible ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          {translationVisible ? t.hideTranslation : t.showTranslation}
        </Button>
      )}

      {/* Restart */}
      <Button variant="outline" size="sm" onClick={onRestart}>
        <RotateCcw className="w-4 h-4 mr-1" />
        {t.restart}
      </Button>

      {/* Back to selection */}
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          <Home className="w-4 h-4 mr-1" />
          {effectiveBackLabel}
        </Button>
      )}

      {/* Exit */}
      {onExit && (
        <Button variant="ghost" size="sm" onClick={onExit}>
          <X className="w-4 h-4 mr-1" />
          {t.exit}
        </Button>
      )}
    </div>
  );
}
