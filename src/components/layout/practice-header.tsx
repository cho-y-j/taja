'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { CreditBalance, UpgradeModal } from '@/components/credits';
import { UserMenu } from './user-menu';
import { SettingsDropdown } from './settings-dropdown';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// 경로를 브레드크럼 아이템으로 변환
function getPathBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // 경로 세그먼트별 라벨 매핑
  const labelMap: Record<string, string> = {
    learn: '학습',
    basic: '기본 연습',
    ai: 'AI 학습',
    practice: '연습',
    basics: '기본',
    'home-row': '자리 익히기',
    words: '단어 연습',
    sentences: '문장 연습',
    'listen-write': '듣고 쓰기',
    documents: '문서 연습',
    my: '마이페이지',
    stats: '통계',
  };

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = labelMap[segment] || segment;
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

interface PracticeHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  rightContent?: React.ReactNode;
}

export function PracticeHeader({
  title,
  showBackButton = true,
  backHref,
  rightContent,
}: PracticeHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getPathBreadcrumbs(pathname);

  // 뒤로가기 경로: backHref가 지정되면 사용, 아니면 상위 경로
  const parentPath = breadcrumbs.length > 1
    ? breadcrumbs[breadcrumbs.length - 2].href
    : '/learn';
  const finalBackHref = backHref || parentPath;

  return (
    <>
      <UpgradeModal />
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 브레드크럼 네비게이션 */}
            <nav className="flex items-center gap-1 text-sm overflow-x-auto">
              <Link
                href="/learn"
                className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
              >
                <Home className="w-4 h-4" />
              </Link>

              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-light)] mx-1 shrink-0" />
                  {index === breadcrumbs.length - 1 ? (
                    // 현재 페이지는 클릭 불가
                    <span className="font-medium text-[var(--color-text)] truncate max-w-[120px] sm:max-w-none">
                      {title || crumb.label}
                    </span>
                  ) : (
                    // 상위 경로는 클릭 가능
                    <Link
                      href={crumb.href}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors truncate max-w-[80px] sm:max-w-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* 오른쪽: 크레딧, 설정, 유저 메뉴 */}
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {rightContent}
              <CreditBalance />
              <SettingsDropdown />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
