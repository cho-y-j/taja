'use client';

import Link from 'next/link';
import { X, Coins, Crown, Sparkles, Check, ExternalLink } from 'lucide-react';
import { useCreditStore } from '@/stores/credit-store';
import { Button } from '@/components/ui/button';

export function UpgradeModal() {
  const { showUpgradeModal, closeUpgradeModal, balance, hasSubscription } =
    useCreditStore();

  if (!showUpgradeModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeUpgradeModal}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-md mx-4 bg-[var(--color-surface)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* 헤더 */}
        <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-8 text-white">
          <button
            onClick={closeUpgradeModal}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              {hasSubscription ? (
                <Crown className="w-6 h-6" />
              ) : (
                <Coins className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {hasSubscription ? '현재 구독 중' : 'AI 크레딧'}
              </h2>
              <p className="text-sm opacity-80">
                {hasSubscription
                  ? '무제한 AI 기능을 이용하세요'
                  : `잔액: ${balance} 크레딧`}
              </p>
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-4">
          {/* 구독 플랜 */}
          <div className="border-2 border-[var(--color-primary)] rounded-xl p-4 relative">
            <div className="absolute -top-3 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              추천
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-[var(--color-text)]">
                  월간 구독
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  AI 기능 무제한 사용
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--color-primary)]">
                  1,000원
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">/월</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                AI 번역 무제한
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                AI 문서 생성 무제한
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                URL/유튜브 콘텐츠 추출
              </li>
            </ul>
            <Button
              className="w-full"
              disabled={hasSubscription}
              onClick={() => {
                // TODO: 결제 연동 후 구현
                alert('결제 기능은 곧 오픈 예정입니다!');
              }}
            >
              {hasSubscription ? '구독 중' : '구독하기'}
            </Button>
          </div>

          {/* 크레딧 팩 */}
          <div className="border border-[var(--color-border)] rounded-xl p-4">
            <h3 className="font-bold text-[var(--color-text)] mb-3">
              크레딧 충전
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { amount: 100, price: 500 },
                { amount: 500, price: 2000 },
                { amount: 1000, price: 3500 },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => {
                    // TODO: 결제 연동 후 구현
                    alert('결제 기능은 곧 오픈 예정입니다!');
                  }}
                  className="p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-bold text-[var(--color-text)]">
                      {pack.amount}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {pack.price.toLocaleString()}원
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-[var(--color-background)] rounded-lg p-3">
            <p className="text-xs text-[var(--color-text-muted)] flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                1 크레딧 = 약 10,000 토큰 (AI 요청 1~3회 분량).
                <br />
                신규 가입 시 200 크레딧이 무료로 제공됩니다.
              </span>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-[var(--color-background)] border-t border-[var(--color-border)] space-y-2">
          <Link
            href="/pricing"
            onClick={closeUpgradeModal}
            className="flex items-center justify-center gap-2 w-full text-sm text-[var(--color-primary)] font-medium hover:underline"
          >
            요금제 자세히 보기
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={closeUpgradeModal}
            className="w-full text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </div>
  );
}
