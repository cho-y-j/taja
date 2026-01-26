import type { HomeRowLevel, Locale } from '@/types/typing';

// 홈로우 키 정의 (언어별)
export const homeRowKeys: Record<Locale, {
  left: string[];
  right: string[];
  thumb: string[];
}> = {
  ko: {
    left: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ'],
    right: ['ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'],
    thumb: [' '],
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
export const fingerMapping: Record<string, { finger: string; hand: 'left' | 'right' }> = {
  // 영어
  a: { finger: 'pinky', hand: 'left' },
  s: { finger: 'ring', hand: 'left' },
  d: { finger: 'middle', hand: 'left' },
  f: { finger: 'index', hand: 'left' },
  j: { finger: 'index', hand: 'right' },
  k: { finger: 'middle', hand: 'right' },
  l: { finger: 'ring', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  ' ': { finger: 'thumb', hand: 'right' },
};

// 레벨별 연습 내용
export const homeRowLevels: Record<Locale, HomeRowLevel[]> = {
  en: [
    {
      level: 1,
      keys: ['f', 'j'],
      targetAccuracy: 90,
      description: 'Index fingers: F and J keys',
    },
    {
      level: 2,
      keys: ['f', 'j', 'd', 'k'],
      targetAccuracy: 90,
      description: 'Add middle fingers: D and K',
    },
    {
      level: 3,
      keys: ['f', 'j', 'd', 'k', 's', 'l'],
      targetAccuracy: 85,
      description: 'Add ring fingers: S and L',
    },
    {
      level: 4,
      keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
      targetAccuracy: 85,
      description: 'Complete home row',
    },
    {
      level: 5,
      keys: ['a', 's', 'd', 'f', ' ', 'j', 'k', 'l', ';'],
      targetAccuracy: 85,
      description: 'Add space bar',
    },
  ],
  ko: [
    {
      level: 1,
      keys: ['ㄹ', 'ㅎ'],
      targetAccuracy: 90,
      description: '검지 연습: ㄹ과 ㅎ',
    },
    {
      level: 2,
      keys: ['ㄹ', 'ㅎ', 'ㅇ', 'ㅗ'],
      targetAccuracy: 90,
      description: '중지 추가: ㅇ과 ㅗ',
    },
    {
      level: 3,
      keys: ['ㄹ', 'ㅎ', 'ㅇ', 'ㅗ', 'ㄴ', 'ㅏ'],
      targetAccuracy: 85,
      description: '약지 추가: ㄴ과 ㅏ',
    },
    {
      level: 4,
      keys: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'],
      targetAccuracy: 85,
      description: '홈로우 완성',
    },
    {
      level: 5,
      keys: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', ' ', 'ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'],
      targetAccuracy: 85,
      description: '스페이스바 추가',
    },
  ],
  ja: [
    {
      level: 1,
      keys: ['は', 'ま'],
      targetAccuracy: 90,
      description: '人差し指: はとま',
    },
    {
      level: 2,
      keys: ['は', 'ま', 'し', 'の'],
      targetAccuracy: 90,
      description: '中指追加: しとの',
    },
    {
      level: 3,
      keys: ['は', 'ま', 'し', 'の', 'と', 'り'],
      targetAccuracy: 85,
      description: '薬指追加: とり',
    },
    {
      level: 4,
      keys: ['ち', 'と', 'し', 'は', 'ま', 'の', 'り', 'れ'],
      targetAccuracy: 85,
      description: 'ホームポジション完成',
    },
    {
      level: 5,
      keys: ['ち', 'と', 'し', 'は', ' ', 'ま', 'の', 'り', 'れ'],
      targetAccuracy: 85,
      description: 'スペースキー追加',
    },
  ],
};

// 홈로우 키로만 구성된 단어
export const homeRowWords: Record<Locale, {
  easy: string[];
  medium: string[];
  hard: string[];
}> = {
  en: {
    easy: ['as', 'ad', 'sad', 'dad', 'lad', 'fad', 'all'],
    medium: ['fall', 'salad', 'flask', 'shall', 'slash', 'alf'],
    hard: ['alfalfa', 'salsa', 'dallas'],
  },
  ko: {
    easy: ['아', '오', '이', '하나'],
    medium: ['나라', '하나', '아이', '이리'],
    hard: ['이리오라', '하나하나', '아하하'],
  },
  ja: {
    easy: ['は', 'ま', 'し', 'の'],
    medium: ['はし', 'しま', 'のり'],
    hard: ['はしり', 'しまり'],
  },
};

// 레벨에 맞는 연습 텍스트 생성
export function generatePracticeText(locale: Locale, level: number): string {
  const levelData = homeRowLevels[locale][level - 1];
  if (!levelData) return '';

  const keys = levelData.keys;
  const length = 30; // 연습 문자 수
  let text = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    text += keys[randomIndex];
    // 5글자마다 공백 추가 (스페이스 연습 레벨일 때)
    if (level >= 5 && (i + 1) % 5 === 0 && i < length - 1) {
      text += ' ';
    }
  }

  return text;
}
