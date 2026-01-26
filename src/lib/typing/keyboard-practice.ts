import type { Locale } from '@/types/typing';

export type KeyboardRow = 'home' | 'top' | 'bottom' | 'all';

export interface PracticeLevel {
  level: number;
  keys: string[];
  targetAccuracy: number;
  description: string;
  descriptionKo: string;
}

// 키보드 행 정의 (영어)
export const keyboardRows = {
  home: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  top: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  bottom: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
};

// 전체 키
const allKeys = [...keyboardRows.home, ...keyboardRows.top, ...keyboardRows.bottom];

// 행별 레벨 정의
export const rowLevels: Record<KeyboardRow, PracticeLevel[]> = {
  home: [
    { level: 1, keys: ['f', 'j'], targetAccuracy: 90, description: 'Index fingers: F and J', descriptionKo: '검지: F와 J' },
    { level: 2, keys: ['f', 'j', 'd', 'k'], targetAccuracy: 90, description: 'Add middle: D and K', descriptionKo: '중지 추가: D와 K' },
    { level: 3, keys: ['f', 'j', 'd', 'k', 's', 'l'], targetAccuracy: 85, description: 'Add ring: S and L', descriptionKo: '약지 추가: S와 L' },
    { level: 4, keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], targetAccuracy: 85, description: 'Complete home row', descriptionKo: '홈로우 완성' },
    { level: 5, keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'], targetAccuracy: 80, description: 'Add G and H', descriptionKo: 'G와 H 추가' },
  ],
  top: [
    { level: 1, keys: ['r', 'u'], targetAccuracy: 90, description: 'Index fingers: R and U', descriptionKo: '검지: R와 U' },
    { level: 2, keys: ['r', 'u', 'e', 'i'], targetAccuracy: 90, description: 'Add middle: E and I', descriptionKo: '중지 추가: E와 I' },
    { level: 3, keys: ['r', 'u', 'e', 'i', 'w', 'o'], targetAccuracy: 85, description: 'Add ring: W and O', descriptionKo: '약지 추가: W와 O' },
    { level: 4, keys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'], targetAccuracy: 85, description: 'Add pinky: Q and P', descriptionKo: '새끼 추가: Q와 P' },
    { level: 5, keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], targetAccuracy: 80, description: 'Complete top row', descriptionKo: '윗줄 완성' },
  ],
  bottom: [
    { level: 1, keys: ['v', 'm'], targetAccuracy: 90, description: 'Index fingers: V and M', descriptionKo: '검지: V와 M' },
    { level: 2, keys: ['v', 'm', 'c', ','], targetAccuracy: 90, description: 'Add middle: C and ,', descriptionKo: '중지 추가: C와 ,' },
    { level: 3, keys: ['v', 'm', 'c', ',', 'x', '.'], targetAccuracy: 85, description: 'Add ring: X and .', descriptionKo: '약지 추가: X와 .' },
    { level: 4, keys: ['z', 'x', 'c', 'v', 'm', ',', '.', '/'], targetAccuracy: 85, description: 'Add pinky: Z and /', descriptionKo: '새끼 추가: Z와 /' },
    { level: 5, keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'], targetAccuracy: 80, description: 'Complete bottom row', descriptionKo: '아랫줄 완성' },
  ],
  all: [
    { level: 1, keys: allKeys, targetAccuracy: 80, description: 'All keys (easy)', descriptionKo: '전체 키 (쉬움)' },
    { level: 2, keys: allKeys, targetAccuracy: 75, description: 'All keys (normal)', descriptionKo: '전체 키 (보통)' },
    { level: 3, keys: allKeys, targetAccuracy: 70, description: 'All keys (hard)', descriptionKo: '전체 키 (어려움)' },
    { level: 4, keys: [...allKeys, ' '], targetAccuracy: 70, description: 'All + Space', descriptionKo: '전체 + 스페이스' },
    { level: 5, keys: [...allKeys, ' '], targetAccuracy: 65, description: 'All + Space (hard)', descriptionKo: '전체 + 스페이스 (어려움)' },
  ],
};

// 행 이름
export const rowNames: Record<KeyboardRow, { en: string; ko: string }> = {
  home: { en: 'Home Row', ko: '홈로우 (기본줄)' },
  top: { en: 'Top Row', ko: '윗줄' },
  bottom: { en: 'Bottom Row', ko: '아랫줄' },
  all: { en: 'All Rows', ko: '전체 연습' },
};

// 연습 텍스트 생성 (레벨에 따라 길이 조절)
export function generateRowPracticeText(row: KeyboardRow, level: number, baseLength: number = 40): string {
  const levelData = rowLevels[row][level - 1];
  if (!levelData) return '';

  const keys = levelData.keys.filter(k => k !== ' ');
  const hasSpace = levelData.keys.includes(' ');

  // 전체 연습은 레벨에 따라 길이 증가
  const length = row === 'all' ? baseLength + (level * 10) : baseLength;

  let text = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    text += keys[randomIndex];

    // 5글자마다 공백 추가
    if (hasSpace && (i + 1) % 5 === 0 && i < length - 1) {
      text += ' ';
    } else if (!hasSpace && (i + 1) % 5 === 0 && i < length - 1) {
      text += ' ';
    }
  }

  return text;
}

// 손가락 매핑 (전체)
export const fingerMapping: Record<string, { finger: string; hand: 'left' | 'right' }> = {
  // 왼손 새끼
  q: { finger: 'pinky', hand: 'left' },
  a: { finger: 'pinky', hand: 'left' },
  z: { finger: 'pinky', hand: 'left' },
  // 왼손 약지
  w: { finger: 'ring', hand: 'left' },
  s: { finger: 'ring', hand: 'left' },
  x: { finger: 'ring', hand: 'left' },
  // 왼손 중지
  e: { finger: 'middle', hand: 'left' },
  d: { finger: 'middle', hand: 'left' },
  c: { finger: 'middle', hand: 'left' },
  // 왼손 검지
  r: { finger: 'index', hand: 'left' },
  f: { finger: 'index', hand: 'left' },
  v: { finger: 'index', hand: 'left' },
  t: { finger: 'index', hand: 'left' },
  g: { finger: 'index', hand: 'left' },
  b: { finger: 'index', hand: 'left' },
  // 오른손 검지
  y: { finger: 'index', hand: 'right' },
  h: { finger: 'index', hand: 'right' },
  n: { finger: 'index', hand: 'right' },
  u: { finger: 'index', hand: 'right' },
  j: { finger: 'index', hand: 'right' },
  m: { finger: 'index', hand: 'right' },
  // 오른손 중지
  i: { finger: 'middle', hand: 'right' },
  k: { finger: 'middle', hand: 'right' },
  ',': { finger: 'middle', hand: 'right' },
  // 오른손 약지
  o: { finger: 'ring', hand: 'right' },
  l: { finger: 'ring', hand: 'right' },
  '.': { finger: 'ring', hand: 'right' },
  // 오른손 새끼
  p: { finger: 'pinky', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  '/': { finger: 'pinky', hand: 'right' },
  // 엄지
  ' ': { finger: 'thumb', hand: 'right' },
};
