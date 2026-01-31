import { auth } from '@clerk/nextjs/server';

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

  const role = (sessionClaims?.metadata as { role?: string })?.role as AdminRole | undefined;

  if (role === 'admin' || role === 'super_admin') {
    return { isAdmin: true, role, userId };
  }

  return { isAdmin: false, role: null, userId };
}
