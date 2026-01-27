import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { prompt, language = 'ko' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트를 입력해주세요' },
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

    const systemPrompt =
      language === 'ko'
        ? `당신은 한국어 타자 연습용 문서를 생성하는 도우미입니다.
사용자의 요청에 맞는 자연스러운 한국어 텍스트를 생성해주세요.
규칙:
- 반드시 한국어로만 작성하세요. 영어 단어를 절대 포함하지 마세요.
- 문서는 여러 문장으로 구성
- 각 문장은 완전한 문장이어야 함
- 타자 연습에 적합한 다양한 표현 사용
- 마크다운 포맷 없이 순수 텍스트만 반환
- 200~500자 분량
- 제목도 함께 만들어주세요
- 번역이나 해석을 절대 포함하지 마세요

응답 형식 (JSON):
{"title": "제목", "content": "본문 내용"}`
        : `You are a helper that generates documents for English typing practice.
Generate natural English text based on the user's request.
Rules:
- You MUST write ONLY in English. Do NOT include any Korean, Chinese, Japanese or other non-English text.
- Do NOT include translations or explanations in any other language.
- Document should contain multiple sentences
- Each sentence must be complete and grammatically correct
- Use varied vocabulary suitable for typing practice
- Return plain text only, no markdown formatting
- 200-500 characters
- Include a title

Response format (JSON):
{"title": "Title here", "content": "Body content here"}`;

    const userPrompt =
      language === 'ko'
        ? `다음 요청에 맞는 타자 연습용 문서를 한국어로만 만들어주세요 (영어 포함 금지): "${prompt}"`
        : `Create a typing practice document in English ONLY (no other languages): "${prompt}"`;

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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
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

    // Try to parse JSON response
    let title = '';
    let body = '';
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        title = parsed.title || '';
        body = parsed.content || '';
      }
    } catch {
      // Fallback: use raw content
    }

    if (!body) {
      // Fallback: use entire response as body
      body = content
        .replace(/^```[\s\S]*?```$/gm, '')
        .replace(/\{[\s\S]*?\}/g, '')
        .trim();
      if (!body) body = content;
    }

    if (!title) {
      title = prompt.slice(0, 30);
    }

    return NextResponse.json({ title, content: body.trim() });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: '문서 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
