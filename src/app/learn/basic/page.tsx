'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Keyboard,
  Type,
  FileText,
  Headphones,
  Mic,
  Check,
  Lock,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';

interface PracticeNode {
  id: string;
  title: string;
  description: string;
  icon: typeof Keyboard;
  href: string;
  status: 'completed' | 'current' | 'available' | 'locked';
  color: string;
}

const practiceNodes: PracticeNode[] = [
  {
    id: 'home-row',
    title: '자리 익히기',
    description: '기본 손가락 위치를 익혀보세요',
    icon: Keyboard,
    href: '/practice/basics/home-row',
    status: 'available',
    color: 'var(--gradient-primary)',
  },
  {
    id: 'words',
    title: '단어 연습',
    description: '자주 사용하는 단어로 연습해요',
    icon: Type,
    href: '/practice/basics/words',
    status: 'available',
    color: 'var(--gradient-success)',
  },
  {
    id: 'sentences',
    title: '문장 연습',
    description: '다양한 문장을 타이핑해보세요',
    icon: FileText,
    href: '/practice/sentences',
    status: 'available',
    color: 'var(--color-accent)',
  },
  {
    id: 'listen-write',
    title: '듣고 쓰기',
    description: '들려주는 문장을 받아쓰기',
    icon: Headphones,
    href: '/practice/listen-write',
    status: 'available',
    color: 'var(--gradient-secondary)',
  },
  {
    id: 'speak',
    title: '보고 말하기',
    description: '화면의 문장을 읽어보세요',
    icon: Mic,
    href: '/practice/speak',
    status: 'available',
    color: 'var(--color-error)',
  },
];

export default function BasicPracticePage() {
  const router = useRouter();
  const { language } = useThemeStore();

  // 언어가 선택되지 않았다면 홈으로 리다이렉트
  useEffect(() => {
    if (!language) {
      router.push('/');
    }
  }, [language, router]);

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="spinner" />
      </div>
    );
  }

  // 전체 진행도 계산 (데모용으로 0%)
  const progress = 0;
  const completedCount = 0;
  const totalCount = practiceNodes.length;

  const languageLabel = language === 'ko' ? '한글' : '영문';

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            href="/learn"
            className="icon-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[var(--color-text)]">
              기본 연습 ({languageLabel})
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {completedCount} / {totalCount} 완료
            </p>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 전체 진행도 */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--color-text-muted)]">
              전체 진행도
            </span>
            <span className="text-sm font-bold text-[var(--color-primary)]">
              {progress}%
            </span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {/* 자유 모드 안내 */}
        <section className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card p-4 border-l-4 border-l-[var(--color-primary)]">
            <p className="text-sm text-[var(--color-text)]">
              모든 연습을 자유롭게 선택할 수 있어요!
            </p>
          </div>
        </section>

        {/* 학습 맵 */}
        <section className="space-y-4">
          {practiceNodes.map((node, index) => (
            <Link
              key={node.id}
              href={node.href}
              className="block animate-slide-up"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="card p-4 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4">
                  {/* 아이콘 */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                      node.status === 'completed'
                        ? 'map-node-completed'
                        : node.status === 'locked'
                        ? 'map-node-locked'
                        : 'map-node-available'
                    }`}
                    style={
                      node.status !== 'completed' && node.status !== 'locked'
                        ? { background: node.color }
                        : undefined
                    }
                  >
                    {node.status === 'completed' ? (
                      <Check className="w-7 h-7 text-white" />
                    ) : node.status === 'locked' ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <node.icon className="w-7 h-7 text-white" />
                    )}
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold mb-1 ${
                      node.status === 'locked'
                        ? 'text-[var(--color-text-light)]'
                        : 'text-[var(--color-text)]'
                    }`}>
                      {node.title}
                    </h3>
                    <p className={`text-sm ${
                      node.status === 'locked'
                        ? 'text-[var(--color-text-light)]'
                        : 'text-[var(--color-text-muted)]'
                    }`}>
                      {node.description}
                    </p>
                  </div>

                  {/* 상태 뱃지 */}
                  {node.status === 'completed' && (
                    <span className="badge badge-success">
                      완료
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
