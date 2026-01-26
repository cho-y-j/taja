// 문장 연습 데이터

export interface SentenceCategory {
  id: string;
  name: string;
  nameKo: string;
  description: string;
}

export interface PracticeSentence {
  id: string;
  text: string;
  category: string;
  language: 'en' | 'ko';
  difficulty: 'easy' | 'medium' | 'hard';
  isUserCreated?: boolean;
  isAiGenerated?: boolean;
  createdAt?: string;
}

// 문장 카테고리
export const sentenceCategories: SentenceCategory[] = [
  { id: 'daily', name: 'Daily Life', nameKo: '일상생활', description: '일상 대화와 생활 문장' },
  { id: 'proverb', name: 'Proverbs', nameKo: '속담/명언', description: '유명한 속담과 명언' },
  { id: 'story', name: 'Stories', nameKo: '이야기', description: '짧은 이야기와 동화' },
  { id: 'news', name: 'News', nameKo: '뉴스/시사', description: '뉴스와 시사 관련 문장' },
  { id: 'custom', name: 'My Sentences', nameKo: '내 문장', description: '직접 만든 문장' },
  { id: 'ai', name: 'AI Generated', nameKo: 'AI 생성', description: 'AI가 만든 문장' },
];

// 샘플 영어 문장
export const englishSampleSentences: PracticeSentence[] = [
  // Daily
  { id: 'en-daily-1', text: 'Good morning! How are you today?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-2', text: 'I had a great breakfast this morning.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-3', text: 'The weather is really nice today.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-4', text: 'Could you please help me with this task?', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-5', text: 'I need to finish my homework before dinner.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-6', text: 'Let me know if you have any questions about the project.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-7', text: 'The restaurant on the corner makes excellent pizza.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-8', text: 'I am looking forward to meeting you next week.', category: 'daily', language: 'en', difficulty: 'medium' },

  // Proverbs
  { id: 'en-proverb-1', text: 'Practice makes perfect.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-2', text: 'Actions speak louder than words.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-3', text: 'The early bird catches the worm.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-4', text: 'A journey of a thousand miles begins with a single step.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-5', text: 'Knowledge is power, but wisdom is knowing how to use it.', category: 'proverb', language: 'en', difficulty: 'hard' },
  { id: 'en-proverb-6', text: 'The only way to do great work is to love what you do.', category: 'proverb', language: 'en', difficulty: 'hard' },

  // Story
  { id: 'en-story-1', text: 'Once upon a time, there was a little rabbit.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-2', text: 'The fox jumped over the lazy brown dog.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-3', text: 'The princess lived in a tall castle on the hill.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-4', text: 'The brave knight fought the dragon to save the village.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-5', text: 'The curious cat explored every corner of the old house.', category: 'story', language: 'en', difficulty: 'medium' },

  // News
  { id: 'en-news-1', text: 'Scientists discover new species in the ocean.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-2', text: 'The economy shows signs of improvement this quarter.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-3', text: 'Technology companies announce major innovations at the conference.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-4', text: 'Climate change continues to affect weather patterns worldwide.', category: 'news', language: 'en', difficulty: 'hard' },
];

// 샘플 한글 문장
export const koreanSampleSentences: PracticeSentence[] = [
  // Daily
  { id: 'ko-daily-1', text: '안녕하세요, 오늘 날씨가 좋네요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-2', text: '오늘 아침에 맛있는 밥을 먹었어요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-3', text: '저는 학교에서 친구들과 공부해요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-4', text: '주말에 가족과 함께 공원에 갔습니다.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-5', text: '도서관에서 재미있는 책을 빌려왔어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-6', text: '내일 친구 생일 파티에 초대받았습니다.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-7', text: '엄마가 만들어 주신 음식이 정말 맛있었어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-8', text: '저는 매일 아침 운동을 하고 건강을 유지합니다.', category: 'daily', language: 'ko', difficulty: 'hard' },

  // Proverbs
  { id: 'ko-proverb-1', text: '백문이 불여일견이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-2', text: '천리길도 한 걸음부터.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-3', text: '뜻이 있는 곳에 길이 있다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-4', text: '낮말은 새가 듣고 밤말은 쥐가 듣는다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-5', text: '가는 말이 고와야 오는 말이 곱다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-6', text: '호랑이도 제 말 하면 온다더니 정말이네요.', category: 'proverb', language: 'ko', difficulty: 'hard' },

  // Story
  { id: 'ko-story-1', text: '옛날 옛적에 토끼 한 마리가 살았어요.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-2', text: '작은 새가 나무 위에서 노래를 불렀습니다.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-3', text: '용감한 왕자가 공주를 구하러 떠났습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-4', text: '숲속에 사는 동물 친구들이 함께 놀았어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-5', text: '마법사는 신비한 주문을 외워 마법을 부렸습니다.', category: 'story', language: 'ko', difficulty: 'hard' },

  // News
  { id: 'ko-news-1', text: '오늘 전국적으로 맑은 날씨가 예상됩니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-2', text: '새로운 기술이 우리 생활을 바꾸고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-3', text: '환경 보호를 위한 노력이 전 세계적으로 확산되고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-4', text: '국내 기업들이 해외 시장 진출에 박차를 가하고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
];

// 모든 샘플 문장 가져오기
export function getSampleSentences(language: 'en' | 'ko'): PracticeSentence[] {
  return language === 'en' ? englishSampleSentences : koreanSampleSentences;
}

// 카테고리별 문장 가져오기
export function getSentencesByCategory(language: 'en' | 'ko', category: string): PracticeSentence[] {
  const sentences = getSampleSentences(language);
  return sentences.filter(s => s.category === category);
}

// 난이도별 문장 가져오기
export function getSentencesByDifficulty(language: 'en' | 'ko', difficulty: 'easy' | 'medium' | 'hard'): PracticeSentence[] {
  const sentences = getSampleSentences(language);
  return sentences.filter(s => s.difficulty === difficulty);
}

// 랜덤 문장 가져오기
export function getRandomSentence(language: 'en' | 'ko', category?: string): PracticeSentence | null {
  let sentences = getSampleSentences(language);
  if (category && category !== 'all') {
    sentences = sentences.filter(s => s.category === category);
  }
  if (sentences.length === 0) return null;
  return sentences[Math.floor(Math.random() * sentences.length)];
}

// 로컬 스토리지 키
const USER_SENTENCES_KEY = 'lit-type-user-sentences';
const AI_SENTENCES_KEY = 'lit-type-ai-sentences';

// 사용자 문장 저장
export function saveUserSentence(sentence: Omit<PracticeSentence, 'id' | 'createdAt'>): PracticeSentence {
  const sentences = getUserSentences();
  const newSentence: PracticeSentence = {
    ...sentence,
    id: `user-${Date.now()}`,
    isUserCreated: true,
    createdAt: new Date().toISOString(),
  };
  sentences.push(newSentence);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_SENTENCES_KEY, JSON.stringify(sentences));
  }
  return newSentence;
}

// 사용자 문장 가져오기
export function getUserSentences(): PracticeSentence[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USER_SENTENCES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 사용자 문장 수정
export function updateUserSentence(id: string, text: string): void {
  const sentences = getUserSentences();
  const index = sentences.findIndex(s => s.id === id);
  if (index !== -1) {
    sentences[index].text = text;
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_SENTENCES_KEY, JSON.stringify(sentences));
    }
  }
}

// 사용자 문장 삭제
export function deleteUserSentence(id: string): void {
  const sentences = getUserSentences().filter(s => s.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_SENTENCES_KEY, JSON.stringify(sentences));
  }
}

// AI 생성 문장 저장
export function saveAiSentence(sentence: Omit<PracticeSentence, 'id' | 'createdAt'>): PracticeSentence {
  const sentences = getAiSentences();
  const newSentence: PracticeSentence = {
    ...sentence,
    id: `ai-${Date.now()}`,
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  };
  sentences.push(newSentence);
  if (typeof window !== 'undefined') {
    localStorage.setItem(AI_SENTENCES_KEY, JSON.stringify(sentences));
  }
  return newSentence;
}

// AI 생성 문장 가져오기
export function getAiSentences(): PracticeSentence[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(AI_SENTENCES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// AI 생성 문장 삭제
export function deleteAiSentence(id: string): void {
  const sentences = getAiSentences().filter(s => s.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(AI_SENTENCES_KEY, JSON.stringify(sentences));
  }
}

// 모든 문장 가져오기 (샘플 + 사용자 + AI)
export function getAllSentences(language: 'en' | 'ko'): PracticeSentence[] {
  const sample = getSampleSentences(language);
  const user = getUserSentences().filter(s => s.language === language);
  const ai = getAiSentences().filter(s => s.language === language);
  return [...sample, ...user, ...ai];
}
