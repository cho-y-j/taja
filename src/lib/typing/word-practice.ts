// 기본 단어 연습 데이터

export interface WordLevel {
  level: number;
  description: string;
  descriptionKo: string;
  targetAccuracy: number;
}

export const wordLevels: WordLevel[] = [
  { level: 1, description: 'Very Easy (2-3 letters)', descriptionKo: '매우 쉬움 (2-3글자)', targetAccuracy: 95 },
  { level: 2, description: 'Easy (3-4 letters)', descriptionKo: '쉬움 (3-4글자)', targetAccuracy: 90 },
  { level: 3, description: 'Normal (4-5 letters)', descriptionKo: '보통 (4-5글자)', targetAccuracy: 85 },
  { level: 4, description: 'Hard (5-6 letters)', descriptionKo: '어려움 (5-6글자)', targetAccuracy: 80 },
  { level: 5, description: 'Very Hard (6+ letters)', descriptionKo: '매우 어려움 (6글자+)', targetAccuracy: 75 },
];

// 영어 단어 데이터 (레벨별)
export const englishWords: Record<number, string[]> = {
  1: ['go', 'hi', 'ok', 'no', 'to', 'up', 'in', 'on', 'it', 'at', 'do', 'be', 'he', 'we', 'me', 'so', 'or', 'if', 'my', 'an'],
  2: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'let', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'any', 'big', 'end', 'own', 'put', 'say', 'she', 'too', 'use'],
  3: ['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'been', 'call', 'come', 'each', 'find', 'give', 'good', 'help', 'here', 'just', 'know', 'like', 'long', 'look', 'make', 'many', 'more', 'much', 'name', 'need', 'only', 'over', 'part', 'read', 'seem', 'show', 'some', 'take', 'tell', 'than', 'them', 'then', 'time', 'want', 'what', 'when', 'work', 'year'],
  4: ['about', 'after', 'being', 'could', 'every', 'first', 'found', 'great', 'house', 'large', 'learn', 'never', 'other', 'place', 'point', 'right', 'small', 'sound', 'still', 'study', 'think', 'three', 'under', 'water', 'where', 'which', 'world', 'would', 'write', 'young', 'child', 'group', 'night', 'story', 'today', 'until', 'while', 'woman', 'money', 'music'],
  5: ['always', 'around', 'before', 'better', 'change', 'differ', 'enough', 'family', 'follow', 'friend', 'happen', 'little', 'mother', 'number', 'people', 'school', 'should', 'though', 'answer', 'become', 'believe', 'country', 'example', 'father', 'govern', 'however', 'import', 'letter', 'member', 'moment', 'moving', 'nation', 'person', 'please', 'problem', 'program', 'second', 'system', 'together', 'woman'],
};

// 한글 단어 데이터 (레벨별)
export const koreanWords: Record<number, string[]> = {
  1: ['나', '너', '우리', '엄마', '아빠', '집', '밥', '물', '눈', '귀', '입', '손', '발', '책', '공', '차', '길', '산', '강', '달'],
  2: ['사람', '아이', '학교', '시간', '오늘', '내일', '어제', '아침', '저녁', '점심', '친구', '가족', '공부', '일기', '편지', '전화', '가방', '연필', '지우개', '노트', '컴퓨터', '텔레비전', '냉장고', '세탁기'],
  3: ['사랑', '행복', '건강', '성공', '노력', '희망', '용기', '믿음', '자유', '평화', '미래', '과거', '현재', '대학', '회사', '병원', '은행', '시장', '공원', '극장', '식당', '카페', '도서관', '박물관'],
  4: ['대한민국', '서울시', '부산시', '인천시', '대전시', '광주시', '컴퓨터', '인터넷', '스마트폰', '자동차', '비행기', '기차역', '버스정류장', '지하철역', '백화점', '마트', '편의점', '아파트', '주택', '건물'],
  5: ['대통령', '국회의원', '공무원', '경찰관', '소방관', '선생님', '의사', '간호사', '변호사', '회계사', '프로그래머', '디자이너', '엔지니어', '과학자', '예술가', '음악가', '작가', '기자', '아나운서', '배우'],
};

// 단어 목록에서 랜덤 단어 선택
export function getRandomWords(language: 'en' | 'ko', level: number, count: number = 10): string[] {
  const words = language === 'en' ? englishWords[level] : koreanWords[level];
  if (!words || words.length === 0) return [];

  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 연습 텍스트 생성 (단어들을 공백으로 구분)
export function generateWordPracticeText(language: 'en' | 'ko', level: number, wordCount: number = 10): string {
  const words = getRandomWords(language, level, wordCount);
  return words.join(' ');
}
