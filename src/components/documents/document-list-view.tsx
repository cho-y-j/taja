'use client';

import { PenLine, Upload, Bot, FileText, Trash2, ChevronRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useDocumentStore, type CreateSource } from '@/stores/document-store';
import { useThemeStore } from '@/stores/theme-store';

export function DocumentListView() {
  const { documents, startCreate, selectDocument, deleteDocument } =
    useDocumentStore();
  const { language: themeLanguage } = useThemeStore();

  const sources: { key: CreateSource; icon: typeof PenLine; label: string; desc: string }[] = [
    { key: 'manual', icon: PenLine, label: '직접 입력', desc: '문서를 직접 작성합니다' },
    { key: 'upload', icon: Upload, label: '파일 업로드', desc: 'PDF, TXT 파일 업로드' },
    { key: 'ai', icon: Bot, label: 'AI 생성', desc: 'AI가 문서를 만들어줍니다' },
    { key: 'url', icon: Link2, label: 'URL 추출', desc: '웹/유튜브에서 추출' },
  ];

  return (
    <div>
      {/* 문서 생성 버튼 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {sources.map((src) => (
          <button
            key={src.key}
            onClick={() => startCreate(src.key, themeLanguage || 'ko')}
            className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <src.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{src.label}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{src.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 문서 목록 */}
      <h2 className="text-lg font-bold mb-4 text-[var(--color-text)]">
        내 문서 ({documents.length})
      </h2>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
            <CardTitle className="mb-2 text-[var(--color-text-muted)]">
              아직 문서가 없습니다
            </CardTitle>
            <CardDescription>
              위 버튼으로 문서를 만들어 연습을 시작하세요
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md transition-all cursor-pointer group"
              onClick={() => selectDocument(doc.id)}
            >
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-text)] truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {doc.content.length}자 &middot;{' '}
                  {doc.language === 'ko' ? '한국어' : '영어'} &middot;{' '}
                  {doc.source === 'ai' ? 'AI 생성' : doc.source === 'upload' ? '업로드' : '직접 입력'} &middot;{' '}
                  {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm('이 문서를 삭제하시겠습니까?')) {
                    deleteDocument(doc.id);
                    // DB에서도 삭제 (로그인된 경우, UUID 형식인 경우만)
                    // 로컬 ID(doc-...)는 DB에 없으므로 스킵
                    if (!doc.id.startsWith('doc-')) {
                      try {
                        const clerk = (window as unknown as { Clerk?: { session?: unknown } }).Clerk;
                        if (clerk?.session) {
                          await fetch(`/api/user/documents?id=${doc.id}`, {
                            method: 'DELETE',
                          });
                        }
                      } catch (e) {
                        // 404는 무시 (이미 삭제됨)
                      }
                    }
                  }
                }}
              >
                <Trash2 className="w-4 h-4 text-[var(--color-text-muted)]" />
              </Button>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
