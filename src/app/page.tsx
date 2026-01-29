'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, Settings } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import type { Language } from '@/types/theme';

export default function HomePage() {
  const router = useRouter();
  const { mode, language, setLanguage, toggleMode } = useThemeStore();

  // 이미 언어를 선택했다면 learn 페이지로 리다이렉트
  useEffect(() => {
    if (language) {
      router.push('/learn');
    }
  }, [language, router]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    router.push('/learn');
  };

  // 언어가 이미 선택되어 있으면 로딩 표시
  if (language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* 헤더 */}
      <header className="p-4 flex justify-end">
        <button
          onClick={toggleMode}
          className="icon-btn"
          aria-label="테마 변경"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* 로고 & 타이틀 */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--gradient-primary)] mb-6 shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
            <Keyboard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-3">
            TAJA
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)]">
            타자 연습 마스터
          </p>
        </div>

        {/* 연습 언어 선택 */}
        <div className="w-full max-w-lg mb-12">
          <p className="text-center text-[var(--color-text-muted)] mb-6 text-lg">
            어떤 언어로 연습할까요?
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* 영어 */}
            <button
              onClick={() => handleLanguageSelect('en')}
              className="language-card text-center animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-5xl mb-4">🇺🇸</div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                영문 타자
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                영어 키보드 연습
              </p>
            </button>

            {/* 한글 */}
            <button
              onClick={() => handleLanguageSelect('ko')}
              className="language-card text-center animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-5xl mb-4">🇰🇷</div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                한글 타자
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                한글 키보드 연습
              </p>
            </button>
          </div>
        </div>

        {/* 모드 선택 */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">현재 모드</p>
          <div className="mode-tabs inline-flex">
            <button
              onClick={() => mode !== 'junior' && toggleMode()}
              className={`mode-tab ${mode === 'junior' ? 'mode-tab-active' : ''}`}
            >
              주니어
            </button>
            <button
              onClick={() => mode !== 'senior' && toggleMode()}
              className={`mode-tab ${mode === 'senior' ? 'mode-tab-active' : ''}`}
            >
              시니어
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-2">
            {mode === 'junior'
              ? '밝고 활기찬 디자인'
              : '차분하고 큰 글씨'}
          </p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-6 text-center">
        <p className="text-sm text-[var(--color-text-light)]">
          &copy; 2026 TAJA. 문해력을 키우는 타자 연습.
        </p>
      </footer>
    </div>
  );
}
