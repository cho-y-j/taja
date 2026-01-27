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

// ── Common English words for real-word practice ──
const COMMON_WORDS = [
  // 2 letters
  'ad','ah','al','as','at','do','go','ha','he','hi','if','in','is','it',
  'la','lo','me','my','no','of','oh','ok','on','or','so','to','up','us','we',
  // 3 letters
  'ace','act','add','age','ago','aid','aim','air','all','and','ant','any','ape',
  'arc','are','ark','arm','art','ash','ask','ate','awe','axe','bad','bag','ban',
  'bar','bat','bay','bed','bet','bid','big','bin','bit','bow','box','boy','bud',
  'bug','bus','but','buy','cab','can','cap','car','cat','cop','cow','cry','cub',
  'cup','cut','dad','dam','day','did','dig','dim','dip','dog','dot','dry','dub',
  'dug','dye','ear','eat','egg','ego','elm','end','era','eve','eye','fan','far',
  'fat','fax','fed','fee','few','fig','fin','fit','fix','fly','fog','for','fox',
  'fry','fun','fur','gag','gap','gas','gave','get','god','got','grab','gum','gun',
  'gut','guy','gym','had','ham','has','hat','hay','hen','her','hid','him','hip',
  'his','hit','hog','hop','hot','how','hub','hug','hum','hut','ice','ill','ink',
  'inn','ion','its','ivy','jab','jag','jam','jar','jaw','jay','jet','jig','job',
  'jog','joy','jug','just','keg','key','kid','kin','kit','lab','lad','lag','lap',
  'law','lay','led','leg','let','lid','lie','lip','lit','log','lot','low','mad',
  'man','map','mat','max','may','men','met','mid','mix','mob','mom','mop','mow',
  'mud','mug','nab','nag','nap','net','new','nil','nip','nod','nor','not','now',
  'nut','oak','oar','oat','odd','off','oil','old','one','opt','ore','our','out',
  'owe','owl','own','pad','pal','pan','pat','paw','pay','pea','peg','pen','per',
  'pet','pie','pig','pin','pit','ply','pod','pop','pot','pro','pry','pub','pug',
  'pull','pun','pup','push','put','rag','ram','ran','rap','rat','raw','ray','red',
  'ref','rib','rid','rig','rim','rip','rob','rod','rot','row','rub','rug','run',
  'rut','rye','sad','sag','sap','sat','saw','say','sea','set','sew','she','shy',
  'sin','sip','sir','sis','sit','six','ski','sky','sly','sob','sod','son','sop',
  'sot','sow','soy','spa','spy','sty','sub','sue','sum','sun','sup','tab','tag',
  'tan','tap','tar','tax','tea','ten','the','tie','tin','tip','toe','ton','too',
  'top','tow','toy','try','tub','tug','two','urn','use','van','vat','vet','via',
  'vie','vim','vow','wad','wag','war','was','wax','way','web','wed','wet','who',
  'why','wig','win','wit','woe','wok','won','woo','wow','yak','yam','yap','yaw',
  'yea','yes','yet','yew','you','zap','zeal','zen','zero','zig','zip','zoo',
  // 4 letters
  'able','also','arch','area','army','aunt','auto','away','back','bake','bald',
  'ball','band','bang','bank','bare','bark','barn','base','bath','bead','beak',
  'beam','bean','bear','beat','beds','beef','been','beer','bell','belt','bend',
  'bent','best','bike','bill','bind','bird','bite','blow','blue','blur','boat',
  'body','bold','bolt','bomb','bond','bone','book','boom','boot','bore','born',
  'boss','both','bowl','bulk','bull','bump','burn','bury','bush','busy','buzz',
  'cafe','cage','cake','calf','call','calm','came','camp','cape','card','care',
  'cart','case','cash','cast','cave','chip','chop','city','clad','clam','clan',
  'clap','clay','clip','clock','club','clue','coal','coat','code','coil','coin',
  'cold','come','cook','cool','cope','copy','cord','core','cork','corn','cost',
  'cozy','crab','crop','crow','cube','cure','curl','cute','dado','dale','damp',
  'dare','dark','dart','dash','data','date','dawn','days','dead','deaf','deal',
  'dear','deck','deed','deem','deep','deer','demo','deny','desk','dial','dice',
  'died','diet','dime','dine','dirt','dish','disk','dock','does','doll','dome',
  'done','doom','door','dose','down','drag','draw','drip','drop','drum','dual',
  'duck','dude','duel','dues','dull','dumb','dump','dune','dusk','dust','duty',
  'each','earn','ease','east','easy','edge','edit','else','emit','envy','epic',
  'euro','even','ever','evil','exam','exit','eyed','face','fact','fade','fail',
  'fair','fake','fall','fame','fang','fare','farm','fast','fate','fear','feat',
  'feed','feel','fees','fell','felt','fend','fern','file','fill','film','find',
  'fine','fire','firm','fish','fist','five','flag','flame','flap','flat','flaw',
  'fled','flip','flock','flow','foam','foil','fold','folk','fond','font','food',
  'fool','foot','ford','fore','fork','form','fort','foul','four','free','frog',
  'from','fuel','full','fume','fund','fury','fuse','fuss','gain','gale','game',
  'gang','gape','garb','gate','gave','gaze','gear','gene','gift','girl','give',
  'glad','glow','glue','goal','goat','goes','gold','golf','gone','good','grab',
  'grim','grin','grip','grow','gulf','gust','guts','hack','hail','hair','hale',
  'half','hall','halt','hand','hang','hard','hare','harm','harp','hash','haste',
  'hate','haul','have','haze','head','heal','heap','hear','heat','heed','heel',
  'held','helm','help','herb','herd','here','hero','hide','high','hike','hill',
  'hilt','hind','hint','hire','hold','hole','holy','home','hood','hook','hope',
  'horn','host','hour','howl','huge','hull','hung','hunt','hurl','hurt','hush',
  'hymn','icon','idea','inch','info','into','iron','isle','item','jack','jade',
  'jail','jazz','jean','jerk','jest','jobs','jock','join','joke','jolt','jump',
  'june','jury','just','keen','keep','kept','kick','kids','kill','kind','king',
  'kiss','kite','knee','knew','knit','knob','knot','know','lace','lack','laid',
  'lake','lamb','lame','lamp','land','lane','lash','lass','last','late','lawn',
  'lazy','lead','leaf','leak','lean','leap','left','lend','lens','less','liar',
  'lick','life','lift','like','limb','lime','limp','line','link','lion','lips',
  'list','live','load','loaf','loan','lock','lodge','loft','logo','lone','long',
  'look','loop','lord','lore','lose','loss','lost','lots','loud','love','luck',
  'lump','lung','lure','lurk','lush','made','maid','mail','main','make','male',
  'mall','malt','mane','many','maps','mare','mark','mask','mass','mast','mate',
  'maze','meal','mean','meat','meet','melt','memo','mend','menu','mere','mesh',
  'mild','mile','milk','mill','mind','mine','mint','miss','mist','moat','mock',
  'mode','mold','mole','mood','moon','more','moss','most','moth','move','much',
  'mule','must','myth','nail','name','navy','near','neat','neck','need','nest',
  'news','next','nice','nine','node','none','noon','norm','nose','note','noun',
  'nude','nuts','obey','odds','once','only','onto','open','oral','oven','over',
  'pace','pack','page','paid','pail','pain','pair','pale','palm','pane','pang',
  'park','part','pass','past','path','peak','peal','pear','peel','peer','perk',
  'pest','pick','pier','pile','pine','pink','pipe','plan','play','plea','plot',
  'plow','plug','plus','poem','poet','pole','poll','polo','pond','pool','poor',
  'pope','pork','port','pose','post','pour','pray','prey','prop','puck','pull',
  'pulp','pump','punk','pure','push','quad','quit','quiz','race','rack','raft',
  'rage','raid','rail','rain','rake','ramp','rang','rank','rare','rash','rate',
  'rave','read','real','reap','rear','reef','reel','rely','rent','rest','rice',
  'rich','ride','rift','ring','rise','risk','road','roam','roar','robe','rock',
  'rode','role','roll','roof','room','root','rope','rose','ruin','rule','rung',
  'rush','rust','sack','safe','sage','said','sail','sake','sale','salt','same',
  'sand','sane','sang','save','scan','seal','seam','seed','seek','seem','seen',
  'self','sell','send','sent','shed','shin','ship','shoe','shop','shot','show',
  'shut','sick','side','sift','sigh','sign','silk','sing','sink','site','size',
  'skin','skip','slam','slap','slid','slim','slip','slot','slow','slug','snap',
  'snow','soak','soar','sock','sofa','soft','soil','sold','sole','some','song',
  'soon','sort','soul','sour','span','spin','spit','spot','stab','star','stay',
  'stem','step','stew','stir','stop','stub','such','suit','sung','sunk','sure',
  'surf','swap','swim','tabs','tack','tail','take','tale','talk','tall','tame',
  'tank','tape','tart','task','team','tear','tell','tend','tens','term','test',
  'text','than','that','them','then','they','thin','this','thus','tick','tide',
  'tidy','tied','tier','tile','till','tilt','time','tine','tiny','tire','toad',
  'toil','told','toll','tomb','tone','took','tool','tops','tore','torn','toss',
  'tour','town','trap','tray','tree','trek','trim','trio','trip','trod','true',
  'tube','tuck','tuna','tune','turn','turf','twin','type','ugly','undo','unit',
  'upon','urge','used','user','vain','vale','vary','vase','vast','veil','vein',
  'vent','verb','very','vest','vibe','vice','view','vine','visa','void','volt',
  'vote','wade','wage','wail','wait','wake','walk','wall','wand','want','ward',
  'warm','warn','warp','wart','wash','wave','wavy','waxy','weak','wear','weed',
  'week','well','went','were','west','what','when','whom','wick','wide','wife',
  'wild','will','wilt','wily','wind','wine','wing','wink','wipe','wire','wise',
  'wish','with','woke','wolf','wood','wool','word','wore','work','worm','worn',
  'wrap','wren','yank','yard','yarn','year','yell','yoga','yolk','your','zeal',
  'zero','zinc','zone','zoom',
  // 5+ letters
  'about','above','abuse','adapt','admin','admit','adopt','adult','after','again',
  'agree','ahead','alarm','album','alert','alien','align','alive','allow','alone',
  'along','alter','among','angel','anger','angle','angry','apart','apple','apply',
  'arena','argue','arise','array','aside','asset','avoid','awake','award','aware',
  'awful','badly','based','basic','basin','basis','beach','began','begin','being',
  'below','bench','birth','black','blade','blame','blank','blast','blaze','bleed',
  'blend','bless','blind','block','blood','bloom','blown','board','bonus','boost',
  'booth','bound','brain','brand','brave','bread','break','breed','brick','bride',
  'brief','bring','broad','brown','brush','buddy','build','bunch','burst','buyer',
  'cabin','cable','cargo','carry','catch','cause','chain','chair','chalk','charm',
  'chart','chase','cheap','check','cheek','chest','chief','child','chunk','civil',
  'claim','clash','class','clean','clear','clerk','click','cliff','climb','cling',
  'clock','clone','close','cloth','cloud','coach','coast','color','comes','comic',
  'coral','count','court','cover','crack','craft','crane','crash','crawl','crazy',
  'cream','crime','cross','crowd','cruel','crush','curve','cycle','daily','dance',
  'death','debut','delay','depth','devil','dirty','donor','doubt','draft','drain',
  'drama','drank','drawn','dream','dress','dried','drift','drill','drink','drive',
  'drops','drove','drunk','dying','eager','early','earth','eight','elect','elite',
  'email','empty','enemy','enjoy','enter','equal','error','essay','event','every',
  'exact','exert','exile','exist','extra','fable','faith','false','fancy','fatal',
  'fault','feast','fence','ferry','fever','fewer','fiber','field','fifth','fifty',
  'fight','final','flesh','flood','floor','fluid','focus','force','forge','forth',
  'found','frame','frank','fraud','fresh','front','frost','fruit','fully','funny',
  'ghost','giant','given','glass','globe','gloom','glory','grace','grade','grain',
  'grand','grant','graph','grasp','grass','grave','great','green','greet','grief',
  'gross','group','grown','guard','guess','guest','guide','guild','guilt','habit',
  'happy','harsh','haven','heart','heavy','hedge','honor','horse','hotel','house',
  'human','humor','hurry','ideal','image','imply','index','inner','input','irony',
  'issue','jewel','joint','judge','juice','knife','knock','known','label','labor',
  'large','laser','later','laugh','layer','learn','lease','least','leave','legal',
  'level','light','liked','limit','linen','liver','lobby','local','lodge','logic',
  'lonely','loose','lover','lower','loyal','lucky','lunar','lunch','magic','major',
  'maker','manor','maple','march','marry','match','mayor','media','mercy','merge',
  'metal','might','minor','minus','mixed','model','money','month','moral','motor',
  'mount','mouse','mouth','moved','movie','music','naked','nerve','never','newly',
  'night','noble','noise','north','noted','novel','nurse','occur','ocean','offer',
  'often','opera','order','other','ought','outer','owned','owner','paint','panel',
  'panic','paper','party','paste','patch','pause','peace','penny','phase','phone',
  'photo','piano','piece','pilot','pitch','pixel','place','plain','plane','plant',
  'plate','plaza','plead','plumb','plunge','point','pound','power','press','price',
  'pride','prime','print','prior','prize','probe','proof','proud','prove','proxy',
  'psalm','pulse','punch','pupil','purse','queen','quest','queue','quick','quiet',
  'quite','quote','radar','radio','raise','rally','ranch','range','rapid','ratio',
  'reach','react','ready','realm','rebel','refer','reign','relax','reply','rider',
  'rifle','right','rigid','risky','rival','river','robin','robot','rocky','roman',
  'rough','round','route','royal','rugby','ruler','rural','saint','salad','scale',
  'scene','scope','score','seize','sense','serve','setup','seven','shade','shaft',
  'shake','shall','shame','shape','share','shark','sharp','sheer','sheet','shelf',
  'shell','shift','shine','shirt','shock','shoot','shore','short','shout','sight',
  'since','sixth','sixty','skill','skull','slave','sleep','slice','slide','slope',
  'small','smart','smell','smile','smoke','solar','solid','solve','sorry','sound',
  'south','space','spare','speak','speed','spend','spill','spine','spite','split',
  'spoke','sport','spray','squad','stack','staff','stage','stain','stake','stale',
  'stall','stamp','stand','stark','start','state','stays','steal','steam','steel',
  'steep','steer','stern','stick','stiff','still','stock','stone','stood','store',
  'storm','story','stove','strip','stuck','stuff','style','sugar','suite','super',
  'surge','swamp','swear','sweep','sweet','swept','swing','sword','table','taste',
  'teach','terms','theft','theme','there','thick','thing','think','third','those',
  'three','threw','throw','tight','tired','title','today','total','touch','tough',
  'tower','trace','track','trade','trail','train','trait','trash','treat','trend',
  'trial','tribe','trick','tried','troop','truck','truly','trump','trunk','trust',
  'truth','tumor','twice','twist','ultra','uncle','under','union','unite','unity',
  'until','upper','upset','urban','usage','usual','utter','valid','value','vault',
  'venue','vigor','virus','visit','vital','vivid','vocal','voice','voter','wagon',
  'waste','watch','water','weave','weigh','weird','wheat','wheel','where','which',
  'while','white','whole','whose','wider','woman','women','world','worry','worse',
  'worst','worth','would','wound','wreck','write','wrong','wrote','yield','young',
  'youth',
];

// 주어진 키 세트로 만들 수 있는 단어 필터링
function getWordsForKeys(keys: string[]): string[] {
  const keySet = new Set(keys.map(k => k.toLowerCase()));
  return COMMON_WORDS.filter(word =>
    word.split('').every(ch => keySet.has(ch))
  );
}

// 연습 텍스트 생성 - 가능하면 실제 단어 사용
export function generateRowPracticeText(row: KeyboardRow, level: number, baseLength: number = 40): string {
  const levelData = rowLevels[row][level - 1];
  if (!levelData) return '';

  const keys = levelData.keys.filter(k => k !== ' ');

  // 사용 가능한 실제 단어 찾기
  const words = getWordsForKeys(keys);

  // 단어가 충분하면 (5개 이상) 실제 단어로 텍스트 구성
  if (words.length >= 5) {
    return generateWordBasedText(words, baseLength);
  }

  // 단어가 부족하면 랜덤 문자 방식 (기존 방식)
  return generateRandomText(keys, baseLength, row, level);
}

function generateWordBasedText(words: string[], targetLength: number): string {
  const result: string[] = [];
  let totalLen = 0;

  while (totalLen < targetLength) {
    const word = words[Math.floor(Math.random() * words.length)];
    // 직전 단어와 중복 방지
    if (result.length > 0 && result[result.length - 1] === word && words.length > 3) {
      continue;
    }
    result.push(word);
    totalLen += word.length + 1; // +1 for space
  }

  return result.join(' ');
}

function generateRandomText(keys: string[], baseLength: number, row: KeyboardRow, level: number): string {
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
