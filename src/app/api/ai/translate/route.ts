import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { text, from = 'en', to = 'ko' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '번역할 텍스트를 입력해주세요' },
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

    const fromName = from === 'ko' ? '한국어' : 'English';
    const toName = to === 'ko' ? '한국어' : 'English';

    const systemPrompt = `You are a professional translator.
Translate the given text from ${fromName} to ${toName}.
Rules:
- Translate naturally, preserving the original meaning
- Keep sentence structure clear
- Return ONLY the translated text, nothing else
- Do not add explanations or notes`;

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
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: '번역 서비스 오류가 발생했습니다' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Error translating:', error);
    return NextResponse.json(
      { error: '번역 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
