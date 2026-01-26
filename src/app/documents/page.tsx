'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  X,
  Upload,
  FileText,
  Trash2,
  Play,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';

interface UserDocument {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

const DOCUMENTS_KEY = 'lit-type-documents';

// 로컬 스토리지에서 문서 가져오기
function getDocuments(): UserDocument[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DOCUMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 문서 저장
function saveDocument(doc: Omit<UserDocument, 'id' | 'createdAt'>): UserDocument {
  const documents = getDocuments();
  const newDoc: UserDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  documents.push(newDoc);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  return newDoc;
}

// 문서 삭제
function deleteDocument(id: string): void {
  const documents = getDocuments().filter(d => d.id !== id);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
}

type ViewMode = 'list' | 'practice';

export default function DocumentPracticePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<UserDocument | null>(null);
  const [practiceText, setPracticeText] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  // 텍스트 입력
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 문서 목록 로드
  useEffect(() => {
    setDocuments(getDocuments());
  }, [viewMode]);

  const {
    metrics,
    isComplete,
    isPaused,
    isStarted,
    getCharacterFeedback,
    reset,
    pause,
    resume,
    inputRef,
    processInput,
    processBackspace,
    startSession,
  } = useTypingEngine(practiceText, 'document');

  // 키 입력 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isComplete || isPaused) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        processBackspace();
        return;
      }

      if (e.key.length !== 1) return;

      if (!isStarted) {
        startSession();
      }

      processInput(e.key);
    },
    [isComplete, isPaused, isStarted, processInput, processBackspace, startSession]
  );

  // 파일 업로드 처리
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNewDocName(file.name.replace(/\.[^/.]+$/, ''));
      setNewDocContent(content);
      setShowAddModal(true);
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 문서 저장
  const handleSaveDocument = useCallback(() => {
    if (!newDocName.trim() || !newDocContent.trim()) return;

    const newDoc = saveDocument({
      name: newDocName.trim(),
      content: newDocContent.trim(),
    });
    setDocuments(prev => [...prev, newDoc]);
    setNewDocName('');
    setNewDocContent('');
    setShowAddModal(false);
  }, [newDocName, newDocContent]);

  // 문서 삭제
  const handleDeleteDocument = useCallback((id: string) => {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  }, []);

  // 연습 시작
  const handleStartPractice = useCallback((doc: UserDocument) => {
    setCurrentDocument(doc);
    // 문단으로 분리 (빈 줄 기준, 또는 100자 단위)
    const paras = doc.content
      .split(/\n\n+/)
      .flatMap(p => {
        // 긴 문단은 100자 단위로 분리
        const trimmed = p.trim();
        if (trimmed.length > 100) {
          const chunks: string[] = [];
          for (let i = 0; i < trimmed.length; i += 100) {
            chunks.push(trimmed.slice(i, i + 100));
          }
          return chunks;
        }
        return trimmed;
      })
      .filter(p => p.length > 0);

    setParagraphs(paras);
    setCurrentParagraph(0);
    setPracticeText(paras[0] || '');
    setViewMode('practice');
    reset();
  }, [reset]);

  // 다음 문단
  const handleNextParagraph = useCallback(() => {
    if (currentParagraph < paragraphs.length - 1) {
      const nextIdx = currentParagraph + 1;
      setCurrentParagraph(nextIdx);
      setPracticeText(paragraphs[nextIdx]);
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentParagraph, paragraphs, reset, inputRef]);

  // 이전 문단
  const handlePrevParagraph = useCallback(() => {
    if (currentParagraph > 0) {
      const prevIdx = currentParagraph - 1;
      setCurrentParagraph(prevIdx);
      setPracticeText(paragraphs[prevIdx]);
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentParagraph, paragraphs, reset, inputRef]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  // 목록으로
  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setCurrentDocument(null);
    setPracticeText('');
    reset();
  }, [reset]);

  // 종료
  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // 연습 화면 진입 시 자동 포커스
  useEffect(() => {
    if (viewMode === 'practice' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [viewMode, inputRef]);

  // 문서 목록 화면
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-xl font-bold">문서 연습</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">내 문서로 타자 연습</h2>
            <p className="text-[var(--color-text-muted)]">
              텍스트 파일을 업로드하거나 직접 입력해서 연습하세요
            </p>
          </div>

          {/* 문서 추가 버튼 */}
          <div className="flex justify-center gap-4 mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              파일 업로드
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              직접 입력
            </Button>
          </div>

          {/* 문서 목록 */}
          <div className="space-y-3">
            {documents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-[var(--color-text-muted)]">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>저장된 문서가 없습니다.</p>
                  <p className="text-sm mt-2">위 버튼으로 문서를 추가해보세요!</p>
                </CardContent>
              </Card>
            ) : (
              documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="py-4 flex items-center justify-between">
                    <div
                      className="flex-1"
                      onClick={() => handleStartPractice(doc)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            {doc.content.length}자 | {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartPractice(doc)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>

        {/* 문서 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <CardHeader>
                <CardTitle>문서 추가</CardTitle>
                <CardDescription>연습할 텍스트를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">문서 이름</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="문서 이름을 입력하세요"
                    className="w-full p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">내용</label>
                  <textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="연습할 텍스트를 입력하세요..."
                    rows={10}
                    className="w-full p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setShowAddModal(false);
                    setNewDocName('');
                    setNewDocContent('');
                  }}>
                    취소
                  </Button>
                  <Button onClick={handleSaveDocument}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // 연습 화면
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{currentDocument?.name}</h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {currentParagraph + 1} / {paragraphs.length} 문단
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <X className="w-4 h-4 mr-2" />
              종료
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 진행률 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>진행률</span>
            <span>{Math.round(((currentParagraph + (isComplete ? 1 : 0)) / paragraphs.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${((currentParagraph + (isComplete ? 1 : 0)) / paragraphs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          className="w-full p-4 mb-4 text-lg border-2 border-[var(--color-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
          onKeyDown={handleKeyDown}
          placeholder="여기를 클릭하고 타이핑을 시작하세요..."
          aria-label="타이핑 입력"
          autoFocus
        />

        {/* 메트릭 표시 */}
        <MetricsDisplay metrics={metrics} className="mb-6" />

        {/* 타이핑 영역 */}
        <div onClick={() => inputRef.current?.focus()} className="cursor-text">
          <TypingDisplay feedback={getCharacterFeedback()} />
          {!isStarted && (
            <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
              위 입력창을 클릭하고 타이핑을 시작하세요
            </p>
          )}
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex justify-center gap-4 mt-8">
          {currentParagraph > 0 && (
            <Button variant="outline" onClick={handlePrevParagraph}>
              이전 문단
            </Button>
          )}
          {!isComplete && isStarted && (
            <Button variant="outline" onClick={isPaused ? resume : pause}>
              {isPaused ? '계속' : '일시정지'}
            </Button>
          )}
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 연습
          </Button>
          <Button variant="outline" onClick={handleBackToList}>
            문서 목록
          </Button>
        </div>

        {/* 완료 결과 */}
        {isComplete && (
          <Card className="mt-6 border-green-500 bg-green-50">
            <CardContent className="py-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                문단 완료!
              </h3>
              <p className="text-green-600 mb-4">
                정확도 {metrics.accuracy}% | 속도 {metrics.wpm} WPM
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  다시 연습
                </Button>
                {currentParagraph < paragraphs.length - 1 ? (
                  <Button onClick={handleNextParagraph} className="bg-green-600 hover:bg-green-700">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    다음 문단
                  </Button>
                ) : (
                  <Button onClick={handleBackToList} className="bg-green-600 hover:bg-green-700">
                    완료! 목록으로
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
