import { NextResponse } from 'next/server';
import { db, users, practiceSessions, documents } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 테이블 카운트 조회
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const sessionCount = await db.select({ count: sql<number>`count(*)` }).from(practiceSessions);
    const docCount = await db.select({ count: sql<number>`count(*)` }).from(documents);

    return NextResponse.json({
      success: true,
      message: 'Neon DB 연결 성공!',
      tables: {
        users: Number(userCount[0].count),
        practiceSessions: Number(sessionCount[0].count),
        documents: Number(docCount[0].count),
      },
    });
  } catch (error) {
    console.error('DB 연결 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
