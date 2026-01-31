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

// AI로 구조화된 단어장과 문장 생성
async function generateVocabAndSentences(
  content: string,
  language: 'ko' | 'en',
  sourceType: string,
  customInstruction?: string
): Promise<{ title: string; content: string; structured: { words: LearningDocument['words']; sentences: LearningDocument['sentences'] } }> {

  // 영어 콘텐츠에서 추출 (영어 단어/문장 + 한국어 번역)
  const systemPromptEn = `You are an English language learning content extractor for Korean speakers.
Extract English words and sentences from the given text.

${customInstruction ? `User instruction: ${customInstruction}\n` : ''}

CRITICAL RULES:
- "word" field must contain ONLY the English word (e.g., "apple", "beautiful")
- "word" field must NEVER contain Korean characters or translations mixed in
- "meaning" field contains the Korean meaning/definition
- "example" field must be an English sentence from the text using the word
- "original" field in sentences must be ONLY in English
- "translation" field contains the Korean translation

IMPORTANT: Return ONLY valid JSON, no other text.

JSON Format:
{
  "title": "문서 제목 (한국어로)",
  "words": [
    { "word": "English word ONLY", "meaning": "한국어 뜻", "example": "English example from text" }
  ],
  "sentences": [
    { "original": "English sentence ONLY", "translation": "한국어 번역" }
  ]
}

Example of CORRECT word entry:
{ "word": "innovation", "meaning": "혁신, 혁신적인 것", "example": "The innovation changed everything." }

Example of WRONG word entry (DO NOT DO THIS):
{ "word": "innovation (혁신)", "meaning": "혁신적인 것", "example": "..." }

Rules:
- Extract 10-15 important English words with Korean meanings
- Extract 8-12 useful English sentences with Korean translations
- Words must be ONLY in English, meanings ONLY in Korean
- Keep sentences concise (under 100 characters)
- Return ONLY the JSON object`;

  // 한국어 콘텐츠에서 추출 (한국어 단어/문장 + 영어 번역)
  const systemPromptKo = `당신은 학습 콘텐츠 추출 전문가입니다.
주어진 텍스트에서 단어와 문장을 추출하여 구조화된 학습 문서를 만들어주세요.

${customInstruction ? `사용자 지시사항: ${customInstruction}\n` : ''}

중요: 오직 유효한 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요.

JSON 형식:
{
  "title": "문서 제목",
  "words": [
    { "word": "텍스트에서 추출한 한국어 단어", "meaning": "English meaning", "example": "텍스트에서 추출한 예문" }
  ],
  "sentences": [
    { "original": "텍스트에서 추출한 한국어 문장", "translation": "English translation" }
  ]
}

규칙:
- 10-15개의 중요 단어와 뜻, 예문 추출
- 8-12개의 유용한 문장과 번역 추출
- 뜻과 번역은 영어로
- 문장은 100자 이내로 간결하게
- JSON 객체만 반환`;

  const systemPrompt = language === 'en' ? systemPromptEn : systemPromptKo;
  const userPrompt = `다음 ${sourceType}에서 추출한 텍스트입니다:\n\n${content.slice(0, 8000)}`;

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
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    throw new Error('AI 생성 실패');
  }

  const data = await response.json();
  const generatedContent = data.choices[0]?.message?.content || '';

  // JSON 파싱 시도
  let doc: LearningDocument | null = null;
  try {
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      doc = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('JSON 파싱 실패:', e);
  }

  // 파싱 실패 시 기본 형식
  if (!doc || !doc.words || !doc.sentences) {
    const lines = generatedContent.split('\n').filter((l: string) => l.trim());
    doc = {
      title: sourceType === '유튜브 영상' ? '유튜브 단어장' : '웹페이지 단어장',
      words: [],
      sentences: lines.slice(0, 10).map((line: string) => ({
        original: line.trim(),
        translation: '',
      })),
    };
  }

  // 텍스트 형식도 생성 (호환용)
  const textContent = [
    '## 단어',
    ...doc.words.map(w => `${w.word} - ${w.meaning}`),
    '',
    '## 문장',
    ...doc.sentences.map(s => s.original),
  ].join('\n');

  return {
    title: doc.title,
    content: textContent,
    structured: {
      words: doc.words,
      sentences: doc.sentences,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url, language = 'ko', instruction, content: directContent } = await request.json();

    // URL도 없고 직접 콘텐츠도 없으면 에러
    if (!url && !directContent) {
      return NextResponse.json({ error: 'URL 또는 콘텐츠가 필요합니다' }, { status: 400 });
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았습니다' }, { status: 500 });
    }

    let content: string;
    let sourceType: string;

    // 직접 콘텐츠가 제공된 경우 (파일 업로드 등)
    if (directContent) {
      content = directContent.slice(0, 10000);
      sourceType = '업로드 파일';
    } else {
      // YouTube URL인지 확인
      const youtubeId = extractYoutubeId(url);

      if (youtubeId) {
        content = await fetchYoutubeTranscript(youtubeId);
        sourceType = '유튜브 영상';
      } else {
        content = await fetchWebContent(url);
        sourceType = '웹페이지';
      }
    }

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: '콘텐츠를 충분히 추출하지 못했습니다' },
        { status: 400 }
      );
    }

    // AI로 단어장과 문장 생성 (커스텀 지시사항 전달)
    const result = await generateVocabAndSentences(content, language, sourceType, instruction);

    return NextResponse.json({
      title: result.title,
      content: result.content,
      structured: result.structured,
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
