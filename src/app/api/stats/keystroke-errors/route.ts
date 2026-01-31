import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, users, keystrokeErrors, keyStatistics } from '@/lib/db';
import { eq, and, sql } from 'drizzle-orm';

interface KeystrokeErrorInput {
  targetKey: string;
  typedKey: string;
  position: number;
}

// POST: 키스트로크 에러 저장
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, errors } = await request.json() as {
      sessionId?: string;
      errors: KeystrokeErrorInput[];
    };

    if (!errors || !Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json({ error: 'No errors to save' }, { status: 400 });
    }

    // 사용자 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // 키스트로크 에러 일괄 저장
    await db.insert(keystrokeErrors).values(
      errors.map((e) => ({
        sessionId: sessionId || null,
        userId,
        targetKey: e.targetKey,
        typedKey: e.typedKey,
        position: e.position,
      }))
    );

    // 키별 통계 업데이트 (집계)
    const keyErrorCounts = new Map<string, number>();
    for (const e of errors) {
      const key = e.targetKey.toLowerCase();
      keyErrorCounts.set(key, (keyErrorCounts.get(key) || 0) + 1);
    }

    // 각 키에 대해 통계 업데이트
    for (const [key, errorCount] of keyErrorCounts) {
      const existing = await db
        .select()
        .from(keyStatistics)
        .where(and(eq(keyStatistics.userId, userId), eq(keyStatistics.key, key)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(keyStatistics)
          .set({
            errorCount: (existing[0].errorCount || 0) + errorCount,
            totalAttempts: (existing[0].totalAttempts || 0) + errorCount, // 에러만 카운트
            updatedAt: new Date(),
          })
          .where(eq(keyStatistics.id, existing[0].id));
      } else {
        await db.insert(keyStatistics).values({
          userId,
          key,
          errorCount,
          totalAttempts: errorCount,
        });
      }
    }

    return NextResponse.json({
      success: true,
      savedCount: errors.length,
    });
  } catch (error) {
    console.error('Save keystroke errors error:', error);
    return NextResponse.json({ error: 'Failed to save errors' }, { status: 500 });
  }
}
