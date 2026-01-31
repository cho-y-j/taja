'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  Shield,
} from 'lucide-react';

const menuItems = [
  {
    label: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: '사용자 관리',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: '이용 현황',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: '결제 관리',
    href: '/admin/payments',
    icon: CreditCard,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[var(--color-text)]">TAJA Admin</h1>
            <p className="text-xs text-[var(--color-text-muted)]">관리자 모드</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 푸터 */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          서비스로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
