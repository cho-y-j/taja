import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'TAJA - 문해력을 키우는 타자 연습',
  description: '문해력 향상을 위한 다국어 타자 연습 서비스. 홈로우 키부터 문서 타이핑까지, 듣고쓰기와 보고말하기 기능 제공.',
  keywords: ['타자 연습', '타이핑', '문해력', 'typing practice', 'literacy'],
};

// Clerk가 설정되어 있는지 확인
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('여기에');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );

  // Clerk가 설정되지 않았으면 ClerkProvider 없이 렌더링
  if (!isClerkConfigured) {
    return content;
  }

  return (
    <ClerkProvider localization={koKR}>
      {content}
    </ClerkProvider>
  );
}
