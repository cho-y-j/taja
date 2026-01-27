# LIT-Type 개발 문서

**최종 업데이트:** 2026-01-27
**프로젝트명:** LIT-Type (문해력을 키우는 타자 연습)
**GitHub:** https://github.com/cho-y-j/taja.git

---

## 1. 프로젝트 개요

### 1.1 목적
문해력(Literacy) 향상을 위한 다국어 타자 연습 웹 애플리케이션

### 1.2 대상 사용자
- 주니어 모드: 어린이, 학생
- 시니어 모드: 어르신 (큰 글씨, 느린 애니메이션)

### 1.3 지원 언어
- 한국어 (두벌식 자판)
- 영어 (QWERTY)
- 일본어 (예정)

---

## 2. 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js | 16.1.4 |
| 언어 | TypeScript | 5.x |
| 스타일 | Tailwind CSS | 4.x |
| 상태관리 | Zustand | 5.x |
| DB ORM | Drizzle | 0.44.x |
| DB | Neon PostgreSQL | (미연동) |
| 인증 | Clerk | (미연동) |
| AI | DeepSeek API | 연동 완료 |
| TTS/STT | Web Speech API | 브라우저 내장 |

---

## 3. 구현된 기능

### 3.1 홈로우/키보드 연습 (`/practice/basics/home-row`)
- **영문 자판**: Home Row → Top Row → Bottom Row → All
- **한글 자판**: 홈로우 → 윗줄 → 아랫줄 → 전체
- 5단계 레벨 시스템 (각 행별)
- 손가락 색상 가이드
- 실시간 WPM, CPM, 정확도 측정
- 언어 전환 버튼 (🇺🇸/🇰🇷)
- 백스페이스로 수정 가능

### 3.2 단어 연습 (`/practice/basics/words`)
- 5단계 난이도 (2~3글자 → 6글자+)
- 영어/한글 단어 세트 각각 준비
- 레벨별 목표 정확도 설정

### 3.3 문장 연습 (`/practice/sentences`)
**3가지 모드:**
1. **샘플 문장**: 4개 카테고리 (일상, 속담, 이야기, 뉴스)
2. **내 문장**: 사용자가 직접 입력/편집/저장/삭제 (localStorage)
3. **AI 생성**: DeepSeek API로 주제 기반 문장 생성 → 저장 가능

### 3.4 듣고 쓰기 (`/practice/listen-write`)
- Web Speech API (TTS) 사용
- 3단계 난이도:
  - 쉬움: 3번 재생, 힌트 표시
  - 보통: 2번 재생
  - 어려움: 1번 재생
- 다시 듣기 버튼
- 힌트 보기/숨기기

### 3.5 보고 말하기 (`/practice/speak`)
- Web Speech API (STT) 사용
- 음성 인식 → 텍스트 변환 → 정확도 계산
- 발음 듣기 버튼 (TTS)
- Chrome 브라우저 권장

### 3.6 문서 연습 (`/documents`)
- 텍스트 파일 업로드 (.txt, .md)
- 직접 텍스트 입력
- 문서 저장/삭제 (localStorage)
- 문단별 연습 (100자 단위 분리)
- 진행률 표시

---

## 4. 파일 구조

```
/Users/jojo/pro/taja/
├── .env                          # 환경변수 (DeepSeek API 키)
├── package.json
├── next.config.ts
├── drizzle.config.ts
├── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 홈페이지
│   │   ├── globals.css           # 전역 스타일 + CSS 변수
│   │   │
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── generate-sentences/
│   │   │           └── route.ts  # DeepSeek API 엔드포인트
│   │   │
│   │   ├── practice/
│   │   │   ├── basics/
│   │   │   │   ├── home-row/
│   │   │   │   │   └── page.tsx  # 키보드 연습
│   │   │   │   └── words/
│   │   │   │       └── page.tsx  # 단어 연습
│   │   │   │
│   │   │   ├── sentences/
│   │   │   │   └── page.tsx      # 문장 연습
│   │   │   │
│   │   │   ├── listen-write/
│   │   │   │   └── page.tsx      # 듣고 쓰기
│   │   │   │
│   │   │   └── speak/
│   │   │       └── page.tsx      # 보고 말하기
│   │   │
│   │   └── documents/
│   │       └── page.tsx          # 문서 연습
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx        # 버튼 컴포넌트
│   │   │   └── card.tsx          # 카드 컴포넌트
│   │   │
│   │   ├── typing/
│   │   │   ├── typing-display.tsx       # 타이핑 텍스트 표시
│   │   │   ├── metrics-display.tsx      # WPM/정확도 표시
│   │   │   ├── keyboard-guide.tsx       # 영문 키보드 가이드
│   │   │   └── korean-keyboard-guide.tsx # 한글 키보드 가이드
│   │   │
│   │   └── providers/
│   │       └── theme-provider.tsx # 테마 프로바이더
│   │
│   ├── hooks/
│   │   └── use-typing-engine.ts  # 타이핑 엔진 훅
│   │
│   ├── stores/
│   │   ├── typing-store.ts       # Zustand 타이핑 상태
│   │   └── theme-store.ts        # Zustand 테마 상태
│   │
│   ├── lib/
│   │   ├── typing/
│   │   │   ├── keyboard-practice.ts  # 영문 키보드 데이터
│   │   │   ├── korean-keyboard.ts    # 한글 키보드 데이터
│   │   │   ├── word-practice.ts      # 단어 데이터
│   │   │   ├── sentence-practice.ts  # 문장 데이터 + CRUD
│   │   │   └── home-row.ts           # (레거시)
│   │   │
│   │   ├── db/
│   │   │   ├── index.ts          # DB 연결 (미사용)
│   │   │   └── schema.ts         # Drizzle 스키마
│   │   │
│   │   └── utils/
│   │       └── cn.ts             # className 유틸
│   │
│   ├── types/
│   │   ├── typing.ts             # 타이핑 관련 타입
│   │   ├── theme.ts              # 테마 타입
│   │   └── speech.d.ts           # Web Speech API 타입
│   │
│   └── i18n/
│       ├── config.ts             # i18n 설정
│       └── messages/
│           ├── ko/common.json
│           ├── en/common.json
│           └── ja/common.json
│
└── .claude/                      # Claude 에이전트/스킬 정의
    └── .claude_backup/
        ├── agents/               # 8개 에이전트 정의
        └── skills/               # 10개 스킬 정의
```

---

## 5. 환경 변수 (.env)

```env
# DeepSeek AI (필수)
DEEPSEEK_API_KEY=sk-xxxxx

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Neon) - 추후 설정
# DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk Auth - 추후 설정
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
# CLERK_SECRET_KEY=sk_test_xxxxx
```

---

## 6. 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

**접속:** http://localhost:3000

---

## 7. 주요 컴포넌트 설명

### 7.1 typing-store.ts (상태 관리)
```typescript
// 주요 상태
- targetText: string      // 목표 텍스트
- currentIndex: number    // 현재 위치
- userInput: string       // 사용자 입력
- errors: number[]        // 오류 인덱스 배열
- isStarted: boolean      // 시작 여부
- isComplete: boolean     // 완료 여부
- metrics: TypingMetrics  // WPM, CPM, 정확도

// 주요 액션
- initSession()           // 세션 초기화
- startSession()          // 타이머 시작
- processInput(char)      // 입력 처리
- processBackspace()      // 백스페이스 처리
- updateElapsedTime()     // 시간 업데이트
- reset()                 // 리셋
```

### 7.2 한글 입력 처리
영문 QWERTY 키보드에서 한글 입력 시:
```typescript
// 영문 키 → 한글 매핑 (engToKorMap)
'a' → 'ㅁ', 's' → 'ㄴ', 'd' → 'ㅇ', 'f' → 'ㄹ', ...

// 입력 핸들러에서 변환
if (language === 'ko') {
  const koreanKey = engToKorMap[e.key.toLowerCase()];
  if (koreanKey) processInput(koreanKey);
}
```

### 7.3 DeepSeek API 연동
```typescript
// POST /api/ai/generate-sentences
{
  prompt: "여행",      // 주제
  language: "ko",      // 언어
  count: 3             // 생성할 문장 수
}

// 응답
{
  sentences: ["여행은 새로운 경험...", ...]
}
```

---

## 8. 데이터 저장 방식

| 데이터 | 저장 위치 | 키 |
|--------|----------|-----|
| 사용자 문장 | localStorage | `lit-type-user-sentences` |
| AI 생성 문장 | localStorage | `lit-type-ai-sentences` |
| 문서 | localStorage | `lit-type-documents` |
| 테마 설정 | Zustand persist | `lit-type-theme` |

---

## 9. 미구현/추후 작업

### 9.1 데이터베이스 연동
- [ ] Neon PostgreSQL 설정
- [ ] 사용자 데이터 서버 저장
- [ ] 연습 기록/통계 저장

### 9.2 인증 시스템
- [ ] Clerk 연동
- [ ] 사용자 프로필
- [ ] 로그인/회원가입

### 9.3 대시보드 (`/dashboard`)
- [ ] 연습 통계 그래프
- [ ] 일별/주별/월별 기록
- [ ] 레벨 진행 상황

### 9.4 추가 기능
- [ ] 일본어 자판 지원
- [ ] 게임 모드 (타임어택, 정확도 챌린지)
- [ ] 멀티플레이어 대전
- [ ] PWA 지원

---

## 10. 알려진 이슈

### 10.1 해결된 이슈
- ✅ 타이머가 타이핑할 때만 움직임 → 시작 후 계속 실행되도록 수정
- ✅ 키보드 입력 안됨 → input 필드 가시화 + autoFocus
- ✅ 전체 연습에 홈로우만 표시 → allKeys 배열 정의 순서 수정
- ✅ 백스페이스 안됨 → processBackspace() 함수 추가

### 10.2 미해결 이슈
- Web Speech API는 Chrome에서 가장 잘 작동 (Safari/Firefox 호환성 이슈)
- 한글 입력 시 실제 한글 조합 불가 (자음/모음 개별 입력)

---

## 11. 개발 일지

### 2026-01-27 (Day 1)

**오전:**
1. 프로젝트 초기 설정
   - Next.js 16 + TypeScript + Tailwind 설치
   - Zustand, Drizzle, next-intl 등 의존성 설치

2. 기본 구조 생성
   - DB 스키마 설계 (users, practice_sessions, documents 등)
   - i18n 설정 (ko/en/ja)
   - 테마 시스템 (Junior/Senior)

3. 타이핑 엔진 구현
   - typing-store.ts (Zustand)
   - use-typing-engine.ts (훅)
   - 실시간 메트릭 계산

**오후:**
4. 홈로우 키 연습 구현
   - 영문 키보드 가이드
   - 5단계 레벨 시스템
   - 손가락 색상 표시

5. 버그 수정
   - 타이머 연속 실행 수정
   - 키보드 포커스 수정
   - 전체 연습 키 수정

6. 한글 키보드 연습 추가
   - 두벌식 레이아웃
   - 영문→한글 키 매핑
   - 한글 키보드 가이드 컴포넌트

**저녁:**
7. 추가 연습 모드 구현
   - 단어 연습 (EN/KO, 5단계)
   - 문장 연습 (샘플/사용자/AI)
   - 듣고 쓰기 (TTS)
   - 보고 말하기 (STT)
   - 문서 연습 (파일 업로드)

8. DeepSeek API 연동
   - /api/ai/generate-sentences 엔드포인트
   - 주제 기반 문장 생성

9. 백스페이스 기능 추가
   - processBackspace() 함수
   - 모든 연습 페이지에 적용

10. GitHub 푸시
    - https://github.com/cho-y-j/taja.git

---

## 12. 다음 세션 시작 가이드

```bash
# 1. 프로젝트 폴더로 이동
cd /Users/jojo/pro/taja

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
open http://localhost:3000
```

**우선 작업 추천:**
1. Neon DB 연결 + 사용자 데이터 저장
2. Clerk 인증 연동
3. 대시보드 페이지 구현

---

## 13. 연락처

- **개발자:** Claude Opus 4.5 + Human
- **Repository:** https://github.com/cho-y-j/taja

---

*이 문서는 프로젝트의 전체 현황을 담고 있습니다. 새로운 작업 시 이 문서를 먼저 읽고 시작하세요.*
