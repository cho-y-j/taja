import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, users, dailyStats, practiceSessions } from '@/lib/db';
import { eq, desc, gte, sql, and } from 'drizzle-orm';

// GET: 일별 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

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

    // 최근 N일간 일별 통계
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // 저장된 일별 통계 조회
    const savedStats = await db
      .select()
      .from(dailyStats)
      .where(
        and(
          eq(dailyStats.userId, userId),
          gte(dailyStats.date, startDateStr)
        )
      )
      .orderBy(desc(dailyStats.date));

    // 세션 데이터에서 일별 통계 직접 계산 (저장된 것이 없는 경우 대비)
    const sessionStats = await db
      .select({
        date: sql<string>`date(${practiceSessions.completedAt})`,
        sessionsCount: sql<number>`count(*)`,
        totalTime: sql<number>`coalesce(sum(${practiceSessions.duration}), 0)`,
        totalCharacters: sql<number>`coalesce(sum(${practiceSessions.charactersTyped}), 0)`,
        errorCount: sql<number>`coalesce(sum(${practiceSessions.errorsCount}), 0)`,
        avgWpm: sql<number>`coalesce(avg(${practiceSessions.wpm}), 0)`,
        avgAccuracy: sql<number>`coalesce(avg(${practiceSessions.accuracy}), 0)`,
      })
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.userId, userId),
          gte(practiceSessions.completedAt, startDate)
        )
      )
      .groupBy(sql`date(${practiceSessions.completedAt})`)
      .orderBy(desc(sql`date(${practiceSessions.completedAt})`));

    // 데이터 포맷팅
    const formattedStats = sessionStats.map((s) => ({
      date: s.date,
      sessionsCount: Number(s.sessionsCount),
      totalTime: Number(s.totalTime),
      totalCharacters: Number(s.totalCharacters),
      errorCount: Number(s.errorCount),
      avgWpm: Math.round(Number(s.avgWpm)),
      avgAccuracy: Math.round(Number(s.avgAccuracy) * 10) / 10,
    }));

    return NextResponse.json({
      stats: formattedStats,
      period: days,
    });
  } catch (error) {
    console.error('Get daily stats error:', error);
    return NextResponse.json({ error: 'Failed to get daily stats' }, { status: 500 });
  }
}
