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

// 샘플 영어 문장 (확장)
export const englishSampleSentences: PracticeSentence[] = [
  // Daily (30개)
  { id: 'en-daily-1', text: 'Good morning! How are you today?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-2', text: 'I had a great breakfast this morning.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-3', text: 'The weather is really nice today.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-4', text: 'Could you please help me with this task?', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-5', text: 'I need to finish my homework before dinner.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-6', text: 'Let me know if you have any questions.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-7', text: 'The restaurant on the corner makes excellent pizza.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-8', text: 'I am looking forward to meeting you next week.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-9', text: 'What time does the meeting start?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-10', text: 'Can I have a cup of coffee please?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-11', text: 'I will call you back in five minutes.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-12', text: 'Please turn off the lights when you leave.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-13', text: 'The train arrives at platform three.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-14', text: 'I forgot my umbrella at home today.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-15', text: 'She works at a hospital downtown.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-16', text: 'We should go grocery shopping this weekend.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-17', text: 'The children are playing in the park.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-18', text: 'I usually wake up at seven in the morning.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-19', text: 'My favorite season is autumn.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-20', text: 'The movie was really interesting and exciting.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-21', text: 'I need to buy some new clothes for the party.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-22', text: 'The library is closed on Sundays.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-23', text: 'He plays the guitar very well.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-24', text: 'We had a wonderful time at the beach.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-25', text: 'The flowers in the garden are beautiful.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-26', text: 'I am learning to cook Korean food.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-27', text: 'The bus stop is just around the corner.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-28', text: 'She speaks three languages fluently.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-29', text: 'I would like to order a large pizza with extra cheese.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-30', text: 'Thank you for your help today.', category: 'daily', language: 'en', difficulty: 'easy' },

  // Proverbs (40개)
  { id: 'en-proverb-1', text: 'Practice makes perfect.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-2', text: 'Actions speak louder than words.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-3', text: 'The early bird catches the worm.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-4', text: 'A journey of a thousand miles begins with a single step.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-5', text: 'Knowledge is power.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-6', text: 'The only way to do great work is to love what you do.', category: 'proverb', language: 'en', difficulty: 'hard' },
  { id: 'en-proverb-7', text: 'Time is money.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-8', text: 'Better late than never.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-9', text: 'When in Rome, do as the Romans do.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-10', text: 'Every cloud has a silver lining.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-11', text: 'Rome was not built in a day.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-12', text: 'Where there is a will, there is a way.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-13', text: 'No pain, no gain.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-14', text: 'Honesty is the best policy.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-15', text: 'Two heads are better than one.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-16', text: 'A picture is worth a thousand words.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-17', text: 'Fortune favors the brave.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-18', text: 'The pen is mightier than the sword.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-19', text: 'You cannot judge a book by its cover.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-20', text: 'All that glitters is not gold.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-21', text: 'Birds of a feather flock together.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-22', text: 'An apple a day keeps the doctor away.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-23', text: 'Look before you leap.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-24', text: 'The grass is always greener on the other side.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-25', text: 'Strike while the iron is hot.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-26', text: 'Many hands make light work.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-27', text: 'Curiosity killed the cat.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-28', text: 'A friend in need is a friend indeed.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-29', text: 'Laughter is the best medicine.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-30', text: 'Beauty is in the eye of the beholder.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-31', text: 'The squeaky wheel gets the grease.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-32', text: 'You reap what you sow.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-33', text: 'Slow and steady wins the race.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-34', text: 'What goes around comes around.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-35', text: 'When one door closes, another opens.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-36', text: 'Do not put all your eggs in one basket.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-37', text: 'If at first you do not succeed, try again.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-38', text: 'Good things come to those who wait.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-39', text: 'The best things in life are free.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-40', text: 'Believe you can and you are halfway there.', category: 'proverb', language: 'en', difficulty: 'medium' },

  // Story (20개)
  { id: 'en-story-1', text: 'Once upon a time, there was a little rabbit.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-2', text: 'The quick brown fox jumps over the lazy dog.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-3', text: 'The princess lived in a tall castle on the hill.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-4', text: 'The brave knight fought the dragon to save the village.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-5', text: 'The curious cat explored every corner of the old house.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-6', text: 'A long time ago, in a faraway land, there lived a king.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-7', text: 'The little mermaid dreamed of walking on land.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-8', text: 'The wolf huffed and puffed but could not blow the house down.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-9', text: 'Cinderella lost her glass slipper at midnight.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-10', text: 'The ugly duckling grew into a beautiful swan.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-11', text: 'Peter Pan never wanted to grow up.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-12', text: 'Alice fell down the rabbit hole into Wonderland.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-13', text: 'The three little pigs built their houses.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-14', text: 'Snow White lived with seven dwarfs in the forest.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-15', text: 'The tortoise and the hare had a race.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-16', text: 'Jack climbed the beanstalk into the clouds.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-17', text: 'Pinocchio wanted to become a real boy.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-18', text: 'The gingerbread man ran as fast as he could.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-19', text: 'Rapunzel let down her long golden hair.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-20', text: 'The frog prince was waiting for a kiss.', category: 'story', language: 'en', difficulty: 'easy' },

  // News (20개)
  { id: 'en-news-1', text: 'Scientists discover new species in the ocean.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-2', text: 'The economy shows signs of improvement this quarter.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-3', text: 'Technology companies announce major innovations.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-4', text: 'Climate change affects weather patterns worldwide.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-5', text: 'New research reveals benefits of regular exercise.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-6', text: 'World leaders meet to discuss global challenges.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-7', text: 'Electric vehicles become more popular this year.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-8', text: 'Space agency plans mission to Mars.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-9', text: 'New smartphone features advanced camera technology.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-10', text: 'Renewable energy production reaches record levels.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-11', text: 'Scientists develop new treatment for common diseases.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-12', text: 'International trade agreements support economic growth.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-13', text: 'Online education transforms learning opportunities.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-14', text: 'Cities implement new public transportation systems.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-15', text: 'Healthcare workers receive recognition for their service.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-16', text: 'Stock market reaches new highs this month.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-17', text: 'Artificial intelligence changes the way we work.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-18', text: 'Countries agree on new environmental policies.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-19', text: 'Sports teams prepare for the international tournament.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-20', text: 'Cultural festivals celebrate diversity and tradition.', category: 'news', language: 'en', difficulty: 'medium' },
];

// 샘플 한글 문장 (확장 - 100개 이상)
export const koreanSampleSentences: PracticeSentence[] = [
  // Daily (30개)
  { id: 'ko-daily-1', text: '안녕하세요, 오늘 날씨가 좋네요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-2', text: '오늘 아침에 맛있는 밥을 먹었어요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-3', text: '저는 학교에서 친구들과 공부해요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-4', text: '주말에 가족과 함께 공원에 갔습니다.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-5', text: '도서관에서 재미있는 책을 빌려왔어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-6', text: '내일 친구 생일 파티에 초대받았습니다.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-7', text: '엄마가 만들어 주신 음식이 정말 맛있었어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-8', text: '저는 매일 아침 운동을 하고 건강을 유지합니다.', category: 'daily', language: 'ko', difficulty: 'hard' },
  { id: 'ko-daily-9', text: '오늘 회의는 몇 시에 시작하나요?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-10', text: '커피 한 잔 주시겠어요?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-11', text: '5분 후에 다시 전화드리겠습니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-12', text: '나갈 때 불을 꺼 주세요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-13', text: '기차가 3번 플랫폼에 도착합니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-14', text: '오늘 우산을 집에 두고 왔어요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-15', text: '그녀는 시내 병원에서 일합니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-16', text: '이번 주말에 장을 봐야 해요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-17', text: '아이들이 공원에서 놀고 있어요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-18', text: '저는 보통 아침 7시에 일어납니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-19', text: '제가 가장 좋아하는 계절은 가을이에요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-20', text: '그 영화는 정말 재미있고 흥미로웠어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-21', text: '파티를 위해 새 옷을 사야 해요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-22', text: '도서관은 일요일에 문을 닫습니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-23', text: '그는 기타를 아주 잘 연주합니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-24', text: '우리는 해변에서 즐거운 시간을 보냈어요.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-25', text: '정원의 꽃들이 아름답습니다.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-26', text: '저는 한국 음식 만드는 법을 배우고 있어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-27', text: '버스 정류장이 바로 저쪽 모퉁이에 있어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-28', text: '그녀는 3개 국어를 유창하게 합니다.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-29', text: '치즈 많이 넣은 큰 피자 주문하고 싶어요.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-30', text: '오늘 도와주셔서 감사합니다.', category: 'daily', language: 'ko', difficulty: 'easy' },

  // Proverbs - 속담/명언 (50개)
  { id: 'ko-proverb-1', text: '백문이 불여일견이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-2', text: '천리길도 한 걸음부터.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-3', text: '뜻이 있는 곳에 길이 있다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-4', text: '낮말은 새가 듣고 밤말은 쥐가 듣는다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-5', text: '가는 말이 고와야 오는 말이 곱다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-6', text: '호랑이도 제 말 하면 온다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-7', text: '시간은 금이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-8', text: '늦더라도 안 하는 것보다 낫다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-9', text: '아는 것이 힘이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-10', text: '원숭이도 나무에서 떨어진다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-11', text: '세 살 버릇 여든까지 간다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-12', text: '고생 끝에 낙이 온다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-13', text: '로마는 하루아침에 이루어지지 않았다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-14', text: '정직이 최선의 방책이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-15', text: '백지장도 맞들면 낫다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-16', text: '하늘은 스스로 돕는 자를 돕는다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-17', text: '티끌 모아 태산이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-18', text: '빈 수레가 요란하다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-19', text: '등잔 밑이 어둡다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-20', text: '꿩 먹고 알 먹는다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-21', text: '누워서 떡 먹기다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-22', text: '소 잃고 외양간 고친다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-23', text: '급할수록 돌아가라.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-24', text: '남의 떡이 커 보인다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-25', text: '될 성부른 나무는 떡잎부터 알아본다.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-26', text: '배보다 배꼽이 더 크다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-27', text: '가재는 게 편이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-28', text: '뿌린 대로 거둔다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-29', text: '웃음은 최고의 명약이다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-30', text: '아름다움은 보는 사람의 눈에 있다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-31', text: '돌다리도 두들겨 보고 건너라.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-32', text: '콩 심은 데 콩 나고 팥 심은 데 팥 난다.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-33', text: '느리지만 꾸준하면 이긴다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-34', text: '모든 일에는 때가 있다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-35', text: '하나를 보면 열을 안다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-36', text: '한 번 실수는 병가지상사다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-37', text: '실패는 성공의 어머니다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-38', text: '좋은 일에는 때를 기다리면 온다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-39', text: '인생에서 가장 좋은 것은 무료다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-40', text: '할 수 있다고 믿으면 반은 이룬 것이다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-41', text: '밑 빠진 독에 물 붓기다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-42', text: '우물 안 개구리다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-43', text: '금강산도 식후경이다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-44', text: '같은 값이면 다홍치마다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-45', text: '말 한마디로 천 냥 빚을 갚는다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-46', text: '웃는 낯에 침 못 뱉는다.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-47', text: '열 번 찍어 안 넘어가는 나무 없다.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-48', text: '아니 땐 굴뚝에 연기 나랴.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-49', text: '옷이 날개다.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-50', text: '눈에서 멀어지면 마음에서도 멀어진다.', category: 'proverb', language: 'ko', difficulty: 'medium' },

  // Story (20개)
  { id: 'ko-story-1', text: '옛날 옛적에 토끼 한 마리가 살았어요.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-2', text: '작은 새가 나무 위에서 노래를 불렀습니다.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-3', text: '용감한 왕자가 공주를 구하러 떠났습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-4', text: '숲속에 사는 동물 친구들이 함께 놀았어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-5', text: '마법사는 신비한 주문을 외워 마법을 부렸습니다.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-6', text: '아주 먼 옛날, 어느 왕국에 왕이 살고 있었어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-7', text: '인어공주는 육지 위를 걷는 꿈을 꾸었습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-8', text: '늑대는 훅 불고 후 불었지만 집을 무너뜨리지 못했어요.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-9', text: '신데렐라는 자정에 유리구두를 잃어버렸어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-10', text: '미운 오리새끼는 아름다운 백조가 되었습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-11', text: '피터팬은 절대 어른이 되고 싶지 않았어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-12', text: '앨리스는 토끼굴을 통해 이상한 나라로 떨어졌어요.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-13', text: '세 마리 아기돼지는 각자 집을 지었습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-14', text: '백설공주는 일곱 난쟁이와 숲속에서 살았어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-15', text: '거북이와 토끼가 달리기 시합을 했습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-16', text: '잭은 콩나무를 타고 구름 위로 올라갔어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-17', text: '피노키오는 진짜 소년이 되고 싶었습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-18', text: '과자로 만든 사람이 빠르게 도망쳤어요.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-19', text: '라푼젤은 긴 금발 머리카락을 내려주었습니다.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-20', text: '개구리 왕자는 키스를 기다리고 있었어요.', category: 'story', language: 'ko', difficulty: 'medium' },

  // News (30개)
  { id: 'ko-news-1', text: '오늘 전국적으로 맑은 날씨가 예상됩니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-2', text: '새로운 기술이 우리 생활을 바꾸고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-3', text: '환경 보호를 위한 노력이 전 세계적으로 확산되고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-4', text: '국내 기업들이 해외 시장 진출에 박차를 가하고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-5', text: '과학자들이 바다에서 새로운 생물종을 발견했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-6', text: '경제 지표가 이번 분기에 개선되는 조짐을 보이고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-7', text: '기술 기업들이 주요 혁신을 발표했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-8', text: '기후 변화가 전 세계 날씨 패턴에 영향을 미치고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-9', text: '새로운 연구가 규칙적인 운동의 이점을 밝혀냈습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-10', text: '세계 정상들이 글로벌 과제를 논의하기 위해 만났습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-11', text: '전기차가 올해 더욱 인기를 얻고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-12', text: '우주 기관이 화성 탐사 임무를 계획하고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-13', text: '새로운 스마트폰이 첨단 카메라 기술을 탑재했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-14', text: '재생 에너지 생산량이 기록적인 수준에 도달했습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-15', text: '과학자들이 일반 질병에 대한 새로운 치료법을 개발했습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-16', text: '국제 무역 협정이 경제 성장을 지원하고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-17', text: '온라인 교육이 학습 기회를 변화시키고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-18', text: '도시들이 새로운 대중교통 시스템을 도입하고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-19', text: '의료 종사자들이 그들의 헌신에 대해 인정받고 있습니다.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-20', text: '주식 시장이 이번 달 새로운 최고치를 기록했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-21', text: '인공지능이 우리의 일하는 방식을 바꾸고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-22', text: '각국이 새로운 환경 정책에 합의했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-23', text: '스포츠 팀들이 국제 대회를 준비하고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-24', text: '문화 축제가 다양성과 전통을 기념합니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-25', text: '올해 해외여행 수요가 크게 증가하고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-26', text: '정부가 새로운 경제 정책을 발표했습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-27', text: '청소년 독서량이 점점 줄어들고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-28', text: '올림픽 개최를 위한 준비가 한창입니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-29', text: '음식 배달 서비스 시장이 급성장하고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-30', text: '국내 관광 산업이 회복세를 보이고 있습니다.', category: 'news', language: 'ko', difficulty: 'medium' },
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
