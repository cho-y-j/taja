import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// YouTube URL에서 video ID 추출
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 웹페이지에서 텍스트 추출
async function fetchWebContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error('웹페이지를 불러올 수 없습니다');
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // 불필요한 요소 제거
  $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();

  // 본문 텍스트 추출
  const text = $('article, main, .content, .post, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 10000); // 최대 10000자
}

// YouTube 자막 추출
async function fetchYoutubeTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ').slice(0, 10000);
  } catch (error) {
    throw new Error('유튜브 자막을 불러올 수 없습니다. 자막이 없는 영상일 수 있습니다.');
  }
}

// AI로 단어장과 문장 생성
async function generateVocabAndSentences(
  content: string,
  language: 'ko' | 'en',
  sourceType: string
): Promise<{ title: string; content: string }> {
  const systemPrompt = language === 'ko'
    ? `당신은 한국어 학습 콘텐츠를 만드는 전문가입니다.
주어진 텍스트에서 중요한 단어와 문장을 추출하여 타자 연습용 학습 자료를 만들어주세요.

다음 형식으로 작성해주세요:
1. 먼저 "## 주요 단어" 섹션에 중요 단어 10-20개를 나열 (한 줄에 하나씩)
2. 그 다음 "## 핵심 문장" 섹션에 핵심 문장 10-15개를 나열 (한 줄에 하나씩)

단어와 문장은 원본 텍스트에서 직접 추출하세요.
타자 연습에 적합하도록 너무 긴 문장은 피해주세요.`
    : `You are an expert at creating English learning content.
Extract important words and sentences from the given text to create typing practice material.

Format your response as follows:
1. First, list 10-20 important words under "## Key Words" (one per line)
2. Then, list 10-15 key sentences under "## Key Sentences" (one per line)

Extract words and sentences directly from the original text.
Avoid overly long sentences to make them suitable for typing practice.`;

  const userPrompt = `다음 ${sourceType}에서 추출한 텍스트입니다. 단어장과 핵심 문장을 만들어주세요:\n\n${content}`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error('AI 생성 실패');
  }

  const data = await response.json();
  const generatedContent = data.choices[0]?.message?.content || '';

  return {
    title: sourceType === '유튜브 영상' ? '유튜브 단어장' : '웹페이지 단어장',
    content: generatedContent,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url, language = 'ko' } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL이 필요합니다' }, { status: 400 });
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았습니다' }, { status: 500 });
    }

    let content: string;
    let sourceType: string;

    // YouTube URL인지 확인
    const youtubeId = extractYoutubeId(url);

    if (youtubeId) {
      content = await fetchYoutubeTranscript(youtubeId);
      sourceType = '유튜브 영상';
    } else {
      content = await fetchWebContent(url);
      sourceType = '웹페이지';
    }

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: '콘텐츠를 충분히 추출하지 못했습니다' },
        { status: 400 }
      );
    }

    // AI로 단어장과 문장 생성
    const result = await generateVocabAndSentences(content, language, sourceType);

    return NextResponse.json({
      title: result.title,
      content: result.content,
      sourceType,
      originalLength: content.length,
    });
  } catch (error) {
    console.error('Extract content error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '콘텐츠 추출 실패' },
      { status: 500 }
    );
  }
}
