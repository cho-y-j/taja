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
  Zap,
  ArrowRight,
} from 'lucide-react';
import { FaqSection } from '@/components/landing/faq-section';

const features = [
  {
    icon: Keyboard,
    title: '체계적인 타자 연습',
    description: '홈로우부터 시작해 단어, 문장까지 단계별 학습',
  },
  {
    icon: Sparkles,
    title: 'AI 맞춤 콘텐츠',
    description: 'AI가 생성한 다양한 연습 문장과 문서',
  },
  {
    icon: Headphones,
    title: '듣고 쓰기',
    description: '음성을 듣고 받아쓰며 청취력 향상',
  },
  {
    icon: Mic,
    title: '보고 말하기',
    description: '문장을 보고 따라 읽으며 발음 연습',
  },
  {
    icon: FileText,
    title: '문서 업로드',
    description: 'PDF, 텍스트 파일로 나만의 연습 자료 생성',
  },
  {
    icon: BarChart3,
    title: '상세 통계',
    description: 'WPM, 정확도, 취약 키 분석으로 실력 확인',
  },
];

const steps = [
  { num: '01', title: '시작하기', desc: '회원가입 없이 바로 연습 시작' },
  { num: '02', title: '연습 선택', desc: '기초부터 AI 문서까지' },
  { num: '03', title: '실력 향상', desc: '통계로 성장을 확인' },
];

export default function LandingPage() {
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
          <div className="flex items-center gap-6">
            <a
              href="/pricing"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              요금제
            </a>
            <a
              href="/sign-in"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              로그인
            </a>
            <a
              href="/learn"
              className="px-5 py-2 bg-[var(--color-text)] text-[var(--color-background)] text-sm font-semibold rounded-full hover:bg-[var(--color-text)]/90 transition-all hover:scale-105"
            >
              시작하기
            </a>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* 배경 장식 (은은한 그리드) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              AI 기반 맞춤형 문해력 트레이너
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-text)] mb-8 tracking-tight leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            타자 연습의 <br className="md:hidden" />
            <span className="text-[var(--color-primary)]">새로운 기준</span>
          </h1>

          <p className="text-xl text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            단순한 타이핑을 넘어 문해력까지. <br className="hidden md:block" />
            TAJA와 함께 가장 스마트한 방식으로 연습하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="/learn"
              className="group min-w-[160px] px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl hover:brightness-110 transition-all hover:-translate-y-1 shadow-lg shadow-[var(--color-primary)]/20"
            >
              <span className="flex items-center justify-center gap-2">
                무료로 시작
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#features"
              className="min-w-[160px] px-8 py-4 bg-[var(--color-surface)] text-[var(--color-text)] font-semibold rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-background)] transition-all hover:-translate-y-1"
            >
              기능 둘러보기
            </a>
          </div>

          {/* 비주얼 데모 (유리 질감 카드) */}
          <div className="mt-20 mx-auto max-w-4xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface)]/50 backdrop-blur-xl">
              <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--color-border-light)] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="pt-20 pb-16 px-8 md:px-20 text-center">
                <p className="font-mono text-2xl md:text-3xl text-[var(--color-text-muted)] leading-relaxed">
                  "모든 위대한 성취는 <br />
                  <span className="text-[var(--color-primary)] font-bold">작은 시작</span>으로 부터..."
                </p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-2 h-8 bg-[var(--color-primary)]/50 rounded-full animate-bounce" />
                  <div className="w-2 h-8 bg-[var(--color-primary)]/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-8 bg-[var(--color-primary)]/10 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
            {/* 장식용 글로우 */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[var(--color-secondary)]/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* 통계 섹션 (깔끔한 바 형태) */}
      <section className="py-12 border-y border-[var(--color-border-light)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100%', label: '무료 사용' },
              { value: 'AI', label: '맞춤형 콘텐츠' },
              { value: 'Global', label: '다국어 지원' },
              { value: '24/7', label: '언제 어디서나' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-[var(--color-text)] mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 (미니멀 카드) */}
      <section id="features" className="py-24 px-6 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
              더 나은 연습을 위한 모든 것
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              단순한 타자 연습을 넘어, 당신의 성장을 돕는 도구들을 준비했습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 (미니멀 스텝) */}
      <section className="py-24 px-6 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
              복잡함은 빼고, 핵심만
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
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

      {/* 요금제 섹션 (Clean) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 tracking-tight">
              투명한 요금제
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 무료 */}
            <div className="p-10 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">Starter</h3>
                  <p className="text-[var(--color-text-muted)] mt-1">가볍게 시작하는 분들께</p>
                </div>
                <div className="text-3xl font-bold text-[var(--color-text)]">₩0 <span className="text-sm font-normal text-[var(--color-text-muted)]">/월</span></div>
              </div>
              <ul className="space-y-4 mb-10">
                {['기본 통계 제공', '단어/문장 연습 무제한', '광고 없음'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--color-text-muted)]">
                    <Check className="w-5 h-5 text-[var(--color-text)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/learn" className="block w-full py-4 text-center rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-border-light)] transition-colors">
                시작하기
              </a>
            </div>

            {/* 프로 */}
            <div className="relative p-10 bg-[var(--color-text)] rounded-3xl border border-[var(--color-text)] text-[var(--color-background)] shadow-2xl">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded-full">Coming Soon</div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                  <p className="text-gray-400 mt-1">성장을 위한 완벽한 도구</p>
                </div>
                <div className="text-3xl font-bold text-white">₩1,000 <span className="text-sm font-normal text-gray-400">/월</span></div>
              </div>
              <ul className="space-y-4 mb-10">
                {['AI 맞춤형 문서 생성', '고품질 TTS 발음 듣기', '심층 분석 리포트', '우선 고객 지원'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="block w-full py-4 text-center rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:brightness-110 transition-all">
                사전 구독 신청
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-20 rounded-[2.5rem] bg-[var(--color-text)] text-[var(--color-background)] text-center overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                준비되셨나요?
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                지금 바로 시작하세요. 복잡한 절차는 없습니다.
              </p>
              <a
                href="/learn"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                무료로 연습하기
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
