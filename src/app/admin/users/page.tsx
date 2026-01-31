'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Crown,
  Coins,
  Activity,
} from 'lucide-react';

interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  createdAt: string;
  creditBalance: number;
  totalUsed: number;
  totalSessions: number;
  avgWpm: number;
  avgAccuracy: number;
  hasSubscription: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (page = 1, searchQuery = search) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchQuery,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            사용자 관리
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            총 {pagination.total.toLocaleString()}명의 사용자
          </p>
        </div>
      </div>

      {/* 검색 */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일로 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
      </form>

      {/* 테이블 */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  크레딧
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  연습
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-border)]" />
                        <div>
                          <div className="w-24 h-4 rounded bg-[var(--color-border)] mb-1" />
                          <div className="w-32 h-3 rounded bg-[var(--color-border)]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-16 h-5 rounded bg-[var(--color-border)]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-12 h-4 rounded bg-[var(--color-border)]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-20 h-4 rounded bg-[var(--color-border)]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-20 h-4 rounded bg-[var(--color-border)]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-12 h-4 rounded bg-[var(--color-border)] ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text)]">
                            {user.name || '이름 없음'}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {user.hasSubscription ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium rounded-full">
                          <Crown className="w-3 h-3" />
                          구독 중
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] text-xs font-medium rounded-full">
                          무료
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Coins className="w-4 h-4 text-[var(--color-secondary)]" />
                        <span className="text-[var(--color-text)]">
                          {user.creditBalance.toLocaleString()}
                        </span>
                        <span className="text-[var(--color-text-muted)]">
                          / {user.totalUsed.toLocaleString()} 사용
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Activity className="w-4 h-4 text-[var(--color-success)]" />
                        <span className="text-[var(--color-text)]">
                          {user.totalSessions}회
                        </span>
                        {user.avgWpm > 0 && (
                          <span className="text-[var(--color-text-muted)]">
                            · {Math.round(user.avgWpm)} WPM
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                    검색 결과가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-muted)]">
              {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total}명
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[var(--color-text)]">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-background)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
