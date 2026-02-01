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
  translation?: string; // 번역 (영어→한글 또는 한글→영어)
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
  { id: 'travel', name: 'Travel', nameKo: '여행', description: '여행 관련 유용한 표현' },
  { id: 'custom', name: 'My Sentences', nameKo: '내 문장', description: '직접 만든 문장' },
  { id: 'ai', name: 'AI Generated', nameKo: 'AI 생성', description: 'AI가 만든 문장' },
];

// 샘플 영어 문장 (확장) - 해석 포함
export const englishSampleSentences: PracticeSentence[] = [
  // Daily (30개)
  { id: 'en-daily-1', text: 'Good morning! How are you today?', translation: '좋은 아침! 오늘 기분이 어때요?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-2', text: 'I had a great breakfast this morning.', translation: '오늘 아침 맛있는 아침식사를 했어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-3', text: 'The weather is really nice today.', translation: '오늘 날씨가 정말 좋네요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-4', text: 'Could you please help me with this task?', translation: '이 일 좀 도와주실 수 있나요?', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-5', text: 'I need to finish my homework before dinner.', translation: '저녁 먹기 전에 숙제를 끝내야 해요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-6', text: 'Let me know if you have any questions.', translation: '질문이 있으면 알려주세요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-7', text: 'The restaurant on the corner makes excellent pizza.', translation: '모퉁이에 있는 식당은 피자를 정말 잘 만들어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-8', text: 'I am looking forward to meeting you next week.', translation: '다음 주에 만나 뵙기를 기대하고 있어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-9', text: 'What time does the meeting start?', translation: '회의가 몇 시에 시작하나요?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-10', text: 'Can I have a cup of coffee please?', translation: '커피 한 잔 주시겠어요?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-11', text: 'I will call you back in five minutes.', translation: '5분 후에 다시 전화할게요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-12', text: 'Please turn off the lights when you leave.', translation: '나갈 때 불 꺼주세요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-13', text: 'The train arrives at platform three.', translation: '기차가 3번 플랫폼에 도착합니다.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-14', text: 'I forgot my umbrella at home today.', translation: '오늘 집에 우산을 두고 왔어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-15', text: 'She works at a hospital downtown.', translation: '그녀는 시내 병원에서 일해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-16', text: 'We should go grocery shopping this weekend.', translation: '이번 주말에 장 보러 가야 해요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-17', text: 'The children are playing in the park.', translation: '아이들이 공원에서 놀고 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-18', text: 'I usually wake up at seven in the morning.', translation: '저는 보통 아침 7시에 일어나요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-19', text: 'My favorite season is autumn.', translation: '제가 가장 좋아하는 계절은 가을이에요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-20', text: 'The movie was really interesting and exciting.', translation: '그 영화는 정말 재미있고 흥미진진했어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-21', text: 'I need to buy some new clothes for the party.', translation: '파티를 위해 새 옷을 사야 해요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-22', text: 'The library is closed on Sundays.', translation: '도서관은 일요일에 문을 닫아요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-23', text: 'He plays the guitar very well.', translation: '그는 기타를 아주 잘 쳐요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-24', text: 'We had a wonderful time at the beach.', translation: '우리는 해변에서 즐거운 시간을 보냈어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-25', text: 'The flowers in the garden are beautiful.', translation: '정원에 있는 꽃들이 아름다워요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-26', text: 'I am learning to cook Korean food.', translation: '저는 한국 요리를 배우고 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-27', text: 'The bus stop is just around the corner.', translation: '버스 정류장은 바로 모퉁이를 돌면 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-28', text: 'She speaks three languages fluently.', translation: '그녀는 세 가지 언어를 유창하게 해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-29', text: 'I would like to order a large pizza with extra cheese.', translation: '치즈 많이 넣은 큰 피자를 주문하고 싶어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-30', text: 'Thank you for your help today.', translation: '오늘 도와주셔서 감사합니다.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-31', text: 'I wake up at six every morning.', translation: '저는 매일 아침 6시에 일어나요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-32', text: 'She is my best friend from school.', translation: '그녀는 학교 때부터 가장 친한 친구예요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-33', text: 'We are going on a trip next month.', translation: '우리는 다음 달에 여행을 가요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-34', text: 'The store closes at nine tonight.', translation: '가게는 오늘 밤 9시에 문을 닫아요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-35', text: 'I need to charge my phone.', translation: '휴대폰을 충전해야 해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-36', text: 'Can you help me move this box?', translation: '이 상자 옮기는 것 좀 도와줄 수 있어요?', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-37', text: 'I am going to the gym after work.', translation: '퇴근 후에 헬스장에 갈 거예요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-38', text: 'What is your phone number?', translation: '전화번호가 뭐예요?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-39', text: 'I have a doctor appointment tomorrow.', translation: '내일 병원 예약이 있어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-40', text: 'Please send me an email.', translation: '이메일로 보내주세요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-41', text: 'The traffic is really bad today.', translation: '오늘 교통이 정말 안 좋아요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-42', text: 'I forgot to set my alarm clock.', translation: '알람 맞추는 걸 깜빡했어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-43', text: 'She is studying for her exam.', translation: '그녀는 시험 공부를 하고 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-44', text: 'I prefer tea to coffee.', translation: '저는 커피보다 차를 좋아해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-45', text: 'The package will arrive on Friday.', translation: '택배는 금요일에 도착할 거예요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-46', text: 'I need to buy some groceries.', translation: '장을 좀 봐야 해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-47', text: 'The meeting has been postponed.', translation: '회의가 연기되었어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-48', text: 'I am looking for my keys.', translation: '열쇠를 찾고 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-49', text: 'She works from home on Fridays.', translation: '그녀는 금요일에 재택근무를 해요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-50', text: 'I just finished reading a book.', translation: '방금 책 한 권을 다 읽었어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-51', text: 'Can I borrow your pen?', translation: '펜 좀 빌려도 될까요?', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-52', text: 'The elevator is out of order.', translation: '엘리베이터가 고장났어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-53', text: 'I am saving money for a new car.', translation: '새 차를 사려고 돈을 모으고 있어요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-54', text: 'The concert starts at eight.', translation: '콘서트는 8시에 시작해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-55', text: 'I walked to the park this morning.', translation: '오늘 아침 공원까지 걸어갔어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-56', text: 'She always makes me laugh.', translation: '그녀는 항상 나를 웃게 해요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-57', text: 'I have to finish this report by Friday.', translation: '금요일까지 이 보고서를 끝내야 해요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-58', text: 'The food at this restaurant is delicious.', translation: '이 식당 음식은 맛있어요.', category: 'daily', language: 'en', difficulty: 'easy' },
  { id: 'en-daily-59', text: 'I am planning to visit my parents.', translation: '부모님을 방문할 계획이에요.', category: 'daily', language: 'en', difficulty: 'medium' },
  { id: 'en-daily-60', text: 'It is getting dark outside.', translation: '밖이 어두워지고 있어요.', category: 'daily', language: 'en', difficulty: 'easy' },

  // Proverbs (40개)
  { id: 'en-proverb-1', text: 'Practice makes perfect.', translation: '연습이 완벽을 만든다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-2', text: 'Actions speak louder than words.', translation: '행동이 말보다 중요하다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-3', text: 'The early bird catches the worm.', translation: '일찍 일어나는 새가 벌레를 잡는다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-4', text: 'A journey of a thousand miles begins with a single step.', translation: '천 리 길도 한 걸음부터.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-5', text: 'Knowledge is power.', translation: '아는 것이 힘이다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-6', text: 'The only way to do great work is to love what you do.', translation: '위대한 일을 하는 유일한 방법은 하는 일을 사랑하는 것이다.', category: 'proverb', language: 'en', difficulty: 'hard' },
  { id: 'en-proverb-7', text: 'Time is money.', translation: '시간은 돈이다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-8', text: 'Better late than never.', translation: '늦더라도 안 하는 것보다 낫다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-9', text: 'When in Rome, do as the Romans do.', translation: '로마에 가면 로마법을 따르라.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-10', text: 'Every cloud has a silver lining.', translation: '고생 끝에 낙이 온다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-11', text: 'Rome was not built in a day.', translation: '로마는 하루아침에 이루어지지 않았다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-12', text: 'Where there is a will, there is a way.', translation: '뜻이 있는 곳에 길이 있다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-13', text: 'No pain, no gain.', translation: '고통 없이는 얻는 것도 없다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-14', text: 'Honesty is the best policy.', translation: '정직이 최선의 방책이다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-15', text: 'Two heads are better than one.', translation: '백지장도 맞들면 낫다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-16', text: 'A picture is worth a thousand words.', translation: '백 번 듣는 것보다 한 번 보는 게 낫다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-17', text: 'Fortune favors the brave.', translation: '하늘은 스스로 돕는 자를 돕는다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-18', text: 'The pen is mightier than the sword.', translation: '펜은 칼보다 강하다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-19', text: 'You cannot judge a book by its cover.', translation: '겉모습만 보고 판단하지 마라.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-20', text: 'All that glitters is not gold.', translation: '반짝인다고 다 금은 아니다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-21', text: 'Birds of a feather flock together.', translation: '유유상종.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-22', text: 'An apple a day keeps the doctor away.', translation: '하루 사과 하나면 의사가 필요 없다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-23', text: 'Look before you leap.', translation: '돌다리도 두들겨 보고 건너라.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-24', text: 'The grass is always greener on the other side.', translation: '남의 떡이 커 보인다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-25', text: 'Strike while the iron is hot.', translation: '쇠뿔도 단김에 빼라.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-26', text: 'Many hands make light work.', translation: '백지장도 맞들면 낫다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-27', text: 'Curiosity killed the cat.', translation: '호기심이 화를 부른다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-28', text: 'A friend in need is a friend indeed.', translation: '어려울 때 친구가 진정한 친구다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-29', text: 'Laughter is the best medicine.', translation: '웃음은 최고의 명약이다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-30', text: 'Beauty is in the eye of the beholder.', translation: '아름다움은 보는 사람의 눈에 달렸다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-31', text: 'The squeaky wheel gets the grease.', translation: '우는 아이 젖 준다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-32', text: 'You reap what you sow.', translation: '뿌린 대로 거둔다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-33', text: 'Slow and steady wins the race.', translation: '느리지만 꾸준하면 이긴다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-34', text: 'What goes around comes around.', translation: '가는 말이 고와야 오는 말이 곱다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-35', text: 'When one door closes, another opens.', translation: '하나의 문이 닫히면 다른 문이 열린다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-36', text: 'Do not put all your eggs in one basket.', translation: '모든 달걀을 한 바구니에 담지 마라.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-37', text: 'If at first you do not succeed, try again.', translation: '처음에 실패해도 다시 도전하라.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-38', text: 'Good things come to those who wait.', translation: '기다리는 자에게 좋은 것이 온다.', category: 'proverb', language: 'en', difficulty: 'medium' },
  { id: 'en-proverb-39', text: 'The best things in life are free.', translation: '인생에서 가장 좋은 것은 무료다.', category: 'proverb', language: 'en', difficulty: 'easy' },
  { id: 'en-proverb-40', text: 'Believe you can and you are halfway there.', translation: '할 수 있다고 믿으면 반은 이룬 것이다.', category: 'proverb', language: 'en', difficulty: 'medium' },

  // Story (20개) - 한글 해석 포함
  { id: 'en-story-1', text: 'Once upon a time, there was a little rabbit.', translation: '옛날 옛적에 작은 토끼가 있었어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-2', text: 'The quick brown fox jumps over the lazy dog.', translation: '빠른 갈색 여우가 게으른 개를 뛰어넘습니다.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-3', text: 'The princess lived in a tall castle on the hill.', translation: '공주는 언덕 위 높은 성에서 살았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-4', text: 'The brave knight fought the dragon to save the village.', translation: '용감한 기사가 마을을 구하기 위해 용과 싸웠습니다.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-5', text: 'The curious cat explored every corner of the old house.', translation: '호기심 많은 고양이가 오래된 집의 구석구석을 탐험했어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-6', text: 'A long time ago, in a faraway land, there lived a king.', translation: '아주 먼 옛날, 머나먼 나라에 한 왕이 살았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-7', text: 'The little mermaid dreamed of walking on land.', translation: '인어공주는 육지 위를 걷는 꿈을 꾸었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-8', text: 'The wolf huffed and puffed but could not blow the house down.', translation: '늑대는 훅훅 불었지만 집을 무너뜨릴 수 없었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-9', text: 'Cinderella lost her glass slipper at midnight.', translation: '신데렐라는 자정에 유리구두를 잃어버렸어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-10', text: 'The ugly duckling grew into a beautiful swan.', translation: '미운 오리새끼는 아름다운 백조가 되었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-11', text: 'Peter Pan never wanted to grow up.', translation: '피터팬은 절대 어른이 되고 싶지 않았어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-12', text: 'Alice fell down the rabbit hole into Wonderland.', translation: '앨리스는 토끼굴로 떨어져 이상한 나라에 갔어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-13', text: 'The three little pigs built their houses.', translation: '아기돼지 삼형제가 각자 집을 지었어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-14', text: 'Snow White lived with seven dwarfs in the forest.', translation: '백설공주는 숲속에서 일곱 난쟁이와 살았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-15', text: 'The tortoise and the hare had a race.', translation: '거북이와 토끼가 달리기 시합을 했어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-16', text: 'Jack climbed the beanstalk into the clouds.', translation: '잭은 콩나무를 타고 구름 위로 올라갔어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-17', text: 'Pinocchio wanted to become a real boy.', translation: '피노키오는 진짜 소년이 되고 싶었어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-18', text: 'The gingerbread man ran as fast as he could.', translation: '과자 인간이 있는 힘껏 달렸어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-19', text: 'Rapunzel let down her long golden hair.', translation: '라푼젤이 긴 금발 머리카락을 내려주었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-20', text: 'The frog prince was waiting for a kiss.', translation: '개구리 왕자는 키스를 기다리고 있었어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-21', text: 'The wise owl lived in the old oak tree.', translation: '지혜로운 올빼미가 오래된 참나무에 살았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-22', text: 'The dragon guarded the treasure in the cave.', translation: '용이 동굴에서 보물을 지키고 있었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-23', text: 'The magic mirror could answer any question.', translation: '마법 거울은 어떤 질문에도 답할 수 있었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-24', text: 'The young hero set off on a great adventure.', translation: '젊은 영웅이 위대한 모험을 떠났어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-25', text: 'The enchanted forest was full of mysteries.', translation: '마법의 숲은 신비로 가득 차 있었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-26', text: 'The fairy godmother granted three wishes.', translation: '요정 대모가 세 가지 소원을 들어주었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-27', text: 'The lion became friends with the mouse.', translation: '사자는 쥐와 친구가 되었어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-28', text: 'The princess found her true love at last.', translation: '공주는 마침내 진정한 사랑을 찾았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-29', text: 'The magical carpet flew across the sky.', translation: '마법의 양탄자가 하늘을 날아갔어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-30', text: 'The clever fox outsmarted the hunter.', translation: '영리한 여우가 사냥꾼을 따돌렸어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-31', text: 'The golden goose laid eggs every morning.', translation: '황금 거위는 매일 아침 알을 낳았어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-32', text: 'The witch cast a spell on the village.', translation: '마녀가 마을에 주문을 걸었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-33', text: 'The brave girl rescued the trapped animal.', translation: '용감한 소녀가 갇힌 동물을 구했어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-34', text: 'The king promised half his kingdom.', translation: '왕은 왕국의 절반을 약속했어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-35', text: 'The old fisherman caught a magical fish.', translation: '늙은 어부가 마법의 물고기를 잡았어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-36', text: 'They lived happily ever after.', translation: '그들은 그 후로 행복하게 살았어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-37', text: 'The secret door led to a hidden world.', translation: '비밀 문은 숨겨진 세계로 이어졌어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-38', text: 'The talking animals held a meeting.', translation: '말하는 동물들이 회의를 열었어요.', category: 'story', language: 'en', difficulty: 'medium' },
  { id: 'en-story-39', text: 'The magic beans grew overnight.', translation: '마법의 콩은 하룻밤 새 자랐어요.', category: 'story', language: 'en', difficulty: 'easy' },
  { id: 'en-story-40', text: 'The prince broke the evil spell.', translation: '왕자가 사악한 마법을 풀었어요.', category: 'story', language: 'en', difficulty: 'easy' },

  // News (20개) - 한글 해석 포함
  { id: 'en-news-1', text: 'Scientists discover new species in the ocean.', translation: '과학자들이 바다에서 새로운 종을 발견했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-2', text: 'The economy shows signs of improvement this quarter.', translation: '경제가 이번 분기에 개선 조짐을 보이고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-3', text: 'Technology companies announce major innovations.', translation: '기술 기업들이 주요 혁신을 발표했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-4', text: 'Climate change affects weather patterns worldwide.', translation: '기후 변화가 전 세계 날씨 패턴에 영향을 미치고 있습니다.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-5', text: 'New research reveals benefits of regular exercise.', translation: '새로운 연구가 규칙적인 운동의 이점을 밝혀냈습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-6', text: 'World leaders meet to discuss global challenges.', translation: '세계 정상들이 글로벌 과제를 논의하기 위해 만났습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-7', text: 'Electric vehicles become more popular this year.', translation: '전기차가 올해 더욱 인기를 얻고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-8', text: 'Space agency plans mission to Mars.', translation: '우주 기관이 화성 탐사 임무를 계획하고 있습니다.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-9', text: 'New smartphone features advanced camera technology.', translation: '새 스마트폰이 첨단 카메라 기술을 탑재했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-10', text: 'Renewable energy production reaches record levels.', translation: '재생 에너지 생산량이 기록적인 수준에 도달했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-11', text: 'Scientists develop new treatment for common diseases.', translation: '과학자들이 일반 질병에 대한 새로운 치료법을 개발했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-12', text: 'International trade agreements support economic growth.', translation: '국제 무역 협정이 경제 성장을 지원하고 있습니다.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-13', text: 'Online education transforms learning opportunities.', translation: '온라인 교육이 학습 기회를 변화시키고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-14', text: 'Cities implement new public transportation systems.', translation: '도시들이 새로운 대중교통 시스템을 도입하고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-15', text: 'Healthcare workers receive recognition for their service.', translation: '의료 종사자들이 그들의 헌신에 대해 인정받고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-16', text: 'Stock market reaches new highs this month.', translation: '주식 시장이 이번 달 새로운 최고치를 기록했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-17', text: 'Artificial intelligence changes the way we work.', translation: '인공지능이 우리의 일하는 방식을 바꾸고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-18', text: 'Countries agree on new environmental policies.', translation: '각국이 새로운 환경 정책에 합의했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-19', text: 'Sports teams prepare for the international tournament.', translation: '스포츠 팀들이 국제 대회를 준비하고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-20', text: 'Cultural festivals celebrate diversity and tradition.', translation: '문화 축제가 다양성과 전통을 기념합니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-21', text: 'New study finds benefits of reading daily.', translation: '새로운 연구가 매일 독서의 이점을 발견했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-22', text: 'Local community organizes charity event.', translation: '지역 사회가 자선 행사를 조직합니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-23', text: 'Government announces new education policy.', translation: '정부가 새로운 교육 정책을 발표했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-24', text: 'Researchers develop breakthrough technology.', translation: '연구자들이 획기적인 기술을 개발했습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-25', text: 'International summit addresses global issues.', translation: '국제 정상회담이 글로벌 문제를 다룹니다.', category: 'news', language: 'en', difficulty: 'hard' },
  { id: 'en-news-26', text: 'Housing prices continue to rise in major cities.', translation: '주요 도시에서 주택 가격이 계속 상승하고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-27', text: 'New app helps people learn languages faster.', translation: '새로운 앱이 사람들의 빠른 언어 학습을 돕습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-28', text: 'Scientists warn about environmental pollution.', translation: '과학자들이 환경 오염에 대해 경고합니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-29', text: 'Museum opens new exhibition this weekend.', translation: '박물관이 이번 주말 새 전시를 엽니다.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-30', text: 'Company creates jobs in local area.', translation: '회사가 지역에 일자리를 창출합니다.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-31', text: 'Health experts recommend balanced diet.', translation: '건강 전문가들이 균형 잡힌 식단을 권장합니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-32', text: 'New bridge construction begins next month.', translation: '새 다리 건설이 다음 달 시작됩니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-33', text: 'Film festival attracts visitors worldwide.', translation: '영화제가 전 세계 방문객을 끌어들입니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-34', text: 'University research leads to medical advance.', translation: '대학 연구가 의학 발전으로 이어집니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-35', text: 'National park celebrates anniversary.', translation: '국립공원이 기념일을 축하합니다.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-36', text: 'Survey shows changing consumer habits.', translation: '조사가 변화하는 소비자 습관을 보여줍니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-37', text: 'Athletes prepare for international competition.', translation: '선수들이 국제 대회를 준비하고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-38', text: 'City plans to expand public parks.', translation: '도시가 공원 확장을 계획하고 있습니다.', category: 'news', language: 'en', difficulty: 'easy' },
  { id: 'en-news-39', text: 'Small businesses adapt to digital age.', translation: '소규모 기업들이 디지털 시대에 적응하고 있습니다.', category: 'news', language: 'en', difficulty: 'medium' },
  { id: 'en-news-40', text: 'Report highlights importance of mental health.', translation: '보고서가 정신 건강의 중요성을 강조합니다.', category: 'news', language: 'en', difficulty: 'medium' },

  // Travel (60개) - 공항, 호텔, 식당, 관광, 교통, 쇼핑, 긴급상황
  // 공항
  { id: 'en-travel-1', text: 'Where is the check-in counter?', translation: '체크인 카운터가 어디에 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-2', text: 'I would like a window seat please.', translation: '창가 좌석으로 부탁드립니다.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-3', text: 'What time does the flight depart?', translation: '비행기가 몇 시에 출발하나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-4', text: 'My luggage is missing.', translation: '제 짐이 없어졌어요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-5', text: 'Where is the baggage claim area?', translation: '수화물 찾는 곳이 어디인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-6', text: 'How long is the layover?', translation: '경유 시간이 얼마나 되나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-7', text: 'Is the flight on time?', translation: '비행기가 정시에 출발하나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-8', text: 'Where can I find a currency exchange?', translation: '환전소가 어디 있나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  // 호텔
  { id: 'en-travel-9', text: 'I have a reservation under the name Kim.', translation: '김이라는 이름으로 예약했습니다.', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-10', text: 'What time is check-out?', translation: '체크아웃은 몇 시인가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-11', text: 'Is breakfast included?', translation: '아침 식사가 포함되어 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-12', text: 'Can I have a late check-out?', translation: '늦은 체크아웃이 가능한가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-13', text: 'The air conditioner is not working.', translation: '에어컨이 작동하지 않아요.', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-14', text: 'Could I have some extra towels?', translation: '수건 좀 더 주실 수 있나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-15', text: 'Is there free WiFi in the room?', translation: '객실에 무료 와이파이가 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-16', text: 'I would like to extend my stay.', translation: '숙박을 연장하고 싶습니다.', category: 'travel', language: 'en', difficulty: 'medium' },
  // 식당
  { id: 'en-travel-17', text: 'A table for two please.', translation: '2명 자리 부탁드립니다.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-18', text: 'Can I see the menu please?', translation: '메뉴판 좀 볼 수 있을까요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-19', text: 'What do you recommend?', translation: '뭘 추천하시나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-20', text: 'I am allergic to peanuts.', translation: '저는 땅콩 알레르기가 있어요.', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-21', text: 'Could we have the bill please?', translation: '계산서 주시겠어요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-22', text: 'Is this dish spicy?', translation: '이 음식은 매운가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-23', text: 'Can I have this to go?', translation: '포장해 주실 수 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-24', text: 'Do you accept credit cards?', translation: '신용카드 받으시나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  // 관광
  { id: 'en-travel-25', text: 'How do I get to the museum?', translation: '박물관에 어떻게 가나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-26', text: 'What are the opening hours?', translation: '영업 시간이 어떻게 되나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-27', text: 'How much is the entrance fee?', translation: '입장료가 얼마인가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-28', text: 'Is there a guided tour?', translation: '가이드 투어가 있나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-29', text: 'Can I take pictures here?', translation: '여기서 사진 찍어도 되나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-30', text: 'Where is the tourist information center?', translation: '관광 안내소가 어디인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-31', text: 'What are the must-see attractions?', translation: '꼭 봐야 할 명소가 어디인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-32', text: 'Is this place wheelchair accessible?', translation: '이곳은 휠체어 접근이 가능한가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  // 교통
  { id: 'en-travel-33', text: 'Where is the nearest subway station?', translation: '가장 가까운 지하철역이 어디인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-34', text: 'How much is the taxi fare to downtown?', translation: '시내까지 택시비가 얼마인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-35', text: 'Does this bus go to the airport?', translation: '이 버스가 공항에 가나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-36', text: 'I would like to rent a car.', translation: '차를 렌트하고 싶습니다.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-37', text: 'Where can I buy a train ticket?', translation: '기차표를 어디서 살 수 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-38', text: 'How long does it take to get there?', translation: '거기까지 얼마나 걸리나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-39', text: 'Please take me to this address.', translation: '이 주소로 데려다 주세요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-40', text: 'Can you stop here please?', translation: '여기서 내려주세요.', category: 'travel', language: 'en', difficulty: 'easy' },
  // 쇼핑
  { id: 'en-travel-41', text: 'How much does this cost?', translation: '이거 얼마인가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-42', text: 'Can I try this on?', translation: '이거 입어봐도 될까요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-43', text: 'Do you have this in a different size?', translation: '다른 사이즈 있나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-44', text: 'Can I get a discount?', translation: '할인 받을 수 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-45', text: 'I am just looking around.', translation: '그냥 구경하는 중이에요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-46', text: 'Where is the fitting room?', translation: '탈의실이 어디인가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-47', text: 'Can I get a tax refund?', translation: '세금 환급 받을 수 있나요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-48', text: 'Do you have this in another color?', translation: '다른 색상 있나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  // 긴급상황
  { id: 'en-travel-49', text: 'I need help please.', translation: '도움이 필요합니다.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-50', text: 'I lost my passport.', translation: '여권을 잃어버렸어요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-51', text: 'Where is the nearest hospital?', translation: '가장 가까운 병원이 어디인가요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-52', text: 'I need to see a doctor.', translation: '의사를 만나야 해요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-53', text: 'Please call the police.', translation: '경찰을 불러주세요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-54', text: 'I am not feeling well.', translation: '몸이 안 좋아요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-55', text: 'Where is the pharmacy?', translation: '약국이 어디인가요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-56', text: 'My wallet was stolen.', translation: '지갑을 도둑맞았어요.', category: 'travel', language: 'en', difficulty: 'easy' },
  // 일반 여행 표현
  { id: 'en-travel-57', text: 'Do you speak English?', translation: '영어 하시나요?', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-58', text: 'I do not understand.', translation: '이해가 안 돼요.', category: 'travel', language: 'en', difficulty: 'easy' },
  { id: 'en-travel-59', text: 'Could you speak more slowly?', translation: '좀 더 천천히 말씀해 주시겠어요?', category: 'travel', language: 'en', difficulty: 'medium' },
  { id: 'en-travel-60', text: 'Thank you for your help.', translation: '도와주셔서 감사합니다.', category: 'travel', language: 'en', difficulty: 'easy' },
];

// 샘플 한글 문장 (확장 - 100개 이상)
export const koreanSampleSentences: PracticeSentence[] = [
  // Daily (30개) - 영어 해석 포함
  { id: 'ko-daily-1', text: '안녕하세요, 오늘 날씨가 좋네요.', translation: 'Hello, the weather is nice today.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-2', text: '오늘 아침에 맛있는 밥을 먹었어요.', translation: 'I had a delicious meal this morning.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-3', text: '저는 학교에서 친구들과 공부해요.', translation: 'I study with friends at school.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-4', text: '주말에 가족과 함께 공원에 갔습니다.', translation: 'I went to the park with my family on the weekend.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-5', text: '도서관에서 재미있는 책을 빌려왔어요.', translation: 'I borrowed an interesting book from the library.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-6', text: '내일 친구 생일 파티에 초대받았습니다.', translation: "I was invited to my friend's birthday party tomorrow.", category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-7', text: '엄마가 만들어 주신 음식이 정말 맛있었어요.', translation: 'The food my mom made was really delicious.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-8', text: '저는 매일 아침 운동을 하고 건강을 유지합니다.', translation: 'I exercise every morning and stay healthy.', category: 'daily', language: 'ko', difficulty: 'hard' },
  { id: 'ko-daily-9', text: '오늘 회의는 몇 시에 시작하나요?', translation: 'What time does the meeting start today?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-10', text: '커피 한 잔 주시겠어요?', translation: 'Can I have a cup of coffee please?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-11', text: '5분 후에 다시 전화드리겠습니다.', translation: 'I will call you back in 5 minutes.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-12', text: '나갈 때 불을 꺼 주세요.', translation: 'Please turn off the lights when you leave.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-13', text: '기차가 3번 플랫폼에 도착합니다.', translation: 'The train arrives at platform 3.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-14', text: '오늘 우산을 집에 두고 왔어요.', translation: 'I left my umbrella at home today.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-15', text: '그녀는 시내 병원에서 일합니다.', translation: 'She works at a hospital downtown.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-16', text: '이번 주말에 장을 봐야 해요.', translation: 'I need to go grocery shopping this weekend.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-17', text: '아이들이 공원에서 놀고 있어요.', translation: 'The children are playing in the park.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-18', text: '저는 보통 아침 7시에 일어납니다.', translation: 'I usually wake up at 7 in the morning.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-19', text: '제가 가장 좋아하는 계절은 가을이에요.', translation: 'My favorite season is autumn.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-20', text: '그 영화는 정말 재미있고 흥미로웠어요.', translation: 'The movie was really fun and interesting.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-21', text: '파티를 위해 새 옷을 사야 해요.', translation: 'I need to buy new clothes for the party.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-22', text: '도서관은 일요일에 문을 닫습니다.', translation: 'The library is closed on Sundays.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-23', text: '그는 기타를 아주 잘 연주합니다.', translation: 'He plays the guitar very well.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-24', text: '우리는 해변에서 즐거운 시간을 보냈어요.', translation: 'We had a great time at the beach.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-25', text: '정원의 꽃들이 아름답습니다.', translation: 'The flowers in the garden are beautiful.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-26', text: '저는 한국 음식 만드는 법을 배우고 있어요.', translation: 'I am learning how to cook Korean food.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-27', text: '버스 정류장이 바로 저쪽 모퉁이에 있어요.', translation: 'The bus stop is just around the corner.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-28', text: '그녀는 3개 국어를 유창하게 합니다.', translation: 'She speaks three languages fluently.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-29', text: '치즈 많이 넣은 큰 피자 주문하고 싶어요.', translation: 'I would like to order a large pizza with extra cheese.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-30', text: '오늘 도와주셔서 감사합니다.', translation: 'Thank you for your help today.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-31', text: '저는 매일 아침 6시에 일어납니다.', translation: 'I wake up at six every morning.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-32', text: '그녀는 학교 때부터 가장 친한 친구예요.', translation: 'She is my best friend from school.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-33', text: '우리는 다음 달에 여행을 가요.', translation: 'We are going on a trip next month.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-34', text: '가게는 오늘 밤 9시에 문을 닫아요.', translation: 'The store closes at nine tonight.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-35', text: '휴대폰을 충전해야 해요.', translation: 'I need to charge my phone.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-36', text: '이 상자 옮기는 것 좀 도와줄 수 있어요?', translation: 'Can you help me move this box?', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-37', text: '퇴근 후에 헬스장에 갈 거예요.', translation: 'I am going to the gym after work.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-38', text: '전화번호가 뭐예요?', translation: 'What is your phone number?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-39', text: '내일 병원 예약이 있어요.', translation: 'I have a doctor appointment tomorrow.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-40', text: '이메일로 보내주세요.', translation: 'Please send me an email.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-41', text: '오늘 교통이 정말 안 좋아요.', translation: 'The traffic is really bad today.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-42', text: '알람 맞추는 걸 깜빡했어요.', translation: 'I forgot to set my alarm clock.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-43', text: '그녀는 시험 공부를 하고 있어요.', translation: 'She is studying for her exam.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-44', text: '저는 커피보다 차를 좋아해요.', translation: 'I prefer tea to coffee.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-45', text: '택배는 금요일에 도착할 거예요.', translation: 'The package will arrive on Friday.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-46', text: '장을 좀 봐야 해요.', translation: 'I need to buy some groceries.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-47', text: '회의가 연기되었어요.', translation: 'The meeting has been postponed.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-48', text: '열쇠를 찾고 있어요.', translation: 'I am looking for my keys.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-49', text: '그녀는 금요일에 재택근무를 해요.', translation: 'She works from home on Fridays.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-50', text: '방금 책 한 권을 다 읽었어요.', translation: 'I just finished reading a book.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-51', text: '펜 좀 빌려도 될까요?', translation: 'Can I borrow your pen?', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-52', text: '엘리베이터가 고장났어요.', translation: 'The elevator is out of order.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-53', text: '새 차를 사려고 돈을 모으고 있어요.', translation: 'I am saving money for a new car.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-54', text: '콘서트는 8시에 시작해요.', translation: 'The concert starts at eight.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-55', text: '오늘 아침 공원까지 걸어갔어요.', translation: 'I walked to the park this morning.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-56', text: '그녀는 항상 나를 웃게 해요.', translation: 'She always makes me laugh.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-57', text: '금요일까지 이 보고서를 끝내야 해요.', translation: 'I have to finish this report by Friday.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-58', text: '이 식당 음식은 맛있어요.', translation: 'The food at this restaurant is delicious.', category: 'daily', language: 'ko', difficulty: 'easy' },
  { id: 'ko-daily-59', text: '부모님을 방문할 계획이에요.', translation: 'I am planning to visit my parents.', category: 'daily', language: 'ko', difficulty: 'medium' },
  { id: 'ko-daily-60', text: '밖이 어두워지고 있어요.', translation: 'It is getting dark outside.', category: 'daily', language: 'ko', difficulty: 'easy' },

  // Proverbs - 속담/명언 (영어 해석 포함)
  { id: 'ko-proverb-1', text: '백문이 불여일견이다.', translation: 'Seeing is believing.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-2', text: '천리길도 한 걸음부터.', translation: 'A journey of a thousand miles begins with a single step.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-3', text: '뜻이 있는 곳에 길이 있다.', translation: 'Where there is a will, there is a way.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-4', text: '낮말은 새가 듣고 밤말은 쥐가 듣는다.', translation: 'Walls have ears.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-5', text: '가는 말이 고와야 오는 말이 곱다.', translation: 'What goes around comes around.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-6', text: '호랑이도 제 말 하면 온다.', translation: 'Speak of the devil.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-7', text: '시간은 금이다.', translation: 'Time is money.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-8', text: '늦더라도 안 하는 것보다 낫다.', translation: 'Better late than never.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-9', text: '아는 것이 힘이다.', translation: 'Knowledge is power.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-10', text: '원숭이도 나무에서 떨어진다.', translation: 'Even experts make mistakes.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-11', text: '세 살 버릇 여든까지 간다.', translation: 'Old habits die hard.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-12', text: '고생 끝에 낙이 온다.', translation: 'After hardship comes happiness.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-13', text: '로마는 하루아침에 이루어지지 않았다.', translation: 'Rome was not built in a day.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-14', text: '정직이 최선의 방책이다.', translation: 'Honesty is the best policy.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-15', text: '백지장도 맞들면 낫다.', translation: 'Two heads are better than one.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-16', text: '하늘은 스스로 돕는 자를 돕는다.', translation: 'Heaven helps those who help themselves.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-17', text: '티끌 모아 태산이다.', translation: 'Many a little makes a mickle.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-18', text: '빈 수레가 요란하다.', translation: 'Empty vessels make the most noise.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-19', text: '등잔 밑이 어둡다.', translation: 'It is dark under the lamp.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-20', text: '꿩 먹고 알 먹는다.', translation: 'Kill two birds with one stone.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-21', text: '누워서 떡 먹기다.', translation: 'It is a piece of cake.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-22', text: '소 잃고 외양간 고친다.', translation: 'Locking the barn door after the horse has bolted.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-23', text: '급할수록 돌아가라.', translation: 'Haste makes waste.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-24', text: '남의 떡이 커 보인다.', translation: 'The grass is always greener on the other side.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-25', text: '될 성부른 나무는 떡잎부터 알아본다.', translation: 'The child is father of the man.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-26', text: '배보다 배꼽이 더 크다.', translation: 'The tail wags the dog.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-27', text: '가재는 게 편이다.', translation: 'Birds of a feather flock together.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-28', text: '뿌린 대로 거둔다.', translation: 'You reap what you sow.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-29', text: '웃음은 최고의 명약이다.', translation: 'Laughter is the best medicine.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-30', text: '아름다움은 보는 사람의 눈에 있다.', translation: 'Beauty is in the eye of the beholder.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-31', text: '돌다리도 두들겨 보고 건너라.', translation: 'Look before you leap.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-32', text: '콩 심은 데 콩 나고 팥 심은 데 팥 난다.', translation: 'As you sow, so shall you reap.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-33', text: '느리지만 꾸준하면 이긴다.', translation: 'Slow and steady wins the race.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-34', text: '모든 일에는 때가 있다.', translation: 'There is a time for everything.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-35', text: '하나를 보면 열을 안다.', translation: 'A straw shows which way the wind blows.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-36', text: '한 번 실수는 병가지상사다.', translation: 'To err is human.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-37', text: '실패는 성공의 어머니다.', translation: 'Failure is the mother of success.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-38', text: '좋은 일에는 때를 기다리면 온다.', translation: 'Good things come to those who wait.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-39', text: '인생에서 가장 좋은 것은 무료다.', translation: 'The best things in life are free.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-40', text: '할 수 있다고 믿으면 반은 이룬 것이다.', translation: 'Believe you can and you are halfway there.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-41', text: '밑 빠진 독에 물 붓기다.', translation: 'Pouring water into a bottomless jar.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-42', text: '우물 안 개구리다.', translation: 'A frog in a well.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-43', text: '금강산도 식후경이다.', translation: 'A loaf of bread is better than the song of many birds.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-44', text: '같은 값이면 다홍치마다.', translation: 'If the price is the same, choose the better one.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-45', text: '말 한마디로 천 냥 빚을 갚는다.', translation: 'A word can pay a thousand debts.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-46', text: '웃는 낯에 침 못 뱉는다.', translation: 'You cannot spit on a smiling face.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-47', text: '열 번 찍어 안 넘어가는 나무 없다.', translation: 'Persistence pays off.', category: 'proverb', language: 'ko', difficulty: 'hard' },
  { id: 'ko-proverb-48', text: '아니 땐 굴뚝에 연기 나랴.', translation: 'Where there is smoke, there is fire.', category: 'proverb', language: 'ko', difficulty: 'medium' },
  { id: 'ko-proverb-49', text: '옷이 날개다.', translation: 'Clothes make the man.', category: 'proverb', language: 'ko', difficulty: 'easy' },
  { id: 'ko-proverb-50', text: '눈에서 멀어지면 마음에서도 멀어진다.', translation: 'Out of sight, out of mind.', category: 'proverb', language: 'ko', difficulty: 'medium' },

  // Story (20개) - 영어 해석 포함
  { id: 'ko-story-1', text: '옛날 옛적에 토끼 한 마리가 살았어요.', translation: 'Once upon a time, there lived a rabbit.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-2', text: '작은 새가 나무 위에서 노래를 불렀습니다.', translation: 'A small bird sang on top of a tree.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-3', text: '용감한 왕자가 공주를 구하러 떠났습니다.', translation: 'The brave prince left to rescue the princess.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-4', text: '숲속에 사는 동물 친구들이 함께 놀았어요.', translation: 'Animal friends living in the forest played together.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-5', text: '마법사는 신비한 주문을 외워 마법을 부렸습니다.', translation: 'The wizard cast a spell with a mysterious incantation.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-6', text: '아주 먼 옛날, 어느 왕국에 왕이 살고 있었어요.', translation: 'Long, long ago, a king lived in a kingdom.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-7', text: '인어공주는 육지 위를 걷는 꿈을 꾸었습니다.', translation: 'The little mermaid dreamed of walking on land.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-8', text: '늑대는 훅 불고 후 불었지만 집을 무너뜨리지 못했어요.', translation: 'The wolf huffed and puffed but could not blow the house down.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-9', text: '신데렐라는 자정에 유리구두를 잃어버렸어요.', translation: 'Cinderella lost her glass slipper at midnight.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-10', text: '미운 오리새끼는 아름다운 백조가 되었습니다.', translation: 'The ugly duckling became a beautiful swan.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-11', text: '피터팬은 절대 어른이 되고 싶지 않았어요.', translation: 'Peter Pan never wanted to grow up.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-12', text: '앨리스는 토끼굴을 통해 이상한 나라로 떨어졌어요.', translation: 'Alice fell through the rabbit hole into Wonderland.', category: 'story', language: 'ko', difficulty: 'hard' },
  { id: 'ko-story-13', text: '세 마리 아기돼지는 각자 집을 지었습니다.', translation: 'The three little pigs each built their own house.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-14', text: '백설공주는 일곱 난쟁이와 숲속에서 살았어요.', translation: 'Snow White lived in the forest with seven dwarfs.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-15', text: '거북이와 토끼가 달리기 시합을 했습니다.', translation: 'The tortoise and the hare had a race.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-16', text: '잭은 콩나무를 타고 구름 위로 올라갔어요.', translation: 'Jack climbed the beanstalk up into the clouds.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-17', text: '피노키오는 진짜 소년이 되고 싶었습니다.', translation: 'Pinocchio wanted to become a real boy.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-18', text: '과자로 만든 사람이 빠르게 도망쳤어요.', translation: 'The gingerbread man ran away quickly.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-19', text: '라푼젤은 긴 금발 머리카락을 내려주었습니다.', translation: 'Rapunzel let down her long golden hair.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-20', text: '개구리 왕자는 키스를 기다리고 있었어요.', translation: 'The frog prince was waiting for a kiss.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-21', text: '지혜로운 올빼미가 오래된 참나무에 살았습니다.', translation: 'The wise owl lived in the old oak tree.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-22', text: '용이 동굴에서 보물을 지키고 있었어요.', translation: 'The dragon guarded the treasure in the cave.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-23', text: '마법 거울은 어떤 질문에도 답할 수 있었어요.', translation: 'The magic mirror could answer any question.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-24', text: '젊은 영웅이 위대한 모험을 떠났습니다.', translation: 'The young hero set off on a great adventure.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-25', text: '마법의 숲은 신비로 가득 차 있었어요.', translation: 'The enchanted forest was full of mysteries.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-26', text: '요정 대모가 세 가지 소원을 들어주었어요.', translation: 'The fairy godmother granted three wishes.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-27', text: '사자는 쥐와 친구가 되었습니다.', translation: 'The lion became friends with the mouse.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-28', text: '공주는 마침내 진정한 사랑을 찾았어요.', translation: 'The princess found her true love at last.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-29', text: '마법의 양탄자가 하늘을 날아갔어요.', translation: 'The magical carpet flew across the sky.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-30', text: '영리한 여우가 사냥꾼을 따돌렸습니다.', translation: 'The clever fox outsmarted the hunter.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-31', text: '황금 거위는 매일 아침 알을 낳았어요.', translation: 'The golden goose laid eggs every morning.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-32', text: '마녀가 마을에 주문을 걸었습니다.', translation: 'The witch cast a spell on the village.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-33', text: '용감한 소녀가 갇힌 동물을 구했어요.', translation: 'The brave girl rescued the trapped animal.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-34', text: '왕은 왕국의 절반을 약속했습니다.', translation: 'The king promised half his kingdom.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-35', text: '늙은 어부가 마법의 물고기를 잡았어요.', translation: 'The old fisherman caught a magical fish.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-36', text: '그들은 그 후로 행복하게 살았습니다.', translation: 'They lived happily ever after.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-37', text: '비밀 문은 숨겨진 세계로 이어졌어요.', translation: 'The secret door led to a hidden world.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-38', text: '말하는 동물들이 회의를 열었습니다.', translation: 'The talking animals held a meeting.', category: 'story', language: 'ko', difficulty: 'medium' },
  { id: 'ko-story-39', text: '마법의 콩은 하룻밤 새 자랐어요.', translation: 'The magic beans grew overnight.', category: 'story', language: 'ko', difficulty: 'easy' },
  { id: 'ko-story-40', text: '왕자가 사악한 마법을 풀었습니다.', translation: 'The prince broke the evil spell.', category: 'story', language: 'ko', difficulty: 'medium' },

  // News (30개) - 영어 해석 포함
  { id: 'ko-news-1', text: '오늘 전국적으로 맑은 날씨가 예상됩니다.', translation: 'Clear weather is expected nationwide today.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-2', text: '새로운 기술이 우리 생활을 바꾸고 있습니다.', translation: 'New technology is changing our lives.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-3', text: '환경 보호를 위한 노력이 전 세계적으로 확산되고 있습니다.', translation: 'Efforts to protect the environment are spreading globally.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-4', text: '국내 기업들이 해외 시장 진출에 박차를 가하고 있습니다.', translation: 'Domestic companies are accelerating their entry into overseas markets.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-5', text: '과학자들이 바다에서 새로운 생물종을 발견했습니다.', translation: 'Scientists have discovered new species in the ocean.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-6', text: '경제 지표가 이번 분기에 개선되는 조짐을 보이고 있습니다.', translation: 'Economic indicators are showing signs of improvement this quarter.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-7', text: '기술 기업들이 주요 혁신을 발표했습니다.', translation: 'Tech companies have announced major innovations.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-8', text: '기후 변화가 전 세계 날씨 패턴에 영향을 미치고 있습니다.', translation: 'Climate change is affecting weather patterns worldwide.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-9', text: '새로운 연구가 규칙적인 운동의 이점을 밝혀냈습니다.', translation: 'New research reveals the benefits of regular exercise.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-10', text: '세계 정상들이 글로벌 과제를 논의하기 위해 만났습니다.', translation: 'World leaders met to discuss global challenges.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-11', text: '전기차가 올해 더욱 인기를 얻고 있습니다.', translation: 'Electric cars are becoming more popular this year.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-12', text: '우주 기관이 화성 탐사 임무를 계획하고 있습니다.', translation: 'Space agencies are planning missions to Mars.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-13', text: '새로운 스마트폰이 첨단 카메라 기술을 탑재했습니다.', translation: 'New smartphones feature advanced camera technology.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-14', text: '재생 에너지 생산량이 기록적인 수준에 도달했습니다.', translation: 'Renewable energy production reaches record levels.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-15', text: '과학자들이 일반 질병에 대한 새로운 치료법을 개발했습니다.', translation: 'Scientists develop new treatments for common diseases.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-16', text: '국제 무역 협정이 경제 성장을 지원하고 있습니다.', translation: 'International trade agreements support economic growth.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-17', text: '온라인 교육이 학습 기회를 변화시키고 있습니다.', translation: 'Online education is transforming learning opportunities.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-18', text: '도시들이 새로운 대중교통 시스템을 도입하고 있습니다.', translation: 'Cities are implementing new public transportation systems.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-19', text: '의료 종사자들이 그들의 헌신에 대해 인정받고 있습니다.', translation: 'Healthcare workers are being recognized for their dedication.', category: 'news', language: 'ko', difficulty: 'hard' },
  { id: 'ko-news-20', text: '주식 시장이 이번 달 새로운 최고치를 기록했습니다.', translation: 'Stock markets reach new highs this month.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-21', text: '인공지능이 우리의 일하는 방식을 바꾸고 있습니다.', translation: 'Artificial intelligence is changing how we work.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-22', text: '각국이 새로운 환경 정책에 합의했습니다.', translation: 'Countries agree on new environmental policies.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-23', text: '스포츠 팀들이 국제 대회를 준비하고 있습니다.', translation: 'Sports teams are preparing for international competitions.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-24', text: '문화 축제가 다양성과 전통을 기념합니다.', translation: 'Cultural festivals celebrate diversity and tradition.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-25', text: '올해 해외여행 수요가 크게 증가하고 있습니다.', translation: 'Demand for overseas travel is increasing significantly this year.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-26', text: '정부가 새로운 경제 정책을 발표했습니다.', translation: 'The government announced new economic policies.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-27', text: '청소년 독서량이 점점 줄어들고 있습니다.', translation: 'Reading among teenagers is decreasing.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-28', text: '올림픽 개최를 위한 준비가 한창입니다.', translation: 'Preparations for hosting the Olympics are in full swing.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-29', text: '음식 배달 서비스 시장이 급성장하고 있습니다.', translation: 'The food delivery service market is growing rapidly.', category: 'news', language: 'ko', difficulty: 'medium' },
  { id: 'ko-news-30', text: '국내 관광 산업이 회복세를 보이고 있습니다.', translation: 'The domestic tourism industry is showing signs of recovery.', category: 'news', language: 'ko', difficulty: 'medium' },

  // Travel (60개) - 공항, 호텔, 식당, 관광, 교통, 쇼핑, 긴급상황
  // 공항
  { id: 'ko-travel-1', text: '체크인 카운터가 어디에 있나요?', translation: 'Where is the check-in counter?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-2', text: '창가 좌석으로 부탁드립니다.', translation: 'I would like a window seat please.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-3', text: '비행기가 몇 시에 출발하나요?', translation: 'What time does the flight depart?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-4', text: '제 짐이 없어졌어요.', translation: 'My luggage is missing.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-5', text: '수화물 찾는 곳이 어디인가요?', translation: 'Where is the baggage claim area?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-6', text: '경유 시간이 얼마나 되나요?', translation: 'How long is the layover?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-7', text: '비행기가 정시에 출발하나요?', translation: 'Is the flight on time?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-8', text: '환전소가 어디 있나요?', translation: 'Where can I find a currency exchange?', category: 'travel', language: 'ko', difficulty: 'easy' },
  // 호텔
  { id: 'ko-travel-9', text: '김이라는 이름으로 예약했습니다.', translation: 'I have a reservation under the name Kim.', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-10', text: '체크아웃은 몇 시인가요?', translation: 'What time is check-out?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-11', text: '아침 식사가 포함되어 있나요?', translation: 'Is breakfast included?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-12', text: '늦은 체크아웃이 가능한가요?', translation: 'Can I have a late check-out?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-13', text: '에어컨이 작동하지 않아요.', translation: 'The air conditioner is not working.', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-14', text: '수건 좀 더 주실 수 있나요?', translation: 'Could I have some extra towels?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-15', text: '객실에 무료 와이파이가 있나요?', translation: 'Is there free WiFi in the room?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-16', text: '숙박을 연장하고 싶습니다.', translation: 'I would like to extend my stay.', category: 'travel', language: 'ko', difficulty: 'medium' },
  // 식당
  { id: 'ko-travel-17', text: '2명 자리 부탁드립니다.', translation: 'A table for two please.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-18', text: '메뉴판 좀 볼 수 있을까요?', translation: 'Can I see the menu please?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-19', text: '뭘 추천하시나요?', translation: 'What do you recommend?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-20', text: '저는 땅콩 알레르기가 있어요.', translation: 'I am allergic to peanuts.', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-21', text: '계산서 주시겠어요?', translation: 'Could we have the bill please?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-22', text: '이 음식은 매운가요?', translation: 'Is this dish spicy?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-23', text: '포장해 주실 수 있나요?', translation: 'Can I have this to go?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-24', text: '신용카드 받으시나요?', translation: 'Do you accept credit cards?', category: 'travel', language: 'ko', difficulty: 'easy' },
  // 관광
  { id: 'ko-travel-25', text: '박물관에 어떻게 가나요?', translation: 'How do I get to the museum?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-26', text: '영업 시간이 어떻게 되나요?', translation: 'What are the opening hours?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-27', text: '입장료가 얼마인가요?', translation: 'How much is the entrance fee?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-28', text: '가이드 투어가 있나요?', translation: 'Is there a guided tour?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-29', text: '여기서 사진 찍어도 되나요?', translation: 'Can I take pictures here?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-30', text: '관광 안내소가 어디인가요?', translation: 'Where is the tourist information center?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-31', text: '꼭 봐야 할 명소가 어디인가요?', translation: 'What are the must-see attractions?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-32', text: '이곳은 휠체어 접근이 가능한가요?', translation: 'Is this place wheelchair accessible?', category: 'travel', language: 'ko', difficulty: 'hard' },
  // 교통
  { id: 'ko-travel-33', text: '가장 가까운 지하철역이 어디인가요?', translation: 'Where is the nearest subway station?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-34', text: '시내까지 택시비가 얼마인가요?', translation: 'How much is the taxi fare to downtown?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-35', text: '이 버스가 공항에 가나요?', translation: 'Does this bus go to the airport?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-36', text: '차를 렌트하고 싶습니다.', translation: 'I would like to rent a car.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-37', text: '기차표를 어디서 살 수 있나요?', translation: 'Where can I buy a train ticket?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-38', text: '거기까지 얼마나 걸리나요?', translation: 'How long does it take to get there?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-39', text: '이 주소로 데려다 주세요.', translation: 'Please take me to this address.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-40', text: '여기서 내려주세요.', translation: 'Can you stop here please?', category: 'travel', language: 'ko', difficulty: 'easy' },
  // 쇼핑
  { id: 'ko-travel-41', text: '이거 얼마인가요?', translation: 'How much does this cost?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-42', text: '이거 입어봐도 될까요?', translation: 'Can I try this on?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-43', text: '다른 사이즈 있나요?', translation: 'Do you have this in a different size?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-44', text: '할인 받을 수 있나요?', translation: 'Can I get a discount?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-45', text: '그냥 구경하는 중이에요.', translation: 'I am just looking around.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-46', text: '탈의실이 어디인가요?', translation: 'Where is the fitting room?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-47', text: '세금 환급 받을 수 있나요?', translation: 'Can I get a tax refund?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-48', text: '다른 색상 있나요?', translation: 'Do you have this in another color?', category: 'travel', language: 'ko', difficulty: 'easy' },
  // 긴급상황
  { id: 'ko-travel-49', text: '도움이 필요합니다.', translation: 'I need help please.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-50', text: '여권을 잃어버렸어요.', translation: 'I lost my passport.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-51', text: '가장 가까운 병원이 어디인가요?', translation: 'Where is the nearest hospital?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-52', text: '의사를 만나야 해요.', translation: 'I need to see a doctor.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-53', text: '경찰을 불러주세요.', translation: 'Please call the police.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-54', text: '몸이 안 좋아요.', translation: 'I am not feeling well.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-55', text: '약국이 어디인가요?', translation: 'Where is the pharmacy?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-56', text: '지갑을 도둑맞았어요.', translation: 'My wallet was stolen.', category: 'travel', language: 'ko', difficulty: 'easy' },
  // 일반 여행 표현
  { id: 'ko-travel-57', text: '영어 하시나요?', translation: 'Do you speak English?', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-58', text: '이해가 안 돼요.', translation: 'I do not understand.', category: 'travel', language: 'ko', difficulty: 'easy' },
  { id: 'ko-travel-59', text: '좀 더 천천히 말씀해 주시겠어요?', translation: 'Could you speak more slowly?', category: 'travel', language: 'ko', difficulty: 'medium' },
  { id: 'ko-travel-60', text: '도와주셔서 감사합니다.', translation: 'Thank you for your help.', category: 'travel', language: 'ko', difficulty: 'easy' },
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
