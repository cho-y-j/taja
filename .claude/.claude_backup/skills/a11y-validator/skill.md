# a11y-validator Skill

## 목적
LIT-Type의 접근성(Accessibility)을 검증하여 시니어, 장애인 등 다양한 사용자가 불편 없이 사용할 수 있도록 한다.

## 준수 표준
- **WCAG 2.1 Level AA**
- 대한민국 웹 접근성 지침 (KWCAG 2.2)

## 접근성 체크리스트

### 1. 인식의 용이성 (Perceivable)

#### 1.1 대체 텍스트
```markdown
- [ ] 모든 이미지에 alt 속성 제공
- [ ] 장식용 이미지는 alt="" 또는 role="presentation"
- [ ] 복잡한 이미지는 상세 설명 제공
```

```typescript
// 좋은 예
<Image src="/keyboard.png" alt="한글 키보드 배열 가이드" />

// 장식용 이미지
<Image src="/decoration.png" alt="" role="presentation" />
```

#### 1.2 색상 대비
```markdown
- [ ] 텍스트/배경 대비 4.5:1 이상 (일반 텍스트)
- [ ] 큰 텍스트(18pt+) 대비 3:1 이상
- [ ] UI 컴포넌트 대비 3:1 이상
```

```typescript
// 테마별 색상 대비 검증
const juniorColors = {
  text: '#1f2937',        // 검정에 가까움
  background: '#fefce8',  // 밝은 크림
  // 대비율: 약 12:1 ✅
};

const seniorColors = {
  text: '#0f172a',        // 진한 검정
  background: '#f8fafc',  // 밝은 그레이
  // 대비율: 약 14:1 ✅
};
```

#### 1.3 색상에만 의존하지 않기
```markdown
- [ ] 오류/성공 표시에 아이콘 또는 텍스트 함께 사용
- [ ] 그래프/차트에 패턴 또는 라벨 추가
```

```typescript
// 색상 + 아이콘 + 텍스트 조합
<span className="text-red-500 flex items-center gap-1">
  <XIcon className="w-4 h-4" />
  <span>오류: 입력이 틀렸습니다</span>
</span>
```

### 2. 운용의 용이성 (Operable)

#### 2.1 키보드 접근성
```markdown
- [ ] 모든 기능 키보드로 접근 가능
- [ ] Tab 순서가 논리적
- [ ] 포커스 표시가 명확히 보임
- [ ] 키보드 트랩 없음 (모달 제외)
```

```typescript
// 포커스 스타일
.focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

// 커스텀 포커스 (Senior 테마)
[data-theme="senior"] *:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
}
```

#### 2.2 충분한 시간
```markdown
- [ ] 시간 제한 있는 기능에 연장/해제 옵션
- [ ] 자동 새로고침 제어 가능
- [ ] 타이핑 연습에 시간 제한 없는 모드 제공
```

#### 2.3 터치 타겟 크기
```markdown
- [ ] 터치 타겟 최소 44x44px (WCAG)
- [ ] Senior 테마: 48x48px 이상 권장
- [ ] 인접 타겟 간 충분한 간격
```

```typescript
// 버튼 최소 크기
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

[data-theme="senior"] .btn {
  min-height: 48px;
  min-width: 48px;
  padding: 16px 32px;
}
```

### 3. 이해의 용이성 (Understandable)

#### 3.1 언어 설정
```markdown
- [ ] html lang 속성 설정
- [ ] 언어 변경 부분에 lang 속성 적용
```

```typescript
// app/[locale]/layout.tsx
export default function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

#### 3.2 입력 도움
```markdown
- [ ] 폼 필드에 명확한 레이블
- [ ] 오류 메시지가 구체적
- [ ] 오류 수정 방법 안내
```

```typescript
// 접근성 있는 폼 예시
<div className="form-field">
  <label htmlFor="wpm-goal" className="block text-sm font-medium">
    목표 WPM
  </label>
  <input
    id="wpm-goal"
    type="number"
    aria-describedby="wpm-goal-hint wpm-goal-error"
    aria-invalid={!!error}
  />
  <p id="wpm-goal-hint" className="text-sm text-gray-500">
    분당 타수 목표를 입력하세요 (예: 200)
  </p>
  {error && (
    <p id="wpm-goal-error" className="text-sm text-red-500" role="alert">
      {error}
    </p>
  )}
</div>
```

### 4. 견고성 (Robust)

#### 4.1 유효한 HTML
```markdown
- [ ] HTML 문법 오류 없음
- [ ] 중복 ID 없음
- [ ] ARIA 속성 올바르게 사용
```

#### 4.2 스크린 리더 호환
```markdown
- [ ] 동적 콘텐츠에 aria-live 사용
- [ ] 모달에 적절한 ARIA 속성
- [ ] 커스텀 컴포넌트에 role 지정
```

```typescript
// 타이핑 결과 실시간 알림
<div aria-live="polite" aria-atomic="true" className="sr-only">
  현재 WPM: {wpm}, 정확도: {accuracy}%
</div>

// 모달 접근성
<dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">연습 결과</h2>
  <p id="modal-description">오늘의 연습 결과입니다.</p>
</dialog>
```

## 자동화 검증 도구

### axe-core (Playwright)
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('홈페이지 접근성', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test('타이핑 연습 페이지 접근성', async ({ page }) => {
  await page.goto('/practice/sentences');

  const results = await new AxeBuilder({ page })
    .include('.typing-area')
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### ESLint 플러그인
```json
// .eslintrc.json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}
```

### 수동 테스트 체크리스트
```markdown
## 스크린 리더 테스트
- [ ] VoiceOver (macOS/iOS) 테스트
- [ ] NVDA (Windows) 테스트
- [ ] 주요 플로우 음성으로 이해 가능

## 키보드 테스트
- [ ] Tab으로 모든 인터랙티브 요소 접근
- [ ] Enter/Space로 버튼/링크 활성화
- [ ] Escape로 모달/드롭다운 닫기
- [ ] 화살표 키로 메뉴/리스트 탐색

## 시각 테스트
- [ ] 200% 확대에서 레이아웃 유지
- [ ] 색맹 시뮬레이터로 확인
- [ ] 고대비 모드에서 확인
```

## 사용 Agent
- QA-Tester: 검증 실행
- Designer: 디자인 반영

## 체크리스트 요약
- [ ] 대체 텍스트 제공
- [ ] 색상 대비 충족
- [ ] 키보드 접근성
- [ ] 터치 타겟 크기
- [ ] 폼 접근성
- [ ] 스크린 리더 호환
- [ ] 자동화 테스트 통과
- [ ] 수동 테스트 완료
