'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Target,
  Zap,
  Flame,
  FileText,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Clerk 설정 여부 확인
const CLERK_CONFIGURED = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에') &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

interface UserStats {
  totalSessions: number;
  totalTime: number;
  averageWpm: number | null;
  averageAccuracy: number | null;
  currentStreak: number;
  longestStreak: number;
  lastPracticeAt: string | null;
}

interface Document {
  id: string;
  title: string;
  createdAt: string;
}

interface ClerkUser {
  firstName?: string | null;
  emailAddresses: { emailAddress: string }[];
  createdAt?: Date;
}

export default function MyPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<ClerkUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Clerk 상태 확인
  useEffect(() => {
    if (!CLERK_CONFIGURED) {
      router.push('/sign-in');
      return;
    }

    // Clerk 전역 객체에서 상태 확인
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const clerk = (window as unknown as { Clerk?: { session?: unknown; user?: ClerkUser } }).Clerk;
        if (clerk) {
          const signedIn = !!clerk.session;
          setIsSignedIn(signedIn);
          setUser(clerk.user || null);
          setIsLoaded(true);

          if (!signedIn) {
            router.push('/sign-in');
          }
        }
      }
    };

    const interval = setInterval(checkAuth, 100);
    setTimeout(() => {
      clearInterval(interval);
      setIsLoaded(true);
    }, 3000);
    checkAuth();

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      // 사용자 동기화
      fetch('/api/user/sync', { method: 'POST' })
        .then((res) => res.json())
        .catch(console.error);

      // 통계 조회
      fetch('/api/user/stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data.stats);
        })
        .catch(console.error);

      // 문서 조회
      fetch('/api/user/documents')
        .then((res) => res.json())
        .then((data) => {
          setDocuments(data.documents || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="spinner" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/learn" className="icon-btn">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-[var(--color-text)]">
            마이페이지
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 프로필 카드 */}
        <section className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.charAt(0) ||
                user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() ||
                'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {user?.firstName || '회원'}님
              </h2>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Mail className="w-4 h-4" />
                {user?.emailAddresses[0]?.emailAddress}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-1">
                <Calendar className="w-4 h-4" />
                {user?.createdAt
                  ? formatDate(user.createdAt.toISOString())
                  : '오늘'}{' '}
                가입
              </div>
            </div>
          </div>
        </section>

        {/* 학습 통계 요약 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-text)]">학습 통계</h3>
            <Link
              href="/my/stats"
              className="text-sm text-[var(--color-primary)] flex items-center gap-1"
            >
              자세히 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" />
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {stats ? formatTime(stats.totalTime) : '0분'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">총 연습 시간</p>
            </div>

            <div className="card p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-[var(--color-success)]" />
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {stats?.totalSessions || 0}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">총 연습 횟수</p>
            </div>

            <div className="card p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-[var(--color-warning)]" />
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {stats?.averageWpm ? Math.round(stats.averageWpm) : 0}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">평균 WPM</p>
            </div>

            <div className="card p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-[var(--color-error)]" />
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {stats?.currentStreak || 0}일
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">연속 학습</p>
            </div>
          </div>
        </section>

        {/* 내 문서 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-text)]">
              내 문서 ({documents.length}개)
            </h3>
            <Link
              href="/learn/ai"
              className="text-sm text-[var(--color-primary)] flex items-center gap-1"
            >
              문서 관리
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="card p-4 flex items-center gap-3"
                >
                  <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-[var(--color-text-light)]" />
              <p className="text-[var(--color-text-muted)] mb-4">
                아직 저장된 문서가 없어요
              </p>
              <Link href="/learn/ai">
                <Button>문서 만들기</Button>
              </Link>
            </div>
          )}
        </section>

        {/* 빠른 링크 */}
        <section>
          <h3 className="font-bold text-[var(--color-text)] mb-4">빠른 링크</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/my/stats" className="card p-4 hover:shadow-md transition-shadow">
              <BarChart2 className="w-6 h-6 mb-2 text-[var(--color-primary)]" />
              <p className="font-medium text-[var(--color-text)]">상세 통계</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                학습 분석 보기
              </p>
            </Link>

            <Link href="/learn" className="card p-4 hover:shadow-md transition-shadow">
              <Target className="w-6 h-6 mb-2 text-[var(--color-success)]" />
              <p className="font-medium text-[var(--color-text)]">학습하기</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                연습 계속하기
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
