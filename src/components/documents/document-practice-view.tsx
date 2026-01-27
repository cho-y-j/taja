'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/document-store';
import { WordPracticeMode } from './practice-modes/word-practice-mode';
import { SentencePracticeMode } from './practice-modes/sentence-practice-mode';
import { SummaryPracticeMode } from './practice-modes/summary-practice-mode';
import { FullTextPracticeMode } from './practice-modes/full-text-practice-mode';
import { ListenWritePracticeMode } from './practice-modes/listen-write-practice-mode';
import { ReadSpeakPracticeMode } from './practice-modes/read-speak-practice-mode';

const modeLabels: Record<string, string> = {
  words: '단어 연습',
  sentences: '문장 연습',
  summary: '요약 연습',
  'full-text': '전체 연습',
  'listen-write': '듣고 쓰기',
  'read-speak': '보고 말하기',
};

export function DocumentPracticeView() {
  const { selectedPracticeMode, getSelectedDocument, backToDetail } =
    useDocumentStore();

  const doc = getSelectedDocument();

  if (!doc || !selectedPracticeMode) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">연습할 문서를 선택해주세요.</p>
        <Button variant="outline" className="mt-4" onClick={backToDetail}>
          돌아가기
        </Button>
      </div>
    );
  }

  const renderMode = () => {
    switch (selectedPracticeMode) {
      case 'words':
        return <WordPracticeMode document={doc} />;
      case 'sentences':
        return <SentencePracticeMode document={doc} />;
      case 'summary':
        return <SummaryPracticeMode document={doc} />;
      case 'full-text':
        return <FullTextPracticeMode document={doc} />;
      case 'listen-write':
        return <ListenWritePracticeMode document={doc} />;
      case 'read-speak':
        return <ReadSpeakPracticeMode document={doc} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={backToDetail}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            {modeLabels[selectedPracticeMode] || selectedPracticeMode}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">{doc.name}</p>
        </div>
      </div>

      {/* 모드별 UI */}
      {renderMode()}
    </div>
  );
}
