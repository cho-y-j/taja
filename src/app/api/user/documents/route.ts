import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db, users, documents } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// 사용자 문서 목록 조회
export async function GET() {
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
      return NextResponse.json({ documents: [] });
    }

    // 문서 목록 조회
    const userDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, user[0].id))
      .orderBy(desc(documents.createdAt));

    return NextResponse.json({ documents: userDocuments });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Failed to get documents' },
      { status: 500 }
    );
  }
}

// 새 문서 생성
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, originalText, summary, locale } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
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

    // 문서 생성
    const newDocument = await db
      .insert(documents)
      .values({
        userId: user[0].id,
        title,
        originalText,
        summary,
        locale: locale || 'ko',
      })
      .returning();

    return NextResponse.json({ document: newDocument[0] });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

// 문서 수정
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, originalText, summary } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
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

    // 문서가 해당 사용자의 것인지 확인
    const existingDoc = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (existingDoc.length === 0 || existingDoc[0].userId !== user[0].id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 문서 수정
    const updatedDocument = await db
      .update(documents)
      .set({
        title: title ?? existingDoc[0].title,
        originalText: originalText ?? existingDoc[0].originalText,
        summary: summary ?? existingDoc[0].summary,
      })
      .where(eq(documents.id, id))
      .returning();

    return NextResponse.json({ document: updatedDocument[0] });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// 문서 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
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

    // 문서가 해당 사용자의 것인지 확인
    const existingDoc = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (existingDoc.length === 0 || existingDoc[0].userId !== user[0].id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 문서 삭제
    await db.delete(documents).where(eq(documents.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
