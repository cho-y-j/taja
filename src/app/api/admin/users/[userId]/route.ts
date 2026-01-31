import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { db, users, userCredits, userStats, subscriptions, creditTransactions, practiceSessions } from '@/lib/db';
import { eq, desc, and, gte } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // 관리자 권한 체크
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;

    // 사용자 기본 정보
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 크레딧 정보
    const credits = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId))
      .limit(1);

    // 통계 정보
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    // 구독 정보
    const now = new Date();
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active'),
          gte(subscriptions.currentPeriodEnd, now)
        )
      )
      .limit(1);

    // 최근 크레딧 거래 내역
    const recentTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(10);

    // 최근 연습 세션
    const recentSessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.completedAt))
      .limit(10);

    return NextResponse.json({
      user: {
        id: user[0].id,
        clerkId: user[0].clerkId,
        name: user[0].name || '',
        email: user[0].email || '',
        createdAt: user[0].createdAt?.toISOString() || '',
      },
      credits: credits[0] ? {
        balance: credits[0].balance,
        totalUsed: credits[0].totalUsed || 0,
        updatedAt: credits[0].updatedAt?.toISOString() || '',
      } : null,
      stats: stats[0] ? {
        totalSessions: stats[0].totalSessions || 0,
        totalTime: stats[0].totalTime || 0,
        avgWpm: stats[0].averageWpm || 0,
        avgAccuracy: stats[0].averageAccuracy || 0,
        bestWpm: 0, // Not stored in userStats
        bestAccuracy: 0, // Not stored in userStats
      } : null,
      subscription: subscription[0] ? {
        plan: subscription[0].plan,
        status: subscription[0].status,
        currentPeriodEnd: subscription[0].currentPeriodEnd?.toISOString() || '',
      } : null,
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        apiEndpoint: t.apiEndpoint || '',
        description: t.description || '',
        createdAt: t.createdAt?.toISOString() || '',
      })),
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        type: s.type,
        wpm: s.wpm || 0,
        accuracy: s.accuracy || 0,
        duration: s.duration || 0,
        createdAt: s.completedAt?.toISOString() || '',
      })),
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
