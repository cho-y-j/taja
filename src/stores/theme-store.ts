import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, Language } from '@/types/theme';

interface ThemeState {
  mode: ThemeMode;
  language: Language | null;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setLanguage: (language: Language | null) => void;
  clearLanguage: () => void;
  hasSelectedLanguage: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'junior',
      language: null,
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'junior' ? 'senior' : 'junior',
        })),
      setLanguage: (language) => set({ language }),
      clearLanguage: () => set({ language: null }),
      hasSelectedLanguage: () => get().language !== null,
    }),
    {
      name: 'taja-theme',
    }
  )
);
