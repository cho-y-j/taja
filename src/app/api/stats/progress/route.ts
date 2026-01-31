import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, users, userStats, practiceSessions, keyStatistics } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';

// GET: 전체 진행 상황 및 통계 요약
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

    // 사용자 전체 통계
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    // 최근 10개 세션
    const recentSessions = await db
      .select({
        id: practiceSessions.id,
        type: practiceSessions.type,
        wpm: practiceSessions.wpm,
        accuracy: practiceSessions.accuracy,
        duration: practiceSessions.duration,
        completedAt: practiceSessions.completedAt,
      })
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.completedAt))
      .limit(10);

    // 연습 유형별 통계
    const typeStats = await db
      .select({
        type: practiceSessions.type,
        count: sql<number>`count(*)`,
        avgWpm: sql<number>`coalesce(avg(${practiceSessions.wpm}), 0)`,
        avgAccuracy: sql<number>`coalesce(avg(${practiceSessions.accuracy}), 0)`,
      })
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .groupBy(practiceSessions.type);

    // 취약 키 Top 5
    const weakKeys = await db
      .select({
        key: keyStatistics.key,
        errorCount: keyStatistics.errorCount,
        totalAttempts: keyStatistics.totalAttempts,
      })
      .from(keyStatistics)
      .where(eq(keyStatistics.userId, userId))
      .orderBy(desc(keyStatistics.errorCount))
      .limit(5);

    return NextResponse.json({
      summary: stats[0] ? {
        totalSessions: stats[0].totalSessions || 0,
        totalTime: stats[0].totalTime || 0,
        averageWpm: Math.round(stats[0].averageWpm || 0),
        averageAccuracy: Math.round((stats[0].averageAccuracy || 0) * 10) / 10,
        currentStreak: stats[0].currentStreak || 0,
        longestStreak: stats[0].longestStreak || 0,
        lastPracticeAt: stats[0].lastPracticeAt?.toISOString() || null,
      } : null,
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        type: s.type,
        wpm: s.wpm || 0,
        accuracy: s.accuracy || 0,
        duration: s.duration || 0,
        completedAt: s.completedAt?.toISOString() || '',
      })),
      typeStats: typeStats.map((t) => ({
        type: t.type,
        count: Number(t.count),
        avgWpm: Math.round(Number(t.avgWpm)),
        avgAccuracy: Math.round(Number(t.avgAccuracy) * 10) / 10,
      })),
      weakKeys: weakKeys.map((k) => ({
        key: k.key,
        errorCount: k.errorCount || 0,
        totalAttempts: k.totalAttempts || 0,
        errorRate: k.totalAttempts && k.totalAttempts > 0
          ? Math.round((k.errorCount || 0) / k.totalAttempts * 100)
          : 0,
      })),
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}
