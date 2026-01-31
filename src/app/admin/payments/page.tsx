'use client';

import { useEffect, useState } from 'react';
import {
  CreditCard,
  Crown,
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  amountKrw: number;
  status: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions'>('subscriptions');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/payments');
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments || []);
          setSubscriptions(data.subscriptions || []);
        }
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-[var(--color-warning)]" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-[var(--color-error)]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)]" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'active':
        return '활성';
      case 'pending':
        return '대기';
      case 'failed':
        return '실패';
      case 'cancelled':
        return '취소됨';
      case 'expired':
        return '만료';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            결제 관리
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            구독 및 결제 내역을 관리합니다
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'subscriptions'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'
          }`}
        >
          <Crown className="w-4 h-4" />
          구독 ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'payments'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          결제 내역 ({payments.length})
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto" />
          </div>
        ) : activeTab === 'subscriptions' ? (
          subscriptions.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    사용자
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    플랜
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                    만료일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--color-background)]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--color-text)]">
                        {sub.userName || '이름 없음'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {sub.userEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm rounded-full">
                        <Crown className="w-3 h-3" />
                        {sub.plan === 'monthly' ? '월간' : sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm">
                        {getStatusIcon(sub.status)}
                        {getStatusLabel(sub.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                      {new Date(sub.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              <Crown className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>아직 구독자가 없습니다</p>
              <p className="text-xs mt-1">결제 연동 후 구독자가 표시됩니다</p>
            </div>
          )
        ) : payments.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  사용자
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  유형
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  금액
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  일시
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[var(--color-background)]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text)]">
                      {payment.userName || '이름 없음'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {payment.userEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm">
                      {payment.type === 'subscription' ? (
                        <>
                          <Crown className="w-4 h-4 text-[var(--color-primary)]" />
                          구독
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 text-[var(--color-secondary)]" />
                          크레딧
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                    {payment.amountKrw.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm">
                      {getStatusIcon(payment.status)}
                      {getStatusLabel(payment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    {new Date(payment.createdAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-[var(--color-text-muted)]">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>아직 결제 내역이 없습니다</p>
            <p className="text-xs mt-1">결제 연동 후 내역이 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
