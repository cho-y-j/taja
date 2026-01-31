import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db, users, userStats, userCredits } from '@/lib/db';
import { eq } from 'drizzle-orm';

// 사용자 동기화 - 로그인 시 호출하여 DB에 사용자 생성/조회
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 기존 사용자 조회
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length > 0) {
      // 기존 사용자 반환
      return NextResponse.json({
        user: existingUser[0],
        isNew: false,
      });
    }

    // 새 사용자 생성
    const newUser = await db
      .insert(users)
      .values({
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0],
      })
      .returning();

    // 사용자 통계 초기화
    await db.insert(userStats).values({
      userId: newUser[0].id,
    });

    // 신규 가입자 크레딧 초기화 (200 무료 크레딧)
    await db.insert(userCredits).values({
      userId: newUser[0].id,
      balance: 200,
    });

    return NextResponse.json({
      user: newUser[0],
      isNew: true,
      credits: 200,
    });
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

// 현재 사용자 정보 조회
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자 통계도 함께 조회
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, existingUser[0].id))
      .limit(1);

    return NextResponse.json({
      user: existingUser[0],
      stats: stats[0] || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
