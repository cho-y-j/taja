'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Coins,
  Crown,
  Sparkles,
  Zap,
  BookOpen,
  MessageSquare,
  Link2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreditStore } from '@/stores/credit-store';

// Clerk 설정 여부 확인
const CLERK_CONFIGURED =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

export default function PricingPage() {
  const { balance, hasSubscription, fetchCredits } = useCreditStore();
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

  const handleSubscribe = () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=/pricing';
      return;
    }
    alert('결제 기능은 곧 오픈 예정입니다!');
  };

  const handleBuyCredits = (amount: number) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=/pricing';
      return;
    }
    alert('결제 기능은 곧 오픈 예정입니다!');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/learn" className="icon-btn">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            요금제
          </h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 현재 잔액 (로그인된 경우) */}
        {isLoaded && isSignedIn && (
          <div className="mb-8 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasSubscription ? (
                  <Crown className="w-6 h-6 text-[var(--color-primary)]" />
                ) : (
                  <Coins className="w-6 h-6 text-[var(--color-primary)]" />
                )}
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    현재 상태
                  </p>
                  <p className="font-bold text-[var(--color-text)]">
                    {hasSubscription
                      ? '구독 중 (무제한)'
                      : `${balance} 크레딧 보유`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 히어로 섹션 */}
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            AI 기능으로 학습 효과 UP!
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            AI가 생성하는 맞춤형 학습 콘텐츠로 타자 연습의 효과를 극대화하세요.
            번역, 요약, 문서 생성 등 다양한 AI 기능을 이용할 수 있습니다.
          </p>
        </section>

        {/* AI 기능 소개 */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4 text-center">
            포함된 AI 기능
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
              <p className="font-medium text-[var(--color-text)]">AI 번역</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                영한/한영 번역
              </p>
            </div>
            <div className="card p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--color-secondary)]" />
              <p className="font-medium text-[var(--color-text)]">AI 문서 생성</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                주제별 학습 콘텐츠
              </p>
            </div>
            <div className="card p-4 text-center">
              <Link2 className="w-8 h-8 mx-auto mb-2 text-[var(--color-success)]" />
              <p className="font-medium text-[var(--color-text)]">URL 추출</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                웹/유튜브 콘텐츠
              </p>
            </div>
            <div className="card p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-[var(--color-warning)]" />
              <p className="font-medium text-[var(--color-text)]">AI 요약</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                문서 요약
              </p>
            </div>
          </div>
        </section>

        {/* 요금제 카드 */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {/* 구독 플랜 */}
          <div
            className="card p-6 border-2 border-[var(--color-primary)] relative animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute -top-3 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">
                  월간 구독
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  부담 없이 시작하세요
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-[var(--color-text)]">
                  1,000
                </span>
                <span className="text-lg text-[var(--color-text-muted)] mb-1">
                  원/월
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                커피 한 잔 값으로 무제한 AI!
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                AI 기능 무제한 사용
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                모든 학습 콘텐츠 이용
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                크레딧 걱정 없이 연습
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                언제든지 해지 가능
              </li>
            </ul>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubscribe}
              disabled={hasSubscription}
            >
              {hasSubscription ? (
                '구독 중'
              ) : isSignedIn ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  구독 시작하기
                </>
              ) : (
                '로그인하고 구독하기'
              )}
            </Button>
          </div>

          {/* 크레딧 팩 */}
          <div
            className="card p-6 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-secondary)' }}
              >
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">
                  크레딧 충전
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  필요한 만큼만 구매
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              구독 없이 필요할 때만 충전해서 사용하세요.
              <br />1 크레딧 = 약 10,000 토큰 (AI 요청 1~3회)
            </p>

            <div className="space-y-3 mb-6">
              {[
                { amount: 100, price: 500, popular: false },
                { amount: 500, price: 2000, popular: true },
                { amount: 1000, price: 3500, popular: false },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => handleBuyCredits(pack.amount)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all hover:border-[var(--color-primary)] ${
                    pack.popular
                      ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                      <Coins className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[var(--color-text)]">
                        {pack.amount} 크레딧
                      </p>
                      {pack.popular && (
                        <span className="text-xs text-[var(--color-secondary)] font-medium">
                          인기
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-[var(--color-text)]">
                    {pack.price.toLocaleString()}원
                  </p>
                </button>
              ))}
            </div>

            {!isSignedIn && (
              <p className="text-xs text-center text-[var(--color-text-muted)]">
                로그인 후 구매할 수 있습니다
              </p>
            )}
          </div>
        </section>

        {/* 무료 체험 안내 */}
        <section
          className="card p-6 text-center animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
            처음이신가요?
          </h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            회원가입만 하면 <strong>200 크레딧</strong>을 무료로 드려요!
            <br />
            결제 없이 AI 기능을 체험해보세요.
          </p>
          {!isSignedIn && (
            <Link href="/sign-up">
              <Button variant="outline" size="lg">
                무료로 시작하기
              </Button>
            </Link>
          )}
        </section>

        {/* FAQ */}
        <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6 text-center">
            자주 묻는 질문
          </h3>
          <div className="space-y-4">
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                Q. 크레딧은 언제 소진되나요?
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                AI 번역, 문서 생성, URL 콘텐츠 추출 등 AI 기능을 사용할 때마다
                크레딧이 차감됩니다. 기본 타자 연습은 크레딧 없이 무료입니다.
              </p>
            </div>
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                Q. 구독을 해지하면 어떻게 되나요?
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                구독 기간이 끝날 때까지 무제한으로 이용 가능합니다. 기간 종료 후에는
                보유 크레딧만큼 사용할 수 있습니다.
              </p>
            </div>
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                Q. 크레딧은 유효기간이 있나요?
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                아니요, 크레딧은 유효기간 없이 평생 사용 가능합니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
