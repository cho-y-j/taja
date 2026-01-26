# typing-basics Skill

## 목적
타자의 기본을 학습하는 기능을 구현한다. 홈로우 키 위치 익히기, 손가락 배치, 기본 단어 연습 등 타자 입문자를 위한 기초 학습 기능.

## 학습 단계

### 1단계: 손가락 위치 익히기

```typescript
// 홈로우 키 정의
const homeRowKeys = {
  ko: {
    left: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ'],  // 왼손
    right: ['ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'], // 오른손
    thumb: [' '],                    // 스페이스
  },
  en: {
    left: ['a', 's', 'd', 'f'],
    right: ['j', 'k', 'l', ';'],
    thumb: [' '],
  },
  ja: {
    left: ['ち', 'と', 'し', 'は'],
    right: ['ま', 'の', 'り', 'れ'],
    thumb: [' '],
  },
};

// 손가락 매핑
const fingerMapping = {
  leftPinky: 0,   // a, ㅁ
  leftRing: 1,    // s, ㄴ
  leftMiddle: 2,  // d, ㅇ
  leftIndex: 3,   // f, ㄹ
  rightIndex: 4,  // j, ㅎ
  rightMiddle: 5, // k, ㅗ
  rightRing: 6,   // l, ㅏ
  rightPinky: 7,  // ;, ㅣ
};
```

### 2단계: 개별 키 연습

```typescript
interface KeyPractice {
  level: number;
  keys: string[];
  repetitions: number;
  targetAccuracy: number;
}

const keyPracticeLevels: KeyPractice[] = [
  // Level 1: 검지 연습 (f, j)
  { level: 1, keys: ['f', 'j'], repetitions: 20, targetAccuracy: 90 },
  // Level 2: 중지 추가 (d, k)
  { level: 2, keys: ['f', 'j', 'd', 'k'], repetitions: 30, targetAccuracy: 90 },
  // Level 3: 약지 추가 (s, l)
  { level: 3, keys: ['f', 'j', 'd', 'k', 's', 'l'], repetitions: 40, targetAccuracy: 85 },
  // Level 4: 새끼 추가 (a, ;)
  { level: 4, keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], repetitions: 50, targetAccuracy: 85 },
  // Level 5: 스페이스 포함
  { level: 5, keys: ['a', 's', 'd', 'f', ' ', 'j', 'k', 'l', ';'], repetitions: 50, targetAccuracy: 85 },
];
```

### 3단계: 조합 연습

```typescript
// 홈로우 키 조합 연습
const homeRowCombinations = {
  en: [
    'ff jj',
    'dd kk',
    'ss ll',
    'aa ;;',
    'asdf jkl;',
    'fdsa ;lkj',
    'fj dk sl a;',
  ],
  ko: [
    'ㅁㄴㅇㄹ',
    'ㅎㅗㅏㅣ',
    'ㅁㄴㅇㄹㅎㅗㅏㅣ',
  ],
};
```

### 4단계: 기본 단어 연습

```typescript
// 홈로우 키로만 구성된 단어
const homeRowWords = {
  en: {
    easy: ['as', 'ad', 'sad', 'dad', 'lad', 'fad', 'all'],
    medium: ['fall', 'salad', 'flask', 'shall', 'slash'],
    hard: ['alfalfa', 'alaska', 'dallas'],
  },
  ko: {
    easy: ['아', '오', '이', '하'],
    medium: ['나라', '하나', '아이'],
    hard: ['이리오라', '하나하나'],
  },
};

// 확장된 기본 단어 (홈로우 + 인접 키)
const basicWords = {
  en: {
    easy: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all'],
    medium: ['that', 'with', 'have', 'this', 'will', 'from', 'they'],
    hard: ['about', 'would', 'there', 'their', 'which', 'could'],
  },
  ko: {
    easy: ['나', '너', '우리', '그것', '이것'],
    medium: ['안녕', '감사', '사랑', '행복'],
    hard: ['대한민국', '타자연습', '컴퓨터'],
  },
};
```

## UI 컴포넌트

### 키보드 가이드 컴포넌트
```typescript
interface KeyboardGuideProps {
  highlightKeys: string[];
  showFingers: boolean;
  showHands: boolean;
  locale: 'ko' | 'en' | 'ja';
}

// 손가락 위치를 시각적으로 표시
// - 현재 눌러야 할 키 하이라이트
// - 올바른 손가락 표시
// - 손 위치 가이드
```

### 진행률 표시
```typescript
interface ProgressProps {
  currentLevel: number;
  totalLevels: number;
  accuracy: number;
  targetAccuracy: number;
  isUnlocked: boolean;
}
```

## 학습 흐름

```
1. 환영 화면
   ↓
2. 손가락 위치 가이드 (애니메이션)
   ↓
3. Level 1: f, j 키 연습
   ↓ (90% 정확도 달성)
4. Level 2: d, k 키 추가
   ↓ (90% 정확도 달성)
   ... 반복 ...
   ↓
5. 조합 연습
   ↓ (85% 정확도 달성)
6. 기본 단어 연습
   ↓
7. 축하 & 다음 단계 안내
```

## 사용 Agent
- Frontend-Dev: 구현
- Designer: UI/UX

## 체크리스트
- [ ] 홈로우 키 정의 (다국어)
- [ ] 손가락 매핑 로직
- [ ] 단계별 연습 레벨 구현
- [ ] 키보드 가이드 UI
- [ ] 진행률 추적
- [ ] 레벨 언락 시스템
- [ ] 기본 단어 데이터베이스
