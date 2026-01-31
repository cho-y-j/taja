'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, BarChart2, ChevronDown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Clerk 설정 여부 확인
const CLERK_CONFIGURED = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

interface UserData {
  firstName?: string | null;
  emailAddresses: { emailAddress: string }[];
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [signOutFn, setSignOutFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!CLERK_CONFIGURED) {
      setIsLoaded(true);
      return;
    }

    // Clerk가 설정된 경우 동적으로 로드
    import('@clerk/nextjs').then((clerk) => {
      // 전역 Clerk 상태 확인 (window.__clerk)
      const checkClerkState = () => {
        if (typeof window !== 'undefined' && (window as unknown as { Clerk?: { user?: unknown; session?: unknown } }).Clerk) {
          const clerkInstance = (window as unknown as { Clerk: { user: UserData | null; session: unknown } }).Clerk;
          setIsSignedIn(!!clerkInstance.session);
          setUser(clerkInstance.user);
          setIsLoaded(true);
        }
      };

      // Clerk 로드 완료 대기
      const interval = setInterval(() => {
        checkClerkState();
        if (isLoaded) clearInterval(interval);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setIsLoaded(true);
      }, 2000);

      return () => clearInterval(interval);
    }).catch(() => {
      setIsLoaded(true);
    });
  }, [isLoaded]);

  // Clerk가 설정되지 않은 경우
  if (!CLERK_CONFIGURED) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            로그인
          </Button>
        </Link>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--color-border)] animate-pulse" />
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            로그인
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">
            회원가입
          </Button>
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      // Clerk 전역 객체에서 signOut 호출
      const clerkInstance = (window as unknown as { Clerk?: { signOut: () => Promise<void> } }).Clerk;
      if (clerkInstance?.signOut) {
        await clerkInstance.signOut();
      }
      // 로그아웃 후 홈으로 이동
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--color-surface)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-medium">
          {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="text-sm font-medium text-[var(--color-text)] hidden sm:block">
          {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || '회원'}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {user?.firstName || '회원'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {user?.emailAddresses[0]?.emailAddress || ''}
              </p>
            </div>

            <div className="py-2">
              <Link
                href="/my"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
              >
                <User className="w-4 h-4" />
                마이페이지
              </Link>
              <Link
                href="/my/stats"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                학습 통계
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                요금제
              </Link>
            </div>

            <div className="border-t border-[var(--color-border)] py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-background)] transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
