import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 구조화된 학습 문서 형식
interface LearningDocument {
  title: string;
  words: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
  sentences: Array<{
    original: string;
    translation: string;
  }>;
}

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

    // 영어 학습 문서 생성 (영어 단어/문장 + 한국어 번역)
    const systemPromptEn = `You are a language learning content creator.
Create a structured learning document with English words and sentences.

IMPORTANT: Return ONLY valid JSON, no other text.

JSON Format:
{
  "title": "Document title in Korean",
  "words": [
    { "word": "English word", "meaning": "Korean meaning", "example": "English example sentence" }
  ],
  "sentences": [
    { "original": "English sentence", "translation": "Korean translation" }
  ]
}

Rules:
- Create 10-15 words with meanings and example sentences
- Create 8-12 practice sentences with translations
- Words should be relevant to the topic
- Sentences should be natural and useful
- All meanings and translations must be in Korean
- Return ONLY the JSON object, nothing else`;

    // 한국어 학습 문서 생성 (한국어 단어/문장 + 영어 번역)
    const systemPromptKo = `당신은 한국어 학습 콘텐츠 제작자입니다.
한국어 단어와 문장으로 구성된 구조화된 학습 문서를 만들어주세요.

중요: 오직 유효한 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.

JSON 형식:
{
  "title": "문서 제목",
  "words": [
    { "word": "한국어 단어", "meaning": "영어 뜻", "example": "한국어 예문" }
  ],
  "sentences": [
    { "original": "한국어 문장", "translation": "English translation" }
  ]
}

규칙:
- 10-15개의 단어와 뜻, 예문을 생성
- 8-12개의 연습 문장과 번역을 생성
- 단어는 주제와 관련된 것으로
- 문장은 자연스럽고 실용적으로
- 뜻과 번역은 영어로
- JSON 객체만 반환, 다른 텍스트 없이`;

    const systemPrompt = language === 'en' ? systemPromptEn : systemPromptKo;
    const userPrompt = language === 'en'
      ? `Create a learning document about: "${prompt}"`
      : `다음 주제로 학습 문서를 만들어주세요: "${prompt}"`;

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
        max_tokens: 2500,
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

    // JSON 파싱 시도
    let doc: LearningDocument | null = null;
    try {
      // JSON 부분 추출
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        doc = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('JSON 파싱 실패:', e);
    }

    // 파싱 실패 시 기본 형식으로 변환
    if (!doc || !doc.words || !doc.sentences) {
      // Fallback: 기존 텍스트 형식으로 처리
      const lines = content.split('\n').filter((l: string) => l.trim());
      doc = {
        title: prompt.slice(0, 30),
        words: [],
        sentences: lines.slice(0, 10).map((line: string) => ({
          original: line.trim(),
          translation: '',
        })),
      };
    }

    // 기존 형식과 호환을 위해 content도 생성
    const textContent = [
      '## 단어',
      ...doc.words.map(w => `${w.word} - ${w.meaning}`),
      '',
      '## 문장',
      ...doc.sentences.map(s => s.original),
    ].join('\n');

    return NextResponse.json({
      title: doc.title,
      content: textContent,
      // 구조화된 데이터
      structured: {
        words: doc.words,
        sentences: doc.sentences,
      },
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: '문서 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
