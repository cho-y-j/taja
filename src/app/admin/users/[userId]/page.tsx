'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Coins,
  Crown,
  Activity,
  Clock,
  Target,
  Zap,
  Plus,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserDetail {
  user: {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    createdAt: string;
  };
  credits: {
    balance: number;
    totalUsed: number;
    updatedAt: string;
  } | null;
  stats: {
    totalSessions: number;
    totalTime: number;
    avgWpm: number;
    avgAccuracy: number;
    bestWpm: number;
    bestAccuracy: number;
  } | null;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    apiEndpoint: string;
    description: string;
    createdAt: string;
  }>;
  recentSessions: Array<{
    id: string;
    type: string;
    wpm: number;
    accuracy: number;
    duration: number;
    createdAt: string;
  }>;
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [isGranting, setIsGranting] = useState(false);

  const fetchUserDetail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const userData = await res.json();
        setData(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const handleGrantCredits = async () => {
    const amount = parseInt(creditAmount);
    if (!amount || amount <= 0) {
      alert('올바른 크레딧 수량을 입력해주세요');
      return;
    }

    setIsGranting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason: creditReason }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message);
        setShowCreditModal(false);
        setCreditAmount('');
        setCreditReason('');
        fetchUserDetail();
      } else {
        const error = await res.json();
        alert(error.error || '크레딧 지급에 실패했습니다');
      }
    } catch (error) {
      alert('크레딧 지급에 실패했습니다');
    } finally {
      setIsGranting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="w-32 h-8 rounded bg-[var(--color-border)]" />
          <div className="w-full h-40 rounded-xl bg-[var(--color-border)]" />
          <div className="w-full h-60 rounded-xl bg-[var(--color-border)]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--color-text-muted)]">
          사용자를 찾을 수 없습니다
        </p>
        <Link href="/admin/users" className="text-[var(--color-primary)] hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const { user, credits, stats, subscription, recentTransactions, recentSessions } = data;

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users" className="icon-btn">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            사용자 상세
          </h1>
        </div>
      </div>

      {/* 사용자 정보 카드 */}
      <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {user.name || '이름 없음'}
            </h2>
            <p className="text-[var(--color-text-muted)]">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              {subscription ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-full">
                  <Crown className="w-4 h-4" />
                  구독 중 ({new Date(subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}까지)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] text-sm font-medium rounded-full">
                  무료 사용자
                </span>
              )}
              <span className="text-sm text-[var(--color-text-muted)]">
                가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-[var(--color-secondary)]" />
            <span className="text-sm text-[var(--color-text-muted)]">크레딧 잔액</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {credits?.balance?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {credits?.totalUsed?.toLocaleString() || 0} 사용
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[var(--color-success)]" />
            <span className="text-sm text-[var(--color-text-muted)]">연습 횟수</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {stats?.totalSessions?.toLocaleString() || 0}회
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            총 {Math.round((stats?.totalTime || 0) / 60)}분 연습
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text-muted)]">평균 WPM</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {Math.round(stats?.avgWpm || 0)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            최고: {Math.round(stats?.bestWpm || 0)}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[var(--color-warning)]" />
            <span className="text-sm text-[var(--color-text-muted)]">평균 정확도</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {Math.round(stats?.avgAccuracy || 0)}%
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            최고: {Math.round(stats?.bestAccuracy || 0)}%
          </p>
        </div>
      </div>

      {/* 크레딧 관리 */}
      <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[var(--color-secondary)]" />
            크레딧 관리
          </h3>
          <Button onClick={() => setShowCreditModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            크레딧 지급
          </Button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text)]">
                    {tx.description || tx.apiEndpoint || tx.type}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {new Date(tx.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <span
                  className={`font-medium ${
                    tx.amount >= 0
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-error)]'
                  }`}
                >
                  {tx.amount >= 0 ? '+' : ''}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-muted)] py-4">
            크레딧 거래 내역이 없습니다
          </p>
        )}
      </section>

      {/* 최근 연습 */}
      <section className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[var(--color-primary)]" />
          최근 연습
        </h3>

        {recentSessions.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {recentSessions.map((session) => (
              <div key={session.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text)]">
                    {session.type} 연습
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {new Date(session.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {Math.round(session.wpm)} WPM · {Math.round(session.accuracy)}%
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {Math.round(session.duration)}초
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-muted)] py-4">
            연습 기록이 없습니다
          </p>
        )}
      </section>

      {/* 크레딧 지급 모달 */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCreditModal(false)}
          />
          <div className="relative w-full max-w-md mx-4 bg-[var(--color-surface)] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
              크레딧 지급
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  지급할 크레딧 수량
                </label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="예: 100"
                  min="1"
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  지급 사유 (선택)
                </label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="예: 이벤트 보상"
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreditModal(false)}
              >
                취소
              </Button>
              <Button onClick={handleGrantCredits} disabled={isGranting}>
                {isGranting ? '처리 중...' : '지급하기'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
