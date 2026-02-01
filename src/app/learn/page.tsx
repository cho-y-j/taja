'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { UserMenu, SettingsDropdown } from '@/components/layout';
import { CreditBalance, UpgradeModal } from '@/components/credits';

// Clerk가 설정되어 있는지 확인
const CLERK_CONFIGURED = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

// 다국어 콘텐츠
const content = {
  ko: {
    selectTitle: '타자 연습 시작하기',
    selectDesc: '연습할 언어를 선택하세요',
    korean: '한국어',
    english: '영어',
    koreanSub: 'Korean',
    englishSub: 'English',
    header: '타자',
    greeting: '안녕하세요!',
    greetingSub: '오늘은 어떤 연습을 해볼까요?',
    basicTitle: '기본 연습',
    basicDesc: '자리익히기부터 문장까지 단계별로 실력을 쌓아요',
    aiTitle: 'AI 학습',
    aiDesc: '나만의 문서로 연습하거나 AI가 만들어주는 콘텐츠로!',
    loginRequired: '로그인 필요',
    myDocs: '내 문서 관리',
    loginToStart: '로그인하고 시작하기',
    hint: '처음이신가요? 기본 연습부터 시작해보세요!',
    todayStats: '오늘의 기록',
    sessions: '연습 횟수',
    avgWpm: '평균 WPM',
    accuracy: '정확도',
  },
  en: {
    selectTitle: 'Start Typing Practice',
    selectDesc: 'Choose a language to practice',
    korean: 'Korean',
    english: 'English',
    koreanSub: '한국어 타이핑',
    englishSub: 'English Typing',
    header: 'Typing',
    greeting: 'Hello!',
    greetingSub: 'What would you like to practice today?',
    basicTitle: 'Basic Practice',
    basicDesc: 'Build your skills step by step, from home row to sentences',
    aiTitle: 'AI Learning',
    aiDesc: 'Practice with your own documents or AI-generated content!',
    loginRequired: 'Login required',
    myDocs: 'My Documents',
    loginToStart: 'Sign in to start',
    hint: 'New here? Start with basic practice!',
    todayStats: "Today's Stats",
    sessions: 'Sessions',
    avgWpm: 'Avg WPM',
    accuracy: 'Accuracy',
  },
};

export default function LearnPage() {
  const { language, uiLanguage, clearLanguage, setLanguage } = useThemeStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clerk가 설정된 경우에만 로그인 상태 확인
  useEffect(() => {
    if (CLERK_CONFIGURED && typeof window !== 'undefined') {
      const checkAuth = () => {
        const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
        if (clerk) {
          setIsSignedIn(!!clerk.session);
        }
      };

      const interval = setInterval(checkAuth, 100);
      setTimeout(() => clearInterval(interval), 3000);
      checkAuth();

      return () => clearInterval(interval);
    }
  }, []);

  const handleChangeLanguage = () => {
    clearLanguage();
  };

  // hydration 방지
  const lang = mounted ? uiLanguage : 'ko';
  const t = content[lang];

  // 언어가 선택되지 않았다면 언어 선택 화면 표시
  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
        <div className="text-center w-full max-w-md">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            {t.selectTitle}
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            {t.selectDesc}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('ko')}
              className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface)] rounded-2xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
            >
              <span className="text-5xl mb-3">🇰🇷</span>
              <span className="text-lg font-semibold text-[var(--color-text)]">{t.korean}</span>
              <span className="text-sm text-[var(--color-text-muted)] mt-1">{t.koreanSub}</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface)] rounded-2xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
            >
              <span className="text-5xl mb-3">🇺🇸</span>
              <span className="text-lg font-semibold text-[var(--color-text)]">{t.english}</span>
              <span className="text-sm text-[var(--color-text-muted)] mt-1">{t.englishSub}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const languageLabel = language === 'ko' ? (lang === 'ko' ? '한글' : 'Korean') : (lang === 'ko' ? '영문' : 'English');
  const languageFlag = language === 'ko' ? '🇰🇷' : '🇺🇸';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 업그레이드 모달 */}
      <UpgradeModal />

      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleChangeLanguage}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <span className="text-xl">{languageFlag}</span>
            <span className="font-medium">{languageLabel} {t.header}</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            <CreditBalance />
            <SettingsDropdown />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 인사 */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-2">
            {t.greeting}
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {t.greetingSub}
          </p>
        </section>

        {/* 학습 경로 카드 */}
        <section className="space-y-4">
          {/* 기본 연습 */}
          <Link href="/learn/basic" className="block">
            <div className="path-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                    {t.basicTitle}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    {t.basicDesc}
                  </p>
                  {/* 진행도 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: '0%' }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[var(--color-primary)]">
                      0%
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-light)] flex-shrink-0 mt-4" />
              </div>
            </div>
          </Link>

          {/* AI 학습 */}
          <Link href={isSignedIn ? '/learn/ai' : '/sign-in'} className="block">
            <div className="path-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-secondary)' }}>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                      {t.aiTitle}
                    </h2>
                    {!isSignedIn && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-background)] px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        {t.loginRequired}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    {t.aiDesc}
                  </p>
                  {/* 문서 수 */}
                  <div className="flex items-center gap-2">
                    <span className="badge badge-secondary">
                      {isSignedIn ? t.myDocs : t.loginToStart}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-light)] flex-shrink-0 mt-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* 빠른 시작 힌트 */}
        <section className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-[var(--color-text-muted)]">
            {t.hint}
          </p>
        </section>

        {/* 통계 미리보기 */}
        <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
            {t.todayStats}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)]">0</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.sessions}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-success)]">0</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.avgWpm}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-secondary)]">0%</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.accuracy}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
