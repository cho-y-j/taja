'use client';

import { useState } from 'react';
import { Settings, Volume2, VolumeX, Keyboard, Mic, Play, Eye, Globe } from 'lucide-react';
import { useSettingsStore, VoiceGender, TTSSpeed } from '@/stores/settings-store';
import { useThemeStore } from '@/stores/theme-store';
import { useTTS } from '@/hooks/use-tts';

const content = {
  ko: {
    settings: '설정',
    displayMode: '화면 모드',
    displayModeLabel: '표시 모드',
    basic: '기본',
    highContrast: '고대비',
    highContrastDesc: '큰 글씨, 높은 대비로 눈에 편안합니다',
    basicDesc: '일반적인 화면 표시입니다',
    uiLanguage: 'UI 언어',
    korean: '한국어',
    english: 'English',
    sound: '사운드',
    keySound: '키 입력 소리',
    errorSound: '오류 소리',
    tts: '음성 (TTS)',
    ttsEnable: '음성 읽기',
    voiceGender: '음성 성별',
    female: '여성',
    male: '남성',
    voiceSpeed: '음성 속도',
    slow: '느림',
    normal: '보통',
    fast: '빠름',
    voiceVolume: '음성 볼륨',
    testTTS: '음성 테스트',
    playing: '재생 중...',
    voicesAvailable: '사용 가능한 음성:',
    testText: '안녕하세요, 음성 테스트입니다.',
  },
  en: {
    settings: 'Settings',
    displayMode: 'Display Mode',
    displayModeLabel: 'Theme',
    basic: 'Default',
    highContrast: 'High Contrast',
    highContrastDesc: 'Larger text, higher contrast for eye comfort',
    basicDesc: 'Standard display settings',
    uiLanguage: 'UI Language',
    korean: '한국어',
    english: 'English',
    sound: 'Sound',
    keySound: 'Key Sound',
    errorSound: 'Error Sound',
    tts: 'Voice (TTS)',
    ttsEnable: 'Voice Reading',
    voiceGender: 'Voice Gender',
    female: 'Female',
    male: 'Male',
    voiceSpeed: 'Voice Speed',
    slow: 'Slow',
    normal: 'Normal',
    fast: 'Fast',
    voiceVolume: 'Voice Volume',
    testTTS: 'Test Voice',
    playing: 'Playing...',
    voicesAvailable: 'Available voices:',
    testText: 'Hello, this is a voice test.',
  },
};

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

  const { mode, setMode, uiLanguage, setUILanguage } = useThemeStore();
  const t = content[uiLanguage];

  const { speak, isSpeaking, voices } = useTTS({ language: uiLanguage });

  const handleTestTTS = () => {
    console.log('[Settings] Testing TTS, voices available:', voices.length);
    speak(t.testText);
  };

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

          <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] z-20 overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-text)]">{t.settings}</p>
            </div>

            <div className="p-4 space-y-4">
              {/* UI 언어 설정 */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  {t.uiLanguage}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">{t.uiLanguage}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUILanguage('ko')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        uiLanguage === 'ko'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {t.korean}
                    </button>
                    <button
                      onClick={() => setUILanguage('en')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        uiLanguage === 'en'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {t.english}
                    </button>
                  </div>
                </div>
              </div>

              {/* 화면 모드 설정 */}
              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  {t.displayMode}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">{t.displayModeLabel}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMode('junior')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        mode === 'junior'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {t.basic}
                    </button>
                    <button
                      onClick={() => setMode('senior')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        mode === 'senior'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {t.highContrast}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {mode === 'senior' ? t.highContrastDesc : t.basicDesc}
                </p>
              </div>

              {/* 사운드 설정 */}
              <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                  {t.sound}
                </p>

                {/* 키 입력 소리 */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">{t.keySound}</span>
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
                    <span className="text-sm text-[var(--color-text)]">{t.errorSound}</span>
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
                  {t.tts}
                </p>

                {/* TTS 활성화 */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text)]">{t.ttsEnable}</span>
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
                    <span className="text-sm text-[var(--color-text)]">{t.voiceGender}</span>
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
                      {t.female}
                    </button>
                    <button
                      onClick={() => setVoiceGender('male')}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        voiceGender === 'male'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {t.male}
                    </button>
                  </div>
                </div>

                {/* 음성 속도 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text)]">{t.voiceSpeed}</span>
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
                        {speed === 'slow' ? t.slow : speed === 'normal' ? t.normal : t.fast}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 음성 볼륨 */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[var(--color-text)]">{t.voiceVolume}</span>
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

                {/* 음성 테스트 */}
                <button
                  onClick={handleTestTTS}
                  disabled={isSpeaking || !ttsEnabled}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  {isSpeaking ? t.playing : t.testTTS}
                </button>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t.voicesAvailable} {voices.length}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
