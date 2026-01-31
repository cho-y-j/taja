import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { addCredits, getUserCredits } from '@/lib/credits';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

// POST: 크레딧 지급
export async function POST(
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
    const { amount, reason } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: '올바른 크레딧 수량을 입력해주세요' },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 크레딧 지급
    await addCredits(
      userId,
      amount,
      'bonus',
      reason || `관리자 지급 (by ${adminCheck.userId})`
    );

    // 업데이트된 잔액 조회
    const updatedCredits = await getUserCredits(userId);

    return NextResponse.json({
      success: true,
      message: `${amount} 크레딧이 지급되었습니다`,
      newBalance: updatedCredits?.balance || 0,
    });
  } catch (error) {
    console.error('Admin credit grant error:', error);
    return NextResponse.json(
      { error: 'Failed to grant credits' },
      { status: 500 }
    );
  }
}
