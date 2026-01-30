import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users, userStats, practiceSessions } from '@/lib/db';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

// 사용자 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 사용자 ID 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자 통계 조회
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, user[0].id))
      .limit(1);

    // 최근 연습 세션 조회 (최근 30개)
    const recentSessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, user[0].id))
      .orderBy(desc(practiceSessions.completedAt))
      .limit(30);

    // 오늘 연습 세션
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.userId, user[0].id),
          gte(practiceSessions.completedAt, today)
        )
      );

    // 연습 유형별 통계
    const typeStats = await db
      .select({
        type: practiceSessions.type,
        count: sql<number>`count(*)`,
        avgWpm: sql<number>`avg(${practiceSessions.wpm})`,
        avgAccuracy: sql<number>`avg(${practiceSessions.accuracy})`,
      })
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, user[0].id))
      .groupBy(practiceSessions.type);

    return NextResponse.json({
      stats: stats[0] || null,
      recentSessions,
      todaySessions,
      typeStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}

// 연습 세션 저장
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, locale, wpm, accuracy, duration, charactersTyped, errorsCount, contentId } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    // 사용자 ID 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 연습 세션 저장
    const newSession = await db
      .insert(practiceSessions)
      .values({
        userId: user[0].id,
        type,
        locale: locale || 'ko',
        wpm,
        accuracy,
        duration,
        charactersTyped,
        errorsCount,
        contentId,
      })
      .returning();

    // 사용자 통계 업데이트
    const existingStats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, user[0].id))
      .limit(1);

    if (existingStats.length > 0) {
      const stats = existingStats[0];
      const newTotalSessions = (stats.totalSessions || 0) + 1;
      const newTotalTime = (stats.totalTime || 0) + (duration || 0);

      // 평균 WPM과 정확도 계산
      const newAvgWpm = stats.averageWpm
        ? (stats.averageWpm * (stats.totalSessions || 0) + (wpm || 0)) / newTotalSessions
        : wpm || 0;
      const newAvgAccuracy = stats.averageAccuracy
        ? (stats.averageAccuracy * (stats.totalSessions || 0) + (accuracy || 0)) / newTotalSessions
        : accuracy || 0;

      // 스트릭 계산
      const lastPractice = stats.lastPracticeAt;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = stats.currentStreak || 0;
      if (lastPractice) {
        const lastDate = new Date(lastPractice);
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate.getTime() === yesterday.getTime()) {
          // 어제 연습했으면 스트릭 증가
          newStreak += 1;
        } else if (lastDate.getTime() < yesterday.getTime()) {
          // 어제 이전에 연습했으면 스트릭 리셋
          newStreak = 1;
        }
        // 오늘 이미 연습했으면 스트릭 유지
      } else {
        newStreak = 1;
      }

      const longestStreak = Math.max(stats.longestStreak || 0, newStreak);

      await db
        .update(userStats)
        .set({
          totalSessions: newTotalSessions,
          totalTime: newTotalTime,
          averageWpm: newAvgWpm,
          averageAccuracy: newAvgAccuracy,
          currentStreak: newStreak,
          longestStreak,
          lastPracticeAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, user[0].id));
    } else {
      // 통계가 없으면 생성
      await db.insert(userStats).values({
        userId: user[0].id,
        totalSessions: 1,
        totalTime: duration || 0,
        averageWpm: wpm || 0,
        averageAccuracy: accuracy || 0,
        currentStreak: 1,
        longestStreak: 1,
        lastPracticeAt: new Date(),
      });
    }

    return NextResponse.json({ session: newSession[0] });
  } catch (error) {
    console.error('Save session error:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}
