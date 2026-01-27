'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/document-store';
import { DocumentListView } from '@/components/documents/document-list-view';
import { DocumentCreateView } from '@/components/documents/document-create-view';
import { DocumentDetailView } from '@/components/documents/document-detail-view';
import { DocumentPracticeView } from '@/components/documents/document-practice-view';

export default function DocumentsPage() {
  const { viewMode, backToList } = useDocumentStore();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {viewMode === 'list' ? (
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="icon" onClick={backToList}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <h1 className="text-xl font-bold text-[var(--color-text)]">
                문서 연습
              </h1>
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
