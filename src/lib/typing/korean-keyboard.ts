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

// ── 한글 자모 분해 ──

const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

// 겹자음/겹모음 → 기본 자모로 분해
const COMPOUND_VOWEL: Record<string, string[]> = {
  'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
  'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'], 'ㅢ': ['ㅡ','ㅣ'],
};
const DOUBLE_CONSONANT: Record<string, string[]> = {
  'ㄲ': ['ㄱ','ㄱ'], 'ㄸ': ['ㄷ','ㄷ'], 'ㅃ': ['ㅂ','ㅂ'], 'ㅆ': ['ㅅ','ㅅ'], 'ㅉ': ['ㅈ','ㅈ'],
};
const COMPLEX_FINAL: Record<string, string[]> = {
  'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'],
  'ㄺ': ['ㄹ','ㄱ'], 'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'], 'ㄽ': ['ㄹ','ㅅ'],
  'ㄾ': ['ㄹ','ㅌ'], 'ㄿ': ['ㄹ','ㅍ'], 'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ'],
};

/** 한글 단어를 기본 자모 시퀀스로 분해. 불가능하면 null */
function decomposeHangul(word: string): string[] | null {
  const result: string[] = [];
  for (const ch of word) {
    const code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return null;

    const offset = code - 0xAC00;
    const ini = CHOSUNG[Math.floor(offset / (21 * 28))];
    const med = JUNGSUNG[Math.floor((offset % (21 * 28)) / 28)];
    const fin = JONGSUNG[offset % 28];

    // 초성
    if (DOUBLE_CONSONANT[ini]) result.push(...DOUBLE_CONSONANT[ini]);
    else result.push(ini);

    // 중성
    if (COMPOUND_VOWEL[med]) result.push(...COMPOUND_VOWEL[med]);
    else result.push(med);

    // 종성
    if (fin) {
      if (COMPLEX_FINAL[fin]) result.push(...COMPLEX_FINAL[fin]);
      else if (DOUBLE_CONSONANT[fin]) result.push(...DOUBLE_CONSONANT[fin]);
      else result.push(fin);
    }
  }
  return result;
}

// ── 한글 단어 목록 (자주 쓰이는 단어) ──
// ㅓ, ㅒ, ㅖ 포함 단어도 포함 — 자모 필터링으로 자동 제외됨
const KOREAN_WORDS = [
  // 1음절
  '강','감','간','갈','값','개','것','곳','공','곧','골','곰','구','군','굴','굿',
  '글','금','길','김','꽃','꿈','끝','나','날','남','낮','내','님','달','담','답',
  '대','돈','돌','동','두','등','디','땅','말','맛','맘','만','많','맞','매','먹',
  '몸','못','문','물','밑','밤','밥','방','배','벌','별','병','봄','불','비','빛',
  '뿔','산','살','삼','상','새','색','생','서','선','설','성','세','소','속','손',
  '솔','송','수','술','숲','시','신','실','심','십','아','안','앞','양','어','얼',
  '엄','엘','여','열','영','예','오','옥','온','옷','왕','요','용','우','운','울',
  '원','월','위','유','육','은','을','음','읍','이','인','일','임','잎','장','잔',
  '점','정','종','주','줄','중','집','참','창','천','철','코','콩','탑','풀','품',
  '피','한','할','함','항','해','혼','홀','화','활','힘',
  // 2음절
  '가구','가난','가능','가방','가슴','가을','가장','가지','감기','감사','강물','강산',
  '개구','개미','거리','건물','결국','경우','계단','고기','고양','고장','공기','공부',
  '공원','과일','관심','광고','교실','교육','구름','구석','국민','국물','군인','굴림',
  '기름','기분','기사','기술','기운','기자','기차','길이','김밥','김치','꼬리','꽃잎',
  '나라','나무','나비','나이','나침','날개','날씨','남녀','남자','남쪽','내일','노래',
  '노력','노인','녹색','논리','농민','높이','누나','눈길','눈물','다리','다음','단어',
  '단풍','달님','달빛','담배','당장','대기','대문','대비','대학','도시','도움','독서',
  '동굴','동물','동산','동생','동양','동작','두부','등불','등산','마당','마루','마을',
  '마음','만남','만두','말씀','매일','머리','먹이','멋진','명단','모기','모두','모양',
  '모임','목소리','목숨','무늬','무릎','문장','문화','물건','물결','물고기','물음','미래',
  '미소','미술','민족','바다','바람','바위','박물','반달','반복','발견','발음','방법',
  '방향','배달','배움','번호','벗김','보람','복도','볼링','봄날','봉사','부모','부분',
  '부인','부자','북쪽','분명','분위기','불꽃','불빛','비늘','비밀','비용','빗물','사건',
  '사고','사람','사랑','사물','사실','사이','사진','산길','살림','삼국','상품','새벽',
  '생각','생명','생일','생활','서로','선물','선비','설날','성공','세상','소금','소나무',
  '소리','소문','소설','소풍','속담','손님','솔잎','송이','수건','수단','수도','수박',
  '수비','수업','수입','수학','숙소','순간','순서','술잔','숨결','시간','시골','시냇물',
  '시민','시작','시장','식구','식물','식사','신문','신발','신비','신호','실내','심장',
  '아기','아들','아름','아버지','아이','아침','안개','안녕','안전','알림','앞길','앞날',
  '약속','양심','양파','어른','언니','얼굴','엄마','여름','여행','연기','연습','연필',
  '열심','열차','영화','옛날','오늘','올림','옹기','왕국','요리','우물','우산','우유',
  '우주','운동','울림','원래','월급','유리','유물','은행','음식','음악','의미','이동',
  '이름','이미','이상','이유','이웃','인간','인기','인류','인물','인사','인생','일기',
  '일상','일요일','입구','입국','잎사귀','자기','자동','자리','자신','자연','자유',
  '작가','작곡','작년','작품','잔디','장난','장마','장미','재료','저녁','전국','전기',
  '전등','전문','전쟁','전통','점심','정문','정신','정원','조건','조금','조상','조용',
  '조직','존경','종류','종이','주말','주민','주소','주인','준비','중간','중심','중앙',
  '즐김','지구','지금','지능','지도','지리','지식','지역','지하','진리','진실','질문',
  '집안','창문','천국','청소','초록','추억','충분','친구','칼날','토요일','통일','통합',
  '파도','파랑','편지','평화','포기','표현','풀잎','풍경','피부','하나','하늘','하루',
  '학교','학생','한강','한국','한글','한마디','합격','항구','항상','해님','해물','행복',
  '현실','혼자','홍수','화분','화산','화요일','환경','활동','회사','효도','후보','훈련',
  '흐름','흙','힘들이',
];

/** 주어진 키 세트로 타이핑 가능한 단어 필터링 */
function getKoreanWordsForKeys(keys: string[]): { jamo: string[] }[] {
  const keySet = new Set(keys);
  const result: { jamo: string[] }[] = [];

  for (const word of KOREAN_WORDS) {
    const jamo = decomposeHangul(word);
    if (jamo && jamo.every(j => keySet.has(j))) {
      result.push({ jamo });
    }
  }
  return result;
}

// 한글 연습 텍스트 생성 — 가능하면 실제 단어 사용
export function generateKoreanPracticeText(row: keyof typeof koreanRowLevels, level: number, baseLength: number = 40): string {
  const levelData = koreanRowLevels[row][level - 1];
  if (!levelData) return '';

  const keys = levelData.keys.filter(k => k !== ' ');
  const words = getKoreanWordsForKeys(keys);

  // 단어가 충분하면 실제 단어 자모 시퀀스 사용
  if (words.length >= 5) {
    const result: string[] = [];
    let totalLen = 0;
    let lastIdx = -1;

    while (totalLen < baseLength) {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * words.length);
      } while (idx === lastIdx && words.length > 3);

      lastIdx = idx;
      const jamoStr = words[idx].jamo.join('');
      result.push(jamoStr);
      totalLen += jamoStr.length + 1;
    }
    return result.join(' ');
  }

  // 단어 부족 → 랜덤 자모
  const length = row === 'all' ? baseLength + (level * 10) : baseLength;
  let text = '';
  for (let i = 0; i < length; i++) {
    text += keys[Math.floor(Math.random() * keys.length)];
    if ((i + 1) % 5 === 0 && i < length - 1) text += ' ';
  }
  return text;
}
