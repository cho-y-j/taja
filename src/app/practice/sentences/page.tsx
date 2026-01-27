'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  X,
  Globe,
  Plus,
  Edit2,
  Trash2,
  Save,
  Sparkles,
  BookOpen,
  User,
  Bot,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TypingDisplay } from '@/components/typing/typing-display';
import { MetricsDisplay } from '@/components/typing/metrics-display';
import { useTypingEngine } from '@/hooks/use-typing-engine';
import { engToKorMap } from '@/lib/typing/korean-keyboard';
import {
  sentenceCategories,
  getSampleSentences,
  getSentencesByCategory,
  getRandomSentence,
  getUserSentences,
  saveUserSentence,
  updateUserSentence,
  deleteUserSentence,
  getAiSentences,
  saveAiSentence,
  deleteAiSentence,
  type PracticeSentence,
} from '@/lib/typing/sentence-practice';

type Language = 'en' | 'ko';
type ViewMode = 'select' | 'practice' | 'manage' | 'ai';

export default function SentencePracticePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('ko');
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [currentSentence, setCurrentSentence] = useState<PracticeSentence | null>(null);
  const [practiceText, setPracticeText] = useState('');

  // User sentence management
  const [userSentences, setUserSentences] = useState<PracticeSentence[]>([]);
  const [aiSentences, setAiSentences] = useState<PracticeSentence[]>([]);
  const [newSentenceText, setNewSentenceText] = useState('');
  const [editingSentenceId, setEditingSentenceId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // AI generation
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSentences, setGeneratedSentences] = useState<string[]>([]);

  // Load user and AI sentences
  useEffect(() => {
    setUserSentences(getUserSentences().filter(s => s.language === language));
    setAiSentences(getAiSentences().filter(s => s.language === language));
  }, [language, viewMode]);

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
  } = useTypingEngine(practiceText, 'sentences');

  // 한글 입력 처리를 위한 커스텀 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isComplete || isPaused) return;

      // 백스페이스 처리
      if (e.key === 'Backspace') {
        e.preventDefault();
        processBackspace();
        return;
      }

      // 특수 키 무시
      if (e.key.length !== 1) return;

      e.preventDefault();

      // 첫 입력 시 자동 시작
      if (!isStarted) {
        startSession();
      }

      if (language === 'ko') {
        // 한글 모드: 영문 키 -> 한글로 변환
        // 구두점과 특수문자는 그대로 사용
        const specialChars = ['.', ',', '!', '?', ' ', ':', ';', '"', "'", '(', ')', '-'];
        if (specialChars.includes(e.key)) {
          processInput(e.key);
        } else {
          const koreanKey = engToKorMap[e.key.toLowerCase()];
          if (koreanKey) {
            processInput(koreanKey);
          }
        }
      } else {
        // 영문 모드
        processInput(e.key);
      }
    },
    [isComplete, isPaused, isStarted, language, processInput, processBackspace, startSession]
  );

  // 연습 시작
  const handleStartPractice = useCallback((sentence: PracticeSentence) => {
    setCurrentSentence(sentence);
    setPracticeText(sentence.text);
    setViewMode('practice');
    reset();
  }, [reset]);

  // 랜덤 문장으로 연습 시작
  const handleRandomPractice = useCallback(() => {
    const sentence = getRandomSentence(language, selectedCategory);
    if (sentence) {
      handleStartPractice(sentence);
    }
  }, [language, selectedCategory, handleStartPractice]);

  // 다시 연습
  const handleRestart = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [reset, inputRef]);

  // 다음 문장
  const handleNextSentence = useCallback(() => {
    handleRandomPractice();
  }, [handleRandomPractice]);

  // 선택 화면으로
  const handleBackToSelect = useCallback(() => {
    setViewMode('select');
    setCurrentSentence(null);
    reset();
  }, [reset]);

  // 종료
  const handleExit = useCallback(() => {
    router.push('/');
  }, [router]);

  // 언어 전환
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
    reset();
  }, [reset]);

  // 연습 화면 진입 시 자동 포커스
  useEffect(() => {
    if (viewMode === 'practice' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [viewMode, inputRef]);

  // === User Sentence Management ===
  const handleAddUserSentence = useCallback(() => {
    if (!newSentenceText.trim()) return;
    const newSentence = saveUserSentence({
      text: newSentenceText.trim(),
      category: 'custom',
      language,
      difficulty: 'medium',
      isUserCreated: true,
    });
    setUserSentences(prev => [...prev, newSentence]);
    setNewSentenceText('');
  }, [newSentenceText, language]);

  const handleUpdateUserSentence = useCallback((id: string) => {
    if (!editingText.trim()) return;
    updateUserSentence(id, editingText.trim());
    setUserSentences(prev =>
      prev.map(s => s.id === id ? { ...s, text: editingText.trim() } : s)
    );
    setEditingSentenceId(null);
    setEditingText('');
  }, [editingText]);

  const handleDeleteUserSentence = useCallback((id: string) => {
    deleteUserSentence(id);
    setUserSentences(prev => prev.filter(s => s.id !== id));
  }, []);

  // === AI Sentence Generation ===
  const handleGenerateAiSentences = useCallback(async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedSentences([]);

    try {
      const response = await fetch('/api/ai/generate-sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          language,
          count: 3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문장 생성에 실패했습니다');
      }

      if (data.sentences && data.sentences.length > 0) {
        setGeneratedSentences(data.sentences);
      } else {
        throw new Error('생성된 문장이 없습니다');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      alert(error instanceof Error ? error.message : '문장 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, language]);

  const handleSaveAiSentence = useCallback((text: string) => {
    const newSentence = saveAiSentence({
      text,
      category: 'ai',
      language,
      difficulty: 'medium',
      isAiGenerated: true,
    });
    setAiSentences(prev => [...prev, newSentence]);
    setGeneratedSentences(prev => prev.filter(s => s !== text));
  }, [language]);

  const handleDeleteAiSentence = useCallback((id: string) => {
    deleteAiSentence(id);
    setAiSentences(prev => prev.filter(s => s.id !== id));
  }, []);

  // === Render ===

  // 선택 화면
  if (viewMode === 'select') {
    const categorySentences = getSentencesByCategory(language, selectedCategory);

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
                <h1 className="text-xl font-bold">문장 연습</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글로 전환' : 'English'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full mb-4">
              {language === 'en' ? '🇺🇸 English' : '🇰🇷 한글'}
            </div>
            <h2 className="text-2xl font-bold mb-2">문장을 선택하세요</h2>
          </div>

          {/* 탭 버튼 */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={viewMode === 'select' ? 'primary' : 'outline'}
              onClick={() => setViewMode('select')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              샘플 문장
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('manage')}
            >
              <User className="w-4 h-4 mr-2" />
              내 문장
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('ai')}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI 생성
            </Button>
          </div>

          {/* 카테고리 선택 */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {sentenceCategories.filter(c => c.id !== 'custom' && c.id !== 'ai').map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.nameKo}
              </Button>
            ))}
          </div>

          {/* 문장 목록 */}
          <div className="space-y-3 mb-8">
            {categorySentences.map((sentence) => (
              <Card
                key={sentence.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStartPractice(sentence)}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg">{sentence.text}</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      난이도: {sentence.difficulty === 'easy' ? '쉬움' : sentence.difficulty === 'medium' ? '보통' : '어려움'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 랜덤 연습 버튼 */}
          <div className="text-center">
            <Button size="lg" onClick={handleRandomPractice}>
              <Play className="w-5 h-5 mr-2" />
              랜덤 문장으로 시작
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 내 문장 관리 화면
  if (viewMode === 'manage') {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setViewMode('select')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">내 문장 관리</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글' : 'EN'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* 탭 버튼 */}
          <div className="flex justify-center gap-2 mb-8">
            <Button variant="outline" onClick={() => setViewMode('select')}>
              <BookOpen className="w-4 h-4 mr-2" />
              샘플 문장
            </Button>
            <Button variant="primary">
              <User className="w-4 h-4 mr-2" />
              내 문장
            </Button>
            <Button variant="outline" onClick={() => setViewMode('ai')}>
              <Bot className="w-4 h-4 mr-2" />
              AI 생성
            </Button>
          </div>

          {/* 새 문장 추가 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">새 문장 추가</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSentenceText}
                  onChange={(e) => setNewSentenceText(e.target.value)}
                  placeholder={language === 'ko' ? '연습할 문장을 입력하세요...' : 'Enter a sentence to practice...'}
                  className="flex-1 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUserSentence()}
                />
                <Button onClick={handleAddUserSentence}>
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 저장된 문장 목록 */}
          <div className="space-y-3">
            {userSentences.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-[var(--color-text-muted)]">
                  저장된 문장이 없습니다. 위에서 새 문장을 추가해보세요!
                </CardContent>
              </Card>
            ) : (
              userSentences.map((sentence) => (
                <Card key={sentence.id}>
                  <CardContent className="py-4">
                    {editingSentenceId === sentence.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 p-2 border border-[var(--color-border)] rounded bg-[var(--color-surface)]"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleUpdateUserSentence(sentence.id)}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingSentenceId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p
                          className="flex-1 cursor-pointer hover:text-[var(--color-primary)]"
                          onClick={() => handleStartPractice(sentence)}
                        >
                          {sentence.text}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingSentenceId(sentence.id);
                              setEditingText(sentence.text);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUserSentence(sentence.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // AI 생성 화면
  if (viewMode === 'ai') {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setViewMode('select')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">AI 문장 생성</h1>
              </div>
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글' : 'EN'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* 탭 버튼 */}
          <div className="flex justify-center gap-2 mb-8">
            <Button variant="outline" onClick={() => setViewMode('select')}>
              <BookOpen className="w-4 h-4 mr-2" />
              샘플 문장
            </Button>
            <Button variant="outline" onClick={() => setViewMode('manage')}>
              <User className="w-4 h-4 mr-2" />
              내 문장
            </Button>
            <Button variant="primary">
              <Bot className="w-4 h-4 mr-2" />
              AI 생성
            </Button>
          </div>

          {/* AI 문장 생성 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                AI로 문장 생성
              </CardTitle>
              <CardDescription>
                원하는 주제를 입력하면 AI가 연습용 문장을 만들어 드립니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={language === 'ko' ? '주제를 입력하세요 (예: 여행, 음식, 학교...)' : 'Enter a topic (e.g., travel, food, school...)'}
                  className="flex-1 p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiSentences()}
                />
                <Button onClick={handleGenerateAiSentences} disabled={isGenerating}>
                  {isGenerating ? (
                    <>생성 중...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      생성
                    </>
                  )}
                </Button>
              </div>

              {/* 생성된 문장 */}
              {generatedSentences.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">생성된 문장:</p>
                  {generatedSentences.map((text, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <p>{text}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSaveAiSentence(text)}>
                          <Save className="w-4 h-4 mr-1" />
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStartPractice({
                            id: `temp-${Date.now()}`,
                            text,
                            category: 'ai',
                            language,
                            difficulty: 'medium',
                            isAiGenerated: true,
                          })}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          연습
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 저장된 AI 문장 */}
          <h3 className="text-lg font-semibold mb-4">저장된 AI 문장</h3>
          <div className="space-y-3">
            {aiSentences.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-[var(--color-text-muted)]">
                  저장된 AI 문장이 없습니다. 위에서 문장을 생성해보세요!
                </CardContent>
              </Card>
            ) : (
              aiSentences.map((sentence) => (
                <Card key={sentence.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <p
                      className="flex-1 cursor-pointer hover:text-[var(--color-primary)]"
                      onClick={() => handleStartPractice(sentence)}
                    >
                      {sentence.text}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartPractice(sentence)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAiSentence(sentence.id)}
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
              <Button variant="ghost" size="icon" onClick={handleBackToSelect}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{language === 'en' ? '🇺🇸' : '🇰🇷'}</span>
                  <h1 className="text-xl font-bold">문장 연습</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? '한글' : 'EN'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="w-4 h-4 mr-2" />
                종료
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 타이핑 영역 (클릭하면 포커스) */}
        <div onClick={() => inputRef.current?.focus()} className="cursor-text relative mb-6">
          <input
            ref={inputRef}
            type="text"
            value=""
            onChange={() => {}}
            className="absolute opacity-0 w-0 h-0"
            onKeyDown={handleKeyDown}
            aria-label="타이핑 입력"
            autoFocus
          />
          <TypingDisplay feedback={getCharacterFeedback()} />
          {!isStarted && (
            <p className="text-center mt-4 text-[var(--color-primary)] animate-pulse">
              {language === 'en' ? 'Click here and start typing' : '여기를 클릭하고 타이핑을 시작하세요'}
            </p>
          )}
        </div>

        {/* 메트릭 표시 */}
        <MetricsDisplay metrics={metrics} className="mb-6" />

        {/* 컨트롤 버튼 */}
        <div className="flex justify-center gap-4 mt-8">
          {!isComplete && isStarted && (
            <Button variant="outline" onClick={isPaused ? resume : pause}>
              {isPaused ? '계속' : '일시정지'}
            </Button>
          )}
          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 연습
          </Button>
          <Button variant="outline" onClick={handleBackToSelect}>
            문장 선택
          </Button>
        </div>

        {/* 완료 결과 */}
        {isComplete && (
          <Card className="mt-6 border-green-500 bg-green-50">
            <CardContent className="py-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                완료!
              </h3>
              <p className="text-green-600 mb-4">
                정확도 {metrics.accuracy}% | 속도 {metrics.wpm} WPM
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleRestart}>
                  다시 연습
                </Button>
                <Button onClick={handleNextSentence} className="bg-green-600 hover:bg-green-700">
                  다음 문장
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
