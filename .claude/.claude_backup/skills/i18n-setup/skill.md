# i18n-setup Skill

## 목적
다국어 확장이 가능한 국제화(i18n) 시스템을 설정한다.

## 지원 언어
- **초기**: 한국어(ko), 영어(en), 일본어(ja)
- **확장 가능**: 추후 중국어, 스페인어 등 추가 용이

## 구현 방식

### 1. next-intl 설정
```typescript
// i18n/config.ts
export const locales = ['ko', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';
```

### 2. 메시지 파일 구조
```
messages/
├── ko/
│   ├── common.json      # 공통 UI
│   ├── practice.json    # 연습 관련
│   ├── dashboard.json   # 대시보드
│   └── settings.json    # 설정
├── en/
│   └── ...
└── ja/
    └── ...
```

### 3. 메시지 파일 예시
```json
// messages/ko/practice.json
{
  "title": "타자 연습",
  "homeRow": {
    "title": "홈로우 키 연습",
    "description": "기본 손가락 위치를 익혀보세요",
    "leftHand": "왼손: A S D F",
    "rightHand": "오른손: J K L ;",
    "startButton": "연습 시작"
  },
  "result": {
    "wpm": "분당 타수",
    "accuracy": "정확도",
    "time": "소요 시간"
  }
}
```

### 4. 컴포넌트에서 사용
```typescript
import { useTranslations } from 'next-intl';

export function PracticeResult() {
  const t = useTranslations('practice.result');

  return (
    <div>
      <p>{t('wpm')}: {wpm}</p>
      <p>{t('accuracy')}: {accuracy}%</p>
    </div>
  );
}
```

### 5. 타이핑 콘텐츠 다국어
```typescript
// 언어별 타이핑 콘텐츠 분리
interface TypingContent {
  locale: Locale;
  sentences: string[];
  words: string[];
  homeRowWords: string[]; // 홈로우 키로만 구성된 단어
}

// 예: 한국어 홈로우 단어
const koHomeRowWords = ['ㅁㄴㅇㄹ', 'ㅎㅗㅏ', ...];
// 예: 영어 홈로우 단어
const enHomeRowWords = ['sad', 'fall', 'ask', 'salad', ...];
```

## 사용 Agent
- Architect: 초기 설정
- Frontend-Dev: 적용

## 체크리스트
- [ ] next-intl 설치 및 설정
- [ ] 메시지 파일 구조 생성
- [ ] 공통 번역 키 정의
- [ ] 언어 전환 UI 구현
- [ ] 타이핑 콘텐츠 다국어 분리
