# theme-system Skill

## 목적
Junior/Senior 두 가지 테마 시스템을 구축하여 다양한 연령대의 사용자에게 최적화된 경험을 제공한다.

## 테마 정의

### Junior 테마 (어린이/초보자)
```typescript
const juniorTheme = {
  colors: {
    primary: '#6366f1',      // 활기찬 인디고
    secondary: '#f472b6',    // 핑크
    accent: '#fbbf24',       // 골드 (보상)
    background: '#fefce8',   // 밝은 크림
    surface: '#ffffff',
    text: '#1f2937',
    success: '#22c55e',      // 성공 (초록)
    error: '#ef4444',        // 오류 (빨강)
    warning: '#f59e0b',
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
    sizes: {
      xs: '0.875rem',   // 14px
      sm: '1rem',       // 16px
      base: '1.125rem', // 18px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '2rem',    // 32px
    },
  },
  spacing: {
    base: '1rem',
    comfortable: true,
  },
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    full: '9999px',
  },
  animation: {
    enabled: true,
    duration: 'normal',
    bounce: true,       // 재미있는 바운스 효과
  },
  features: {
    gamification: true,  // 게임화 요소
    characters: true,    // 캐릭터/마스코트
    sounds: true,        // 효과음
    confetti: true,      // 축하 효과
  },
};
```

### Senior 테마 (시니어/전문가)
```typescript
const seniorTheme = {
  colors: {
    primary: '#2563eb',      // 차분한 블루
    secondary: '#64748b',    // 슬레이트
    accent: '#059669',       // 녹색
    background: '#f8fafc',   // 부드러운 그레이
    surface: '#ffffff',
    text: '#0f172a',         // 진한 텍스트 (가독성)
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
    sizes: {
      xs: '1rem',       // 16px (최소 크기 증가)
      sm: '1.125rem',   // 18px
      base: '1.25rem',  // 20px
      lg: '1.5rem',     // 24px
      xl: '1.875rem',   // 30px
      '2xl': '2.25rem', // 36px
    },
  },
  spacing: {
    base: '1.25rem',    // 더 넓은 간격
    comfortable: true,
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  animation: {
    enabled: true,
    duration: 'slow',   // 느린 전환
    bounce: false,      // 바운스 없음
  },
  features: {
    gamification: false, // 게임화 최소화
    characters: false,
    sounds: false,       // 기본 음소거
    confetti: false,
  },
  accessibility: {
    highContrast: true,
    largeClickTargets: true,  // 최소 48px
    reducedMotion: 'respect', // 시스템 설정 존중
  },
};
```

## 구현

### CSS Variables 설정
```css
/* globals.css */
:root {
  --color-primary: theme('colors.primary');
  --color-secondary: theme('colors.secondary');
  --font-size-base: theme('typography.sizes.base');
  /* ... */
}

[data-theme="junior"] {
  --color-primary: #6366f1;
  --color-background: #fefce8;
  --font-size-base: 1.125rem;
  /* ... */
}

[data-theme="senior"] {
  --color-primary: #2563eb;
  --color-background: #f8fafc;
  --font-size-base: 1.25rem;
  /* ... */
}
```

### Theme Provider
```typescript
// components/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'junior' | 'senior';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: 'junior', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('junior');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## 사용 Agent
- Designer: 디자인 토큰 정의
- Frontend-Dev: 구현

## 체크리스트
- [ ] 디자인 토큰 정의
- [ ] CSS Variables 설정
- [ ] Theme Provider 구현
- [ ] 테마 전환 UI
- [ ] 사용자 설정 저장
