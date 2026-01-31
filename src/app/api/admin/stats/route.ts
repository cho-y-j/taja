import { NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { db, users, userCredits, creditTransactions, payments, practiceSessions } from '@/lib/db';
import { desc, sql, gte, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // 관리자 권한 체크
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 오늘 날짜 (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 전체 사용자 수
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(totalUsersResult[0]?.count || 0);

    // 오늘 활성 사용자 (오늘 연습 세션이 있는 사용자)
    const activeTodayResult = await db
      .select({ count: sql<number>`count(distinct ${practiceSessions.userId})` })
      .from(practiceSessions)
      .where(gte(practiceSessions.completedAt, today));
    const activeToday = Number(activeTodayResult[0]?.count || 0);

    // 총 크레딧 사용량
    const totalCreditsResult = await db
      .select({ total: sql<number>`coalesce(sum(${userCredits.totalUsed}), 0)` })
      .from(userCredits);
    const totalCreditsUsed = Number(totalCreditsResult[0]?.total || 0);

    // 총 매출 (결제 완료된 금액)
    const totalRevenueResult = await db
      .select({ total: sql<number>`coalesce(sum(${payments.amountKrw}), 0)` })
      .from(payments)
      .where(eq(payments.status, 'completed'));
    const totalRevenue = Number(totalRevenueResult[0]?.total || 0);

    // 최근 가입자 5명
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    // 최근 AI 사용 내역 5건
    const recentActivity = await db
      .select({
        id: creditTransactions.id,
        type: creditTransactions.type,
        apiEndpoint: creditTransactions.apiEndpoint,
        tokensUsed: creditTransactions.tokensUsed,
        createdAt: creditTransactions.createdAt,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.type, 'usage'))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(5);

    // 활동 내역 포맷팅
    const formattedActivity = recentActivity.map((a) => ({
      id: a.id,
      type: a.type,
      description: `${a.apiEndpoint?.replace('/api/ai/', '') || 'AI'} 사용 (${a.tokensUsed?.toLocaleString() || 0} 토큰)`,
      createdAt: a.createdAt?.toISOString() || '',
    }));

    return NextResponse.json({
      totalUsers,
      activeToday,
      totalCreditsUsed,
      totalRevenue,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name || '',
        email: u.email || '',
        createdAt: u.createdAt?.toISOString() || '',
      })),
      recentActivity: formattedActivity,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
