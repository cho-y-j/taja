# TAJA Changelog

## 2026-01-31 - AI 크레딧 시스템 + 관리자 대시보드 + 상세 통계

### 관리자 이용 현황 차트 (e5c263c)
- **일일 활성 사용자**: 라인 차트로 DAU 추이 표시
- **AI 기능별 사용량**: 파이 차트 (번역/요약/문서생성 등)
- **신규 가입 추이**: 바 차트로 일별 가입자 수 표시
- **연습 유형별 분포**: 파이 차트 (홈로우/단어/문장 등)
- **평균 WPM/정확도**: 이중 Y축 라인 차트
- **일별 크레딧 사용량**: 바 차트
- 기간 선택: 7일/30일/90일

### 버그 수정 (e42c9f6)
- **크레딧 버튼 깜빡임 수정**: 페이지 이동 시 버튼이 깜빡이는 문제 해결
  - `useAuth()` 훅으로 안정적인 로그인 상태 확인
  - `lastFetched` 체크로 이미 데이터가 있으면 스켈레톤 미표시
- **미들웨어 위치 이동**: `middleware.ts` → `src/middleware.ts` (Clerk 요구사항)
- **관리자 API 보호 추가**: `/api/admin/*` 라우트에 관리자 권한 체크

### Phase 1: AI 크레딧 시스템

#### 데이터베이스 스키마 추가
- `user_credits` - 사용자 크레딧 잔액
- `credit_transactions` - 크레딧 거래 내역
- `subscriptions` - 구독 정보
- `payments` - 결제 내역
- `keystroke_errors` - 키스트로크 에러 기록
- `key_statistics` - 키별 통계
- `daily_stats` - 일별 통계

#### 크레딧 시스템 구현
- 신규 가입 시 200 크레딧 자동 지급
- AI API 호출 시 크레딧 체크 및 차감
- 구독자는 무제한 사용
- 토큰 추정: 한글 1.5토큰/글자, 영문 0.3토큰/글자
- 적용된 AI 라우트:
  - `/api/ai/translate`
  - `/api/ai/summarize`
  - `/api/ai/generate-document`
  - `/api/ai/extract-content`

#### UI 컴포넌트
- `CreditBalance` - 헤더에 크레딧 잔액 표시
- `UpgradeModal` - 크레딧 부족 시 업그레이드 안내
- `/pricing` - 요금제 페이지 (월 1,000원 구독 / 크레딧팩)

### Phase 2: 관리자 대시보드

#### 라우트 보호
- Clerk `publicMetadata.role` 기반 권한 체크
- `admin` 또는 `super_admin` 역할 필요

#### 관리자 페이지
- `/admin` - 대시보드 메인 (DAU, 총 사용자, 크레딧 사용량, 매출)
- `/admin/users` - 사용자 목록 (검색, 페이지네이션)
- `/admin/users/[userId]` - 사용자 상세 + 크레딧 수동 지급
- `/admin/analytics` - 이용 현황 (차트 준비 중)
- `/admin/payments` - 결제/구독 관리

#### 관리자 API
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/users/[userId]`
- `POST /api/admin/users/[userId]/credits`
- `GET /api/admin/analytics`
- `GET /api/admin/payments`

### Phase 3: 상세 사용자 통계

#### 키스트로크 에러 수집
- `typing-store.ts`에 `keystrokeErrors` 상태 추가
- 타이핑 중 에러 발생 시 targetKey, typedKey, position 기록

#### 통계 API
- `POST /api/stats/keystroke-errors` - 에러 저장 + 키별 집계
- `GET /api/stats/key-heatmap` - 키보드 히트맵 데이터
- `GET /api/stats/daily` - 일별 WPM/정확도 통계
- `GET /api/stats/progress` - 전체 진행 상황

#### 통계 컴포넌트
- `KeyboardHeatmap` - 에러율 기반 키보드 시각화
- `WeakKeysList` - 취약 키 TOP 5
- `ProgressChart` - WPM/정확도 추이 차트
- `PracticeBreakdown` - 연습 유형별 분포

#### 마이페이지 통계 UI 강화 (`/my/stats`)
- 3개 탭: 전체 현황 / 취약 키 분석 / 성장 추이
- 키보드 히트맵으로 취약 키 시각화
- 일별 성과 추이 차트

---

## 이전 업데이트

### 초기 버전
- Clerk 인증 연동
- Neon PostgreSQL + Drizzle ORM
- 기본 타자 연습 (홈로우, 단어, 문장)
- AI 문서 생성 (DeepSeek API)
- 듣고쓰기, 보고말하기 기능
