import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { prompt, language, count = 3 } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '주제를 입력해주세요' },
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

    const systemPrompt = language === 'ko'
      ? `당신은 한국어 타자 연습용 문장을 생성하는 도우미입니다.
사용자가 제시한 주제에 맞는 자연스러운 한국어 문장을 생성해주세요.
규칙:
- 각 문장은 15~40자 사이로 작성
- 문장은 완전한 문장이어야 함
- 타자 연습에 적합하도록 다양한 자음과 모음을 포함
- JSON 배열 형식으로 문장만 반환 (예: ["문장1", "문장2", "문장3"])`
      : `You are a helper that generates sentences for typing practice in English.
Generate natural English sentences based on the topic provided by the user.
Rules:
- Each sentence should be 10-60 characters
- Sentences must be complete and grammatically correct
- Include variety of letters for typing practice
- Return only a JSON array of sentences (e.g., ["Sentence 1", "Sentence 2", "Sentence 3"])`;

    const userPrompt = language === 'ko'
      ? `"${prompt}" 주제로 타자 연습용 문장 ${count}개를 생성해주세요.`
      : `Generate ${count} typing practice sentences about "${prompt}".`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: 'AI 서비스 오류가 발생했습니다' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON array from response
    let sentences: string[] = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        sentences = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines if not JSON
        sentences = content
          .split('\n')
          .map((s: string) => s.replace(/^\d+\.\s*/, '').trim())
          .filter((s: string) => s.length > 0)
          .slice(0, count);
      }
    } catch {
      // If parsing fails, try to extract sentences manually
      sentences = content
        .split('\n')
        .map((s: string) => s.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
        .filter((s: string) => s.length > 5)
        .slice(0, count);
    }

    return NextResponse.json({ sentences });
  } catch (error) {
    console.error('Error generating sentences:', error);
    return NextResponse.json(
      { error: '문장 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
