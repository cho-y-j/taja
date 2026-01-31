import { NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { db, users, subscriptions, payments } from '@/lib/db';
import { desc, eq, and, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // 관리자 권한 체크
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 활성 구독 목록
    const now = new Date();
    const activeSubscriptions = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        userName: users.name,
        userEmail: users.email,
        plan: subscriptions.plan,
        status: subscriptions.status,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(
        and(
          eq(subscriptions.status, 'active'),
          gte(subscriptions.currentPeriodEnd, now)
        )
      )
      .orderBy(desc(subscriptions.currentPeriodEnd));

    // 최근 결제 내역
    const recentPayments = await db
      .select({
        id: payments.id,
        userId: payments.userId,
        userName: users.name,
        userEmail: users.email,
        type: payments.type,
        amountKrw: payments.amountKrw,
        status: payments.status,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .orderBy(desc(payments.createdAt))
      .limit(50);

    return NextResponse.json({
      subscriptions: activeSubscriptions.map((s) => ({
        id: s.id,
        userId: s.userId,
        userName: s.userName || '',
        userEmail: s.userEmail || '',
        plan: s.plan,
        status: s.status,
        currentPeriodEnd: s.currentPeriodEnd?.toISOString() || '',
      })),
      payments: recentPayments.map((p) => ({
        id: p.id,
        userId: p.userId,
        userName: p.userName || '',
        userEmail: p.userEmail || '',
        type: p.type,
        amountKrw: p.amountKrw,
        status: p.status,
        createdAt: p.createdAt?.toISOString() || '',
      })),
    });
  } catch (error) {
    console.error('Admin payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
