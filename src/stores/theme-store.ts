import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, Language } from '@/types/theme';

type UILanguage = 'ko' | 'en';

interface ThemeState {
  mode: ThemeMode;
  language: Language | null;  // 연습 언어 (타이핑할 언어)
  uiLanguage: UILanguage;     // UI 언어
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setLanguage: (language: Language | null) => void;
  setUILanguage: (lang: UILanguage) => void;
  clearLanguage: () => void;
  hasSelectedLanguage: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'junior',
      language: null,
      uiLanguage: 'ko',
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'junior' ? 'senior' : 'junior',
        })),
      setLanguage: (language) => set({ language }),
      setUILanguage: (uiLanguage) => set({ uiLanguage }),
      clearLanguage: () => set({ language: null }),
      hasSelectedLanguage: () => get().language !== null,
    }),
    {
      name: 'taja-theme',
    }
  )
);
