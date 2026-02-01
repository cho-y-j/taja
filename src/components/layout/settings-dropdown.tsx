'use client';

import { useState } from 'react';
import { Settings, Volume2, VolumeX, Keyboard, Mic } from 'lucide-react';
import { useSettingsStore, VoiceGender, TTSSpeed } from '@/stores/settings-store';

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    keySound,
    errorSound,
    ttsEnabled,
    voiceGender,
    ttsSpeed,
    ttsVolume,
    setKeySound,
    setErrorSound,
    setTTSEnabled,
    setVoiceGender,
    setTTSSpeed,
    setTTSVolume,
  } = useSettingsStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn"
        title="설정"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-text)]">설정</p>
            </div>

            <div className="p-4 space-y-4">
              {/* 사운드 설정 */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  사운드
                </p>

                {/* 키 입력 소리 */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">키 입력 소리</span>
                  </div>
                  <button
                    onClick={() => setKeySound(!keySound)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      keySound ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        keySound ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* 오류 소리 */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">오류 소리</span>
                  </div>
                  <button
                    onClick={() => setErrorSound(!errorSound)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      errorSound ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        errorSound ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* TTS 설정 */}
              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  음성 (TTS)
                </p>

                {/* TTS 활성화 */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">음성 읽기</span>
                  </div>
                  <button
                    onClick={() => setTTSEnabled(!ttsEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      ttsEnabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        ttsEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* 음성 성별 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">음성 성별</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setVoiceGender('female')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        voiceGender === 'female'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      여성
                    </button>
                    <button
                      onClick={() => setVoiceGender('male')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        voiceGender === 'male'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      남성
                    </button>
                  </div>
                </div>

                {/* 음성 속도 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text)]">음성 속도</span>
                  <div className="flex gap-1">
                    {(['slow', 'normal', 'fast'] as TTSSpeed[]).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setTTSSpeed(speed)}
                        className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                          ttsSpeed === speed
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                        }`}
                      >
                        {speed === 'slow' ? '느림' : speed === 'normal' ? '보통' : '빠름'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 음성 볼륨 */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[var(--color-text)]">음성 볼륨</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={ttsVolume}
                    onChange={(e) => setTTSVolume(parseFloat(e.target.value))}
                    className="w-24 accent-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
