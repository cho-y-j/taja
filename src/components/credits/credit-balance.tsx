'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Coins, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import { useCreditStore } from '@/stores/credit-store';

export function CreditBalance() {
  const { isSignedIn, isLoaded } = useAuth();
  const { balance, hasSubscription, isLoading, lastFetched, fetchCredits, openUpgradeModal } =
    useCreditStore();

  // 로그인 상태가 확인되면 크레딧 조회 (store가 자체 캐시 관리)
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchCredits();
    }
  }, [isLoaded, isSignedIn, fetchCredits]);

  // 로그인하지 않았으면 표시 안함
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // 첫 로딩 중에만 스켈레톤 표시 (이미 fetch한 적 있으면 스킵)
  if (isLoading && !lastFetched) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="w-4 h-4 rounded-full bg-[var(--color-border)] animate-pulse" />
        <div className="w-8 h-3 rounded bg-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  // 아직 fetch하지 않았으면 표시 안함 (깜빡임 방지)
  if (!lastFetched) {
    return null;
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
