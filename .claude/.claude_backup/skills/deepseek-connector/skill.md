# deepseek-connector Skill

## 목적
DeepSeek API를 안전하게 연동하여 AI 기반 문장 생성, 문서 요약, 텍스트 분석 기능을 제공한다.

## 보안 원칙
- API 키는 **서버 사이드 전용** (클라이언트 노출 금지)
- 환경 변수로 관리 (Vercel Environment Variables)
- Rate Limiting 적용

## API 클라이언트 구현

```typescript
// lib/ai/deepseek-client.ts
import { z } from 'zod';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function callDeepSeek(request: DeepSeekRequest): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: request.model || 'deepseek-chat',
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0].message.content;
}
```

## 문장 생성 기능

```typescript
// lib/ai/generate-sentences.ts
const generateSentencesSchema = z.object({
  locale: z.enum(['ko', 'en', 'ja']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topic: z.string().optional(),
  count: z.number().min(1).max(20).default(5),
});

type GenerateSentencesInput = z.infer<typeof generateSentencesSchema>;

const systemPrompts: Record<string, string> = {
  ko: `당신은 한국어 타자 연습용 문장을 생성하는 전문가입니다.
요청에 따라 자연스럽고 실용적인 문장을 생성하세요.
- 문법적으로 정확해야 합니다
- 일상에서 실제로 사용하는 표현이어야 합니다
- 난이도에 맞는 어휘를 선택하세요

응답은 JSON 배열 형식으로만 제공하세요: ["문장1", "문장2", ...]`,

  en: `You are an expert at generating English typing practice sentences.
Generate natural, practical sentences based on the request.
- Must be grammatically correct
- Use expressions commonly used in daily life
- Choose vocabulary appropriate for the difficulty level

Respond only in JSON array format: ["sentence1", "sentence2", ...]`,

  ja: `あなたは日本語タイピング練習用の文章を生成する専門家です。
リクエストに従って自然で実用的な文章を生成してください。
- 文法的に正確であること
- 日常で実際に使う表現であること
- 難易度に合った語彙を選ぶこと

JSON配列形式でのみ回答してください: ["文章1", "文章2", ...]`,
};

const difficultyPrompts: Record<string, Record<string, string>> = {
  ko: {
    easy: '짧고 간단한 문장 (10자 이내, 기본 어휘)',
    medium: '일반적인 길이의 문장 (20자 내외, 일상 어휘)',
    hard: '긴 복문 (30자 이상, 다양한 어휘)',
  },
  en: {
    easy: 'Short simple sentences (under 50 characters, basic vocabulary)',
    medium: 'Medium length sentences (around 100 characters, common vocabulary)',
    hard: 'Long complex sentences (over 150 characters, varied vocabulary)',
  },
  ja: {
    easy: '短くて簡単な文章（20文字以内、基本語彙）',
    medium: '一般的な長さの文章（40文字程度、日常語彙）',
    hard: '長い複文（60文字以上、多様な語彙）',
  },
};

export async function generateSentences(input: GenerateSentencesInput): Promise<string[]> {
  const validated = generateSentencesSchema.parse(input);

  const userPrompt = `
난이도: ${difficultyPrompts[validated.locale][validated.difficulty]}
${validated.topic ? `주제: ${validated.topic}` : '주제: 일상생활'}
개수: ${validated.count}개
`;

  const content = await callDeepSeek({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompts[validated.locale] },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
  });

  // JSON 파싱
  const sentences = JSON.parse(content);
  return sentences;
}
```

## 문서 요약 기능

```typescript
// lib/ai/summarize-document.ts
export async function summarizeDocument(
  text: string,
  locale: string
): Promise<{
  summary: string;
  keySentences: string[];
}> {
  const systemPrompt = `You are an expert at summarizing documents for typing practice.
Given a document, provide:
1. A concise summary (2-3 sentences)
2. 5-10 key sentences that are good for typing practice

Respond in JSON format:
{
  "summary": "...",
  "keySentences": ["...", "..."]
}`;

  const content = await callDeepSeek({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Language: ${locale}\n\nDocument:\n${text.slice(0, 10000)}` },
    ],
    temperature: 0.5,
  });

  return JSON.parse(content);
}
```

## 텍스트 분석 기능

```typescript
// lib/ai/analyze-text.ts
export async function analyzeText(text: string): Promise<{
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  wordCount: number;
  avgSentenceLength: number;
}> {
  // AI 분석 또는 규칙 기반 분석
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?。！？]/);

  const avgLength = words.length / sentences.length;

  let difficulty: 'easy' | 'medium' | 'hard';
  if (avgLength < 10) difficulty = 'easy';
  else if (avgLength < 20) difficulty = 'medium';
  else difficulty = 'hard';

  return {
    difficulty,
    topics: [], // AI로 추출 가능
    wordCount: words.length,
    avgSentenceLength: Math.round(avgLength),
  };
}
```

## API Routes

```typescript
// app/api/ai/generate/route.ts
import { auth } from '@clerk/nextjs';
import { generateSentences } from '@/lib/ai/generate-sentences';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Rate Limiting
  const { success } = await rateLimit.limit(userId);
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  const body = await request.json();
  const sentences = await generateSentences(body);

  return Response.json({ sentences });
}
```

## 에러 처리 및 폴백

```typescript
// API 실패 시 로컬 콘텐츠 제공
export async function getSentences(params: GenerateSentencesInput): Promise<string[]> {
  try {
    return await generateSentences(params);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    // 폴백: 미리 저장된 문장 반환
    return getLocalSentences(params);
  }
}
```

## 사용 Agent
- AI-Integrator: 구현

## 체크리스트
- [ ] API 클라이언트 구현
- [ ] 문장 생성 기능
- [ ] 문서 요약 기능
- [ ] 텍스트 분석 기능
- [ ] Rate Limiting
- [ ] 에러 처리 및 폴백
- [ ] 캐싱 전략
