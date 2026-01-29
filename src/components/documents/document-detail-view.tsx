'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Volume2,
  VolumeX,
  Languages,
  BookOpen,
  FileText,
  Type,
  Headphones,
  Mic,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useDocumentStore, type PracticeMode } from '@/stores/document-store';
import { loadVoices, speakText, getPreferredVoice } from '@/lib/speech/tts-utils';

interface PracticeModeOption {
  mode: PracticeMode;
  icon: typeof Type;
  label: string;
  description: string;
  color: string;
}

const practiceOptions: PracticeModeOption[] = [
  {
    mode: 'words',
    icon: Type,
    label: '단어 연습',
    description: '문서에서 추출한 단어로 연습',
    color: 'bg-green-500',
  },
  {
    mode: 'sentences',
    icon: BookOpen,
    label: '문장 연습',
    description: '문서의 문장을 하나씩 연습',
    color: 'bg-purple-500',
  },
  {
    mode: 'summary',
    icon: Sparkles,
    label: '요약 연습',
    description: 'AI가 요약한 내용으로 연습',
    color: 'bg-indigo-500',
  },
  {
    mode: 'full-text',
    icon: FileText,
    label: '전체 연습',
    description: '문서 전체를 문단별로 연습',
    color: 'bg-teal-500',
  },
  {
    mode: 'listen-write',
    icon: Headphones,
    label: '듣고 쓰기',
    description: '문장을 듣고 받아쓰기',
    color: 'bg-orange-500',
  },
  {
    mode: 'read-speak',
    icon: Mic,
    label: '보고 말하기',
    description: '문장을 보고 소리내어 읽기',
    color: 'bg-pink-500',
  },
];

export function DocumentDetailView() {
  const {
    getSelectedDocument,
    selectPracticeMode,
    startEdit,
    deleteDocument,
    backToList,
    updateDocument,
  } = useDocumentStore();

  const doc = getSelectedDocument();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    loadVoices().then(setVoices);
  }, []);

  // TTS 재생
  const handleSpeak = useCallback(() => {
    if (!doc) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const voice = getPreferredVoice(voices, doc.language);
    speakText(doc.content, doc.language, {
      voice,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [doc, isSpeaking, voices]);

  // 번역 토글
  const handleTranslation = useCallback(async () => {
    if (!doc) return;

    if (showTranslation) {
      setShowTranslation(false);
      return;
    }

    // 캐시된 번역이 있으면 바로 표시
    if (doc.translation) {
      setShowTranslation(true);
      return;
    }

    // 번역 API 호출
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: doc.content,
          from: doc.language,
          to: doc.language === 'en' ? 'ko' : 'en',
        }),
      });

      if (!res.ok) throw new Error('번역 실패');

      const data = await res.json();
      updateDocument(doc.id, { translation: data.translation });
      setShowTranslation(true);
    } catch {
      alert('번역 중 오류가 발생했습니다.');
    } finally {
      setIsTranslating(false);
    }
  }, [doc, showTranslation, updateDocument]);

  // 삭제
  const handleDelete = useCallback(() => {
    if (!doc) return;
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteDocument(doc.id);
    }
  }, [doc, deleteDocument]);

  if (!doc) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">문서를 찾을 수 없습니다.</p>
        <Button variant="outline" className="mt-4" onClick={backToList}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={backToList}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {doc.name}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {doc.content.length}자 &middot;{' '}
              {doc.language === 'ko' ? '한국어' : '영어'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSpeak}>
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 mr-1" />
            ) : (
              <Volume2 className="w-4 h-4 mr-1" />
            )}
            {isSpeaking ? '정지' : '듣기'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslation}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Languages className="w-4 h-4 mr-1" />
            )}
            {showTranslation ? '원문' : '번역'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => startEdit(doc.id)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
          </Button>
        </div>
      </div>

      {/* 문서 미리보기 */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="max-h-48 overflow-y-auto whitespace-pre-wrap text-[var(--color-text)] leading-relaxed">
            {doc.content}
          </div>
          {showTranslation && doc.translation && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">
                {doc.language === 'en' ? '한국어 번역' : '영어 번역'}
              </p>
              <div className="whitespace-pre-wrap text-[var(--color-text-muted)] leading-relaxed">
                {doc.translation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 연습 모드 선택 */}
      <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">
        연습 모드 선택
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceOptions.map((opt) => (
          <Card
            key={opt.mode}
            className="cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => selectPracticeMode(opt.mode)}
          >
            <CardContent className="pt-6">
              <div
                className={`w-10 h-10 rounded-lg ${opt.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <opt.icon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-base mb-1">{opt.label}</CardTitle>
              <CardDescription className="text-xs">
                {opt.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
