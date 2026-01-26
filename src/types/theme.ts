// 테마 관련 타입 정의

export type ThemeMode = 'junior' | 'senior';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  success: string;
  error: string;
  warning: string;
  border: string;
}

export interface ThemeTypography {
  fontFamily: string;
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}

export interface ThemeSpacing {
  base: string;
  comfortable: boolean;
}

export interface ThemeAnimation {
  enabled: boolean;
  duration: 'fast' | 'normal' | 'slow';
  bounce: boolean;
}

export interface ThemeFeatures {
  gamification: boolean;
  characters: boolean;
  sounds: boolean;
  confetti: boolean;
}

export interface ThemeAccessibility {
  highContrast: boolean;
  largeClickTargets: boolean;
  reducedMotion: 'respect' | 'always' | 'never';
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animation: ThemeAnimation;
  features: ThemeFeatures;
  accessibility?: ThemeAccessibility;
}
