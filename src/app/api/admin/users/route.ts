import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { db, users, userCredits, userStats, subscriptions } from '@/lib/db';
import { desc, sql, like, or, eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 체크
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // all, subscribers, active

    const offset = (page - 1) * limit;

    // 기본 쿼리 조건
    let whereConditions = [];

    // 검색 조건
    if (search) {
      whereConditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    // 사용자 목록 조회 (크레딧 정보와 함께)
    const userList = await db
      .select({
        id: users.id,
        clerkId: users.clerkId,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        creditBalance: userCredits.balance,
        totalUsed: userCredits.totalUsed,
        totalSessions: userStats.totalSessions,
        avgWpm: userStats.averageWpm,
        avgAccuracy: userStats.averageAccuracy,
      })
      .from(users)
      .leftJoin(userCredits, eq(users.id, userCredits.userId))
      .leftJoin(userStats, eq(users.id, userStats.userId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // 총 개수
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
    const total = Number(totalResult[0]?.count || 0);

    // 구독자 ID 목록 조회
    const now = new Date();
    const activeSubscriptions = await db
      .select({ userId: subscriptions.userId })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'active'),
          gte(subscriptions.currentPeriodEnd, now)
        )
      );
    const subscriberIds = new Set(activeSubscriptions.map((s) => s.userId));

    // 결과 포맷팅
    const formattedUsers = userList.map((u) => ({
      id: u.id,
      clerkId: u.clerkId,
      name: u.name || '',
      email: u.email || '',
      createdAt: u.createdAt?.toISOString() || '',
      creditBalance: u.creditBalance || 0,
      totalUsed: u.totalUsed || 0,
      totalSessions: u.totalSessions || 0,
      avgWpm: u.avgWpm || 0,
      avgAccuracy: u.avgAccuracy || 0,
      hasSubscription: subscriberIds.has(u.id),
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
