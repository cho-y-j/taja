// 기본 단어 연습 데이터 - 대폭 확장 버전

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

export interface WordWithMeaning {
  word: string;
  meaning: string;
}

// 영어 단어 데이터 (레벨별) - 대폭 확장
export const englishWordsWithMeaning: Record<number, WordWithMeaning[]> = {
  1: [
    // 기본 동사
    { word: 'go', meaning: '가다' }, { word: 'do', meaning: '하다' }, { word: 'be', meaning: '~이다' },
    { word: 'is', meaning: '~이다' }, { word: 'am', meaning: '~이다' }, { word: 'to', meaning: '~로' },
    // 대명사
    { word: 'I', meaning: '나' }, { word: 'we', meaning: '우리' }, { word: 'he', meaning: '그' },
    { word: 'me', meaning: '나를' }, { word: 'us', meaning: '우리를' }, { word: 'it', meaning: '그것' },
    // 전치사/접속사
    { word: 'in', meaning: '안에' }, { word: 'on', meaning: '위에' }, { word: 'at', meaning: '~에' },
    { word: 'up', meaning: '위로' }, { word: 'so', meaning: '그래서' }, { word: 'or', meaning: '또는' },
    { word: 'if', meaning: '만약' }, { word: 'as', meaning: '~로서' }, { word: 'by', meaning: '~에 의해' },
    // 형용사/부사
    { word: 'no', meaning: '아니' }, { word: 'ok', meaning: '좋아' }, { word: 'hi', meaning: '안녕' },
    { word: 'my', meaning: '나의' }, { word: 'an', meaning: '하나의' },
    // 명사
    { word: 'ax', meaning: '도끼' }, { word: 'ox', meaning: '황소' }, { word: 'ad', meaning: '광고' },
    { word: 'TV', meaning: '텔레비전' }, { word: 'PC', meaning: '컴퓨터' },
    // 추가 단어
    { word: 'of', meaning: '~의' }, { word: 'oh', meaning: '오' }, { word: 'ah', meaning: '아' },
    { word: 'ex', meaning: '전' }, { word: 'vs', meaning: '대' },
    // 3글자 쉬운 단어
    { word: 'cat', meaning: '고양이' }, { word: 'dog', meaning: '개' }, { word: 'sun', meaning: '태양' },
    { word: 'bus', meaning: '버스' }, { word: 'car', meaning: '자동차' }, { word: 'box', meaning: '상자' },
    { word: 'cup', meaning: '컵' }, { word: 'hat', meaning: '모자' }, { word: 'map', meaning: '지도' },
    { word: 'pen', meaning: '펜' }, { word: 'bag', meaning: '가방' }, { word: 'bed', meaning: '침대' },
    { word: 'egg', meaning: '계란' }, { word: 'ice', meaning: '얼음' }, { word: 'key', meaning: '열쇠' },
    { word: 'leg', meaning: '다리' }, { word: 'arm', meaning: '팔' }, { word: 'eye', meaning: '눈' },
    { word: 'ear', meaning: '귀' }, { word: 'toe', meaning: '발가락' }, { word: 'lip', meaning: '입술' },
    { word: 'air', meaning: '공기' }, { word: 'sky', meaning: '하늘' }, { word: 'sea', meaning: '바다' },
    { word: 'tea', meaning: '차' }, { word: 'pie', meaning: '파이' }, { word: 'jam', meaning: '잼' },
    { word: 'nut', meaning: '견과류' }, { word: 'oil', meaning: '기름' }, { word: 'gas', meaning: '가스' },
    { word: 'hot', meaning: '뜨거운' }, { word: 'wet', meaning: '젖은' }, { word: 'dry', meaning: '마른' },
    { word: 'old', meaning: '오래된' }, { word: 'new', meaning: '새로운' }, { word: 'big', meaning: '큰' },
    { word: 'fat', meaning: '뚱뚱한' }, { word: 'sad', meaning: '슬픈' }, { word: 'mad', meaning: '화난' },
    { word: 'bad', meaning: '나쁜' }, { word: 'red', meaning: '빨간' }, { word: 'run', meaning: '달리다' },
    { word: 'sit', meaning: '앉다' }, { word: 'eat', meaning: '먹다' }, { word: 'see', meaning: '보다' },
    { word: 'say', meaning: '말하다' }, { word: 'ask', meaning: '묻다' }, { word: 'try', meaning: '시도하다' },
    { word: 'cry', meaning: '울다' }, { word: 'fly', meaning: '날다' }, { word: 'buy', meaning: '사다' },
    { word: 'cut', meaning: '자르다' }, { word: 'put', meaning: '놓다' }, { word: 'get', meaning: '얻다' },
    { word: 'let', meaning: '~하게 하다' }, { word: 'set', meaning: '설정하다' }, { word: 'hit', meaning: '치다' },
    { word: 'win', meaning: '이기다' }, { word: 'mix', meaning: '섞다' }, { word: 'fix', meaning: '고치다' },
    { word: 'add', meaning: '더하다' }, { word: 'end', meaning: '끝' }, { word: 'top', meaning: '꼭대기' },
    { word: 'job', meaning: '직업' }, { word: 'fun', meaning: '재미' }, { word: 'gym', meaning: '체육관' },
    { word: 'art', meaning: '예술' }, { word: 'act', meaning: '행동' }, { word: 'age', meaning: '나이' },
    { word: 'aim', meaning: '목표' }, { word: 'bay', meaning: '만' }, { word: 'bee', meaning: '벌' },
    { word: 'bit', meaning: '조금' }, { word: 'bow', meaning: '활' }, { word: 'bug', meaning: '벌레' },
    { word: 'cab', meaning: '택시' }, { word: 'can', meaning: '캔' }, { word: 'cow', meaning: '소' },
    { word: 'dam', meaning: '댐' }, { word: 'den', meaning: '굴' }, { word: 'dew', meaning: '이슬' },
    { word: 'dot', meaning: '점' }, { word: 'dye', meaning: '염료' }, { word: 'eel', meaning: '뱀장어' },
    { word: 'elm', meaning: '느릅나무' }, { word: 'era', meaning: '시대' }, { word: 'eve', meaning: '전야' },
    { word: 'fan', meaning: '선풍기' }, { word: 'fee', meaning: '요금' }, { word: 'fig', meaning: '무화과' },
    { word: 'fin', meaning: '지느러미' }, { word: 'fir', meaning: '전나무' }, { word: 'fog', meaning: '안개' },
    { word: 'fox', meaning: '여우' }, { word: 'fur', meaning: '털' }, { word: 'gap', meaning: '틈' },
    { word: 'gem', meaning: '보석' }, { word: 'gin', meaning: '진' }, { word: 'gum', meaning: '껌' },
    { word: 'gut', meaning: '내장' }, { word: 'hay', meaning: '건초' }, { word: 'hem', meaning: '단' },
    { word: 'hen', meaning: '암탉' }, { word: 'hog', meaning: '돼지' }, { word: 'hop', meaning: '뛰다' },
    { word: 'hub', meaning: '중심' }, { word: 'hue', meaning: '색조' }, { word: 'hug', meaning: '포옹' },
    { word: 'hut', meaning: '오두막' }, { word: 'ink', meaning: '잉크' }, { word: 'inn', meaning: '여관' },
    { word: 'ion', meaning: '이온' }, { word: 'ivy', meaning: '담쟁이' }, { word: 'jar', meaning: '병' },
    { word: 'jaw', meaning: '턱' }, { word: 'jay', meaning: '어치' }, { word: 'jet', meaning: '제트기' },
    { word: 'jog', meaning: '조깅' }, { word: 'joy', meaning: '기쁨' }, { word: 'jug', meaning: '주전자' },
  ],
  2: [
    // 관사/접속사
    { word: 'the', meaning: '그' }, { word: 'and', meaning: '그리고' }, { word: 'but', meaning: '하지만' },
    { word: 'for', meaning: '~를 위해' }, { word: 'are', meaning: '~이다' }, { word: 'not', meaning: '아니다' },
    { word: 'you', meaning: '너' }, { word: 'all', meaning: '모든' }, { word: 'can', meaning: '할 수 있다' },
    { word: 'had', meaning: '가졌다' }, { word: 'her', meaning: '그녀의' }, { word: 'was', meaning: '~였다' },
    { word: 'one', meaning: '하나' }, { word: 'our', meaning: '우리의' }, { word: 'out', meaning: '밖으로' },
    { word: 'day', meaning: '날' }, { word: 'has', meaning: '가지다' }, { word: 'him', meaning: '그를' },
    { word: 'his', meaning: '그의' }, { word: 'how', meaning: '어떻게' }, { word: 'its', meaning: '그것의' },
    { word: 'may', meaning: '~할지도' }, { word: 'now', meaning: '지금' }, { word: 'two', meaning: '둘' },
    { word: 'way', meaning: '길' }, { word: 'who', meaning: '누구' }, { word: 'boy', meaning: '소년' },
    { word: 'did', meaning: '했다' }, { word: 'man', meaning: '남자' }, { word: 'any', meaning: '어떤' },
    { word: 'own', meaning: '자신의' }, { word: 'she', meaning: '그녀' }, { word: 'too', meaning: '또한' },
    { word: 'use', meaning: '사용하다' },
    // 음식
    { word: 'food', meaning: '음식' }, { word: 'meat', meaning: '고기' }, { word: 'fish', meaning: '생선' },
    { word: 'rice', meaning: '쌀' }, { word: 'soup', meaning: '수프' }, { word: 'cake', meaning: '케이크' },
    { word: 'milk', meaning: '우유' }, { word: 'wine', meaning: '와인' }, { word: 'beer', meaning: '맥주' },
    { word: 'salt', meaning: '소금' }, { word: 'corn', meaning: '옥수수' }, { word: 'bean', meaning: '콩' },
    { word: 'pork', meaning: '돼지고기' }, { word: 'beef', meaning: '소고기' }, { word: 'lamb', meaning: '양고기' },
    // 동물
    { word: 'bird', meaning: '새' }, { word: 'bear', meaning: '곰' }, { word: 'deer', meaning: '사슴' },
    { word: 'duck', meaning: '오리' }, { word: 'frog', meaning: '개구리' }, { word: 'goat', meaning: '염소' },
    { word: 'lion', meaning: '사자' }, { word: 'wolf', meaning: '늑대' }, { word: 'fish', meaning: '물고기' },
    { word: 'crab', meaning: '게' }, { word: 'moth', meaning: '나방' }, { word: 'worm', meaning: '벌레' },
    // 자연
    { word: 'tree', meaning: '나무' }, { word: 'leaf', meaning: '잎' }, { word: 'rain', meaning: '비' },
    { word: 'snow', meaning: '눈' }, { word: 'wind', meaning: '바람' }, { word: 'fire', meaning: '불' },
    { word: 'rock', meaning: '바위' }, { word: 'sand', meaning: '모래' }, { word: 'lake', meaning: '호수' },
    { word: 'hill', meaning: '언덕' }, { word: 'wave', meaning: '파도' }, { word: 'star', meaning: '별' },
    { word: 'moon', meaning: '달' }, { word: 'dust', meaning: '먼지' }, { word: 'soil', meaning: '흙' },
    // 신체
    { word: 'hand', meaning: '손' }, { word: 'foot', meaning: '발' }, { word: 'face', meaning: '얼굴' },
    { word: 'head', meaning: '머리' }, { word: 'hair', meaning: '머리카락' }, { word: 'back', meaning: '등' },
    { word: 'neck', meaning: '목' }, { word: 'nose', meaning: '코' }, { word: 'knee', meaning: '무릎' },
    { word: 'bone', meaning: '뼈' }, { word: 'skin', meaning: '피부' }, { word: 'chin', meaning: '턱' },
    // 가정용품
    { word: 'door', meaning: '문' }, { word: 'wall', meaning: '벽' }, { word: 'roof', meaning: '지붕' },
    { word: 'room', meaning: '방' }, { word: 'desk', meaning: '책상' }, { word: 'lamp', meaning: '램프' },
    { word: 'sofa', meaning: '소파' }, { word: 'bowl', meaning: '그릇' }, { word: 'fork', meaning: '포크' },
    { word: 'dish', meaning: '접시' }, { word: 'oven', meaning: '오븐' }, { word: 'sink', meaning: '싱크대' },
    // 의류
    { word: 'coat', meaning: '코트' }, { word: 'shoe', meaning: '신발' }, { word: 'sock', meaning: '양말' },
    { word: 'belt', meaning: '벨트' }, { word: 'suit', meaning: '정장' }, { word: 'jean', meaning: '청바지' },
    // 색상
    { word: 'blue', meaning: '파란' }, { word: 'gold', meaning: '금색' }, { word: 'gray', meaning: '회색' },
    { word: 'pink', meaning: '분홍' }, { word: 'navy', meaning: '남색' },
    // 감정/상태
    { word: 'love', meaning: '사랑' }, { word: 'hate', meaning: '미움' }, { word: 'fear', meaning: '공포' },
    { word: 'hope', meaning: '희망' }, { word: 'pain', meaning: '고통' }, { word: 'calm', meaning: '차분한' },
    { word: 'glad', meaning: '기쁜' }, { word: 'kind', meaning: '친절한' }, { word: 'cool', meaning: '시원한' },
    { word: 'warm', meaning: '따뜻한' }, { word: 'cold', meaning: '추운' }, { word: 'fast', meaning: '빠른' },
    { word: 'slow', meaning: '느린' }, { word: 'hard', meaning: '단단한' }, { word: 'soft', meaning: '부드러운' },
    { word: 'loud', meaning: '시끄러운' }, { word: 'weak', meaning: '약한' }, { word: 'safe', meaning: '안전한' },
    { word: 'rich', meaning: '부유한' }, { word: 'poor', meaning: '가난한' }, { word: 'true', meaning: '진실' },
    { word: 'fake', meaning: '가짜' }, { word: 'real', meaning: '진짜' }, { word: 'free', meaning: '자유로운' },
    { word: 'busy', meaning: '바쁜' }, { word: 'lazy', meaning: '게으른' }, { word: 'easy', meaning: '쉬운' },
    // 동사
    { word: 'walk', meaning: '걷다' }, { word: 'talk', meaning: '말하다' }, { word: 'look', meaning: '보다' },
    { word: 'read', meaning: '읽다' }, { word: 'work', meaning: '일하다' }, { word: 'play', meaning: '놀다' },
    { word: 'stay', meaning: '머무르다' }, { word: 'wait', meaning: '기다리다' }, { word: 'help', meaning: '돕다' },
    { word: 'stop', meaning: '멈추다' }, { word: 'start', meaning: '시작하다' }, { word: 'move', meaning: '움직이다' },
    { word: 'turn', meaning: '돌다' }, { word: 'jump', meaning: '점프하다' }, { word: 'swim', meaning: '수영하다' },
    { word: 'sing', meaning: '노래하다' }, { word: 'draw', meaning: '그리다' }, { word: 'push', meaning: '밀다' },
    { word: 'pull', meaning: '당기다' }, { word: 'wash', meaning: '씻다' }, { word: 'cook', meaning: '요리하다' },
    { word: 'open', meaning: '열다' }, { word: 'shut', meaning: '닫다' }, { word: 'pick', meaning: '고르다' },
    { word: 'drop', meaning: '떨어뜨리다' }, { word: 'hold', meaning: '잡다' }, { word: 'send', meaning: '보내다' },
    { word: 'feel', meaning: '느끼다' }, { word: 'hear', meaning: '듣다' }, { word: 'show', meaning: '보여주다' },
    { word: 'give', meaning: '주다' }, { word: 'take', meaning: '가져가다' }, { word: 'make', meaning: '만들다' },
    { word: 'come', meaning: '오다' }, { word: 'know', meaning: '알다' }, { word: 'want', meaning: '원하다' },
    { word: 'need', meaning: '필요하다' }, { word: 'like', meaning: '좋아하다' }, { word: 'find', meaning: '찾다' },
    { word: 'tell', meaning: '말하다' }, { word: 'call', meaning: '부르다' }, { word: 'keep', meaning: '유지하다' },
    { word: 'lose', meaning: '잃다' }, { word: 'grow', meaning: '자라다' }, { word: 'fall', meaning: '떨어지다' },
    { word: 'rise', meaning: '오르다' }, { word: 'rest', meaning: '쉬다' }, { word: 'wake', meaning: '깨다' },
    // 시간
    { word: 'time', meaning: '시간' }, { word: 'hour', meaning: '시' }, { word: 'week', meaning: '주' },
    { word: 'year', meaning: '년' }, { word: 'date', meaning: '날짜' }, { word: 'past', meaning: '과거' },
    // 장소
    { word: 'home', meaning: '집' }, { word: 'city', meaning: '도시' }, { word: 'town', meaning: '마을' },
    { word: 'road', meaning: '길' }, { word: 'park', meaning: '공원' }, { word: 'shop', meaning: '가게' },
    { word: 'bank', meaning: '은행' }, { word: 'farm', meaning: '농장' }, { word: 'jail', meaning: '감옥' },
    // 기타
    { word: 'news', meaning: '뉴스' }, { word: 'game', meaning: '게임' }, { word: 'book', meaning: '책' },
    { word: 'song', meaning: '노래' }, { word: 'film', meaning: '영화' }, { word: 'fact', meaning: '사실' },
    { word: 'idea', meaning: '아이디어' }, { word: 'plan', meaning: '계획' }, { word: 'team', meaning: '팀' },
    { word: 'rule', meaning: '규칙' }, { word: 'test', meaning: '시험' }, { word: 'sign', meaning: '기호' },
    { word: 'card', meaning: '카드' }, { word: 'gift', meaning: '선물' }, { word: 'trip', meaning: '여행' },
    { word: 'step', meaning: '발걸음' }, { word: 'size', meaning: '크기' }, { word: 'cost', meaning: '비용' },
    { word: 'deal', meaning: '거래' }, { word: 'race', meaning: '경주' }, { word: 'term', meaning: '용어' },
  ],
  3: [
    // 기본 중요 단어
    { word: 'that', meaning: '저것' }, { word: 'with', meaning: '~와 함께' }, { word: 'have', meaning: '가지다' },
    { word: 'this', meaning: '이것' }, { word: 'will', meaning: '~할 것이다' }, { word: 'your', meaning: '너의' },
    { word: 'from', meaning: '~로부터' }, { word: 'they', meaning: '그들' }, { word: 'been', meaning: '~였다' },
    { word: 'each', meaning: '각각' }, { word: 'just', meaning: '단지' }, { word: 'long', meaning: '긴' },
    { word: 'many', meaning: '많은' }, { word: 'more', meaning: '더' }, { word: 'much', meaning: '많이' },
    { word: 'name', meaning: '이름' }, { word: 'only', meaning: '오직' }, { word: 'over', meaning: '위로' },
    { word: 'part', meaning: '부분' }, { word: 'seem', meaning: '~처럼 보이다' }, { word: 'some', meaning: '일부' },
    { word: 'than', meaning: '~보다' }, { word: 'them', meaning: '그들을' }, { word: 'then', meaning: '그때' },
    { word: 'what', meaning: '무엇' }, { word: 'when', meaning: '언제' },
    // 동사
    { word: 'begin', meaning: '시작하다' }, { word: 'bring', meaning: '가져오다' }, { word: 'build', meaning: '짓다' },
    { word: 'carry', meaning: '나르다' }, { word: 'catch', meaning: '잡다' }, { word: 'change', meaning: '바꾸다' },
    { word: 'check', meaning: '확인하다' }, { word: 'clean', meaning: '청소하다' }, { word: 'clear', meaning: '치우다' },
    { word: 'climb', meaning: '오르다' }, { word: 'close', meaning: '닫다' }, { word: 'count', meaning: '세다' },
    { word: 'cover', meaning: '덮다' }, { word: 'cross', meaning: '건너다' }, { word: 'dance', meaning: '춤추다' },
    { word: 'drink', meaning: '마시다' }, { word: 'drive', meaning: '운전하다' }, { word: 'enjoy', meaning: '즐기다' },
    { word: 'enter', meaning: '들어가다' }, { word: 'fight', meaning: '싸우다' }, { word: 'finish', meaning: '끝내다' },
    { word: 'focus', meaning: '집중하다' }, { word: 'force', meaning: '강요하다' }, { word: 'guess', meaning: '추측하다' },
    { word: 'laugh', meaning: '웃다' }, { word: 'learn', meaning: '배우다' }, { word: 'leave', meaning: '떠나다' },
    { word: 'offer', meaning: '제안하다' }, { word: 'order', meaning: '주문하다' }, { word: 'place', meaning: '놓다' },
    { word: 'plant', meaning: '심다' }, { word: 'point', meaning: '가리키다' }, { word: 'press', meaning: '누르다' },
    { word: 'raise', meaning: '올리다' }, { word: 'reach', meaning: '도달하다' }, { word: 'serve', meaning: '봉사하다' },
    { word: 'share', meaning: '나누다' }, { word: 'sleep', meaning: '자다' }, { word: 'smile', meaning: '미소짓다' },
    { word: 'speak', meaning: '말하다' }, { word: 'spend', meaning: '쓰다' }, { word: 'stand', meaning: '서다' },
    { word: 'study', meaning: '공부하다' }, { word: 'teach', meaning: '가르치다' }, { word: 'thank', meaning: '감사하다' },
    { word: 'think', meaning: '생각하다' }, { word: 'throw', meaning: '던지다' }, { word: 'touch', meaning: '만지다' },
    { word: 'train', meaning: '훈련하다' }, { word: 'trust', meaning: '신뢰하다' }, { word: 'visit', meaning: '방문하다' },
    { word: 'watch', meaning: '보다' }, { word: 'worry', meaning: '걱정하다' }, { word: 'write', meaning: '쓰다' },
    // 명사
    { word: 'apple', meaning: '사과' }, { word: 'beach', meaning: '해변' }, { word: 'brain', meaning: '뇌' },
    { word: 'bread', meaning: '빵' }, { word: 'chair', meaning: '의자' }, { word: 'child', meaning: '아이' },
    { word: 'class', meaning: '수업' }, { word: 'clock', meaning: '시계' }, { word: 'cloud', meaning: '구름' },
    { word: 'color', meaning: '색' }, { word: 'dream', meaning: '꿈' }, { word: 'earth', meaning: '지구' },
    { word: 'enemy', meaning: '적' }, { word: 'event', meaning: '행사' }, { word: 'field', meaning: '들판' },
    { word: 'floor', meaning: '바닥' }, { word: 'fruit', meaning: '과일' }, { word: 'glass', meaning: '유리' },
    { word: 'grass', meaning: '풀' }, { word: 'green', meaning: '초록' }, { word: 'group', meaning: '그룹' },
    { word: 'guide', meaning: '안내' }, { word: 'heart', meaning: '심장' }, { word: 'horse', meaning: '말' },
    { word: 'hotel', meaning: '호텔' }, { word: 'house', meaning: '집' }, { word: 'image', meaning: '이미지' },
    { word: 'juice', meaning: '주스' }, { word: 'knife', meaning: '칼' }, { word: 'layer', meaning: '층' },
    { word: 'level', meaning: '수준' }, { word: 'light', meaning: '빛' }, { word: 'lunch', meaning: '점심' },
    { word: 'match', meaning: '경기' }, { word: 'metal', meaning: '금속' }, { word: 'money', meaning: '돈' },
    { word: 'month', meaning: '달' }, { word: 'mouse', meaning: '쥐' }, { word: 'movie', meaning: '영화' },
    { word: 'music', meaning: '음악' }, { word: 'night', meaning: '밤' }, { word: 'noise', meaning: '소음' },
    { word: 'nurse', meaning: '간호사' }, { word: 'ocean', meaning: '바다' }, { word: 'owner', meaning: '주인' },
    { word: 'paper', meaning: '종이' }, { word: 'party', meaning: '파티' }, { word: 'peace', meaning: '평화' },
    { word: 'phone', meaning: '전화' }, { word: 'photo', meaning: '사진' }, { word: 'piece', meaning: '조각' },
    { word: 'pilot', meaning: '조종사' }, { word: 'pizza', meaning: '피자' }, { word: 'plane', meaning: '비행기' },
    { word: 'plate', meaning: '접시' }, { word: 'power', meaning: '힘' }, { word: 'price', meaning: '가격' },
    { word: 'queen', meaning: '여왕' }, { word: 'radio', meaning: '라디오' }, { word: 'river', meaning: '강' },
    { word: 'robot', meaning: '로봇' }, { word: 'salad', meaning: '샐러드' }, { word: 'sauce', meaning: '소스' },
    { word: 'scene', meaning: '장면' }, { word: 'shape', meaning: '모양' }, { word: 'shirt', meaning: '셔츠' },
    { word: 'smell', meaning: '냄새' }, { word: 'snake', meaning: '뱀' }, { word: 'sound', meaning: '소리' },
    { word: 'space', meaning: '공간' }, { word: 'sport', meaning: '스포츠' }, { word: 'stage', meaning: '무대' },
    { word: 'state', meaning: '상태' }, { word: 'stone', meaning: '돌' }, { word: 'store', meaning: '가게' },
    { word: 'storm', meaning: '폭풍' }, { word: 'story', meaning: '이야기' }, { word: 'style', meaning: '스타일' },
    { word: 'sugar', meaning: '설탕' }, { word: 'table', meaning: '테이블' }, { word: 'taste', meaning: '맛' },
    { word: 'tiger', meaning: '호랑이' }, { word: 'today', meaning: '오늘' }, { word: 'tooth', meaning: '이빨' },
    { word: 'topic', meaning: '주제' }, { word: 'tower', meaning: '탑' }, { word: 'trade', meaning: '무역' },
    { word: 'trial', meaning: '재판' }, { word: 'truth', meaning: '진실' }, { word: 'uncle', meaning: '삼촌' },
    { word: 'value', meaning: '가치' }, { word: 'video', meaning: '비디오' }, { word: 'voice', meaning: '목소리' },
    { word: 'waste', meaning: '낭비' }, { word: 'water', meaning: '물' }, { word: 'wheel', meaning: '바퀴' },
    { word: 'white', meaning: '흰색' }, { word: 'woman', meaning: '여자' }, { word: 'world', meaning: '세계' },
    { word: 'young', meaning: '젊은' }, { word: 'youth', meaning: '청춘' },
    // 형용사
    { word: 'angry', meaning: '화난' }, { word: 'basic', meaning: '기본적인' }, { word: 'black', meaning: '검은' },
    { word: 'brave', meaning: '용감한' }, { word: 'brief', meaning: '짧은' }, { word: 'brown', meaning: '갈색' },
    { word: 'cheap', meaning: '싼' }, { word: 'clean', meaning: '깨끗한' }, { word: 'crazy', meaning: '미친' },
    { word: 'daily', meaning: '매일의' }, { word: 'dirty', meaning: '더러운' }, { word: 'early', meaning: '이른' },
    { word: 'empty', meaning: '빈' }, { word: 'equal', meaning: '동등한' }, { word: 'exact', meaning: '정확한' },
    { word: 'extra', meaning: '추가의' }, { word: 'false', meaning: '거짓의' }, { word: 'final', meaning: '최종의' },
    { word: 'first', meaning: '첫 번째' }, { word: 'fresh', meaning: '신선한' }, { word: 'front', meaning: '앞의' },
    { word: 'funny', meaning: '웃긴' }, { word: 'giant', meaning: '거대한' }, { word: 'grand', meaning: '웅장한' },
    { word: 'great', meaning: '위대한' }, { word: 'happy', meaning: '행복한' }, { word: 'heavy', meaning: '무거운' },
    { word: 'human', meaning: '인간의' }, { word: 'inner', meaning: '안쪽의' }, { word: 'large', meaning: '큰' },
    { word: 'later', meaning: '나중의' }, { word: 'local', meaning: '지역의' }, { word: 'lucky', meaning: '운 좋은' },
    { word: 'magic', meaning: '마법의' }, { word: 'major', meaning: '주요한' }, { word: 'minor', meaning: '작은' },
    { word: 'moral', meaning: '도덕적' }, { word: 'quick', meaning: '빠른' }, { word: 'quiet', meaning: '조용한' },
    { word: 'ready', meaning: '준비된' }, { word: 'right', meaning: '올바른' }, { word: 'rough', meaning: '거친' },
    { word: 'royal', meaning: '왕실의' }, { word: 'sharp', meaning: '날카로운' }, { word: 'short', meaning: '짧은' },
    { word: 'silly', meaning: '어리석은' }, { word: 'small', meaning: '작은' }, { word: 'smart', meaning: '똑똑한' },
    { word: 'sorry', meaning: '미안한' }, { word: 'sweet', meaning: '달콤한' }, { word: 'thick', meaning: '두꺼운' },
    { word: 'tight', meaning: '꽉 끼는' }, { word: 'tired', meaning: '피곤한' }, { word: 'total', meaning: '총' },
    { word: 'upper', meaning: '위쪽의' }, { word: 'urban', meaning: '도시의' }, { word: 'usual', meaning: '보통의' },
    { word: 'whole', meaning: '전체의' }, { word: 'wrong', meaning: '잘못된' },
  ],
  4: [
    // 동사
    { word: 'accept', meaning: '받아들이다' }, { word: 'achieve', meaning: '달성하다' }, { word: 'afford', meaning: '여유가 있다' },
    { word: 'appear', meaning: '나타나다' }, { word: 'arrive', meaning: '도착하다' }, { word: 'attack', meaning: '공격하다' },
    { word: 'become', meaning: '되다' }, { word: 'behave', meaning: '행동하다' }, { word: 'belong', meaning: '속하다' },
    { word: 'borrow', meaning: '빌리다' }, { word: 'cancel', meaning: '취소하다' }, { word: 'choose', meaning: '선택하다' },
    { word: 'commit', meaning: '저지르다' }, { word: 'compare', meaning: '비교하다' }, { word: 'compete', meaning: '경쟁하다' },
    { word: 'connect', meaning: '연결하다' }, { word: 'contain', meaning: '포함하다' }, { word: 'control', meaning: '조종하다' },
    { word: 'create', meaning: '창조하다' }, { word: 'decide', meaning: '결정하다' }, { word: 'defend', meaning: '방어하다' },
    { word: 'deliver', meaning: '배달하다' }, { word: 'depend', meaning: '의지하다' }, { word: 'design', meaning: '디자인하다' },
    { word: 'destroy', meaning: '파괴하다' }, { word: 'develop', meaning: '발전하다' }, { word: 'differ', meaning: '다르다' },
    { word: 'direct', meaning: '지시하다' }, { word: 'divide', meaning: '나누다' }, { word: 'double', meaning: '두 배로 하다' },
    { word: 'enable', meaning: '가능하게 하다' }, { word: 'escape', meaning: '탈출하다' }, { word: 'except', meaning: '제외하다' },
    { word: 'expect', meaning: '기대하다' }, { word: 'explain', meaning: '설명하다' }, { word: 'export', meaning: '수출하다' },
    { word: 'extend', meaning: '확장하다' }, { word: 'follow', meaning: '따르다' }, { word: 'forget', meaning: '잊다' },
    { word: 'handle', meaning: '다루다' }, { word: 'happen', meaning: '일어나다' }, { word: 'ignore', meaning: '무시하다' },
    { word: 'import', meaning: '수입하다' }, { word: 'improve', meaning: '향상하다' }, { word: 'include', meaning: '포함하다' },
    { word: 'inform', meaning: '알리다' }, { word: 'insist', meaning: '주장하다' }, { word: 'intend', meaning: '의도하다' },
    { word: 'invent', meaning: '발명하다' }, { word: 'invest', meaning: '투자하다' }, { word: 'invite', meaning: '초대하다' },
    { word: 'listen', meaning: '듣다' }, { word: 'manage', meaning: '관리하다' }, { word: 'matter', meaning: '중요하다' },
    { word: 'notice', meaning: '알아차리다' }, { word: 'obtain', meaning: '얻다' }, { word: 'operate', meaning: '작동하다' },
    { word: 'oppose', meaning: '반대하다' }, { word: 'permit', meaning: '허락하다' }, { word: 'prefer', meaning: '선호하다' },
    { word: 'prepare', meaning: '준비하다' }, { word: 'prevent', meaning: '막다' }, { word: 'produce', meaning: '생산하다' },
    { word: 'promise', meaning: '약속하다' }, { word: 'protect', meaning: '보호하다' }, { word: 'provide', meaning: '제공하다' },
    { word: 'publish', meaning: '출판하다' }, { word: 'pursue', meaning: '추구하다' }, { word: 'realize', meaning: '깨닫다' },
    { word: 'receive', meaning: '받다' }, { word: 'record', meaning: '기록하다' }, { word: 'reduce', meaning: '줄이다' },
    { word: 'reflect', meaning: '반영하다' }, { word: 'refuse', meaning: '거절하다' }, { word: 'release', meaning: '풀어주다' },
    { word: 'remain', meaning: '남다' }, { word: 'remove', meaning: '제거하다' }, { word: 'repeat', meaning: '반복하다' },
    { word: 'replace', meaning: '교체하다' }, { word: 'report', meaning: '보고하다' }, { word: 'require', meaning: '요구하다' },
    { word: 'rescue', meaning: '구조하다' }, { word: 'respect', meaning: '존경하다' }, { word: 'respond', meaning: '응답하다' },
    { word: 'result', meaning: '결과를 낳다' }, { word: 'return', meaning: '돌아오다' }, { word: 'reveal', meaning: '드러내다' },
    { word: 'search', meaning: '검색하다' }, { word: 'select', meaning: '선택하다' }, { word: 'settle', meaning: '정착하다' },
    { word: 'spread', meaning: '퍼지다' }, { word: 'suffer', meaning: '고통받다' }, { word: 'supply', meaning: '공급하다' },
    { word: 'support', meaning: '지원하다' }, { word: 'suppose', meaning: '추측하다' }, { word: 'survive', meaning: '생존하다' },
    { word: 'travel', meaning: '여행하다' }, { word: 'wonder', meaning: '궁금해하다' },
    // 명사
    { word: 'access', meaning: '접근' }, { word: 'action', meaning: '행동' }, { word: 'advice', meaning: '조언' },
    { word: 'amount', meaning: '양' }, { word: 'answer', meaning: '대답' }, { word: 'artist', meaning: '예술가' },
    { word: 'attack', meaning: '공격' }, { word: 'author', meaning: '저자' }, { word: 'beauty', meaning: '아름다움' },
    { word: 'belief', meaning: '믿음' }, { word: 'border', meaning: '국경' }, { word: 'bottle', meaning: '병' },
    { word: 'branch', meaning: '가지' }, { word: 'bridge', meaning: '다리' }, { word: 'budget', meaning: '예산' },
    { word: 'button', meaning: '버튼' }, { word: 'camera', meaning: '카메라' }, { word: 'cancer', meaning: '암' },
    { word: 'career', meaning: '경력' }, { word: 'center', meaning: '중심' }, { word: 'chance', meaning: '기회' },
    { word: 'charge', meaning: '요금' }, { word: 'choice', meaning: '선택' }, { word: 'church', meaning: '교회' },
    { word: 'client', meaning: '고객' }, { word: 'coffee', meaning: '커피' }, { word: 'corner', meaning: '모퉁이' },
    { word: 'couple', meaning: '커플' }, { word: 'course', meaning: '과정' }, { word: 'credit', meaning: '신용' },
    { word: 'crisis', meaning: '위기' }, { word: 'culture', meaning: '문화' }, { word: 'damage', meaning: '손해' },
    { word: 'danger', meaning: '위험' }, { word: 'degree', meaning: '학위' }, { word: 'demand', meaning: '수요' },
    { word: 'detail', meaning: '세부사항' }, { word: 'device', meaning: '장치' }, { word: 'dinner', meaning: '저녁식사' },
    { word: 'doctor', meaning: '의사' }, { word: 'dollar', meaning: '달러' }, { word: 'editor', meaning: '편집자' },
    { word: 'effect', meaning: '효과' }, { word: 'effort', meaning: '노력' }, { word: 'energy', meaning: '에너지' },
    { word: 'engine', meaning: '엔진' }, { word: 'expert', meaning: '전문가' }, { word: 'factor', meaning: '요인' },
    { word: 'family', meaning: '가족' }, { word: 'father', meaning: '아버지' }, { word: 'figure', meaning: '수치' },
    { word: 'finger', meaning: '손가락' }, { word: 'flower', meaning: '꽃' }, { word: 'forest', meaning: '숲' },
    { word: 'format', meaning: '형식' }, { word: 'friend', meaning: '친구' }, { word: 'future', meaning: '미래' },
    { word: 'garden', meaning: '정원' }, { word: 'ground', meaning: '땅' }, { word: 'growth', meaning: '성장' },
    { word: 'health', meaning: '건강' }, { word: 'height', meaning: '높이' }, { word: 'island', meaning: '섬' },
    { word: 'itself', meaning: '그것 자체' }, { word: 'leader', meaning: '리더' }, { word: 'league', meaning: '리그' },
    { word: 'length', meaning: '길이' }, { word: 'lesson', meaning: '수업' }, { word: 'letter', meaning: '편지' },
    { word: 'liquid', meaning: '액체' }, { word: 'market', meaning: '시장' }, { word: 'master', meaning: '주인' },
    { word: 'matter', meaning: '문제' }, { word: 'member', meaning: '구성원' }, { word: 'memory', meaning: '기억' },
    { word: 'method', meaning: '방법' }, { word: 'middle', meaning: '중간' }, { word: 'minute', meaning: '분' },
    { word: 'mirror', meaning: '거울' }, { word: 'moment', meaning: '순간' }, { word: 'mother', meaning: '어머니' },
    { word: 'motion', meaning: '동작' }, { word: 'museum', meaning: '박물관' }, { word: 'nation', meaning: '국가' },
    { word: 'nature', meaning: '자연' }, { word: 'number', meaning: '숫자' }, { word: 'object', meaning: '물체' },
    { word: 'office', meaning: '사무실' }, { word: 'option', meaning: '선택권' }, { word: 'orange', meaning: '오렌지' },
    { word: 'origin', meaning: '기원' }, { word: 'output', meaning: '출력' }, { word: 'palace', meaning: '궁전' },
    { word: 'parent', meaning: '부모' }, { word: 'people', meaning: '사람들' }, { word: 'period', meaning: '기간' },
    { word: 'person', meaning: '사람' }, { word: 'planet', meaning: '행성' }, { word: 'player', meaning: '선수' },
    { word: 'please', meaning: '제발' }, { word: 'pocket', meaning: '주머니' }, { word: 'police', meaning: '경찰' },
    { word: 'policy', meaning: '정책' }, { word: 'potato', meaning: '감자' }, { word: 'prayer', meaning: '기도' },
    { word: 'prince', meaning: '왕자' }, { word: 'prison', meaning: '감옥' }, { word: 'profit', meaning: '이익' },
    { word: 'public', meaning: '대중' }, { word: 'reason', meaning: '이유' }, { word: 'record', meaning: '기록' },
    { word: 'region', meaning: '지역' }, { word: 'report', meaning: '보고서' }, { word: 'result', meaning: '결과' },
    { word: 'safety', meaning: '안전' }, { word: 'sample', meaning: '샘플' }, { word: 'school', meaning: '학교' },
    { word: 'screen', meaning: '화면' }, { word: 'season', meaning: '계절' }, { word: 'second', meaning: '초' },
    { word: 'secret', meaning: '비밀' }, { word: 'sector', meaning: '부문' }, { word: 'senior', meaning: '선배' },
    { word: 'series', meaning: '시리즈' }, { word: 'signal', meaning: '신호' }, { word: 'silver', meaning: '은' },
    { word: 'sister', meaning: '자매' }, { word: 'social', meaning: '사회적' }, { word: 'source', meaning: '출처' },
    { word: 'speech', meaning: '연설' }, { word: 'spirit', meaning: '정신' }, { word: 'spring', meaning: '봄' },
    { word: 'square', meaning: '광장' }, { word: 'status', meaning: '상태' }, { word: 'stream', meaning: '시내' },
    { word: 'street', meaning: '거리' }, { word: 'stress', meaning: '스트레스' }, { word: 'strike', meaning: '파업' },
    { word: 'studio', meaning: '스튜디오' }, { word: 'summer', meaning: '여름' }, { word: 'supply', meaning: '공급' },
    { word: 'symbol', meaning: '상징' }, { word: 'system', meaning: '시스템' }, { word: 'target', meaning: '목표' },
    { word: 'theory', meaning: '이론' }, { word: 'thread', meaning: '실' }, { word: 'threat', meaning: '위협' },
    { word: 'ticket', meaning: '표' }, { word: 'tissue', meaning: '조직' }, { word: 'tongue', meaning: '혀' },
    { word: 'treaty', meaning: '조약' }, { word: 'valley', meaning: '계곡' }, { word: 'victim', meaning: '피해자' },
    { word: 'vision', meaning: '비전' }, { word: 'volume', meaning: '볼륨' }, { word: 'wealth', meaning: '부' },
    { word: 'weapon', meaning: '무기' }, { word: 'weight', meaning: '무게' }, { word: 'window', meaning: '창문' },
    { word: 'winner', meaning: '우승자' }, { word: 'winter', meaning: '겨울' }, { word: 'wisdom', meaning: '지혜' },
    { word: 'wonder', meaning: '경이' }, { word: 'worker', meaning: '노동자' }, { word: 'writer', meaning: '작가' },
  ],
  5: [
    // 동사
    { word: 'abandon', meaning: '버리다' }, { word: 'abolish', meaning: '폐지하다' }, { word: 'absorb', meaning: '흡수하다' },
    { word: 'accompany', meaning: '동반하다' }, { word: 'accomplish', meaning: '성취하다' }, { word: 'accumulate', meaning: '축적하다' },
    { word: 'acquire', meaning: '습득하다' }, { word: 'activate', meaning: '활성화하다' }, { word: 'address', meaning: '다루다' },
    { word: 'adjust', meaning: '조정하다' }, { word: 'administer', meaning: '관리하다' }, { word: 'admire', meaning: '존경하다' },
    { word: 'advertise', meaning: '광고하다' }, { word: 'advocate', meaning: '지지하다' }, { word: 'allocate', meaning: '할당하다' },
    { word: 'analyze', meaning: '분석하다' }, { word: 'announce', meaning: '발표하다' }, { word: 'anticipate', meaning: '예상하다' },
    { word: 'apologize', meaning: '사과하다' }, { word: 'appreciate', meaning: '감사하다' }, { word: 'approach', meaning: '접근하다' },
    { word: 'approve', meaning: '승인하다' }, { word: 'argue', meaning: '주장하다' }, { word: 'arrange', meaning: '배열하다' },
    { word: 'assemble', meaning: '조립하다' }, { word: 'assess', meaning: '평가하다' }, { word: 'assign', meaning: '할당하다' },
    { word: 'assist', meaning: '돕다' }, { word: 'associate', meaning: '연관짓다' }, { word: 'assume', meaning: '가정하다' },
    { word: 'assure', meaning: '보장하다' }, { word: 'attempt', meaning: '시도하다' }, { word: 'attract', meaning: '끌어들이다' },
    { word: 'authorize', meaning: '허가하다' }, { word: 'balance', meaning: '균형을 맞추다' }, { word: 'calculate', meaning: '계산하다' },
    { word: 'celebrate', meaning: '축하하다' }, { word: 'challenge', meaning: '도전하다' }, { word: 'circulate', meaning: '순환하다' },
    { word: 'classify', meaning: '분류하다' }, { word: 'collapse', meaning: '붕괴하다' }, { word: 'collect', meaning: '수집하다' },
    { word: 'combine', meaning: '결합하다' }, { word: 'comment', meaning: '논평하다' }, { word: 'communicate', meaning: '소통하다' },
    { word: 'compensate', meaning: '보상하다' }, { word: 'complain', meaning: '불평하다' }, { word: 'complete', meaning: '완료하다' },
    { word: 'complicate', meaning: '복잡하게 하다' }, { word: 'concentrate', meaning: '집중하다' }, { word: 'conclude', meaning: '결론짓다' },
    { word: 'conduct', meaning: '수행하다' }, { word: 'confirm', meaning: '확인하다' }, { word: 'confront', meaning: '직면하다' },
    { word: 'confuse', meaning: '혼란시키다' }, { word: 'connect', meaning: '연결하다' }, { word: 'consider', meaning: '고려하다' },
    { word: 'consist', meaning: '구성되다' }, { word: 'construct', meaning: '건설하다' }, { word: 'consume', meaning: '소비하다' },
    { word: 'contact', meaning: '연락하다' }, { word: 'continue', meaning: '계속하다' }, { word: 'contract', meaning: '계약하다' },
    { word: 'contribute', meaning: '기여하다' }, { word: 'convince', meaning: '설득하다' }, { word: 'cooperate', meaning: '협력하다' },
    { word: 'coordinate', meaning: '조율하다' }, { word: 'correct', meaning: '수정하다' }, { word: 'correspond', meaning: '일치하다' },
    { word: 'criticize', meaning: '비판하다' }, { word: 'cultivate', meaning: '재배하다' }, { word: 'customize', meaning: '맞춤화하다' },
    { word: 'decrease', meaning: '감소하다' }, { word: 'dedicate', meaning: '헌신하다' }, { word: 'define', meaning: '정의하다' },
    { word: 'delegate', meaning: '위임하다' }, { word: 'deliberate', meaning: '숙고하다' }, { word: 'demonstrate', meaning: '시연하다' },
    { word: 'describe', meaning: '묘사하다' }, { word: 'designate', meaning: '지정하다' }, { word: 'determine', meaning: '결정하다' },
    { word: 'diminish', meaning: '줄어들다' }, { word: 'disappear', meaning: '사라지다' }, { word: 'disappoint', meaning: '실망시키다' },
    { word: 'discover', meaning: '발견하다' }, { word: 'discuss', meaning: '토론하다' }, { word: 'dismiss', meaning: '해고하다' },
    { word: 'display', meaning: '전시하다' }, { word: 'distinguish', meaning: '구별하다' }, { word: 'distribute', meaning: '분배하다' },
    { word: 'dominate', meaning: '지배하다' }, { word: 'download', meaning: '다운로드하다' }, { word: 'educate', meaning: '교육하다' },
    { word: 'elaborate', meaning: '자세히 설명하다' }, { word: 'eliminate', meaning: '제거하다' }, { word: 'embrace', meaning: '포옹하다' },
    { word: 'emerge', meaning: '나타나다' }, { word: 'emphasize', meaning: '강조하다' }, { word: 'employ', meaning: '고용하다' },
    { word: 'encounter', meaning: '마주치다' }, { word: 'encourage', meaning: '격려하다' }, { word: 'endure', meaning: '견디다' },
    { word: 'enforce', meaning: '시행하다' }, { word: 'engage', meaning: '참여하다' }, { word: 'enhance', meaning: '향상시키다' },
    { word: 'ensure', meaning: '보장하다' }, { word: 'entertain', meaning: '즐겁게 하다' }, { word: 'establish', meaning: '설립하다' },
    { word: 'estimate', meaning: '추정하다' }, { word: 'evaluate', meaning: '평가하다' }, { word: 'examine', meaning: '조사하다' },
    { word: 'exceed', meaning: '초과하다' }, { word: 'exchange', meaning: '교환하다' }, { word: 'exclude', meaning: '제외하다' },
    { word: 'execute', meaning: '실행하다' }, { word: 'exercise', meaning: '운동하다' }, { word: 'exhibit', meaning: '전시하다' },
    { word: 'expand', meaning: '확장하다' }, { word: 'experiment', meaning: '실험하다' }, { word: 'explore', meaning: '탐험하다' },
    { word: 'express', meaning: '표현하다' }, { word: 'facilitate', meaning: '촉진하다' }, { word: 'feature', meaning: '특징짓다' },
    { word: 'finance', meaning: '자금을 조달하다' }, { word: 'forecast', meaning: '예측하다' }, { word: 'formulate', meaning: '공식화하다' },
    { word: 'function', meaning: '기능하다' }, { word: 'generate', meaning: '생성하다' }, { word: 'graduate', meaning: '졸업하다' },
    { word: 'guarantee', meaning: '보증하다' }, { word: 'hesitate', meaning: '망설이다' }, { word: 'highlight', meaning: '강조하다' },
    { word: 'identify', meaning: '식별하다' }, { word: 'illustrate', meaning: '설명하다' }, { word: 'imagine', meaning: '상상하다' },
    { word: 'implement', meaning: '시행하다' }, { word: 'imply', meaning: '암시하다' }, { word: 'impose', meaning: '부과하다' },
    { word: 'impress', meaning: '감명을 주다' }, { word: 'indicate', meaning: '나타내다' }, { word: 'influence', meaning: '영향을 미치다' },
    { word: 'inherit', meaning: '상속하다' }, { word: 'initiate', meaning: '시작하다' }, { word: 'innovate', meaning: '혁신하다' },
    { word: 'inquire', meaning: '문의하다' }, { word: 'inspect', meaning: '검사하다' }, { word: 'inspire', meaning: '영감을 주다' },
    { word: 'install', meaning: '설치하다' }, { word: 'institute', meaning: '설립하다' }, { word: 'instruct', meaning: '지시하다' },
    { word: 'integrate', meaning: '통합하다' }, { word: 'interact', meaning: '상호작용하다' }, { word: 'interpret', meaning: '해석하다' },
    { word: 'interrupt', meaning: '방해하다' }, { word: 'intervene', meaning: '개입하다' }, { word: 'introduce', meaning: '소개하다' },
    { word: 'investigate', meaning: '조사하다' }, { word: 'involve', meaning: '포함하다' }, { word: 'isolate', meaning: '고립시키다' },
    { word: 'justify', meaning: '정당화하다' }, { word: 'launch', meaning: '출시하다' }, { word: 'legislate', meaning: '입법하다' },
    { word: 'liberate', meaning: '해방하다' }, { word: 'maintain', meaning: '유지하다' }, { word: 'manufacture', meaning: '제조하다' },
    { word: 'maximize', meaning: '극대화하다' }, { word: 'measure', meaning: '측정하다' }, { word: 'mention', meaning: '언급하다' },
    { word: 'minimize', meaning: '최소화하다' }, { word: 'moderate', meaning: '조절하다' }, { word: 'modify', meaning: '수정하다' },
    { word: 'monitor', meaning: '모니터링하다' }, { word: 'motivate', meaning: '동기부여하다' }, { word: 'negotiate', meaning: '협상하다' },
    { word: 'nominate', meaning: '지명하다' }, { word: 'normalize', meaning: '정상화하다' }, { word: 'observe', meaning: '관찰하다' },
    { word: 'occupy', meaning: '점령하다' }, { word: 'offend', meaning: '기분 상하게 하다' }, { word: 'organize', meaning: '조직하다' },
    { word: 'originate', meaning: '유래하다' }, { word: 'overcome', meaning: '극복하다' }, { word: 'overlook', meaning: '간과하다' },
    { word: 'participate', meaning: '참가하다' }, { word: 'perceive', meaning: '인식하다' }, { word: 'perform', meaning: '공연하다' },
    { word: 'persist', meaning: '지속하다' }, { word: 'persuade', meaning: '설득하다' }, { word: 'possess', meaning: '소유하다' },
    { word: 'postpone', meaning: '연기하다' }, { word: 'practice', meaning: '연습하다' }, { word: 'predict', meaning: '예측하다' },
    { word: 'prescribe', meaning: '처방하다' }, { word: 'preserve', meaning: '보존하다' }, { word: 'proceed', meaning: '진행하다' },
    { word: 'process', meaning: '처리하다' }, { word: 'proclaim', meaning: '선언하다' }, { word: 'progress', meaning: '진전하다' },
    { word: 'prohibit', meaning: '금지하다' }, { word: 'project', meaning: '계획하다' }, { word: 'promote', meaning: '홍보하다' },
    { word: 'propose', meaning: '제안하다' }, { word: 'prosecute', meaning: '기소하다' }, { word: 'purchase', meaning: '구매하다' },
    { word: 'qualify', meaning: '자격을 얻다' }, { word: 'question', meaning: '질문하다' }, { word: 'recognize', meaning: '인식하다' },
    { word: 'recommend', meaning: '추천하다' }, { word: 'recover', meaning: '회복하다' }, { word: 'recruit', meaning: '모집하다' },
    { word: 'reference', meaning: '참조하다' }, { word: 'reform', meaning: '개혁하다' }, { word: 'register', meaning: '등록하다' },
    { word: 'regulate', meaning: '규제하다' }, { word: 'reinforce', meaning: '강화하다' }, { word: 'reject', meaning: '거부하다' },
    { word: 'relate', meaning: '관련시키다' }, { word: 'relax', meaning: '휴식하다' }, { word: 'relocate', meaning: '이전하다' },
    { word: 'remember', meaning: '기억하다' }, { word: 'remind', meaning: '상기시키다' }, { word: 'renovate', meaning: '수리하다' },
    { word: 'represent', meaning: '대표하다' }, { word: 'reproduce', meaning: '재생산하다' }, { word: 'request', meaning: '요청하다' },
    { word: 'research', meaning: '연구하다' }, { word: 'resemble', meaning: '닮다' }, { word: 'reserve', meaning: '예약하다' },
    { word: 'reside', meaning: '거주하다' }, { word: 'resign', meaning: '사임하다' }, { word: 'resolve', meaning: '해결하다' },
    { word: 'restore', meaning: '복원하다' }, { word: 'restrict', meaning: '제한하다' }, { word: 'retire', meaning: '은퇴하다' },
    { word: 'retrieve', meaning: '되찾다' }, { word: 'sacrifice', meaning: '희생하다' }, { word: 'satisfy', meaning: '만족시키다' },
    { word: 'schedule', meaning: '예정하다' }, { word: 'secure', meaning: '확보하다' }, { word: 'separate', meaning: '분리하다' },
    { word: 'simplify', meaning: '단순화하다' }, { word: 'simulate', meaning: '모의 실험하다' }, { word: 'specify', meaning: '명시하다' },
    { word: 'sponsor', meaning: '후원하다' }, { word: 'stabilize', meaning: '안정시키다' }, { word: 'stimulate', meaning: '자극하다' },
    { word: 'strengthen', meaning: '강화하다' }, { word: 'structure', meaning: '구조화하다' }, { word: 'struggle', meaning: '투쟁하다' },
    { word: 'submit', meaning: '제출하다' }, { word: 'subscribe', meaning: '구독하다' }, { word: 'substitute', meaning: '대체하다' },
    { word: 'succeed', meaning: '성공하다' }, { word: 'suggest', meaning: '제안하다' }, { word: 'summarize', meaning: '요약하다' },
    { word: 'supervise', meaning: '감독하다' }, { word: 'supplement', meaning: '보충하다' }, { word: 'suspend', meaning: '중단하다' },
    { word: 'sustain', meaning: '유지하다' }, { word: 'symbolize', meaning: '상징하다' }, { word: 'terminate', meaning: '종료하다' },
    { word: 'tolerate', meaning: '참다' }, { word: 'transfer', meaning: '이전하다' }, { word: 'transform', meaning: '변형하다' },
    { word: 'translate', meaning: '번역하다' }, { word: 'transmit', meaning: '전송하다' }, { word: 'transport', meaning: '운송하다' },
    { word: 'undergo', meaning: '겪다' }, { word: 'undermine', meaning: '약화시키다' }, { word: 'understand', meaning: '이해하다' },
    { word: 'undertake', meaning: '착수하다' }, { word: 'unite', meaning: '통합하다' }, { word: 'update', meaning: '업데이트하다' },
    { word: 'upgrade', meaning: '업그레이드하다' }, { word: 'utilize', meaning: '활용하다' }, { word: 'validate', meaning: '검증하다' },
    { word: 'vary', meaning: '다양하다' }, { word: 'verify', meaning: '확인하다' }, { word: 'violate', meaning: '위반하다' },
    { word: 'volunteer', meaning: '자원하다' }, { word: 'withdraw', meaning: '철회하다' }, { word: 'witness', meaning: '목격하다' },
  ],
};

// 한글 단어 데이터 (레벨별) - 대폭 확장
export const koreanWordsWithMeaning: Record<number, WordWithMeaning[]> = {
  1: [
    // 기본 명사 - 가족
    { word: '나', meaning: 'I/me' }, { word: '너', meaning: 'you' }, { word: '우리', meaning: 'we' },
    { word: '엄마', meaning: 'mom' }, { word: '아빠', meaning: 'dad' }, { word: '형', meaning: 'older brother' },
    { word: '누나', meaning: 'older sister' }, { word: '동생', meaning: 'sibling' }, { word: '할머니', meaning: 'grandma' },
    { word: '할아버지', meaning: 'grandpa' },
    // 신체
    { word: '눈', meaning: 'eye' }, { word: '코', meaning: 'nose' }, { word: '귀', meaning: 'ear' },
    { word: '입', meaning: 'mouth' }, { word: '손', meaning: 'hand' }, { word: '발', meaning: 'foot' },
    { word: '머리', meaning: 'head' }, { word: '배', meaning: 'stomach' }, { word: '다리', meaning: 'leg' },
    { word: '팔', meaning: 'arm' }, { word: '목', meaning: 'neck' }, { word: '등', meaning: 'back' },
    // 자연
    { word: '산', meaning: 'mountain' }, { word: '강', meaning: 'river' }, { word: '바다', meaning: 'sea' },
    { word: '하늘', meaning: 'sky' }, { word: '달', meaning: 'moon' }, { word: '별', meaning: 'star' },
    { word: '해', meaning: 'sun' }, { word: '구름', meaning: 'cloud' }, { word: '비', meaning: 'rain' },
    { word: '눈', meaning: 'snow' }, { word: '바람', meaning: 'wind' }, { word: '불', meaning: 'fire' },
    { word: '물', meaning: 'water' }, { word: '흙', meaning: 'soil' }, { word: '돌', meaning: 'stone' },
    // 동물
    { word: '개', meaning: 'dog' }, { word: '고양이', meaning: 'cat' }, { word: '새', meaning: 'bird' },
    { word: '물고기', meaning: 'fish' }, { word: '소', meaning: 'cow' }, { word: '말', meaning: 'horse' },
    { word: '돼지', meaning: 'pig' }, { word: '양', meaning: 'sheep' }, { word: '닭', meaning: 'chicken' },
    { word: '토끼', meaning: 'rabbit' }, { word: '쥐', meaning: 'mouse' }, { word: '곰', meaning: 'bear' },
    // 음식
    { word: '밥', meaning: 'rice' }, { word: '빵', meaning: 'bread' }, { word: '물', meaning: 'water' },
    { word: '우유', meaning: 'milk' }, { word: '고기', meaning: 'meat' }, { word: '과일', meaning: 'fruit' },
    { word: '야채', meaning: 'vegetable' }, { word: '사과', meaning: 'apple' }, { word: '배', meaning: 'pear' },
    { word: '포도', meaning: 'grape' }, { word: '귤', meaning: 'tangerine' }, { word: '바나나', meaning: 'banana' },
    // 사물
    { word: '집', meaning: 'house' }, { word: '문', meaning: 'door' }, { word: '창문', meaning: 'window' },
    { word: '책', meaning: 'book' }, { word: '공', meaning: 'ball' }, { word: '차', meaning: 'car' },
    { word: '가방', meaning: 'bag' }, { word: '신발', meaning: 'shoes' }, { word: '옷', meaning: 'clothes' },
    { word: '모자', meaning: 'hat' }, { word: '안경', meaning: 'glasses' }, { word: '시계', meaning: 'watch' },
    // 색깔
    { word: '빨강', meaning: 'red' }, { word: '파랑', meaning: 'blue' }, { word: '노랑', meaning: 'yellow' },
    { word: '초록', meaning: 'green' }, { word: '검정', meaning: 'black' }, { word: '하양', meaning: 'white' },
    // 숫자
    { word: '하나', meaning: 'one' }, { word: '둘', meaning: 'two' }, { word: '셋', meaning: 'three' },
    { word: '넷', meaning: 'four' }, { word: '다섯', meaning: 'five' }, { word: '여섯', meaning: 'six' },
    { word: '일곱', meaning: 'seven' }, { word: '여덟', meaning: 'eight' }, { word: '아홉', meaning: 'nine' },
    { word: '열', meaning: 'ten' }, { word: '백', meaning: 'hundred' }, { word: '천', meaning: 'thousand' },
    // 시간
    { word: '오늘', meaning: 'today' }, { word: '내일', meaning: 'tomorrow' }, { word: '어제', meaning: 'yesterday' },
    { word: '아침', meaning: 'morning' }, { word: '점심', meaning: 'lunch' }, { word: '저녁', meaning: 'evening' },
    { word: '밤', meaning: 'night' }, { word: '낮', meaning: 'daytime' },
    // 기본 동사
    { word: '가다', meaning: 'go' }, { word: '오다', meaning: 'come' }, { word: '먹다', meaning: 'eat' },
    { word: '마시다', meaning: 'drink' }, { word: '자다', meaning: 'sleep' }, { word: '일어나다', meaning: 'wake up' },
    { word: '앉다', meaning: 'sit' }, { word: '서다', meaning: 'stand' }, { word: '걷다', meaning: 'walk' },
    { word: '뛰다', meaning: 'run' }, { word: '보다', meaning: 'see' }, { word: '듣다', meaning: 'hear' },
    // 기본 형용사
    { word: '크다', meaning: 'big' }, { word: '작다', meaning: 'small' }, { word: '많다', meaning: 'many' },
    { word: '적다', meaning: 'few' }, { word: '좋다', meaning: 'good' }, { word: '나쁘다', meaning: 'bad' },
    { word: '새롭다', meaning: 'new' }, { word: '오래되다', meaning: 'old' }, { word: '빠르다', meaning: 'fast' },
    { word: '느리다', meaning: 'slow' }, { word: '덥다', meaning: 'hot' }, { word: '춥다', meaning: 'cold' },
  ],
  2: [
    // 학교/교육
    { word: '학교', meaning: 'school' }, { word: '교실', meaning: 'classroom' }, { word: '선생님', meaning: 'teacher' },
    { word: '학생', meaning: 'student' }, { word: '공부', meaning: 'study' }, { word: '숙제', meaning: 'homework' },
    { word: '시험', meaning: 'exam' }, { word: '수업', meaning: 'class' }, { word: '책상', meaning: 'desk' },
    { word: '의자', meaning: 'chair' }, { word: '칠판', meaning: 'blackboard' }, { word: '분필', meaning: 'chalk' },
    { word: '연필', meaning: 'pencil' }, { word: '지우개', meaning: 'eraser' }, { word: '공책', meaning: 'notebook' },
    // 장소
    { word: '병원', meaning: 'hospital' }, { word: '은행', meaning: 'bank' }, { word: '마트', meaning: 'mart' },
    { word: '식당', meaning: 'restaurant' }, { word: '카페', meaning: 'cafe' }, { word: '공원', meaning: 'park' },
    { word: '도서관', meaning: 'library' }, { word: '극장', meaning: 'theater' }, { word: '호텔', meaning: 'hotel' },
    { word: '공항', meaning: 'airport' }, { word: '역', meaning: 'station' }, { word: '정류장', meaning: 'bus stop' },
    // 직업
    { word: '의사', meaning: 'doctor' }, { word: '간호사', meaning: 'nurse' }, { word: '경찰', meaning: 'police' },
    { word: '소방관', meaning: 'firefighter' }, { word: '요리사', meaning: 'chef' }, { word: '가수', meaning: 'singer' },
    { word: '배우', meaning: 'actor' }, { word: '기자', meaning: 'reporter' }, { word: '변호사', meaning: 'lawyer' },
    { word: '회사원', meaning: 'office worker' }, { word: '운전사', meaning: 'driver' }, { word: '농부', meaning: 'farmer' },
    // 교통
    { word: '버스', meaning: 'bus' }, { word: '지하철', meaning: 'subway' }, { word: '택시', meaning: 'taxi' },
    { word: '비행기', meaning: 'airplane' }, { word: '배', meaning: 'ship' }, { word: '자전거', meaning: 'bicycle' },
    { word: '오토바이', meaning: 'motorcycle' }, { word: '기차', meaning: 'train' }, { word: '트럭', meaning: 'truck' },
    // 감정
    { word: '기쁨', meaning: 'joy' }, { word: '슬픔', meaning: 'sadness' }, { word: '화', meaning: 'anger' },
    { word: '두려움', meaning: 'fear' }, { word: '사랑', meaning: 'love' }, { word: '행복', meaning: 'happiness' },
    { word: '걱정', meaning: 'worry' }, { word: '희망', meaning: 'hope' }, { word: '외로움', meaning: 'loneliness' },
    // 날씨
    { word: '맑음', meaning: 'clear' }, { word: '흐림', meaning: 'cloudy' }, { word: '비', meaning: 'rain' },
    { word: '눈', meaning: 'snow' }, { word: '바람', meaning: 'wind' }, { word: '태풍', meaning: 'typhoon' },
    { word: '천둥', meaning: 'thunder' }, { word: '번개', meaning: 'lightning' }, { word: '안개', meaning: 'fog' },
    // 계절
    { word: '봄', meaning: 'spring' }, { word: '여름', meaning: 'summer' }, { word: '가을', meaning: 'autumn' },
    { word: '겨울', meaning: 'winter' },
    // 가전제품
    { word: '텔레비전', meaning: 'TV' }, { word: '냉장고', meaning: 'refrigerator' }, { word: '세탁기', meaning: 'washer' },
    { word: '에어컨', meaning: 'air conditioner' }, { word: '선풍기', meaning: 'fan' }, { word: '전자레인지', meaning: 'microwave' },
    { word: '청소기', meaning: 'vacuum' }, { word: '다리미', meaning: 'iron' }, { word: '컴퓨터', meaning: 'computer' },
    // 음식
    { word: '김치', meaning: 'kimchi' }, { word: '불고기', meaning: 'bulgogi' }, { word: '비빔밥', meaning: 'bibimbap' },
    { word: '김밥', meaning: 'gimbap' }, { word: '라면', meaning: 'ramen' }, { word: '떡볶이', meaning: 'tteokbokki' },
    { word: '치킨', meaning: 'chicken' }, { word: '피자', meaning: 'pizza' }, { word: '햄버거', meaning: 'hamburger' },
    { word: '국수', meaning: 'noodles' }, { word: '만두', meaning: 'dumpling' }, { word: '찌개', meaning: 'stew' },
    // 동사
    { word: '말하다', meaning: 'speak' }, { word: '읽다', meaning: 'read' }, { word: '쓰다', meaning: 'write' },
    { word: '배우다', meaning: 'learn' }, { word: '가르치다', meaning: 'teach' }, { word: '만들다', meaning: 'make' },
    { word: '사다', meaning: 'buy' }, { word: '팔다', meaning: 'sell' }, { word: '주다', meaning: 'give' },
    { word: '받다', meaning: 'receive' }, { word: '찾다', meaning: 'find' }, { word: '잃다', meaning: 'lose' },
    { word: '열다', meaning: 'open' }, { word: '닫다', meaning: 'close' }, { word: '켜다', meaning: 'turn on' },
    { word: '끄다', meaning: 'turn off' }, { word: '시작하다', meaning: 'start' }, { word: '끝나다', meaning: 'end' },
    { word: '도착하다', meaning: 'arrive' }, { word: '출발하다', meaning: 'depart' },
    // 형용사
    { word: '예쁘다', meaning: 'pretty' }, { word: '멋있다', meaning: 'cool' }, { word: '귀엽다', meaning: 'cute' },
    { word: '무섭다', meaning: 'scary' }, { word: '재미있다', meaning: 'fun' }, { word: '지루하다', meaning: 'boring' },
    { word: '어렵다', meaning: 'difficult' }, { word: '쉽다', meaning: 'easy' }, { word: '비싸다', meaning: 'expensive' },
    { word: '싸다', meaning: 'cheap' }, { word: '맛있다', meaning: 'delicious' }, { word: '맛없다', meaning: 'tasteless' },
  ],
  3: [
    // 추상적 개념
    { word: '자유', meaning: 'freedom' }, { word: '평화', meaning: 'peace' }, { word: '정의', meaning: 'justice' },
    { word: '진실', meaning: 'truth' }, { word: '거짓', meaning: 'lie' }, { word: '용기', meaning: 'courage' },
    { word: '인내', meaning: 'patience' }, { word: '지혜', meaning: 'wisdom' }, { word: '창의성', meaning: 'creativity' },
    { word: '책임', meaning: 'responsibility' }, { word: '의무', meaning: 'duty' }, { word: '권리', meaning: 'right' },
    { word: '존경', meaning: 'respect' }, { word: '신뢰', meaning: 'trust' }, { word: '우정', meaning: 'friendship' },
    { word: '협력', meaning: 'cooperation' }, { word: '경쟁', meaning: 'competition' }, { word: '성공', meaning: 'success' },
    { word: '실패', meaning: 'failure' }, { word: '노력', meaning: 'effort' }, { word: '목표', meaning: 'goal' },
    { word: '꿈', meaning: 'dream' }, { word: '미래', meaning: 'future' }, { word: '과거', meaning: 'past' },
    { word: '현재', meaning: 'present' }, { word: '기회', meaning: 'opportunity' }, { word: '위기', meaning: 'crisis' },
    // 사회/정치
    { word: '정부', meaning: 'government' }, { word: '국회', meaning: 'parliament' }, { word: '대통령', meaning: 'president' },
    { word: '장관', meaning: 'minister' }, { word: '법률', meaning: 'law' }, { word: '헌법', meaning: 'constitution' },
    { word: '선거', meaning: 'election' }, { word: '투표', meaning: 'vote' }, { word: '민주주의', meaning: 'democracy' },
    { word: '경제', meaning: 'economy' }, { word: '시장', meaning: 'market' }, { word: '무역', meaning: 'trade' },
    { word: '수출', meaning: 'export' }, { word: '수입', meaning: 'import' }, { word: '세금', meaning: 'tax' },
    // 과학/기술
    { word: '과학', meaning: 'science' }, { word: '기술', meaning: 'technology' }, { word: '연구', meaning: 'research' },
    { word: '실험', meaning: 'experiment' }, { word: '발명', meaning: 'invention' }, { word: '발견', meaning: 'discovery' },
    { word: '에너지', meaning: 'energy' }, { word: '환경', meaning: 'environment' }, { word: '오염', meaning: 'pollution' },
    { word: '재활용', meaning: 'recycling' }, { word: '인터넷', meaning: 'internet' }, { word: '스마트폰', meaning: 'smartphone' },
    { word: '인공지능', meaning: 'AI' }, { word: '로봇', meaning: 'robot' }, { word: '데이터', meaning: 'data' },
    // 문화/예술
    { word: '문화', meaning: 'culture' }, { word: '예술', meaning: 'art' }, { word: '음악', meaning: 'music' },
    { word: '미술', meaning: 'fine art' }, { word: '문학', meaning: 'literature' }, { word: '영화', meaning: 'movie' },
    { word: '연극', meaning: 'play' }, { word: '춤', meaning: 'dance' }, { word: '전통', meaning: 'tradition' },
    { word: '역사', meaning: 'history' }, { word: '유산', meaning: 'heritage' }, { word: '축제', meaning: 'festival' },
    // 건강/의료
    { word: '건강', meaning: 'health' }, { word: '질병', meaning: 'disease' }, { word: '치료', meaning: 'treatment' },
    { word: '수술', meaning: 'surgery' }, { word: '약', meaning: 'medicine' }, { word: '예방', meaning: 'prevention' },
    { word: '증상', meaning: 'symptom' }, { word: '진단', meaning: 'diagnosis' }, { word: '면역', meaning: 'immunity' },
    { word: '백신', meaning: 'vaccine' }, { word: '운동', meaning: 'exercise' }, { word: '다이어트', meaning: 'diet' },
    // 교육
    { word: '교육', meaning: 'education' }, { word: '대학교', meaning: 'university' }, { word: '졸업', meaning: 'graduation' },
    { word: '입학', meaning: 'admission' }, { word: '학위', meaning: 'degree' }, { word: '전공', meaning: 'major' },
    { word: '학점', meaning: 'credits' }, { word: '장학금', meaning: 'scholarship' }, { word: '논문', meaning: 'thesis' },
    // 직장/비즈니스
    { word: '회사', meaning: 'company' }, { word: '사무실', meaning: 'office' }, { word: '직원', meaning: 'employee' },
    { word: '상사', meaning: 'boss' }, { word: '부하', meaning: 'subordinate' }, { word: '동료', meaning: 'colleague' },
    { word: '회의', meaning: 'meeting' }, { word: '프로젝트', meaning: 'project' }, { word: '보고서', meaning: 'report' },
    { word: '계약', meaning: 'contract' }, { word: '협상', meaning: 'negotiation' }, { word: '마감', meaning: 'deadline' },
    // 동사
    { word: '생각하다', meaning: 'think' }, { word: '느끼다', meaning: 'feel' }, { word: '믿다', meaning: 'believe' },
    { word: '기억하다', meaning: 'remember' }, { word: '잊다', meaning: 'forget' }, { word: '이해하다', meaning: 'understand' },
    { word: '설명하다', meaning: 'explain' }, { word: '질문하다', meaning: 'ask' }, { word: '대답하다', meaning: 'answer' },
    { word: '토론하다', meaning: 'discuss' }, { word: '발표하다', meaning: 'present' }, { word: '제안하다', meaning: 'suggest' },
    { word: '결정하다', meaning: 'decide' }, { word: '선택하다', meaning: 'choose' }, { word: '비교하다', meaning: 'compare' },
    { word: '분석하다', meaning: 'analyze' }, { word: '해결하다', meaning: 'solve' }, { word: '발전하다', meaning: 'develop' },
    { word: '변화하다', meaning: 'change' }, { word: '적응하다', meaning: 'adapt' }, { word: '도전하다', meaning: 'challenge' },
    { word: '포기하다', meaning: 'give up' }, { word: '극복하다', meaning: 'overcome' }, { word: '성취하다', meaning: 'achieve' },
    // 형용사
    { word: '중요하다', meaning: 'important' }, { word: '필요하다', meaning: 'necessary' }, { word: '가능하다', meaning: 'possible' },
    { word: '불가능하다', meaning: 'impossible' }, { word: '확실하다', meaning: 'certain' }, { word: '불확실하다', meaning: 'uncertain' },
    { word: '복잡하다', meaning: 'complex' }, { word: '간단하다', meaning: 'simple' }, { word: '다양하다', meaning: 'diverse' },
    { word: '특별하다', meaning: 'special' }, { word: '평범하다', meaning: 'ordinary' }, { word: '독특하다', meaning: 'unique' },
  ],
  4: [
    // 지역/도시
    { word: '서울특별시', meaning: 'Seoul' }, { word: '부산광역시', meaning: 'Busan' }, { word: '인천광역시', meaning: 'Incheon' },
    { word: '대구광역시', meaning: 'Daegu' }, { word: '대전광역시', meaning: 'Daejeon' }, { word: '광주광역시', meaning: 'Gwangju' },
    { word: '울산광역시', meaning: 'Ulsan' }, { word: '세종특별자치시', meaning: 'Sejong' }, { word: '경기도', meaning: 'Gyeonggi' },
    { word: '강원도', meaning: 'Gangwon' }, { word: '충청북도', meaning: 'North Chungcheong' }, { word: '충청남도', meaning: 'South Chungcheong' },
    { word: '전라북도', meaning: 'North Jeolla' }, { word: '전라남도', meaning: 'South Jeolla' }, { word: '경상북도', meaning: 'North Gyeongsang' },
    { word: '경상남도', meaning: 'South Gyeongsang' }, { word: '제주특별자치도', meaning: 'Jeju' },
    // 국제/외교
    { word: '국제관계', meaning: 'international relations' }, { word: '외교', meaning: 'diplomacy' }, { word: '대사관', meaning: 'embassy' },
    { word: '영사관', meaning: 'consulate' }, { word: '비자', meaning: 'visa' }, { word: '여권', meaning: 'passport' },
    { word: '이민', meaning: 'immigration' }, { word: '난민', meaning: 'refugee' }, { word: '유학', meaning: 'study abroad' },
    // 경제/금융
    { word: '주식시장', meaning: 'stock market' }, { word: '투자', meaning: 'investment' }, { word: '이자', meaning: 'interest' },
    { word: '대출', meaning: 'loan' }, { word: '저축', meaning: 'savings' }, { word: '예금', meaning: 'deposit' },
    { word: '환율', meaning: 'exchange rate' }, { word: '물가', meaning: 'prices' }, { word: '인플레이션', meaning: 'inflation' },
    { word: '불경기', meaning: 'recession' }, { word: '호황', meaning: 'boom' }, { word: '파산', meaning: 'bankruptcy' },
    // 법률
    { word: '재판', meaning: 'trial' }, { word: '판사', meaning: 'judge' }, { word: '검사', meaning: 'prosecutor' },
    { word: '피고인', meaning: 'defendant' }, { word: '원고', meaning: 'plaintiff' }, { word: '증인', meaning: 'witness' },
    { word: '증거', meaning: 'evidence' }, { word: '판결', meaning: 'verdict' }, { word: '형벌', meaning: 'punishment' },
    { word: '벌금', meaning: 'fine' }, { word: '징역', meaning: 'imprisonment' }, { word: '무죄', meaning: 'not guilty' },
    // 미디어
    { word: '뉴스', meaning: 'news' }, { word: '신문', meaning: 'newspaper' }, { word: '잡지', meaning: 'magazine' },
    { word: '방송', meaning: 'broadcast' }, { word: '라디오', meaning: 'radio' }, { word: '인터뷰', meaning: 'interview' },
    { word: '기사', meaning: 'article' }, { word: '광고', meaning: 'advertisement' }, { word: '홍보', meaning: 'promotion' },
    { word: '소셜미디어', meaning: 'social media' }, { word: '유튜브', meaning: 'YouTube' }, { word: '팟캐스트', meaning: 'podcast' },
    // 환경
    { word: '기후변화', meaning: 'climate change' }, { word: '지구온난화', meaning: 'global warming' }, { word: '온실가스', meaning: 'greenhouse gas' },
    { word: '이산화탄소', meaning: 'carbon dioxide' }, { word: '신재생에너지', meaning: 'renewable energy' }, { word: '태양광', meaning: 'solar power' },
    { word: '풍력', meaning: 'wind power' }, { word: '원자력', meaning: 'nuclear power' }, { word: '생태계', meaning: 'ecosystem' },
    { word: '멸종위기', meaning: 'endangered' }, { word: '자연보호', meaning: 'nature conservation' }, { word: '지속가능성', meaning: 'sustainability' },
    // 의학/건강
    { word: '응급실', meaning: 'emergency room' }, { word: '입원', meaning: 'hospitalization' }, { word: '퇴원', meaning: 'discharge' },
    { word: '외래', meaning: 'outpatient' }, { word: '처방전', meaning: 'prescription' }, { word: '부작용', meaning: 'side effect' },
    { word: '항생제', meaning: 'antibiotic' }, { word: '진통제', meaning: 'painkiller' }, { word: '예방접종', meaning: 'vaccination' },
    { word: '건강검진', meaning: 'health checkup' }, { word: '정신건강', meaning: 'mental health' }, { word: '스트레스', meaning: 'stress' },
    // IT/기술
    { word: '소프트웨어', meaning: 'software' }, { word: '하드웨어', meaning: 'hardware' }, { word: '프로그래밍', meaning: 'programming' },
    { word: '알고리즘', meaning: 'algorithm' }, { word: '데이터베이스', meaning: 'database' }, { word: '클라우드', meaning: 'cloud' },
    { word: '사이버보안', meaning: 'cybersecurity' }, { word: '해킹', meaning: 'hacking' }, { word: '암호화', meaning: 'encryption' },
    { word: '블록체인', meaning: 'blockchain' }, { word: '가상현실', meaning: 'virtual reality' }, { word: '증강현실', meaning: 'augmented reality' },
    // 스포츠
    { word: '축구', meaning: 'soccer' }, { word: '야구', meaning: 'baseball' }, { word: '농구', meaning: 'basketball' },
    { word: '배구', meaning: 'volleyball' }, { word: '테니스', meaning: 'tennis' }, { word: '골프', meaning: 'golf' },
    { word: '수영', meaning: 'swimming' }, { word: '마라톤', meaning: 'marathon' }, { word: '태권도', meaning: 'taekwondo' },
    { word: '유도', meaning: 'judo' }, { word: '체조', meaning: 'gymnastics' }, { word: '스케이팅', meaning: 'skating' },
    // 동사
    { word: '수행하다', meaning: 'perform' }, { word: '관리하다', meaning: 'manage' }, { word: '감독하다', meaning: 'supervise' },
    { word: '조정하다', meaning: 'adjust' }, { word: '통제하다', meaning: 'control' }, { word: '규제하다', meaning: 'regulate' },
    { word: '시행하다', meaning: 'implement' }, { word: '평가하다', meaning: 'evaluate' }, { word: '검토하다', meaning: 'review' },
    { word: '승인하다', meaning: 'approve' }, { word: '거부하다', meaning: 'reject' }, { word: '취소하다', meaning: 'cancel' },
    { word: '연기하다', meaning: 'postpone' }, { word: '예약하다', meaning: 'reserve' }, { word: '등록하다', meaning: 'register' },
    { word: '신청하다', meaning: 'apply' }, { word: '처리하다', meaning: 'process' }, { word: '확인하다', meaning: 'confirm' },
    { word: '조사하다', meaning: 'investigate' }, { word: '분석하다', meaning: 'analyze' }, { word: '보고하다', meaning: 'report' },
    { word: '발표하다', meaning: 'announce' }, { word: '전달하다', meaning: 'deliver' }, { word: '공유하다', meaning: 'share' },
  ],
  5: [
    // 고급 추상 개념
    { word: '패러다임', meaning: 'paradigm' }, { word: '이데올로기', meaning: 'ideology' }, { word: '철학', meaning: 'philosophy' },
    { word: '윤리학', meaning: 'ethics' }, { word: '인식론', meaning: 'epistemology' }, { word: '존재론', meaning: 'ontology' },
    { word: '현상학', meaning: 'phenomenology' }, { word: '해석학', meaning: 'hermeneutics' }, { word: '상대주의', meaning: 'relativism' },
    { word: '절대주의', meaning: 'absolutism' }, { word: '실용주의', meaning: 'pragmatism' }, { word: '이상주의', meaning: 'idealism' },
    // 사회과학
    { word: '사회학', meaning: 'sociology' }, { word: '심리학', meaning: 'psychology' }, { word: '인류학', meaning: 'anthropology' },
    { word: '정치학', meaning: 'political science' }, { word: '경제학', meaning: 'economics' }, { word: '언어학', meaning: 'linguistics' },
    { word: '고고학', meaning: 'archaeology' }, { word: '지리학', meaning: 'geography' }, { word: '통계학', meaning: 'statistics' },
    // 자연과학
    { word: '물리학', meaning: 'physics' }, { word: '화학', meaning: 'chemistry' }, { word: '생물학', meaning: 'biology' },
    { word: '천문학', meaning: 'astronomy' }, { word: '지질학', meaning: 'geology' }, { word: '기상학', meaning: 'meteorology' },
    { word: '유전학', meaning: 'genetics' }, { word: '생태학', meaning: 'ecology' }, { word: '해양학', meaning: 'oceanography' },
    // 의학 전문용어
    { word: '외과', meaning: 'surgery' }, { word: '내과', meaning: 'internal medicine' }, { word: '소아과', meaning: 'pediatrics' },
    { word: '산부인과', meaning: 'obstetrics' }, { word: '정형외과', meaning: 'orthopedics' }, { word: '신경과', meaning: 'neurology' },
    { word: '정신과', meaning: 'psychiatry' }, { word: '피부과', meaning: 'dermatology' }, { word: '안과', meaning: 'ophthalmology' },
    { word: '이비인후과', meaning: 'ENT' }, { word: '비뇨기과', meaning: 'urology' }, { word: '심장내과', meaning: 'cardiology' },
    // 법률 전문용어
    { word: '민사소송', meaning: 'civil lawsuit' }, { word: '형사소송', meaning: 'criminal lawsuit' }, { word: '행정소송', meaning: 'administrative lawsuit' },
    { word: '지적재산권', meaning: 'intellectual property' }, { word: '특허권', meaning: 'patent' }, { word: '저작권', meaning: 'copyright' },
    { word: '상표권', meaning: 'trademark' }, { word: '손해배상', meaning: 'damages' }, { word: '위자료', meaning: 'consolation money' },
    // 경영/비즈니스
    { word: '기업가정신', meaning: 'entrepreneurship' }, { word: '스타트업', meaning: 'startup' }, { word: '벤처캐피탈', meaning: 'venture capital' },
    { word: '인수합병', meaning: 'M&A' }, { word: '구조조정', meaning: 'restructuring' }, { word: '아웃소싱', meaning: 'outsourcing' },
    { word: '프랜차이즈', meaning: 'franchise' }, { word: '마케팅', meaning: 'marketing' }, { word: '브랜딩', meaning: 'branding' },
    { word: '컨설팅', meaning: 'consulting' }, { word: '매출액', meaning: 'revenue' }, { word: '영업이익', meaning: 'operating profit' },
    { word: '순이익', meaning: 'net profit' }, { word: '시장점유율', meaning: 'market share' }, { word: '경쟁우위', meaning: 'competitive advantage' },
    // 국제관계
    { word: '다자주의', meaning: 'multilateralism' }, { word: '양자주의', meaning: 'bilateralism' }, { word: '고립주의', meaning: 'isolationism' },
    { word: '세계화', meaning: 'globalization' }, { word: '지역주의', meaning: 'regionalism' }, { word: '보호무역주의', meaning: 'protectionism' },
    { word: '자유무역협정', meaning: 'FTA' }, { word: '관세', meaning: 'tariff' }, { word: '비관세장벽', meaning: 'non-tariff barrier' },
    // 사회문제
    { word: '불평등', meaning: 'inequality' }, { word: '양극화', meaning: 'polarization' }, { word: '저출산', meaning: 'low birth rate' },
    { word: '고령화', meaning: 'aging' }, { word: '실업률', meaning: 'unemployment rate' }, { word: '비정규직', meaning: 'non-regular worker' },
    { word: '최저임금', meaning: 'minimum wage' }, { word: '복지정책', meaning: 'welfare policy' }, { word: '사회보장', meaning: 'social security' },
    // IT 고급용어
    { word: '머신러닝', meaning: 'machine learning' }, { word: '딥러닝', meaning: 'deep learning' }, { word: '신경망', meaning: 'neural network' },
    { word: '자연어처리', meaning: 'NLP' }, { word: '컴퓨터비전', meaning: 'computer vision' }, { word: '빅데이터', meaning: 'big data' },
    { word: '사물인터넷', meaning: 'IoT' }, { word: '5G통신', meaning: '5G' }, { word: '자율주행', meaning: 'autonomous driving' },
    { word: '드론', meaning: 'drone' }, { word: '메타버스', meaning: 'metaverse' }, { word: 'NFT', meaning: 'NFT' },
    // 예술/문화
    { word: '인상주의', meaning: 'impressionism' }, { word: '표현주의', meaning: 'expressionism' }, { word: '초현실주의', meaning: 'surrealism' },
    { word: '추상화', meaning: 'abstract art' }, { word: '설치미술', meaning: 'installation art' }, { word: '행위예술', meaning: 'performance art' },
    { word: '교향곡', meaning: 'symphony' }, { word: '협주곡', meaning: 'concerto' }, { word: '오페라', meaning: 'opera' },
    // 동사/형용사
    { word: '통합하다', meaning: 'integrate' }, { word: '분리하다', meaning: 'separate' }, { word: '최적화하다', meaning: 'optimize' },
    { word: '자동화하다', meaning: 'automate' }, { word: '표준화하다', meaning: 'standardize' }, { word: '다양화하다', meaning: 'diversify' },
    { word: '전문화하다', meaning: 'specialize' }, { word: '일반화하다', meaning: 'generalize' }, { word: '구체화하다', meaning: 'specify' },
    { word: '추상화하다', meaning: 'abstract' }, { word: '체계화하다', meaning: 'systematize' }, { word: '합리화하다', meaning: 'rationalize' },
    { word: '민영화하다', meaning: 'privatize' }, { word: '국유화하다', meaning: 'nationalize' }, { word: '세계화하다', meaning: 'globalize' },
    { word: '지역화하다', meaning: 'localize' }, { word: '현대화하다', meaning: 'modernize' }, { word: '산업화하다', meaning: 'industrialize' },
    { word: '디지털화하다', meaning: 'digitize' }, { word: '혁신하다', meaning: 'innovate' },
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
