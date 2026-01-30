'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Target,
  Zap,
  Flame,
  TrendingUp,
  Calendar,
} from 'lucide-react';

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

interface PracticeSession {
  id: string;
  type: string;
  wpm: number;
  accuracy: number;
  duration: number;
  completedAt: string;
}

interface TypeStat {
  type: string;
  count: number;
  avgWpm: number;
  avgAccuracy: number;
}

export default function StatsPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<PracticeSession[]>([]);
  const [typeStats, setTypeStats] = useState<TypeStat[]>([]);
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
        const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
        if (clerk) {
          const signedIn = !!clerk.session;
          setIsSignedIn(signedIn);
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
      fetch('/api/user/stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data.stats);
          setRecentSessions(data.recentSessions || []);
          setTodaySessions(data.todaySessions || []);
          setTypeStats(data.typeStats || []);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      'home-row': '자리 익히기',
      words: '단어 연습',
      sentences: '문장 연습',
      'listen-write': '듣고 쓰기',
      speak: '보고 말하기',
      document: 'AI 문서',
    };
    return names[type] || type;
  };

  const todayTotalTime = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/my" className="icon-btn">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-[var(--color-text)]">
            학습 통계
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 오늘의 학습 */}
        <section className="card p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold">오늘의 학습</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{todaySessions.length}</p>
              <p className="text-sm opacity-80">연습 횟수</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatTime(todayTotalTime)}</p>
              <p className="text-sm opacity-80">연습 시간</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats?.currentStreak || 0}일</p>
              <p className="text-sm opacity-80">연속 학습</p>
            </div>
          </div>
        </section>

        {/* 전체 통계 */}
        <section>
          <h3 className="font-bold text-[var(--color-text)] mb-4">전체 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" />
              <p className="text-xl font-bold text-[var(--color-text)]">
                {stats ? formatTime(stats.totalTime) : '0분'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">총 연습 시간</p>
            </div>

            <div className="card p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-[var(--color-success)]" />
              <p className="text-xl font-bold text-[var(--color-text)]">
                {stats?.totalSessions || 0}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">총 연습 횟수</p>
            </div>

            <div className="card p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-[var(--color-warning)]" />
              <p className="text-xl font-bold text-[var(--color-text)]">
                {stats?.averageWpm ? Math.round(stats.averageWpm) : 0}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">평균 WPM</p>
            </div>

            <div className="card p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent)]" />
              <p className="text-xl font-bold text-[var(--color-text)]">
                {stats?.averageAccuracy ? Math.round(stats.averageAccuracy) : 0}%
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">평균 정확도</p>
            </div>
          </div>
        </section>

        {/* 스트릭 */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-6 h-6 text-[var(--color-error)]" />
            <h3 className="font-bold text-[var(--color-text)]">연속 학습 기록</h3>
          </div>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--color-error)]">
                {stats?.currentStreak || 0}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">현재 연속</p>
            </div>
            <div className="w-px h-12 bg-[var(--color-border)]" />
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--color-text)]">
                {stats?.longestStreak || 0}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">최고 기록</p>
            </div>
          </div>
        </section>

        {/* 연습 유형별 통계 */}
        {typeStats.length > 0 && (
          <section>
            <h3 className="font-bold text-[var(--color-text)] mb-4">연습 유형별</h3>
            <div className="space-y-3">
              {typeStats.map((stat) => (
                <div key={stat.type} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--color-text)]">
                      {getTypeName(stat.type)}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {stat.count}회 연습
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[var(--color-primary)]">
                      평균 {Math.round(stat.avgWpm)} WPM
                    </span>
                    <span className="text-[var(--color-success)]">
                      정확도 {Math.round(stat.avgAccuracy)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 최근 연습 기록 */}
        {recentSessions.length > 0 && (
          <section>
            <h3 className="font-bold text-[var(--color-text)] mb-4">최근 연습</h3>
            <div className="space-y-2">
              {recentSessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="card p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {getTypeName(session.type)}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(session.completedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-primary)]">
                      {session.wpm} WPM
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {Math.round(session.accuracy)}% · {formatDuration(session.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 데이터 없음 */}
        {!stats && recentSessions.length === 0 && (
          <div className="card p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-light)]" />
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
              아직 학습 기록이 없어요
            </h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              연습을 시작하면 여기에 통계가 표시됩니다
            </p>
            <Link href="/learn">
              <button className="btn btn-primary">학습 시작하기</button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
