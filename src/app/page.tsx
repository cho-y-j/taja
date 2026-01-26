'use client';

import Link from 'next/link';
import { Keyboard, BookOpen, Headphones, Mic, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/stores/theme-store';

const practiceOptions = [
  {
    title: '홈로우 키 연습',
    description: '기본 손가락 위치를 익혀보세요',
    icon: Keyboard,
    href: '/practice/basics/home-row',
    color: 'bg-blue-500',
  },
  {
    title: '기본 단어 연습',
    description: '자주 사용하는 단어로 연습해요',
    icon: BookOpen,
    href: '/practice/basics/words',
    color: 'bg-green-500',
  },
  {
    title: '문장 연습',
    description: '다양한 문장을 타이핑해보세요',
    icon: FileText,
    href: '/practice/sentences',
    color: 'bg-purple-500',
  },
  {
    title: '듣고 쓰기',
    description: '들려주는 문장을 받아쓰기',
    icon: Headphones,
    href: '/practice/listen-write',
    color: 'bg-orange-500',
  },
  {
    title: '보고 말하기',
    description: '화면의 문장을 읽어보세요',
    icon: Mic,
    href: '/practice/speak',
    color: 'bg-pink-500',
  },
  {
    title: '문서 연습',
    description: '내 문서로 타자 연습하기',
    icon: FileText,
    href: '/documents',
    color: 'bg-teal-500',
  },
];

export default function HomePage() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-[var(--color-text)]">LIT-Type</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMode}
            >
              {mode === 'junior' ? '시니어 모드' : '주니어 모드'}로 전환
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                대시보드
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            문해력을 키우는
            <br />
            <span className="text-[var(--color-primary)]">타자 연습</span>
          </h2>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            홈로우 키부터 시작해서 문장, 듣고쓰기, 보고말하기까지.
            <br />
            재미있게 타자 실력을 키워보세요!
          </p>
        </section>

        {/* 연습 옵션 그리드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {practiceOptions.map((option) => (
            <Link key={option.href} href={option.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="mb-2">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {/* 빠른 시작 */}
        <section className="text-center mt-16">
          <p className="text-[var(--color-text-muted)] mb-4">처음이신가요?</p>
          <Link href="/practice/basics/home-row">
            <Button size="lg" className="text-lg px-8">
              홈로우 키부터 시작하기
            </Button>
          </Link>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-[var(--color-border)] py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-[var(--color-text-muted)]">
          <p>&copy; 2024 LIT-Type. 문해력을 키우는 타자 연습.</p>
        </div>
      </footer>
    </div>
  );
}
