import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 공개 라우트 (로그인 없이 접근 가능)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/learn',
  '/learn/basic',
  '/learn/ai',
  '/practice/(.*)',
  '/pricing',
  '/api/ai/(.*)',
  '/api/db-test',
  '/api/documents/(.*)',
]);

// 관리자 전용 라우트
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 관리자 라우트 체크
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    // 로그인 필수
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // 관리자 권한 체크 (Clerk Dashboard에서 publicMetadata.role = 'admin' 설정)
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin' && role !== 'super_admin') {
      // 권한 없음 - 홈으로 리다이렉트
      return NextResponse.redirect(new URL('/learn', req.url));
    }
  }

  // 일반 보호 라우트
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
