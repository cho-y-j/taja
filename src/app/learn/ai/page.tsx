'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  FileText,
  Upload,
  Sparkles,
  ChevronRight,
  Folder,
  Link2,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useDocumentStore } from '@/stores/document-store';
import { CreditBalance, UpgradeModal } from '@/components/credits';

const content = {
  ko: {
    pageTitle: 'AI 학습',
    documentsCount: '개의 문서',
    newDocument: '새 문서 만들기',
    directInput: '직접 입력',
    directInputDesc: '텍스트를 직접 입력해요',
    fileUpload: '파일 업로드',
    fileUploadDesc: 'PDF, TXT 파일',
    aiGenerate: 'AI 생성',
    aiGenerateDesc: 'AI가 콘텐츠를 만들어요',
    urlExtract: 'URL 추출',
    urlExtractDesc: '웹/유튜브에서 추출',
    myDocuments: '내 문서',
    viewAll: '전체 보기',
    noDocuments: '아직 문서가 없어요',
    createFirst: '첫 문서 만들기',
    moreCount: '개 더 보기',
    korean: '한글',
    english: '영문',
    chars: '자',
  },
  en: {
    pageTitle: 'AI Learning',
    documentsCount: ' documents',
    newDocument: 'Create New Document',
    directInput: 'Type Text',
    directInputDesc: 'Enter text directly',
    fileUpload: 'Upload File',
    fileUploadDesc: 'PDF, TXT files',
    aiGenerate: 'AI Generate',
    aiGenerateDesc: 'AI creates content for you',
    urlExtract: 'URL Extract',
    urlExtractDesc: 'Extract from web/YouTube',
    myDocuments: 'My Documents',
    viewAll: 'View All',
    noDocuments: 'No documents yet',
    createFirst: 'Create First Document',
    moreCount: ' more',
    korean: 'Korean',
    english: 'English',
    chars: ' chars',
  },
};

export default function AILearningPage() {
  const router = useRouter();
  const { language, uiLanguage } = useThemeStore();
  const { documents, setViewMode, startCreate } = useDocumentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 언어가 선택되지 않았다면 홈으로 리다이렉트
  useEffect(() => {
    if (!language) {
      router.push('/');
    }
  }, [language, router]);

  const handleCreateNew = (type: 'input' | 'upload' | 'ai' | 'url') => {
    const source = type === 'input' ? 'manual' : type;
    startCreate(source as 'manual' | 'upload' | 'ai' | 'url');
    router.push('/documents');
  };

  const handleOpenDocuments = () => {
    setViewMode('list');
    router.push('/documents');
  };

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="spinner" />
      </div>
    );
  }

  const lang = mounted ? uiLanguage : 'ko';
  const t = content[lang];
  const languageLabel = language === 'ko' ? t.korean : t.english;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 업그레이드 모달 */}
      <UpgradeModal />

      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/learn" className="icon-btn">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[var(--color-text)]">
              {t.pageTitle} ({languageLabel})
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {documents.length}{t.documentsCount}
            </p>
          </div>
          <CreditBalance />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 새 문서 만들기 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">
            {t.newDocument}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 직접 입력 */}
            <button
              onClick={() => handleCreateNew('input')}
              className="card p-5 text-center hover:shadow-lg transition-all group animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--gradient-primary)' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-text)] mb-1">
                {t.directInput}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.directInputDesc}
              </p>
            </button>

            {/* 파일 업로드 */}
            <button
              onClick={() => handleCreateNew('upload')}
              className="card p-5 text-center hover:shadow-lg transition-all group animate-slide-up"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--gradient-success)' }}>
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-text)] mb-1">
                {t.fileUpload}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.fileUploadDesc}
              </p>
            </button>

            {/* AI 생성 */}
            <button
              onClick={() => handleCreateNew('ai')}
              className="card p-5 text-center hover:shadow-lg transition-all group animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--gradient-secondary)' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-text)] mb-1">
                {t.aiGenerate}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.aiGenerateDesc}
              </p>
            </button>

            {/* URL/유튜브 추출 */}
            <button
              onClick={() => handleCreateNew('url')}
              className="card p-5 text-center hover:shadow-lg transition-all group animate-slide-up"
              style={{ animationDelay: '0.25s' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}>
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-text)] mb-1">
                {t.urlExtract}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.urlExtractDesc}
              </p>
            </button>
          </div>
        </section>

        {/* 내 문서 */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              {t.myDocuments}
            </h2>
            {documents.length > 0 && (
              <button
                onClick={handleOpenDocuments}
                className="text-sm text-[var(--color-primary)] font-medium hover:underline"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="card p-8 text-center">
              <Folder className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
              <p className="text-[var(--color-text-muted)] mb-4">
                {t.noDocuments}
              </p>
              <button
                onClick={() => handleCreateNew('input')}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                {t.createFirst}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents?doc=${doc.id}`}
                  className="block"
                >
                  <div className="card p-4 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-border-light)] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--color-text)] truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {doc.content.length}{t.chars} · {doc.language === 'ko' ? t.korean : t.english}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-light)] flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}

              {documents.length > 5 && (
                <button
                  onClick={handleOpenDocuments}
                  className="w-full py-3 text-center text-sm text-[var(--color-primary)] font-medium hover:underline"
                >
                  +{documents.length - 5}{t.moreCount}
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
