# document-processor Skill

## 목적
사용자가 업로드하거나 작성한 문서를 타이핑 연습 콘텐츠로 변환한다. 전체 텍스트, 요약, 핵심 단어 추출 기능을 제공한다.

## 지원 파일 형식
- PDF (.pdf)
- 텍스트 (.txt)
- Word (.docx)
- 직접 입력 (텍스트 에디터)

## 처리 파이프라인

```
[파일 업로드] → [텍스트 추출] → [전처리] → [AI 분석] → [콘텐츠 생성]
```

### 1. 파일 업로드 및 검증

```typescript
// lib/documents/upload.ts
import { UTApi } from 'uploadthing/server';

const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadDocument(file: File, userId: string) {
  // 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }

  // UploadThing으로 업로드
  const utapi = new UTApi();
  const response = await utapi.uploadFiles(file);

  return {
    url: response.data?.url,
    key: response.data?.key,
  };
}
```

### 2. 텍스트 추출

```typescript
// lib/documents/extract.ts
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(fileUrl: string, fileType: string): Promise<string> {
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();

  switch (fileType) {
    case 'application/pdf':
      const pdfData = await pdf(Buffer.from(buffer));
      return pdfData.text;

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const docxResult = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      return docxResult.value;

    case 'text/plain':
      return new TextDecoder().decode(buffer);

    default:
      throw new Error('Unsupported file type');
  }
}
```

### 3. 텍스트 전처리

```typescript
// lib/documents/preprocess.ts
interface PreprocessedText {
  paragraphs: string[];    // 문단 단위
  sentences: string[];     // 문장 단위
  words: string[];         // 단어 단위
  totalCharacters: number;
  totalWords: number;
}

export function preprocessText(text: string, locale: string): PreprocessedText {
  // 정규화
  let normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // 문단 분리
  const paragraphs = normalized
    .split(/\n{2,}/)
    .filter(p => p.trim().length > 0);

  // 문장 분리 (언어별)
  const sentenceDelimiters = locale === 'ja'
    ? /[。！？]/
    : /[.!?]/;
  const sentences = normalized
    .split(sentenceDelimiters)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // 단어 분리
  const words = normalized
    .split(/\s+/)
    .filter(w => w.length > 0);

  return {
    paragraphs,
    sentences,
    words,
    totalCharacters: normalized.length,
    totalWords: words.length,
  };
}
```

### 4. AI 분석 (DeepSeek 연동)

```typescript
// lib/documents/analyze.ts
interface DocumentAnalysis {
  summary: string;           // AI 요약
  keySentences: string[];    // 핵심 문장 (5-10개)
  vocabulary: VocabularyItem[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;     // 예상 연습 시간 (분)
}

interface VocabularyItem {
  word: string;
  frequency: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function analyzeDocument(
  text: string,
  locale: string
): Promise<DocumentAnalysis> {
  // DeepSeek API 호출
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ text, locale }),
  });

  return response.json();
}
```

### 5. 타이핑 콘텐츠 생성

```typescript
// lib/documents/content.ts
interface TypingContent {
  id: string;
  documentId: string;
  type: 'full' | 'summary' | 'sentences' | 'vocabulary';
  content: string[];
  metadata: {
    totalCharacters: number;
    estimatedMinutes: number;
    difficulty: string;
  };
}

export function generateTypingContent(
  document: PreprocessedText,
  analysis: DocumentAnalysis
): TypingContent[] {
  return [
    // 전체 텍스트 (문단별)
    {
      type: 'full',
      content: document.paragraphs,
      // ...
    },
    // 요약본
    {
      type: 'summary',
      content: [analysis.summary],
      // ...
    },
    // 핵심 문장
    {
      type: 'sentences',
      content: analysis.keySentences,
      // ...
    },
    // 단어 연습
    {
      type: 'vocabulary',
      content: analysis.vocabulary.map(v => v.word),
      // ...
    },
  ];
}
```

## API 엔드포인트

```
POST /api/documents/upload
  - 파일 업로드 및 저장

POST /api/documents/process
  - 텍스트 추출 및 분석

GET /api/documents/:id
  - 문서 정보 조회

GET /api/documents/:id/content
  - 타이핑 콘텐츠 조회

DELETE /api/documents/:id
  - 문서 삭제
```

## 사용 Agent
- Backend-Dev: 파일 처리
- AI-Integrator: 분석

## 체크리스트
- [ ] 파일 업로드 구현 (UploadThing)
- [ ] 텍스트 추출 (PDF, DOCX, TXT)
- [ ] 텍스트 전처리
- [ ] AI 분석 연동
- [ ] 콘텐츠 생성 로직
- [ ] API 엔드포인트 구현
