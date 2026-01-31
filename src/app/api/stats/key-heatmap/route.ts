import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, users, keyStatistics } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET: 키보드 히트맵용 키별 통계 조회
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // 키별 통계 조회
    const stats = await db
      .select({
        key: keyStatistics.key,
        totalAttempts: keyStatistics.totalAttempts,
        errorCount: keyStatistics.errorCount,
      })
      .from(keyStatistics)
      .where(eq(keyStatistics.userId, userId))
      .orderBy(desc(keyStatistics.errorCount));

    // 에러율 계산
    const heatmapData = stats.map((s) => ({
      key: s.key,
      totalAttempts: s.totalAttempts || 0,
      errorCount: s.errorCount || 0,
      errorRate: s.totalAttempts && s.totalAttempts > 0
        ? Math.round((s.errorCount || 0) / s.totalAttempts * 100)
        : 0,
    }));

    // 가장 취약한 키 5개
    const weakKeys = heatmapData
      .filter((k) => k.errorCount > 0)
      .slice(0, 5);

    return NextResponse.json({
      heatmap: heatmapData,
      weakKeys,
      totalErrors: heatmapData.reduce((sum, k) => sum + k.errorCount, 0),
    });
  } catch (error) {
    console.error('Get key heatmap error:', error);
    return NextResponse.json({ error: 'Failed to get heatmap' }, { status: 500 });
  }
}
