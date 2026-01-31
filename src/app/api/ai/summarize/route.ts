import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { checkAndDeductCredits, estimateTokens } from '@/lib/credits';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { content, language = 'ko' } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: '요약할 내용을 입력해주세요' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다' },
        { status: 500 }
      );
    }

    // 로그인된 사용자인 경우 크레딧 체크
    const { userId: clerkId } = await auth();

    if (clerkId) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

      if (user.length > 0) {
        const tokens = estimateTokens(content);
        const creditCheck = await checkAndDeductCredits(
          user[0].id,
          tokens,
          '/api/ai/summarize'
        );

        if (!creditCheck.allowed) {
          return NextResponse.json(
            {
              error: 'CREDITS_DEPLETED',
              message: '크레딧이 부족합니다. 충전하거나 구독해주세요.',
              balance: creditCheck.balance,
            },
            { status: 402 }
          );
        }
      }
    }

    const systemPrompt =
      language === 'ko'
        ? `당신은 한국어 문서를 요약하는 도우미입니다.
주어진 문서를 2~4문장으로 간결하게 요약해주세요.
규칙:
- 핵심 내용만 포함
- 완전한 문장으로 작성
- 타자 연습에 적합한 길이 (50~200자)
- 요약 텍스트만 반환 (설명 없이)`
        : `You are a document summarization helper.
Summarize the given document in 2-4 sentences.
Rules:
- Include only key points
- Write complete sentences
- Suitable length for typing practice (50-200 characters)
- Return ONLY the summary text, no explanations`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: content },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: '요약 서비스 오류가 발생했습니다' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing:', error);
    return NextResponse.json(
      { error: '요약 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
