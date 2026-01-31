import { auth, clerkClient } from '@clerk/nextjs/server';

export type AdminRole = 'admin' | 'super_admin';

export interface AdminCheckResult {
  isAdmin: boolean;
  role: AdminRole | null;
  userId: string | null;
}

/**
 * API 라우트에서 관리자 권한 체크
 */
export async function checkAdmin(): Promise<AdminCheckResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { isAdmin: false, role: null, userId: null };
  }

  // sessionClaims에서 먼저 확인
  const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as Record<string, unknown> | undefined;
  let role = (metadata?.role || publicMetadata?.role) as AdminRole | undefined;

  // sessionClaims에 없으면 Clerk API로 직접 확인
  if (!role) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = user.publicMetadata?.role as AdminRole | undefined;
    } catch (error) {
      console.error('Failed to fetch user metadata:', error);
    }
  }

  if (role === 'admin' || role === 'super_admin') {
    return { isAdmin: true, role, userId };
  }

  return { isAdmin: false, role: null, userId };
}
