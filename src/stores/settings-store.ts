import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VoiceGender = 'female' | 'male';
export type TTSSpeed = 'slow' | 'normal' | 'fast';

interface SettingsState {
  // 사운드 설정
  keySound: boolean;
  errorSound: boolean;

  // TTS 설정
  ttsEnabled: boolean;
  voiceGender: VoiceGender;
  ttsSpeed: TTSSpeed;
  ttsVolume: number; // 0-1

  // 액션
  setKeySound: (enabled: boolean) => void;
  setErrorSound: (enabled: boolean) => void;
  setTTSEnabled: (enabled: boolean) => void;
  setVoiceGender: (gender: VoiceGender) => void;
  setTTSSpeed: (speed: TTSSpeed) => void;
  setTTSVolume: (volume: number) => void;

  // 헬퍼
  getTTSRate: () => number;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 기본값
      keySound: true,
      errorSound: true,
      ttsEnabled: true,
      voiceGender: 'female',
      ttsSpeed: 'normal',
      ttsVolume: 1,

      // 액션
      setKeySound: (enabled) => set({ keySound: enabled }),
      setErrorSound: (enabled) => set({ errorSound: enabled }),
      setTTSEnabled: (enabled) => set({ ttsEnabled: enabled }),
      setVoiceGender: (gender) => set({ voiceGender: gender }),
      setTTSSpeed: (speed) => set({ ttsSpeed: speed }),
      setTTSVolume: (volume) => set({ ttsVolume: Math.max(0, Math.min(1, volume)) }),

      // 헬퍼
      getTTSRate: () => {
        const speed = get().ttsSpeed;
        switch (speed) {
          case 'slow': return 0.7;
          case 'normal': return 0.9;
          case 'fast': return 1.1;
          default: return 0.9;
        }
      },
    }),
    {
      name: 'taja-settings',
    }
  )
);
