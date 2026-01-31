'use client';

import { useEffect, useState } from 'react';
import { Coins, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import { useCreditStore } from '@/stores/credit-store';

// Clerk 설정 여부 확인
const CLERK_CONFIGURED =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

export function CreditBalance() {
  const { balance, hasSubscription, isLoading, fetchCredits, openUpgradeModal } =
    useCreditStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    if (!CLERK_CONFIGURED) {
      setIsLoaded(true);
      return;
    }

    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const clerk = (
          window as unknown as { Clerk?: { session?: unknown } }
        ).Clerk;
        if (clerk) {
          const signedIn = !!clerk.session;
          setIsSignedIn(signedIn);
          setIsLoaded(true);

          // 로그인 상태면 크레딧 조회
          if (signedIn) {
            fetchCredits();
          }
        }
      }
    };

    const interval = setInterval(checkAuth, 100);
    setTimeout(() => {
      clearInterval(interval);
      setIsLoaded(true);
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchCredits]);

  // 로그인하지 않았으면 표시 안함
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // 로딩 중
  if (isLoading && balance === 0) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="w-4 h-4 rounded-full bg-[var(--color-border)] animate-pulse" />
        <div className="w-8 h-3 rounded bg-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  // 구독자
  if (hasSubscription) {
    return (
      <button
        onClick={openUpgradeModal}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <InfinityIcon className="w-4 h-4" />
        <span className="hidden sm:inline">구독 중</span>
      </button>
    );
  }

  // 크레딧 부족 경고
  const isLow = balance < 50;
  const isDepleted = balance <= 0;

  return (
    <button
      onClick={openUpgradeModal}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
        isDepleted
          ? 'bg-[var(--color-error)] text-white animate-pulse'
          : isLow
            ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
            : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]'
      }`}
    >
      <Coins className="w-4 h-4" />
      <span>{balance}</span>
      {isDepleted && <Sparkles className="w-3 h-3 ml-0.5" />}
    </button>
  );
}
