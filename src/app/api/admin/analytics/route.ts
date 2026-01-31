import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { db, users, practiceSessions, creditTransactions } from '@/lib/db';
import { desc, sql, gte, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 체크
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d';

    // 기간 계산
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 일별 활성 사용자 (연습 세션 기준)
    const dailyActiveUsers = await db
      .select({
        date: sql<string>`date(${practiceSessions.completedAt})`,
        count: sql<number>`count(distinct ${practiceSessions.userId})`,
      })
      .from(practiceSessions)
      .where(gte(practiceSessions.completedAt, startDate))
      .groupBy(sql`date(${practiceSessions.completedAt})`)
      .orderBy(sql`date(${practiceSessions.completedAt})`);

    // AI 기능별 사용량
    const aiUsageByType = await db
      .select({
        type: creditTransactions.apiEndpoint,
        count: sql<number>`count(*)`,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.type, 'usage'))
      .groupBy(creditTransactions.apiEndpoint)
      .orderBy(desc(sql`count(*)`));

    // 일별 신규 가입
    const signupsPerDay = await db
      .select({
        date: sql<string>`date(${users.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(gte(users.createdAt, startDate))
      .groupBy(sql`date(${users.createdAt})`)
      .orderBy(sql`date(${users.createdAt})`);

    // 연습 유형별 분포
    const practiceByType = await db
      .select({
        type: practiceSessions.type,
        count: sql<number>`count(*)`,
      })
      .from(practiceSessions)
      .where(gte(practiceSessions.completedAt, startDate))
      .groupBy(practiceSessions.type)
      .orderBy(desc(sql`count(*)`));

    // 일별 평균 WPM/정확도
    const dailyPerformance = await db
      .select({
        date: sql<string>`date(${practiceSessions.completedAt})`,
        avgWpm: sql<number>`avg(${practiceSessions.wpm})`,
        avgAccuracy: sql<number>`avg(${practiceSessions.accuracy})`,
      })
      .from(practiceSessions)
      .where(gte(practiceSessions.completedAt, startDate))
      .groupBy(sql`date(${practiceSessions.completedAt})`)
      .orderBy(sql`date(${practiceSessions.completedAt})`);

    // 일별 크레딧 사용량
    const dailyCreditUsage = await db
      .select({
        date: sql<string>`date(${creditTransactions.createdAt})`,
        total: sql<number>`sum(abs(${creditTransactions.amount}))`,
      })
      .from(creditTransactions)
      .where(sql`${creditTransactions.type} = 'usage' AND ${creditTransactions.createdAt} >= ${startDate}`)
      .groupBy(sql`date(${creditTransactions.createdAt})`)
      .orderBy(sql`date(${creditTransactions.createdAt})`);

    return NextResponse.json({
      dailyActiveUsers: dailyActiveUsers.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      aiUsageByType: aiUsageByType.map((a) => ({
        type: a.type?.replace('/api/ai/', '') || 'unknown',
        count: Number(a.count),
      })),
      signupsPerDay: signupsPerDay.map((s) => ({
        date: s.date,
        count: Number(s.count),
      })),
      practiceByType: practiceByType.map((p) => ({
        type: p.type || 'unknown',
        count: Number(p.count),
      })),
      dailyPerformance: dailyPerformance.map((d) => ({
        date: d.date,
        avgWpm: Math.round(Number(d.avgWpm) || 0),
        avgAccuracy: Math.round(Number(d.avgAccuracy) || 0),
      })),
      dailyCreditUsage: dailyCreditUsage.map((c) => ({
        date: c.date,
        total: Number(c.total) || 0,
      })),
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
