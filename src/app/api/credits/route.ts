import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, users, userCredits, creditTransactions, subscriptions } from '@/lib/db';
import { eq, and, gte, desc } from 'drizzle-orm';

// GET: 현재 크레딧 잔액 및 구독 상태 조회
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

    // 크레딧 잔액 조회
    let credits = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId))
      .limit(1);

    // 크레딧 레코드가 없으면 생성 (기존 사용자 호환)
    if (credits.length === 0) {
      await db.insert(userCredits).values({
        userId,
        balance: 200,
      });
      credits = await db
        .select()
        .from(userCredits)
        .where(eq(userCredits.userId, userId))
        .limit(1);
    }

    // 활성 구독 확인
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

    // 최근 크레딧 사용 내역 (최근 10개)
    const recentTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(10);

    return NextResponse.json({
      balance: credits[0]?.balance || 0,
      totalUsed: credits[0]?.totalUsed || 0,
      hasSubscription: subscription.length > 0,
      subscription: subscription[0] || null,
      recentTransactions,
    });
  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json({ error: 'Failed to get credits' }, { status: 500 });
  }
}
