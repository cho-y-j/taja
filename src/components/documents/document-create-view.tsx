'use client';

import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Bot, Upload, Save, Globe, Loader2, Link2, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDocumentStore } from '@/stores/document-store';
import { detectLanguage } from '@/lib/documents/document-utils';

export function DocumentCreateView() {
  const {
    createSource,
    editingDocumentId,
    draftName,
    draftContent,
    draftLanguage,
    isGenerating,
    generationError,
    setDraft,
    setGenerating,
    setGenerationError,
    addDocument,
    updateDocument,
    clearDraft,
    backToList,
    selectDocument,
  } = useDocumentStore();

  const [aiPrompt, setAiPrompt] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingDocumentId;

  // AI 문서 생성
  const handleAiGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, language: draftLanguage }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'AI 생성 실패');
      }

      const data = await res.json();
      setDraft(data.title || aiPrompt.slice(0, 30), data.content, draftLanguage);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'AI 생성 오류');
    } finally {
      setGenerating(false);
    }
  }, [aiPrompt, draftLanguage, setDraft, setGenerating, setGenerationError]);

  // URL에서 콘텐츠 추출
  const handleUrlExtract = useCallback(async () => {
    if (!urlInput.trim()) return;
    setIsExtractingUrl(true);
    setUrlError(null);

    try {
      const res = await fetch('/api/ai/extract-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput, language: draftLanguage }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '콘텐츠 추출 실패');
      }

      const data = await res.json();
      setDraft(data.title || 'URL 단어장', data.content, draftLanguage);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : 'URL 추출 오류');
    } finally {
      setIsExtractingUrl(false);
    }
  }, [urlInput, draftLanguage, setDraft]);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 업로드
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      if (file.name.endsWith('.pdf')) {
        // PDF: server-side parsing
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/documents/parse-pdf', {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'PDF 파싱 실패');
          }
          const data = await res.json();
          const lang = detectLanguage(data.text);
          setDraft(data.fileName || file.name.replace(/\.pdf$/i, ''), data.text, lang);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'PDF 파일을 읽을 수 없습니다');
        } finally {
          setIsUploading(false);
        }
      } else {
        // TXT/MD: client-side reading
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const fileName = file.name.replace(/\.(txt|md)$/i, '');
          const lang = detectLanguage(text);
          setDraft(fileName, text, lang);
        };
        reader.readAsText(file);
      }
    },
    [setDraft]
  );

  // 저장
  const handleSave = useCallback(() => {
    if (!draftName.trim() || !draftContent.trim()) return;

    if (isEditing && editingDocumentId) {
      updateDocument(editingDocumentId, {
        name: draftName,
        content: draftContent,
        language: draftLanguage,
      });
      clearDraft();
      selectDocument(editingDocumentId);
    } else {
      const doc = addDocument({
        name: draftName,
        content: draftContent,
        language: draftLanguage,
        source: createSource || 'manual',
        aiPrompt: createSource === 'ai' ? aiPrompt : undefined,
      });
      clearDraft();
      selectDocument(doc.id);
    }
  }, [
    draftName,
    draftContent,
    draftLanguage,
    isEditing,
    editingDocumentId,
    createSource,
    aiPrompt,
    addDocument,
    updateDocument,
    clearDraft,
    selectDocument,
  ]);

  // 언어 토글
  const toggleLanguage = useCallback(() => {
    setDraft(draftName, draftContent, draftLanguage === 'ko' ? 'en' : 'ko');
  }, [draftName, draftContent, draftLanguage, setDraft]);

  const handleBack = useCallback(() => {
    clearDraft();
    if (isEditing && editingDocumentId) {
      selectDocument(editingDocumentId);
    } else {
      backToList();
    }
  }, [clearDraft, isEditing, editingDocumentId, selectDocument, backToList]);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">
            {isEditing ? '문서 편집' : '새 문서'}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          <Globe className="w-4 h-4 mr-2" />
          {draftLanguage === 'ko' ? '한국어' : 'English'}
        </Button>
      </div>

      {/* AI 프롬프트 (AI 생성 모드일 때만) */}
      {createSource === 'ai' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-semibold">AI 문서 생성</span>
              </div>
              {/* 생성 언어 선택 */}
              <div className="flex items-center gap-1 bg-[var(--color-border)] rounded-lg p-1">
                <button
                  onClick={() => setDraft(draftName, draftContent, 'ko')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    draftLanguage === 'ko'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => setDraft(draftName, draftContent, 'en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    draftLanguage === 'en'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              어떤 문서를 만들고 싶은지 구체적으로 적어주세요.
              {draftLanguage === 'en'
                ? ' (영문으로만 생성됩니다)'
                : ' (한국어로만 생성됩니다)'}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={draftLanguage === 'en' ? '예: 10 sentences about travel' : '예: 여행에 관련된 문장 10개'}
                className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              <Button
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                isLoading={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '생성'
                )}
              </Button>
            </div>
            {generationError && (
              <p className="mt-2 text-sm text-[var(--color-error)]">
                {generationError}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 파일 업로드 (업로드 모드일 때만) */}
      {createSource === 'upload' && !draftContent && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-semibold">파일 업로드</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-8 border-2 border-dashed border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors text-center disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-[var(--color-primary)]" />
                  <p className="text-[var(--color-text-muted)]">PDF 파일을 읽고 있습니다...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)]" />
                  <p className="text-[var(--color-text-muted)]">
                    클릭하여 파일을 선택하세요
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    .pdf, .txt, .md 지원
                  </p>
                </>
              )}
            </button>
            {uploadError && (
              <p className="mt-2 text-sm text-[var(--color-error)]">{uploadError}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* URL/유튜브 추출 (URL 모드일 때만) */}
      {createSource === 'url' && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-semibold">URL에서 단어장 만들기</span>
              </div>
              {/* 생성 언어 선택 */}
              <div className="flex items-center gap-1 bg-[var(--color-border)] rounded-lg p-1">
                <button
                  onClick={() => setDraft(draftName, draftContent, 'ko')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    draftLanguage === 'ko'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => setDraft(draftName, draftContent, 'en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    draftLanguage === 'en'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              웹페이지 또는 유튜브 URL을 입력하면 AI가 단어와 문장을 추출해요
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://... 또는 유튜브 링크"
                className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlExtract()}
              />
              <Button
                onClick={handleUrlExtract}
                disabled={isExtractingUrl || !urlInput.trim()}
              >
                {isExtractingUrl ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '추출'
                )}
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> 웹페이지
              </span>
              <span className="flex items-center gap-1">
                <Youtube className="w-3 h-3" /> 유튜브 (자막 필요)
              </span>
            </div>
            {urlError && (
              <p className="mt-2 text-sm text-[var(--color-error)]">
                {urlError}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 문서 편집 영역 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[var(--color-text)]">
            문서 제목
          </label>
          <input
            type="text"
            value={draftName}
            onChange={(e) => setDraft(e.target.value, draftContent, draftLanguage)}
            placeholder="문서 제목을 입력하세요"
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-[var(--color-text)]">
            내용{' '}
            <span className="font-normal text-[var(--color-text-muted)]">
              ({draftContent.length}자)
            </span>
          </label>
          <textarea
            value={draftContent}
            onChange={(e) => setDraft(draftName, e.target.value, draftLanguage)}
            placeholder="연습할 내용을 입력하세요..."
            rows={12}
            className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] resize-y font-mono"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleBack}>
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!draftName.trim() || !draftContent.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? '수정 저장' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
