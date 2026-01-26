'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useThemeStore();

  useEffect(() => {
    // HTML에 테마 속성 설정
    document.documentElement.setAttribute('data-theme', mode);

    // 시스템 다크 모드 감지 (추후 확장용)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }
  }, [mode]);

  return <>{children}</>;
}
