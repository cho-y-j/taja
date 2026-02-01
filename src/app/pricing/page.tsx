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
import { useThemeStore } from '@/stores/theme-store';

// Clerk 설정 여부 확인
const CLERK_CONFIGURED =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

const content = {
  ko: {
    pageTitle: '요금제',
    currentStatus: '현재 상태',
    subscribedUnlimited: '구독 중 (무제한)',
    creditsHeld: '크레딧 보유',
    heroTitle: 'AI 기능으로 학습 효과 UP!',
    heroDesc: 'AI가 생성하는 맞춤형 학습 콘텐츠로 타자 연습의 효과를 극대화하세요. 번역, 요약, 문서 생성 등 다양한 AI 기능을 이용할 수 있습니다.',
    aiFeatures: '포함된 AI 기능',
    aiTranslate: 'AI 번역',
    aiTranslateDesc: '영한/한영 번역',
    aiDocument: 'AI 문서 생성',
    aiDocumentDesc: '주제별 학습 콘텐츠',
    urlExtract: 'URL 추출',
    urlExtractDesc: '웹/유튜브 콘텐츠',
    aiSummary: 'AI 요약',
    aiSummaryDesc: '문서 요약',
    monthlyPlan: '월간 구독',
    monthlyPlanDesc: '부담 없이 시작하세요',
    price: '1,000',
    priceUnit: '원/월',
    coffeePrice: '커피 한 잔 값으로 무제한 AI!',
    unlimitedAI: 'AI 기능 무제한 사용',
    allContent: '모든 학습 콘텐츠 이용',
    noWorry: '크레딧 걱정 없이 연습',
    cancelAnytime: '언제든지 해지 가능',
    subscribed: '구독 중',
    startSubscription: '구독 시작하기',
    loginAndSubscribe: '로그인하고 구독하기',
    creditPack: '크레딧 충전',
    creditPackDesc: '필요한 만큼만 구매',
    creditInfo: '구독 없이 필요할 때만 충전해서 사용하세요.',
    creditInfo2: '1 크레딧 = 약 10,000 토큰 (AI 요청 1~3회)',
    credits: '크레딧',
    popular: '인기',
    loginRequired: '로그인 후 구매할 수 있습니다',
    newUser: '처음이신가요?',
    freeCredits: '회원가입만 하면',
    freeCreditsAmount: '200 크레딧',
    freeCreditsDesc: '을 무료로 드려요!',
    freeCreditsDesc2: '결제 없이 AI 기능을 체험해보세요.',
    startFree: '무료로 시작하기',
    faq: '자주 묻는 질문',
    faq1Q: 'Q. 크레딧은 언제 소진되나요?',
    faq1A: 'AI 번역, 문서 생성, URL 콘텐츠 추출 등 AI 기능을 사용할 때마다 크레딧이 차감됩니다. 기본 타자 연습은 크레딧 없이 무료입니다.',
    faq2Q: 'Q. 구독을 해지하면 어떻게 되나요?',
    faq2A: '구독 기간이 끝날 때까지 무제한으로 이용 가능합니다. 기간 종료 후에는 보유 크레딧만큼 사용할 수 있습니다.',
    faq3Q: 'Q. 크레딧은 유효기간이 있나요?',
    faq3A: '아니요, 크레딧은 유효기간 없이 평생 사용 가능합니다.',
    paymentSoon: '결제 기능은 곧 오픈 예정입니다!',
  },
  en: {
    pageTitle: 'Pricing',
    currentStatus: 'Current Status',
    subscribedUnlimited: 'Subscribed (Unlimited)',
    creditsHeld: 'credits',
    heroTitle: 'Boost Your Learning with AI!',
    heroDesc: 'Maximize your typing practice with AI-generated personalized content. Access translation, summarization, document generation, and more.',
    aiFeatures: 'Included AI Features',
    aiTranslate: 'AI Translation',
    aiTranslateDesc: 'EN↔KO translation',
    aiDocument: 'AI Documents',
    aiDocumentDesc: 'Topic-based content',
    urlExtract: 'URL Extract',
    urlExtractDesc: 'Web/YouTube content',
    aiSummary: 'AI Summary',
    aiSummaryDesc: 'Document summarization',
    monthlyPlan: 'Monthly Plan',
    monthlyPlanDesc: 'Start with no pressure',
    price: '$1',
    priceUnit: '/month',
    coffeePrice: 'Less than a coffee for unlimited AI!',
    unlimitedAI: 'Unlimited AI features',
    allContent: 'Access all learning content',
    noWorry: 'No credit worries',
    cancelAnytime: 'Cancel anytime',
    subscribed: 'Subscribed',
    startSubscription: 'Start Subscription',
    loginAndSubscribe: 'Sign in to Subscribe',
    creditPack: 'Buy Credits',
    creditPackDesc: 'Pay as you go',
    creditInfo: 'Only charge when you need it.',
    creditInfo2: '1 credit ≈ 10,000 tokens (1-3 AI requests)',
    credits: 'credits',
    popular: 'Popular',
    loginRequired: 'Sign in to purchase',
    newUser: 'New here?',
    freeCredits: 'Sign up and get',
    freeCreditsAmount: '200 credits',
    freeCreditsDesc: ' for free!',
    freeCreditsDesc2: 'Try AI features without payment.',
    startFree: 'Start for Free',
    faq: 'FAQ',
    faq1Q: 'Q. When are credits used?',
    faq1A: 'Credits are used for AI translation, document generation, URL extraction, etc. Basic typing practice is free without credits.',
    faq2Q: 'Q. What happens if I cancel?',
    faq2A: 'You can use unlimited features until your subscription ends. After that, you can use your remaining credits.',
    faq3Q: 'Q. Do credits expire?',
    faq3A: 'No, credits never expire.',
    paymentSoon: 'Payment feature coming soon!',
  },
};

export default function PricingPage() {
  const { balance, hasSubscription, fetchCredits } = useCreditStore();
  const { uiLanguage } = useThemeStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const lang = mounted ? uiLanguage : 'ko';
  const t = content[lang];

  const handleSubscribe = () => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=/pricing';
      return;
    }
    alert(t.paymentSoon);
  };

  const handleBuyCredits = (amount: number) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=/pricing';
      return;
    }
    alert(t.paymentSoon);
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
            {t.pageTitle}
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
                    {t.currentStatus}
                  </p>
                  <p className="font-bold text-[var(--color-text)]">
                    {hasSubscription
                      ? t.subscribedUnlimited
                      : `${balance} ${t.creditsHeld}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 히어로 섹션 */}
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            {t.heroTitle}
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
            {t.heroDesc}
          </p>
        </section>

        {/* AI 기능 소개 */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-4 text-center">
            {t.aiFeatures}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
              <p className="font-medium text-[var(--color-text)]">{t.aiTranslate}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.aiTranslateDesc}
              </p>
            </div>
            <div className="card p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--color-secondary)]" />
              <p className="font-medium text-[var(--color-text)]">{t.aiDocument}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.aiDocumentDesc}
              </p>
            </div>
            <div className="card p-4 text-center">
              <Link2 className="w-8 h-8 mx-auto mb-2 text-[var(--color-success)]" />
              <p className="font-medium text-[var(--color-text)]">{t.urlExtract}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.urlExtractDesc}
              </p>
            </div>
            <div className="card p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-[var(--color-warning)]" />
              <p className="font-medium text-[var(--color-text)]">{t.aiSummary}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.aiSummaryDesc}
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
                  {t.monthlyPlan}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {t.monthlyPlanDesc}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-[var(--color-text)]">
                  {t.price}
                </span>
                <span className="text-lg text-[var(--color-text-muted)] mb-1">
                  {t.priceUnit}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t.coffeePrice}
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                {t.unlimitedAI}
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                {t.allContent}
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                {t.noWorry}
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text)]">
                <Check className="w-5 h-5 text-[var(--color-success)]" />
                {t.cancelAnytime}
              </li>
            </ul>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubscribe}
              disabled={hasSubscription}
            >
              {hasSubscription ? (
                t.subscribed
              ) : isSignedIn ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  {t.startSubscription}
                </>
              ) : (
                t.loginAndSubscribe
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
                  {t.creditPack}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {t.creditPackDesc}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {t.creditInfo}
              <br />{t.creditInfo2}
            </p>

            <div className="space-y-3 mb-6">
              {[
                { amount: 100, price: lang === 'ko' ? '500원' : '$0.50', popular: false },
                { amount: 500, price: lang === 'ko' ? '2,000원' : '$2', popular: true },
                { amount: 1000, price: lang === 'ko' ? '3,500원' : '$3.50', popular: false },
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
                        {pack.amount} {t.credits}
                      </p>
                      {pack.popular && (
                        <span className="text-xs text-[var(--color-secondary)] font-medium">
                          {t.popular}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-[var(--color-text)]">
                    {pack.price}
                  </p>
                </button>
              ))}
            </div>

            {!isSignedIn && (
              <p className="text-xs text-center text-[var(--color-text-muted)]">
                {t.loginRequired}
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
            {t.newUser}
          </h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            {t.freeCredits} <strong>{t.freeCreditsAmount}</strong>{t.freeCreditsDesc}
            <br />
            {t.freeCreditsDesc2}
          </p>
          {!isSignedIn && (
            <Link href="/sign-up">
              <Button variant="outline" size="lg">
                {t.startFree}
              </Button>
            </Link>
          )}
        </section>

        {/* FAQ */}
        <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6 text-center">
            {t.faq}
          </h3>
          <div className="space-y-4">
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                {t.faq1Q}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t.faq1A}
              </p>
            </div>
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                {t.faq2Q}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t.faq2A}
              </p>
            </div>
            <div className="card p-4">
              <p className="font-medium text-[var(--color-text)] mb-2">
                {t.faq3Q}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t.faq3A}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
