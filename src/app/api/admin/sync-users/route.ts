import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, users, userStats, userCredits } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { checkAdmin } from '@/lib/admin/check-admin';

// POST: 모든 Clerk 사용자를 DB에 동기화 (관리자 전용)
export async function POST() {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ limit: 100 });

    let synced = 0;
    let skipped = 0;

    for (const clerkUser of clerkUsers.data) {
      // 이미 DB에 있는지 확인
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUser.id))
        .limit(1);

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      // 새 사용자 생성
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = clerkUser.firstName || email?.split('@')[0] || 'User';

      const newUser = await db
        .insert(users)
        .values({
          clerkId: clerkUser.id,
          email,
          name,
        })
        .returning();

      // 사용자 통계 초기화
      await db.insert(userStats).values({
        userId: newUser[0].id,
      });

      // 크레딧 초기화 (200 무료)
      await db.insert(userCredits).values({
        userId: newUser[0].id,
        balance: 200,
      });

      synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      total: clerkUsers.data.length,
    });
  } catch (error) {
    console.error('Sync users error:', error);
    return NextResponse.json({ error: 'Failed to sync users' }, { status: 500 });
  }
}
