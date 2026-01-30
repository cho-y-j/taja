import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Clerk 설정 여부 확인
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && !key.includes('여기에') && key.startsWith('pk_');
};

// 공개 라우트 (로그인 없이 접근 가능)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/learn',
  '/learn/basic',
  '/learn/ai',
  '/practice/(.*)',
  '/api/ai/(.*)',
  '/api/db-test',
  '/api/documents/(.*)',
]);

export default function middleware(req: NextRequest) {
  // Clerk가 설정되지 않은 경우 미들웨어 스킵
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  // Clerk 미들웨어 실행
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })(req, {} as any);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
