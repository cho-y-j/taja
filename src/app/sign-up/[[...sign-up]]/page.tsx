'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* 헤더 */}
      <header className="p-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>돌아가기</span>
        </Link>
      </header>

      {/* 회원가입 폼 */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              회원가입
            </h1>
            <p className="text-[var(--color-text-muted)]">
              계정을 만들고 학습 기록을 저장하세요
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'hidden',
                dividerRow: 'hidden',
                formButtonPrimary:
                  'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl py-3',
                formFieldInput:
                  'rounded-xl border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
                footerActionLink: 'text-[var(--color-primary)]',
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
