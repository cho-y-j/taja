'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LearnPage() {
  const router = useRouter();
  const { language, clearLanguage, toggleMode } = useThemeStore();
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Clerk가 설정된 경우에만 로그인 상태 확인
  useEffect(() => {
    if (CLERK_CONFIGURED && typeof window !== 'undefined') {
      // Clerk 전역 객체에서 상태 확인
      const checkAuth = () => {
        const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
        if (clerk) {
          setIsSignedIn(!!clerk.session);
        }
      };

      // 주기적으로 확인 (Clerk 로드 대기)
      const interval = setInterval(checkAuth, 100);
      setTimeout(() => clearInterval(interval), 3000);
      checkAuth();

      return () => clearInterval(interval);
    }
  }, []);

  // 언어가 선택되지 않았다면 홈으로 리다이렉트
  useEffect(() => {
    if (!language) {
      router.push('/');
    }
  }, [language, router]);

  const handleChangeLanguage = () => {
    clearLanguage();
    router.push('/');
  };

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="spinner" />
      </div>
    );
  }

  const languageLabel = language === 'ko' ? '한글' : '영문';
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
            <span className="font-medium">{languageLabel} 타자</span>
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
            안녕하세요!
          </h1>
          <p className="text-[var(--color-text-muted)]">
            오늘은 어떤 연습을 해볼까요?
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
                    기본 연습
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    자리익히기부터 문장까지 단계별로 실력을 쌓아요
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
                      AI 학습
                    </h2>
                    {!isSignedIn && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-background)] px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        로그인 필요
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    나만의 문서로 연습하거나 AI가 만들어주는 콘텐츠로!
                  </p>
                  {/* 문서 수 */}
                  <div className="flex items-center gap-2">
                    <span className="badge badge-secondary">
                      {isSignedIn ? '내 문서 관리' : '로그인하고 시작하기'}
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
            처음이신가요? 기본 연습부터 시작해보세요!
          </p>
        </section>

        {/* 통계 미리보기 */}
        <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
            오늘의 기록
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-primary)]">0</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                연습 횟수
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-success)]">0</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                평균 WPM
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-secondary)]">0%</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                정확도
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
