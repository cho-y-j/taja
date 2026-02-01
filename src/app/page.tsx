'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import {
  Keyboard,
  Sparkles,
  BarChart3,
  Headphones,
  Mic,
  FileText,
  ChevronRight,
  Check,
  ChevronDown,
  Zap,
  Target,
  TrendingUp,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Keyboard,
      title: '체계적인 타자 연습',
      description: '홈로우부터 시작해 단어, 문장까지 단계별 학습',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'AI 맞춤 콘텐츠',
      description: 'AI가 생성한 다양한 연습 문장과 문서',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Headphones,
      title: '듣고 쓰기',
      description: '음성을 듣고 받아쓰며 청취력 향상',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Mic,
      title: '보고 말하기',
      description: '문장을 보고 따라 읽으며 발음 연습',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: FileText,
      title: '문서 업로드',
      description: 'PDF, 텍스트 파일로 나만의 연습 자료 생성',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: '상세 통계',
      description: 'WPM, 정확도, 취약 키 분석으로 실력 확인',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const steps = [
    { num: 1, title: '회원가입', desc: '간편하게 가입하고 200 무료 크레딧 받기' },
    { num: 2, title: '연습 선택', desc: '기초부터 AI 문서까지 원하는 연습 선택' },
    { num: 3, title: '실력 향상', desc: '통계로 성장을 확인하고 꾸준히 연습' },
  ];

  const faqs = [
    {
      q: '무료로 사용할 수 있나요?',
      a: '네! 가입 시 200 크레딧이 무료로 제공되며, 기본 타자 연습(홈로우, 단어, 문장)은 무제한 무료입니다. AI 기능 사용 시에만 크레딧이 차감됩니다.',
    },
    {
      q: '구독하면 어떤 혜택이 있나요?',
      a: '월 1,000원 구독 시 AI 기능(문서 생성, 번역, 요약)을 무제한으로 사용할 수 있고, 고품질 TTS 발음도 이용 가능합니다.',
    },
    {
      q: '어떤 언어를 지원하나요?',
      a: '현재 한국어와 영어 타자 연습을 지원합니다. 향후 일본어, 중국어도 추가 예정입니다.',
    },
    {
      q: '모바일에서도 사용 가능한가요?',
      a: '데스크톱 환경에 최적화되어 있습니다. 타자 연습 특성상 물리적 키보드가 있는 환경에서 가장 효과적입니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] overflow-x-hidden">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text)]">TAJA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              요금제
            </Link>
            {isSignedIn ? (
              <Link
                href="/learn"
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                연습하기
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  무료로 시작
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* 뱃지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)] mb-8">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-[var(--color-text-muted)]">
                AI 기반 맞춤형 타자 연습
              </span>
            </div>

            {/* 메인 헤드라인 */}
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6 leading-tight">
              타자 연습으로
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                문해력을 키우세요
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
              홈로우부터 AI 생성 문서까지, 체계적인 학습으로 타이핑 실력과 문해력을 동시에 향상시키세요.
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/learn"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  무료로 시작하기
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-[var(--color-surface)] text-[var(--color-text)] font-semibold rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
              >
                기능 살펴보기
              </Link>
            </div>

            {/* 통계 */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { value: '200', label: '무료 크레딧' },
                { value: '6+', label: '연습 모드' },
                { value: '24/7', label: '언제든 연습' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`transition-all duration-700 delay-${i * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${i * 200 + 500}ms` }}
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              다양한 기능으로 효과적인 학습
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              단순한 타자 연습을 넘어, AI와 함께하는 종합적인 문해력 향상 플랫폼
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] hover:border-transparent hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-[var(--color-surface)]/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              3단계로 시작하세요
            </h2>
            <p className="text-[var(--color-text-muted)]">
              복잡한 설정 없이 바로 시작할 수 있습니다
            </p>
          </div>

          <div className="relative">
            {/* 연결선 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/25">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 요금제 미리보기 */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              심플한 요금제
            </h2>
            <p className="text-[var(--color-text-muted)]">
              기본 기능은 무료, AI 기능은 구독으로
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 무료 */}
            <div className="p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
              <div className="text-lg font-semibold text-[var(--color-text-muted)] mb-2">무료</div>
              <div className="text-4xl font-bold text-[var(--color-text)] mb-6">
                ₩0
                <span className="text-base font-normal text-[var(--color-text-muted)]">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['홈로우/단어/문장 연습 무제한', '기본 통계', '가입 시 200 크레딧'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/learn"
                className="block w-full py-3 text-center bg-[var(--color-background)] text-[var(--color-text)] font-medium rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
              >
                무료로 시작
              </Link>
            </div>

            {/* 프로 */}
            <div className="relative p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border-2 border-purple-500/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full">
                추천
              </div>
              <div className="text-lg font-semibold text-purple-400 mb-2">프로</div>
              <div className="text-4xl font-bold text-[var(--color-text)] mb-6">
                ₩1,000
                <span className="text-base font-normal text-[var(--color-text-muted)]">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '무료 기능 모두 포함',
                  'AI 문서 생성 무제한',
                  '고품질 TTS 발음',
                  '상세 통계 & 분석',
                  '우선 지원',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text)]">
                    <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                구독하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[var(--color-surface)]/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-[var(--color-text)]">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[var(--color-text-muted)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                가입하고 200 무료 크레딧을 받아 AI 기능을 체험해보세요.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                무료로 시작하기
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Keyboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--color-text)]">TAJA</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <Link href="/pricing" className="hover:text-[var(--color-text)] transition-colors">
                요금제
              </Link>
              <Link href="/learn" className="hover:text-[var(--color-text)] transition-colors">
                연습하기
              </Link>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              &copy; 2026 TAJA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
