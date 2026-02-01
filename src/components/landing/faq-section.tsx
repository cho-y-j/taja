'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = {
  ko: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '무료로 사용할 수 있나요?',
        a: '네! 기본 타자 연습(홈로우, 단어, 문장)은 무제한 무료입니다. 회원가입 없이도 바로 연습할 수 있어요.',
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
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    items: [
      {
        q: 'Is it free to use?',
        a: 'Yes! Basic typing practice (home row, words, sentences) is unlimited and free. You can start practicing without signing up.',
      },
      {
        q: 'What benefits do I get with a subscription?',
        a: 'With a $1/month subscription, you get unlimited AI features (document generation, translation, summarization) and premium TTS voices.',
      },
      {
        q: 'What languages are supported?',
        a: 'We currently support Korean and English typing practice. Japanese and Chinese are coming soon.',
      },
      {
        q: 'Can I use it on mobile?',
        a: 'TAJA is optimized for desktop. Typing practice is most effective with a physical keyboard.',
      },
    ],
  },
};

interface FaqSectionProps {
  lang?: 'ko' | 'en';
}

export function FaqSection({ lang = 'ko' }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = faqs[lang];

  return (
    <section className="py-20 px-6 bg-[var(--color-surface)]/50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            {t.title}
          </h2>
        </div>

        <div className="space-y-4">
          {t.items.map((faq, i) => (
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
  );
}
