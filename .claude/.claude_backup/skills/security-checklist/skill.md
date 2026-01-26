# security-checklist Skill

## 목적
LIT-Type 프로젝트의 보안 점검을 위한 체크리스트와 자동 검증 도구를 제공한다.

## 보안 체크리스트

### 1. 인증 및 인가 (Authentication & Authorization)

```markdown
## Clerk 설정 검토
- [ ] Clerk 대시보드에서 적절한 인증 방식 활성화
- [ ] 소셜 로그인 제공자 검토
- [ ] 세션 타임아웃 설정 확인
- [ ] JWT 토큰 만료 시간 적절성

## API Route 보호
- [ ] 모든 보호 API에 인증 미들웨어 적용
- [ ] 사용자별 데이터 접근 권한 확인
- [ ] 관리자 전용 기능 분리

## 검증 코드
```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/api/health'],
  ignoredRoutes: ['/api/webhook/clerk'],
});

// API Route 내부
import { auth } from '@clerk/nextjs';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ...
}
```
```

### 2. 입력 검증 (Input Validation)

```markdown
## Zod 스키마 검증
- [ ] 모든 API 입력에 Zod 검증 적용
- [ ] 문자열 최대 길이 제한
- [ ] 숫자 범위 제한
- [ ] 열거형 값 제한

## XSS 방지
- [ ] 사용자 입력 HTML 이스케이프
- [ ] dangerouslySetInnerHTML 사용 금지 또는 sanitize
- [ ] CSP 헤더 설정

## 검증 코드
```typescript
import { z } from 'zod';

const inputSchema = z.object({
  text: z.string().max(10000).trim(),
  type: z.enum(['sentence', 'word', 'paragraph']),
  count: z.number().int().min(1).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = inputSchema.safeParse(body);

  if (!validated.success) {
    return Response.json(
      { error: validated.error.flatten() },
      { status: 400 }
    );
  }
  // validated.data 사용
}
```
```

### 3. 데이터베이스 보안 (Database Security)

```markdown
## Row Level Security
- [ ] RLS 정책 활성화 및 테스트
- [ ] 사용자별 데이터 격리 확인
- [ ] RLS 우회 불가능 확인

## SQL Injection 방지
- [ ] Drizzle ORM 파라미터화 쿼리 사용
- [ ] Raw SQL 사용 시 바인딩 적용
- [ ] 동적 쿼리 구성 금지

## 검증 코드
```typescript
// 안전한 쿼리 (Drizzle)
const sessions = await db
  .select()
  .from(practiceSessions)
  .where(eq(practiceSessions.userId, userId));

// 위험한 패턴 (절대 금지)
// db.execute(`SELECT * FROM sessions WHERE user_id = '${userId}'`);
```
```

### 4. API 보안 (API Security)

```markdown
## Rate Limiting
- [ ] 인증 API 제한 (로그인 시도 등)
- [ ] AI 생성 API 제한
- [ ] 파일 업로드 API 제한

## CORS 설정
- [ ] 허용 도메인 명시적 설정
- [ ] 와일드카드(*) 사용 금지

## 검증 코드
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 분당 10회
});

// API Route
const { success } = await rateLimit.limit(userId);
if (!success) {
  return new Response('Too many requests', { status: 429 });
}
```
```

### 5. 파일 업로드 보안 (File Upload Security)

```markdown
## 파일 검증
- [ ] MIME 타입 검증 (서버 사이드)
- [ ] 파일 확장자 화이트리스트
- [ ] 파일 크기 제한
- [ ] 매직 바이트 검증

## 안전한 저장
- [ ] 서명된 URL 사용
- [ ] 직접 파일 접근 차단
- [ ] 악성 파일 스캔 (가능시)

## 검증 코드
```typescript
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }
  return true;
}
```
```

### 6. 환경 변수 보안 (Environment Security)

```markdown
## 키 관리
- [ ] 프로덕션 키와 개발 키 분리
- [ ] .env 파일 .gitignore 등록
- [ ] Vercel Environment Variables 사용
- [ ] 클라이언트 노출 키 NEXT_PUBLIC_ 접두사 확인

## 검증
- [ ] 빌드 시 환경 변수 노출 검사
- [ ] 클라이언트 번들에 비밀 키 미포함 확인
```

### 7. 보안 헤더 (Security Headers)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
];
```

## 자동화 검증

```bash
# 의존성 취약점 검사
npm audit

# ESLint 보안 규칙
npx eslint --ext .ts,.tsx src/ --rule 'no-eval: error'

# 환경 변수 노출 검사
grep -r "DEEPSEEK_API_KEY" --include="*.ts" --include="*.tsx" src/
```

## 사용 Agent
- Security-Auditor: 전 과정

## 체크리스트 요약
- [ ] 인증/인가 검토 완료
- [ ] 입력 검증 적용 완료
- [ ] DB 보안 검토 완료
- [ ] API 보안 적용 완료
- [ ] 파일 업로드 보안 완료
- [ ] 환경 변수 보안 완료
- [ ] 보안 헤더 설정 완료
- [ ] 자동화 검증 통과
