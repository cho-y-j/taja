import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'LIT-Type - 문해력을 키우는 타자 연습',
  description: '문해력 향상을 위한 다국어 타자 연습 서비스. 홈로우 키부터 문서 타이핑까지, 듣고쓰기와 보고말하기 기능 제공.',
  keywords: ['타자 연습', '타이핑', '문해력', 'typing practice', 'literacy'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
