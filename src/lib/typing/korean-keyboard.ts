// 한글 키보드 레이아웃 (두벌식)
export const koreanKeyboardRows = {
  home: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'],
  top: ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  bottom: ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
};

// 전체 한글 키
const allKoreanKeys = [...koreanKeyboardRows.home, ...koreanKeyboardRows.top, ...koreanKeyboardRows.bottom];

export interface KoreanPracticeLevel {
  level: number;
  keys: string[];
  targetAccuracy: number;
  description: string;
  descriptionKo: string;
}

// 한글 행별 레벨 정의
export const koreanRowLevels = {
  home: [
    { level: 1, keys: ['ㄹ', 'ㅎ'], targetAccuracy: 90, description: 'Index: ㄹ and ㅎ', descriptionKo: '검지: ㄹ과 ㅎ' },
    { level: 2, keys: ['ㄹ', 'ㅎ', 'ㅇ', 'ㅗ'], targetAccuracy: 90, description: 'Add middle: ㅇ and ㅗ', descriptionKo: '중지 추가: ㅇ과 ㅗ' },
    { level: 3, keys: ['ㄹ', 'ㅎ', 'ㅇ', 'ㅗ', 'ㄴ', 'ㅏ'], targetAccuracy: 85, description: 'Add ring: ㄴ and ㅏ', descriptionKo: '약지 추가: ㄴ과 ㅏ' },
    { level: 4, keys: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'], targetAccuracy: 85, description: 'Complete home row', descriptionKo: '홈로우 완성' },
    { level: 5, keys: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', ' ', 'ㅎ', 'ㅗ', 'ㅏ', 'ㅣ'], targetAccuracy: 80, description: 'Add space', descriptionKo: '스페이스 추가' },
  ],
  top: [
    { level: 1, keys: ['ㄱ', 'ㅕ'], targetAccuracy: 90, description: 'Index: ㄱ and ㅕ', descriptionKo: '검지: ㄱ과 ㅕ' },
    { level: 2, keys: ['ㄱ', 'ㅕ', 'ㄷ', 'ㅛ'], targetAccuracy: 90, description: 'Add middle: ㄷ and ㅛ', descriptionKo: '중지 추가: ㄷ과 ㅛ' },
    { level: 3, keys: ['ㄱ', 'ㅕ', 'ㄷ', 'ㅛ', 'ㅈ', 'ㅑ'], targetAccuracy: 85, description: 'Add ring: ㅈ and ㅑ', descriptionKo: '약지 추가: ㅈ과 ㅑ' },
    { level: 4, keys: ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'], targetAccuracy: 85, description: 'Add pinky', descriptionKo: '새끼 추가' },
    { level: 5, keys: ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'], targetAccuracy: 80, description: 'Complete top row', descriptionKo: '윗줄 완성' },
  ],
  bottom: [
    { level: 1, keys: ['ㅍ', 'ㅜ'], targetAccuracy: 90, description: 'Index: ㅍ and ㅜ', descriptionKo: '검지: ㅍ과 ㅜ' },
    { level: 2, keys: ['ㅍ', 'ㅜ', 'ㅊ', 'ㅠ'], targetAccuracy: 90, description: 'Add middle: ㅊ and ㅠ', descriptionKo: '중지 추가: ㅊ과 ㅠ' },
    { level: 3, keys: ['ㅍ', 'ㅜ', 'ㅊ', 'ㅠ', 'ㅌ', 'ㅡ'], targetAccuracy: 85, description: 'Add ring: ㅌ and ㅡ', descriptionKo: '약지 추가: ㅌ과 ㅡ' },
    { level: 4, keys: ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'], targetAccuracy: 85, description: 'Complete bottom row', descriptionKo: '아랫줄 완성' },
    { level: 5, keys: ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', ' ', 'ㅠ', 'ㅜ', 'ㅡ'], targetAccuracy: 80, description: 'Add space', descriptionKo: '스페이스 추가' },
  ],
  all: [
    { level: 1, keys: allKoreanKeys, targetAccuracy: 80, description: 'All keys (easy)', descriptionKo: '전체 키 (쉬움)' },
    { level: 2, keys: allKoreanKeys, targetAccuracy: 75, description: 'All keys (normal)', descriptionKo: '전체 키 (보통)' },
    { level: 3, keys: allKoreanKeys, targetAccuracy: 70, description: 'All keys (hard)', descriptionKo: '전체 키 (어려움)' },
    { level: 4, keys: [...allKoreanKeys, ' '], targetAccuracy: 70, description: 'All + Space', descriptionKo: '전체 + 스페이스' },
    { level: 5, keys: [...allKoreanKeys, ' '], targetAccuracy: 65, description: 'All + Space (hard)', descriptionKo: '전체 + 스페이스 (어려움)' },
  ],
};

// 한글 행 이름
export const koreanRowNames = {
  home: '홈로우 (기본줄)',
  top: '윗줄',
  bottom: '아랫줄',
  all: '전체 연습',
};

// 한글 키보드 레이아웃 (영문 키 -> 한글 키 매핑)
export const engToKorMap: Record<string, string> = {
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
  'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
  'h': 'ㅗ', 'j': 'ㅏ', 'k': 'ㅣ', 'l': 'ㅣ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
  'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
};

// 한글 키 -> 영문 키 매핑 (역방향)
export const korToEngMap: Record<string, string> = {
  'ㅂ': 'q', 'ㅈ': 'w', 'ㄷ': 'e', 'ㄱ': 'r', 'ㅅ': 't',
  'ㅛ': 'y', 'ㅕ': 'u', 'ㅑ': 'i', 'ㅐ': 'o', 'ㅔ': 'p',
  'ㅁ': 'a', 'ㄴ': 's', 'ㅇ': 'd', 'ㄹ': 'f', 'ㅎ': 'g',
  'ㅗ': 'h', 'ㅏ': 'j', 'ㅣ': 'k',
  'ㅋ': 'z', 'ㅌ': 'x', 'ㅊ': 'c', 'ㅍ': 'v',
  'ㅠ': 'b', 'ㅜ': 'n', 'ㅡ': 'm',
};

// 한글 손가락 매핑
export const koreanFingerMapping: Record<string, { finger: string; hand: 'left' | 'right' }> = {
  // 왼손 새끼
  'ㅂ': { finger: 'pinky', hand: 'left' },
  'ㅁ': { finger: 'pinky', hand: 'left' },
  'ㅋ': { finger: 'pinky', hand: 'left' },
  // 왼손 약지
  'ㅈ': { finger: 'ring', hand: 'left' },
  'ㄴ': { finger: 'ring', hand: 'left' },
  'ㅌ': { finger: 'ring', hand: 'left' },
  // 왼손 중지
  'ㄷ': { finger: 'middle', hand: 'left' },
  'ㅇ': { finger: 'middle', hand: 'left' },
  'ㅊ': { finger: 'middle', hand: 'left' },
  // 왼손 검지
  'ㄱ': { finger: 'index', hand: 'left' },
  'ㄹ': { finger: 'index', hand: 'left' },
  'ㅍ': { finger: 'index', hand: 'left' },
  'ㅅ': { finger: 'index', hand: 'left' },
  'ㅎ': { finger: 'index', hand: 'left' },
  // 오른손 검지
  'ㅛ': { finger: 'index', hand: 'right' },
  'ㅗ': { finger: 'index', hand: 'right' },
  'ㅠ': { finger: 'index', hand: 'right' },
  'ㅕ': { finger: 'index', hand: 'right' },
  'ㅏ': { finger: 'index', hand: 'right' },
  'ㅜ': { finger: 'index', hand: 'right' },
  // 오른손 중지
  'ㅑ': { finger: 'middle', hand: 'right' },
  'ㅣ': { finger: 'middle', hand: 'right' },
  'ㅡ': { finger: 'middle', hand: 'right' },
  // 오른손 약지
  'ㅐ': { finger: 'ring', hand: 'right' },
  // 오른손 새끼
  'ㅔ': { finger: 'pinky', hand: 'right' },
  // 엄지
  ' ': { finger: 'thumb', hand: 'right' },
};

// 한글 연습 텍스트 생성
export function generateKoreanPracticeText(row: keyof typeof koreanRowLevels, level: number, baseLength: number = 40): string {
  const levelData = koreanRowLevels[row][level - 1];
  if (!levelData) return '';

  const keys = levelData.keys.filter(k => k !== ' ');
  const hasSpace = levelData.keys.includes(' ');
  const length = row === 'all' ? baseLength + (level * 10) : baseLength;

  let text = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    text += keys[randomIndex];

    if ((i + 1) % 5 === 0 && i < length - 1) {
      text += ' ';
    }
  }

  return text;
}
