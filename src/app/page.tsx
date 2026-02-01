'use client';

import { useState, useEffect } from 'react';
import {
  Keyboard,
  Sparkles,
  BarChart3,
  Headphones,
  Mic,
  FileText,
  ChevronRight,
  Check,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { FaqSection } from '@/components/landing/faq-section';
import { useThemeStore } from '@/stores/theme-store';

// 다국어 콘텐츠
const content = {
  ko: {
    nav: {
      pricing: '요금제',
      signIn: '로그인',
      start: '시작하기',
    },
    hero: {
      badge: 'AI 기반 맞춤형 문해력 트레이너',
      title: '타자 연습의',
      titleHighlight: '새로운 기준',
      description: '단순한 타이핑을 넘어 문해력까지. TAJA와 함께 가장 스마트한 방식으로 연습하세요.',
      cta: '무료로 시작',
      secondary: '기능 둘러보기',
      demo: '"모든 위대한 성취는',
      demoHighlight: '작은 시작',
      demoEnd: '으로 부터..."',
    },
    stats: [
      { value: '100%', label: '무료 사용' },
      { value: 'AI', label: '맞춤형 콘텐츠' },
      { value: 'Global', label: '다국어 지원' },
      { value: '24/7', label: '언제 어디서나' },
    ],
    features: {
      title: '더 나은 연습을 위한 모든 것',
      description: '단순한 타자 연습을 넘어, 당신의 성장을 돕는 도구들을 준비했습니다.',
      items: [
        { icon: 'Keyboard', title: '체계적인 타자 연습', description: '홈로우부터 시작해 단어, 문장까지 단계별 학습' },
        { icon: 'Sparkles', title: 'AI 맞춤 콘텐츠', description: 'AI가 생성한 다양한 연습 문장과 문서' },
        { icon: 'Headphones', title: '듣고 쓰기', description: '음성을 듣고 받아쓰며 청취력 향상' },
        { icon: 'Mic', title: '보고 말하기', description: '문장을 보고 따라 읽으며 발음 연습' },
        { icon: 'FileText', title: '문서 업로드', description: 'PDF, 텍스트 파일로 나만의 연습 자료 생성' },
        { icon: 'BarChart3', title: '상세 통계', description: 'WPM, 정확도, 취약 키 분석으로 실력 확인' },
      ],
    },
    steps: {
      title: '복잡함은 빼고, 핵심만',
      items: [
        { num: '01', title: '시작하기', desc: '회원가입 없이 바로 연습 시작' },
        { num: '02', title: '연습 선택', desc: '기초부터 AI 문서까지' },
        { num: '03', title: '실력 향상', desc: '통계로 성장을 확인' },
      ],
    },
    pricing: {
      title: '투명한 요금제',
      free: {
        name: 'Starter',
        desc: '가볍게 시작하는 분들께',
        price: '₩0',
        features: ['기본 통계 제공', '단어/문장 연습 무제한', '광고 없음'],
        cta: '시작하기',
      },
      pro: {
        name: 'Pro',
        desc: '성장을 위한 완벽한 도구',
        price: '₩1,000',
        features: ['AI 맞춤형 문서 생성', '고품질 TTS 발음 듣기', '심층 분석 리포트', '우선 고객 지원'],
        cta: '사전 구독 신청',
      },
    },
    cta: {
      title: '준비되셨나요?',
      description: '지금 바로 시작하세요. 복잡한 절차는 없습니다.',
      button: '무료로 연습하기',
    },
  },
  en: {
    nav: {
      pricing: 'Pricing',
      signIn: 'Sign In',
      start: 'Get Started',
    },
    hero: {
      badge: 'AI-Powered Literacy Trainer',
      title: 'A New Standard in',
      titleHighlight: 'Typing Practice',
      description: 'Beyond simple typing. Practice smarter with TAJA and improve your literacy skills.',
      cta: 'Start Free',
      secondary: 'View Features',
      demo: '"Every great achievement',
      demoHighlight: 'starts small',
      demoEnd: '..."',
    },
    stats: [
      { value: '100%', label: 'FREE' },
      { value: 'AI', label: 'PERSONALIZED' },
      { value: 'Global', label: 'MULTILINGUAL' },
      { value: '24/7', label: 'ANYTIME' },
    ],
    features: {
      title: 'Everything You Need to Practice Better',
      description: 'More than just typing practice. Tools designed to help you grow.',
      items: [
        { icon: 'Keyboard', title: 'Structured Practice', description: 'Step-by-step learning from home row to sentences' },
        { icon: 'Sparkles', title: 'AI Content', description: 'AI-generated practice sentences and documents' },
        { icon: 'Headphones', title: 'Listen & Write', description: 'Improve listening by typing what you hear' },
        { icon: 'Mic', title: 'Read & Speak', description: 'Practice pronunciation by reading aloud' },
        { icon: 'FileText', title: 'Upload Documents', description: 'Create practice materials from your own files' },
        { icon: 'BarChart3', title: 'Detailed Stats', description: 'Track WPM, accuracy, and weak keys' },
      ],
    },
    steps: {
      title: 'Simple. No Complexity.',
      items: [
        { num: '01', title: 'Start', desc: 'No sign-up required to begin' },
        { num: '02', title: 'Choose', desc: 'From basics to AI documents' },
        { num: '03', title: 'Improve', desc: 'Track your progress with stats' },
      ],
    },
    pricing: {
      title: 'Transparent Pricing',
      free: {
        name: 'Starter',
        desc: 'For those just getting started',
        price: '$0',
        features: ['Basic statistics', 'Unlimited word/sentence practice', 'No ads'],
        cta: 'Get Started',
      },
      pro: {
        name: 'Pro',
        desc: 'Complete tools for growth',
        price: '$1',
        features: ['AI document generation', 'Premium TTS voices', 'Deep analytics', 'Priority support'],
        cta: 'Pre-subscribe',
      },
    },
    cta: {
      title: 'Ready to Begin?',
      description: 'Start now. No complicated steps.',
      button: 'Practice for Free',
    },
  },
};

const iconMap = {
  Keyboard,
  Sparkles,
  Headphones,
  Mic,
  FileText,
  BarChart3,
};

export default function LandingPage() {
  const { uiLanguage, setUILanguage } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버/클라이언트 hydration 불일치 방지
  const lang = mounted ? uiLanguage : 'ko';
  const t = content[lang];

  return (
    <div className="min-h-screen bg-[var(--color-background)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border-light)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center transition-transform group-hover:scale-110">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">TAJA</span>
          </a>
          <div className="flex items-center gap-4 md:gap-6">
            {/* 언어 선택 */}
            <button
              onClick={() => setUILanguage(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ko' ? 'EN' : '한국어'}
            </button>
            <a
              href="/pricing"
              className="hidden md:block text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t.nav.pricing}
            </a>
            <a
              href="/sign-in"
              className="hidden md:block text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t.nav.signIn}
            </a>
            <a
              href="/learn"
              className="px-5 py-2 bg-[var(--color-text)] text-[var(--color-background)] text-sm font-semibold rounded-full hover:bg-[var(--color-text)]/90 transition-all hover:scale-105"
            >
              {t.nav.start}
            </a>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-text)] mb-8 tracking-tight leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.title} <br className="md:hidden" />
            <span className="text-[var(--color-primary)]">{t.hero.titleHighlight}</span>
          </h1>

          <p className="text-xl text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="/learn"
              className="group min-w-[160px] px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl hover:brightness-110 transition-all hover:-translate-y-1 shadow-lg shadow-[var(--color-primary)]/20"
            >
              <span className="flex items-center justify-center gap-2">
                {t.hero.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#features"
              className="min-w-[160px] px-8 py-4 bg-[var(--color-surface)] text-[var(--color-text)] font-semibold rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-background)] transition-all hover:-translate-y-1"
            >
              {t.hero.secondary}
            </a>
          </div>

          {/* 비주얼 데모 */}
          <div className="mt-20 mx-auto max-w-4xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface)]/50 backdrop-blur-xl">
              <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--color-border-light)] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="pt-20 pb-16 px-8 md:px-20 text-center">
                <p className="font-mono text-2xl md:text-3xl text-[var(--color-text-muted)] leading-relaxed">
                  {t.hero.demo} <br />
                  <span className="text-[var(--color-primary)] font-bold">{t.hero.demoHighlight}</span>{t.hero.demoEnd}
                </p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-2 h-8 bg-[var(--color-primary)]/50 rounded-full animate-bounce" />
                  <div className="w-2 h-8 bg-[var(--color-primary)]/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-8 bg-[var(--color-primary)]/10 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[var(--color-secondary)]/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-12 border-y border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-[var(--color-text)] mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section id="features" className="py-24 px-6 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
              {t.features.title}
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              {t.features.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, i) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div
                  key={i}
                  className="group p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="py-24 px-6 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
              {t.steps.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {t.steps.items.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-[var(--color-border-light)] mb-6 opacity-50 select-none">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
              {t.pricing.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 무료 */}
            <div className="p-10 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{t.pricing.free.name}</h3>
                  <p className="text-[var(--color-text-muted)] mt-1">{t.pricing.free.desc}</p>
                </div>
                <div className="text-3xl font-bold text-[var(--color-text)]">{t.pricing.free.price} <span className="text-sm font-normal text-[var(--color-text-muted)]">/{lang === 'ko' ? '월' : 'mo'}</span></div>
              </div>
              <ul className="space-y-4 mb-10">
                {t.pricing.free.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--color-text-muted)]">
                    <Check className="w-5 h-5 text-[var(--color-text)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/learn" className="block w-full py-4 text-center rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-border-light)] transition-colors">
                {t.pricing.free.cta}
              </a>
            </div>

            {/* 프로 */}
            <div className="relative p-10 bg-[var(--color-text)] rounded-3xl border border-[var(--color-text)] text-[var(--color-background)] shadow-2xl">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded-full">Coming Soon</div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">{t.pricing.pro.name}</h3>
                  <p className="text-gray-400 mt-1">{t.pricing.pro.desc}</p>
                </div>
                <div className="text-3xl font-bold text-white">{t.pricing.pro.price} <span className="text-sm font-normal text-gray-400">/{lang === 'ko' ? '월' : 'mo'}</span></div>
              </div>
              <ul className="space-y-4 mb-10">
                {t.pricing.pro.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="block w-full py-4 text-center rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:brightness-110 transition-all">
                {t.pricing.pro.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection lang={lang} />

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-20 rounded-[2.5rem] bg-[var(--color-text)] text-[var(--color-background)] text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                {t.cta.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                {t.cta.description}
              </p>
              <a
                href="/learn"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                {t.cta.button}
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 border-t border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--color-text)] flex items-center justify-center">
              <Keyboard className="w-3 h-3 text-[var(--color-background)]" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">TAJA</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-[var(--color-text-muted)]">
            <a href="/pricing" className="hover:text-[var(--color-text)] transition-colors">Pricing</a>
            <a href="/learn" className="hover:text-[var(--color-text)] transition-colors">Start Practice</a>
            <a href="/privacy" className="hover:text-[var(--color-text)] transition-colors">Privacy</a>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2026 TAJA Labs.
          </p>
        </div>
      </footer>
    </div>
  );
}
