'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/document-store';
import { CreditBalance, UpgradeModal } from '@/components/credits';
import { DocumentListView } from '@/components/documents/document-list-view';
import { DocumentCreateView } from '@/components/documents/document-create-view';
import { DocumentDetailView } from '@/components/documents/document-detail-view';
import { DocumentPracticeView } from '@/components/documents/document-practice-view';
import { UserMenu, SettingsDropdown } from '@/components/layout';

export default function DocumentsPage() {
  const { viewMode, backToList, getSelectedDocument } = useDocumentStore();
  const selectedDocument = getSelectedDocument();

  // 브레드크럼 생성
  const getBreadcrumbs = () => {
    const crumbs: Array<{ label: string; href: string; onClick?: () => void }> = [
      { label: '문서 연습', href: '/documents', onClick: backToList }
    ];
    if (viewMode === 'create') {
      crumbs.push({ label: '새 문서', href: '#', onClick: undefined });
    } else if (viewMode === 'detail' && selectedDocument) {
      crumbs.push({ label: selectedDocument.name, href: '#', onClick: undefined });
    } else if (viewMode === 'practice' && selectedDocument) {
      crumbs.push({ label: selectedDocument.name, href: '#', onClick: backToList });
      crumbs.push({ label: '연습', href: '#', onClick: undefined });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 업그레이드 모달 */}
      <UpgradeModal />

      {/* 헤더 */}
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
                <div key={index} className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-light)] mx-1 shrink-0" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-[var(--color-text)] truncate max-w-[120px] sm:max-w-none">
                      {crumb.label}
                    </span>
                  ) : crumb.onClick ? (
                    <button
                      onClick={crumb.onClick}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors truncate max-w-[80px] sm:max-w-none"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-[var(--color-text-muted)] truncate max-w-[80px] sm:max-w-none">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            {/* 오른쪽: 크레딧, 설정, 유저 메뉴 */}
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <CreditBalance />
              <SettingsDropdown />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {viewMode === 'list' && <DocumentListView />}
        {viewMode === 'create' && <DocumentCreateView />}
        {viewMode === 'detail' && <DocumentDetailView />}
        {viewMode === 'practice' && <DocumentPracticeView />}
      </main>
    </div>
  );
}
