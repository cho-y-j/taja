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

// 영어 단어 데이터 (레벨별) - 단어와 한글 해석
export interface WordWithMeaning {
  word: string;
  meaning: string;
}

export const englishWordsWithMeaning: Record<number, WordWithMeaning[]> = {
  1: [
    { word: 'go', meaning: '가다' }, { word: 'hi', meaning: '안녕' }, { word: 'ok', meaning: '좋아' },
    { word: 'no', meaning: '아니' }, { word: 'to', meaning: '~로' }, { word: 'up', meaning: '위로' },
    { word: 'in', meaning: '안에' }, { word: 'on', meaning: '위에' }, { word: 'it', meaning: '그것' },
    { word: 'at', meaning: '~에' }, { word: 'do', meaning: '하다' }, { word: 'be', meaning: '~이다' },
    { word: 'he', meaning: '그' }, { word: 'we', meaning: '우리' }, { word: 'me', meaning: '나를' },
    { word: 'so', meaning: '그래서' }, { word: 'or', meaning: '또는' }, { word: 'if', meaning: '만약' },
    { word: 'my', meaning: '나의' }, { word: 'an', meaning: '하나의' },
  ],
  2: [
    { word: 'the', meaning: '그' }, { word: 'and', meaning: '그리고' }, { word: 'for', meaning: '~를 위해' },
    { word: 'are', meaning: '~이다' }, { word: 'but', meaning: '하지만' }, { word: 'not', meaning: '아니다' },
    { word: 'you', meaning: '너' }, { word: 'all', meaning: '모든' }, { word: 'can', meaning: '할 수 있다' },
    { word: 'had', meaning: '가졌다' }, { word: 'her', meaning: '그녀의' }, { word: 'was', meaning: '~였다' },
    { word: 'one', meaning: '하나' }, { word: 'our', meaning: '우리의' }, { word: 'out', meaning: '밖으로' },
    { word: 'day', meaning: '날' }, { word: 'get', meaning: '얻다' }, { word: 'has', meaning: '가지다' },
    { word: 'him', meaning: '그를' }, { word: 'his', meaning: '그의' }, { word: 'how', meaning: '어떻게' },
    { word: 'its', meaning: '그것의' }, { word: 'let', meaning: '~하게 하다' }, { word: 'may', meaning: '~할지도' },
    { word: 'new', meaning: '새로운' }, { word: 'now', meaning: '지금' }, { word: 'old', meaning: '오래된' },
    { word: 'see', meaning: '보다' }, { word: 'two', meaning: '둘' }, { word: 'way', meaning: '길' },
    { word: 'who', meaning: '누구' }, { word: 'boy', meaning: '소년' }, { word: 'did', meaning: '했다' },
    { word: 'man', meaning: '남자' }, { word: 'any', meaning: '어떤' }, { word: 'big', meaning: '큰' },
    { word: 'end', meaning: '끝' }, { word: 'own', meaning: '자신의' }, { word: 'put', meaning: '놓다' },
    { word: 'say', meaning: '말하다' }, { word: 'she', meaning: '그녀' }, { word: 'too', meaning: '또한' },
    { word: 'use', meaning: '사용하다' },
  ],
  3: [
    { word: 'that', meaning: '저것' }, { word: 'with', meaning: '~와 함께' }, { word: 'have', meaning: '가지다' },
    { word: 'this', meaning: '이것' }, { word: 'will', meaning: '~할 것이다' }, { word: 'your', meaning: '너의' },
    { word: 'from', meaning: '~로부터' }, { word: 'they', meaning: '그들' }, { word: 'been', meaning: '~였다' },
    { word: 'call', meaning: '부르다' }, { word: 'come', meaning: '오다' }, { word: 'each', meaning: '각각' },
    { word: 'find', meaning: '찾다' }, { word: 'give', meaning: '주다' }, { word: 'good', meaning: '좋은' },
    { word: 'help', meaning: '돕다' }, { word: 'here', meaning: '여기' }, { word: 'just', meaning: '단지' },
    { word: 'know', meaning: '알다' }, { word: 'like', meaning: '좋아하다' }, { word: 'long', meaning: '긴' },
    { word: 'look', meaning: '보다' }, { word: 'make', meaning: '만들다' }, { word: 'many', meaning: '많은' },
    { word: 'more', meaning: '더' }, { word: 'much', meaning: '많이' }, { word: 'name', meaning: '이름' },
    { word: 'need', meaning: '필요하다' }, { word: 'only', meaning: '오직' }, { word: 'over', meaning: '위로' },
    { word: 'part', meaning: '부분' }, { word: 'read', meaning: '읽다' }, { word: 'seem', meaning: '~처럼 보이다' },
    { word: 'show', meaning: '보여주다' }, { word: 'some', meaning: '일부' }, { word: 'take', meaning: '가져가다' },
    { word: 'tell', meaning: '말하다' }, { word: 'than', meaning: '~보다' }, { word: 'them', meaning: '그들을' },
    { word: 'then', meaning: '그때' }, { word: 'time', meaning: '시간' }, { word: 'want', meaning: '원하다' },
    { word: 'what', meaning: '무엇' }, { word: 'when', meaning: '언제' }, { word: 'work', meaning: '일하다' },
    { word: 'year', meaning: '년' },
  ],
  4: [
    { word: 'about', meaning: '~에 대해' }, { word: 'after', meaning: '~후에' }, { word: 'being', meaning: '존재' },
    { word: 'could', meaning: '~할 수 있었다' }, { word: 'every', meaning: '모든' }, { word: 'first', meaning: '첫 번째' },
    { word: 'found', meaning: '찾았다' }, { word: 'great', meaning: '위대한' }, { word: 'house', meaning: '집' },
    { word: 'large', meaning: '큰' }, { word: 'learn', meaning: '배우다' }, { word: 'never', meaning: '절대 ~않다' },
    { word: 'other', meaning: '다른' }, { word: 'place', meaning: '장소' }, { word: 'point', meaning: '점' },
    { word: 'right', meaning: '오른쪽/맞는' }, { word: 'small', meaning: '작은' }, { word: 'sound', meaning: '소리' },
    { word: 'still', meaning: '여전히' }, { word: 'study', meaning: '공부하다' }, { word: 'think', meaning: '생각하다' },
    { word: 'three', meaning: '셋' }, { word: 'under', meaning: '아래에' }, { word: 'water', meaning: '물' },
    { word: 'where', meaning: '어디' }, { word: 'which', meaning: '어느 것' }, { word: 'world', meaning: '세계' },
    { word: 'would', meaning: '~할 것이다' }, { word: 'write', meaning: '쓰다' }, { word: 'young', meaning: '젊은' },
    { word: 'child', meaning: '아이' }, { word: 'group', meaning: '그룹' }, { word: 'night', meaning: '밤' },
    { word: 'story', meaning: '이야기' }, { word: 'today', meaning: '오늘' }, { word: 'until', meaning: '~까지' },
    { word: 'while', meaning: '~하는 동안' }, { word: 'woman', meaning: '여자' }, { word: 'money', meaning: '돈' },
    { word: 'music', meaning: '음악' },
  ],
  5: [
    { word: 'always', meaning: '항상' }, { word: 'around', meaning: '주위에' }, { word: 'before', meaning: '전에' },
    { word: 'better', meaning: '더 좋은' }, { word: 'change', meaning: '변화' }, { word: 'differ', meaning: '다르다' },
    { word: 'enough', meaning: '충분한' }, { word: 'family', meaning: '가족' }, { word: 'follow', meaning: '따르다' },
    { word: 'friend', meaning: '친구' }, { word: 'happen', meaning: '일어나다' }, { word: 'little', meaning: '작은' },
    { word: 'mother', meaning: '어머니' }, { word: 'number', meaning: '숫자' }, { word: 'people', meaning: '사람들' },
    { word: 'school', meaning: '학교' }, { word: 'should', meaning: '~해야 한다' }, { word: 'though', meaning: '비록' },
    { word: 'answer', meaning: '대답' }, { word: 'become', meaning: '되다' }, { word: 'believe', meaning: '믿다' },
    { word: 'country', meaning: '나라' }, { word: 'example', meaning: '예시' }, { word: 'father', meaning: '아버지' },
    { word: 'govern', meaning: '통치하다' }, { word: 'however', meaning: '그러나' }, { word: 'import', meaning: '수입하다' },
    { word: 'letter', meaning: '편지' }, { word: 'member', meaning: '구성원' }, { word: 'moment', meaning: '순간' },
    { word: 'moving', meaning: '움직이는' }, { word: 'nation', meaning: '국가' }, { word: 'person', meaning: '사람' },
    { word: 'please', meaning: '제발' }, { word: 'problem', meaning: '문제' }, { word: 'program', meaning: '프로그램' },
    { word: 'second', meaning: '두 번째' }, { word: 'system', meaning: '시스템' }, { word: 'together', meaning: '함께' },
  ],
};

// 한글 단어 데이터 (레벨별) - 단어와 영어 해석
export const koreanWordsWithMeaning: Record<number, WordWithMeaning[]> = {
  1: [
    { word: '나', meaning: 'I/me' }, { word: '너', meaning: 'you' }, { word: '우리', meaning: 'we' },
    { word: '엄마', meaning: 'mom' }, { word: '아빠', meaning: 'dad' }, { word: '집', meaning: 'house' },
    { word: '밥', meaning: 'rice' }, { word: '물', meaning: 'water' }, { word: '눈', meaning: 'eye/snow' },
    { word: '귀', meaning: 'ear' }, { word: '입', meaning: 'mouth' }, { word: '손', meaning: 'hand' },
    { word: '발', meaning: 'foot' }, { word: '책', meaning: 'book' }, { word: '공', meaning: 'ball' },
    { word: '차', meaning: 'car/tea' }, { word: '길', meaning: 'road' }, { word: '산', meaning: 'mountain' },
    { word: '강', meaning: 'river' }, { word: '달', meaning: 'moon' },
  ],
  2: [
    { word: '사람', meaning: 'person' }, { word: '아이', meaning: 'child' }, { word: '학교', meaning: 'school' },
    { word: '시간', meaning: 'time' }, { word: '오늘', meaning: 'today' }, { word: '내일', meaning: 'tomorrow' },
    { word: '어제', meaning: 'yesterday' }, { word: '아침', meaning: 'morning' }, { word: '저녁', meaning: 'evening' },
    { word: '점심', meaning: 'lunch' }, { word: '친구', meaning: 'friend' }, { word: '가족', meaning: 'family' },
    { word: '공부', meaning: 'study' }, { word: '일기', meaning: 'diary' }, { word: '편지', meaning: 'letter' },
    { word: '전화', meaning: 'phone' }, { word: '가방', meaning: 'bag' }, { word: '연필', meaning: 'pencil' },
    { word: '지우개', meaning: 'eraser' }, { word: '노트', meaning: 'notebook' }, { word: '컴퓨터', meaning: 'computer' },
    { word: '텔레비전', meaning: 'television' }, { word: '냉장고', meaning: 'refrigerator' }, { word: '세탁기', meaning: 'washer' },
  ],
  3: [
    { word: '사랑', meaning: 'love' }, { word: '행복', meaning: 'happiness' }, { word: '건강', meaning: 'health' },
    { word: '성공', meaning: 'success' }, { word: '노력', meaning: 'effort' }, { word: '희망', meaning: 'hope' },
    { word: '용기', meaning: 'courage' }, { word: '믿음', meaning: 'faith' }, { word: '자유', meaning: 'freedom' },
    { word: '평화', meaning: 'peace' }, { word: '미래', meaning: 'future' }, { word: '과거', meaning: 'past' },
    { word: '현재', meaning: 'present' }, { word: '대학', meaning: 'university' }, { word: '회사', meaning: 'company' },
    { word: '병원', meaning: 'hospital' }, { word: '은행', meaning: 'bank' }, { word: '시장', meaning: 'market' },
    { word: '공원', meaning: 'park' }, { word: '극장', meaning: 'theater' }, { word: '식당', meaning: 'restaurant' },
    { word: '카페', meaning: 'cafe' }, { word: '도서관', meaning: 'library' }, { word: '박물관', meaning: 'museum' },
  ],
  4: [
    { word: '대한민국', meaning: 'Korea' }, { word: '서울시', meaning: 'Seoul' }, { word: '부산시', meaning: 'Busan' },
    { word: '인천시', meaning: 'Incheon' }, { word: '대전시', meaning: 'Daejeon' }, { word: '광주시', meaning: 'Gwangju' },
    { word: '컴퓨터', meaning: 'computer' }, { word: '인터넷', meaning: 'internet' }, { word: '스마트폰', meaning: 'smartphone' },
    { word: '자동차', meaning: 'car' }, { word: '비행기', meaning: 'airplane' }, { word: '기차역', meaning: 'train station' },
    { word: '버스정류장', meaning: 'bus stop' }, { word: '지하철역', meaning: 'subway station' }, { word: '백화점', meaning: 'dept store' },
    { word: '마트', meaning: 'mart' }, { word: '편의점', meaning: 'convenience store' }, { word: '아파트', meaning: 'apartment' },
    { word: '주택', meaning: 'house' }, { word: '건물', meaning: 'building' },
  ],
  5: [
    { word: '대통령', meaning: 'president' }, { word: '국회의원', meaning: 'congressman' }, { word: '공무원', meaning: 'official' },
    { word: '경찰관', meaning: 'police officer' }, { word: '소방관', meaning: 'firefighter' }, { word: '선생님', meaning: 'teacher' },
    { word: '의사', meaning: 'doctor' }, { word: '간호사', meaning: 'nurse' }, { word: '변호사', meaning: 'lawyer' },
    { word: '회계사', meaning: 'accountant' }, { word: '프로그래머', meaning: 'programmer' }, { word: '디자이너', meaning: 'designer' },
    { word: '엔지니어', meaning: 'engineer' }, { word: '과학자', meaning: 'scientist' }, { word: '예술가', meaning: 'artist' },
    { word: '음악가', meaning: 'musician' }, { word: '작가', meaning: 'writer' }, { word: '기자', meaning: 'journalist' },
    { word: '아나운서', meaning: 'announcer' }, { word: '배우', meaning: 'actor' },
  ],
};

// Legacy exports for backward compatibility
export const englishWords: Record<number, string[]> = Object.fromEntries(
  Object.entries(englishWordsWithMeaning).map(([level, words]) => [level, words.map(w => w.word)])
);

export const koreanWords: Record<number, string[]> = Object.fromEntries(
  Object.entries(koreanWordsWithMeaning).map(([level, words]) => [level, words.map(w => w.word)])
);

// 단어 목록에서 랜덤 단어 선택
export function getRandomWords(language: 'en' | 'ko', level: number, count: number = 10): string[] {
  const words = language === 'en' ? englishWords[level] : koreanWords[level];
  if (!words || words.length === 0) return [];

  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 랜덤 단어와 해석 함께 가져오기
export function getRandomWordsWithMeaning(language: 'en' | 'ko', level: number, count: number = 10): WordWithMeaning[] {
  const wordsData = language === 'en' ? englishWordsWithMeaning[level] : koreanWordsWithMeaning[level];
  if (!wordsData || wordsData.length === 0) return [];

  const shuffled = [...wordsData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 단어의 해석 가져오기
export function getWordMeaning(language: 'en' | 'ko', level: number, word: string): string | undefined {
  const wordsData = language === 'en' ? englishWordsWithMeaning[level] : koreanWordsWithMeaning[level];
  if (!wordsData) return undefined;

  const found = wordsData.find(w => w.word === word);
  return found?.meaning;
}

// 연습 텍스트 생성 (단어들을 공백으로 구분)
export function generateWordPracticeText(language: 'en' | 'ko', level: number, wordCount: number = 10): string {
  const words = getRandomWords(language, level, wordCount);
  return words.join(' ');
}
