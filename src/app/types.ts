export type BrothType = '돼지' | '닭' | '해물' | '쇼유' | '시오' | '미소';
export type TextureType = '꼬들' | '보통' | '퍼짐';
export type NoodleThicknessType = '가는 면' | '보통 면' | '굵은 면';
export type RichnessType = '진함' | '보통' | '맑음';
export type SpiceType = '없음' | '약간' | '보통' | '강함';
export type SignatureTag = '수제면 제조' | '직접 우린 육수' | '기간 한정 메뉴' | '혼밥식 좌석';

export interface Preference {
  broth: BrothType[];           // ← 배열로 변경 (복수 선택)
  noodleThickness: NoodleThicknessType | null;
  texture: TextureType | null;
  richness: RichnessType | null;
  spiceLevel: SpiceType | null;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  broth: BrothType;
  texture: TextureType;
  richness: RichnessType;
  spiceLevel: SpiceType;
  description: string;
  isSignature?: boolean;
  isLimited?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  rating: number;
  distance: string;
  imageUrl: string;
  tags: string[];
  broth: BrothType[];          // ← 배열로 변경
  noodleThickness: NoodleThicknessType;
  noodleShape: string;
  selfMadeNoodles: boolean;
  texture: TextureType;
  richness: RichnessType;
  spiceLevel: SpiceType;
  waiting: boolean;
  waitingTime?: string;
  averageWaitTime: string;
  operatingNote: string;
  isLocal: boolean;
  signatureTags: SignatureTag[];
  signature: string;
  location: { lat: number; lng: number };
  /** SVG 맵 내 핀 위치 (0~390, 0~480 기준) */
  mapPos: { x: number; y: number };
  mustTry: boolean;
  menus: MenuItem[];
  detectiveReviews: DetectiveReview[];
}

export interface DetectiveReview {
  id: string;
  texture: string;
  broth: string;
  atmosphere: string;
  revisit: string;
  note: string;
  verifiedVisit: boolean;
}

export interface NotebookEntry {
  id: string;
  shopId?: string;
  date: string;
  shopName: string;
  menu: string;
  memo: string;
  texture?: string;
  richness?: string;
  tasteMatch?: string;
  impression?: string;
}

export function getMenuMatch(
  menu: MenuItem,
  pref: Preference
): { score: number; matchedLabels: string[] } {
  const matchedLabels: string[] = [];
  if (pref.broth.length > 0 && pref.broth.includes(menu.broth)) matchedLabels.push(pref.broth.join('·') + ' 계열');
  if (pref.texture && menu.texture === pref.texture) matchedLabels.push(pref.texture + '면');
  if (pref.richness && menu.richness === pref.richness) matchedLabels.push('국물 ' + pref.richness);
  if (pref.spiceLevel && menu.spiceLevel === pref.spiceLevel) matchedLabels.push('맵기 ' + pref.spiceLevel);
  return { score: matchedLabels.length, matchedLabels };
}

export function totalSelectedCount(pref: Preference): number {
  return [
    pref.broth.length > 0 ? 1 : null,
    pref.texture, pref.richness, pref.spiceLevel,
  ].filter(Boolean).length;
}

export const mockShops: Shop[] = [
  /* ── 돼지 육수 ── */
  {
    id: '1',
    name: '혼다라멘',
    description: '직화 돈코츠 · 가는 스트레이트면 · 진함',
    rating: 4.8,
    distance: '0.9km',
    imageUrl: 'https://images.unsplash.com/photo-1772217261042-0175d0b2fcb0?w=400&h=300&fit=crop',
    tags: ['자가제면', '국물이 깊음', '사장님 라멘 덕후'],
    broth: ['돼지'],
    noodleThickness: '가는 면',
    noodleShape: '스트레이트면',
    selfMadeNoodles: true,
    texture: '꼬들',
    richness: '진함',
    spiceLevel: '없음',
    waiting: false,
    averageWaitTime: '평소 약 20분',
    operatingNote: '현재 바로 입장 가능 · 재료 소진 시 조기 마감',
    isLocal: true,
    signatureTags: ['수제면 제조', '직접 우린 육수', '혼밥식 좌석'],
    signature: '매장에서 직접 뽑은 가는 스트레이트면과 직화로 8시간 추출한 돈코츠 육수. 단일 매장만 운영하는 울산 삼산동 로컬 라멘집입니다.',
    location: { lat: 35.5378, lng: 129.3361 },
    mapPos: { x: 289, y: 232 },
    mustTry: true,
    menus: [
      { id: '1-1', name: '기본 돈코츠 라멘', price: 13000, broth: '돼지', texture: '꼬들', richness: '진함', spiceLevel: '없음', description: '순수 하카타식 돼지뼈 진국, 극꼬들면', isSignature: true },
      { id: '1-2', name: '특제 차슈 라멘', price: 16000, broth: '돼지', texture: '꼬들', richness: '진함', spiceLevel: '없음', description: '직화 구이 차슈 3장 + 반숙란 + 해초', isSignature: true },
      { id: '1-3', name: '마늘 라멘', price: 13500, broth: '돼지', texture: '꼬들', richness: '진함', spiceLevel: '약간', description: '볶은 마늘 드문뿍, 카에다마 무한리필' },
      { id: '1-4', name: '쇼유 라멘', price: 12500, broth: '쇼유', texture: '꼬들', richness: '보통', spiceLevel: '없음', description: '간장 타레 가미, 라이트 돈코츠 베이스' },
    ],
    detectiveReviews: [
      {
        id: 'r1',
        texture: '가는 스트레이트면, 탄력 있음',
        broth: '진하지만 느끼하지 않은 직화 돈코츠',
        atmosphere: '조용한 카운터석, 조리 과정이 보임',
        revisit: '재방문 확정',
        note: '차슈를 직접 손질하는 모습이 보이고 국물을 끝까지 마실 만큼 균형이 좋았어요.',
        verifiedVisit: true,
      },
      {
        id: 'r2',
        texture: '꼬들 세팅 추천',
        broth: '향이 깊고 마늘 추가와 잘 어울림',
        atmosphere: '혼밥하기 편함',
        revisit: '다시 방문 예정',
        note: '협찬 없는 방문 기록으로, 웨이팅을 감수할 만한 한 그릇이었습니다.',
        verifiedVisit: true,
      },
    ],
  },
  {
    id: '4',
    name: '라멘 온기',
    description: '돈코츠·쇼유 · 보통면 · 보통',
    rating: 4.5,
    distance: '1.1km',
    imageUrl: 'https://images.unsplash.com/photo-1719204089341-11dec48eae19?w=400&h=300&fit=crop',
    tags: ['돼지육수', '쇼유', '가성비'],
    broth: ['돼지', '쇼유'],
    noodleThickness: '보통 면',
    noodleShape: '웨이브면',
    selfMadeNoodles: false,
    texture: '보통',
    richness: '보통',
    spiceLevel: '약간',
    waiting: false,
    averageWaitTime: '평소 약 5분',
    operatingNote: '점심 세트 운영 · 재료 소진 시 조기 마감',
    isLocal: true,
    signatureTags: ['혼밥식 좌석'],
    signature: '울산 삼산동 직장인들의 단골집. 점심 한정 세트가 가성비 갑이며, 카에다마(면 추가) 무제한 제공으로 배불리 즐길 수 있습니다.',
    location: { lat: 35.5383, lng: 129.3373 },
    mapPos: { x: 309, y: 219 },
    mustTry: false,
    menus: [
      { id: '4-1', name: '기본 돈코츠 라멘', price: 12000, broth: '돼지', texture: '보통', richness: '보통', spiceLevel: '없음', description: '진한 돼지뼈 국물, 카에다마 무제한', isSignature: true },
      { id: '4-2', name: '기본 쇼유 라멘', price: 12000, broth: '쇼유', texture: '보통', richness: '맑음', spiceLevel: '없음', description: '깔끔한 간장 베이스 깃코만 타레' },
      { id: '4-3', name: '토리파이탄 라멘', price: 13000, broth: '닭', texture: '보통', richness: '보통', spiceLevel: '없음', description: '닭 백탕 진국, 부드러운 국물', isSignature: true },
      { id: '4-4', name: '매운 야채 라멘', price: 13000, broth: '돼지', texture: '보통', richness: '보통', spiceLevel: '약간', description: '고추 오일 + 야채 가득 볶음 토핑' },
    ],
    detectiveReviews: [],
  },

  /* ── 쇼유·닭 육수 ── */
  {
    id: '2',
    name: '멘무샤 울산',
    description: '쇼유·닭 육수 · 수제꼬들면 · 보통',
    rating: 4.6,
    distance: '2.3km',
    imageUrl: 'https://images.unsplash.com/photo-1638866281450-3933540af86a?w=400&h=300&fit=crop',
    tags: ['쇼유', '수제면', '닭육수'],
    broth: ['쇼유', '닭'],
    noodleThickness: '가는 면',
    noodleShape: '스트레이트면',
    selfMadeNoodles: true,
    texture: '꼬들',
    richness: '보통',
    spiceLevel: '없음',
    waiting: false,
    averageWaitTime: '평소 약 10분',
    operatingNote: '당일 제면 수량 소진 시 마감',
    isLocal: true,
    signatureTags: ['수제면 제조', '직접 우린 육수'],
    signature: '매일 아침 직접 뽑는 수제 직면(直麵)이 시그니처. 닭·돼지 블렌드 쇼유 육수와의 궁합이 뛰어난 울산 달동의 숨은 명소입니다.',
    location: { lat: 35.5329, lng: 129.3231 },
    mapPos: { x: 88, y: 363 },
    mustTry: false,
    menus: [
      { id: '2-1', name: '쇼유 수제면 라멘', price: 13000, broth: '쇼유', texture: '꼬들', richness: '보통', spiceLevel: '없음', description: '직접 뽑은 수제 직면, 간장 육수', isSignature: true },
      { id: '2-2', name: '토리 쇼유 라멘', price: 14000, broth: '닭', texture: '꼬들', richness: '보통', spiceLevel: '없음', description: '닭 육수 쇼유 베이스, 차슈·멘마 토핑', isSignature: true },
      { id: '2-3', name: '쯔케멘', price: 14000, broth: '쇼유', texture: '꼬들', richness: '진함', spiceLevel: '없음', description: '진한 소스에 수제면 찍어먹는 스타일' },
      { id: '2-4', name: '매운 쇼유 라멘', price: 13500, broth: '쇼유', texture: '꼬들', richness: '보통', spiceLevel: '약간', description: '청양 고추 오일 가미, 칼칼한 쇼유' },
    ],
    detectiveReviews: [],
  },

  /* ── 해물·돼지 육수 ── */
  {
    id: '3',
    name: '하카타 분코 울산',
    description: '해물·돼지 육수 · 보통면 · 진함',
    rating: 4.7,
    distance: '1.6km',
    imageUrl: 'https://images.unsplash.com/photo-1749293253083-e5f2a48de33b?w=400&h=300&fit=crop',
    tags: ['해물육수', '얼큰', '한정메뉴'],
    broth: ['해물', '돼지'],
    noodleThickness: '보통 면',
    noodleShape: '웨이브면',
    selfMadeNoodles: false,
    texture: '보통',
    richness: '진함',
    spiceLevel: '보통',
    waiting: true,
    waitingTime: '약 25분',
    averageWaitTime: '평소 약 25분',
    operatingNote: '수요일 특선 한정 판매 · 재료 소진 시 마감',
    isLocal: true,
    signatureTags: ['직접 우린 육수', '기간 한정 메뉴'],
    signature: '울산 앞바다 해산물과 돼지뼈를 함께 끓여 완성한 독특한 블렌드 육수. 매주 수요일 한정 특선 메뉴가 SNS를 달구는 화제의 가게입니다.',
    location: { lat: 35.5415, lng: 129.3322 },
    mapPos: { x: 229, y: 133 },
    mustTry: true,
    menus: [
      { id: '3-1', name: '해물 진한 라멘', price: 14000, broth: '해물', texture: '보통', richness: '진함', spiceLevel: '없음', description: '해산물 진국 + 돼지뼈 블렌드', isSignature: true },
      { id: '3-2', name: '매운 해물 라멘', price: 15000, broth: '해물', texture: '보통', richness: '진함', spiceLevel: '보통', description: '해물 진국에 비법 고추기름 토핑', isSignature: true },
      { id: '3-3', name: '아사리 시오 라멘', price: 13000, broth: '해물', texture: '보통', richness: '맑음', spiceLevel: '없음', description: '바지락 맑은 육수, 담백한 시오 베이스' },
      { id: '3-4', name: '오마카세 특선 라멘', price: 16000, broth: '해물', texture: '보통', richness: '진함', spiceLevel: '약간', description: '수요일 한정 · 제철 해산물 토핑', isLimited: true },
    ],
    detectiveReviews: [],
  },

  /* ── 시오·쇼유 육수 ── */
  {
    id: '7',
    name: '기무라야 울산',
    description: '시오·쇼유 육수 · 보통면 · 맑음',
    rating: 4.4,
    distance: '1.3km',
    imageUrl: 'https://images.unsplash.com/photo-1742633882713-593c13e90231?w=400&h=300&fit=crop',
    tags: ['시오', '소금', '쇼유'],
    broth: ['시오', '쇼유'],
    noodleThickness: '가는 면',
    noodleShape: '스트레이트면',
    selfMadeNoodles: false,
    texture: '보통',
    richness: '맑음',
    spiceLevel: '없음',
    waiting: false,
    averageWaitTime: '대기 거의 없음',
    operatingNote: '브레이크타임 15:00-17:00',
    isLocal: true,
    signatureTags: ['직접 우린 육수'],
    signature: '오키나와 천연 소금과 다시마·멸치 다시로 완성한 청아한 시오 라멘. 투명한 국물에서 느껴지는 깊은 감칠맛이 이 집의 자부심입니다.',
    location: { lat: 35.5357, lng: 129.3290 },
    mapPos: { x: 179, y: 288 },
    mustTry: false,
    menus: [
      { id: '7-1', name: '기본 시오 라멘', price: 12000, broth: '시오', texture: '보통', richness: '맑음', spiceLevel: '없음', description: '오키나와 소금 + 다시마 맑은 국물', isSignature: true },
      { id: '7-2', name: '시오 차슈 라멘', price: 14000, broth: '시오', texture: '보통', richness: '맑음', spiceLevel: '없음', description: '차슈 2장 + 반숙란 프리미엄 토핑' },
      { id: '7-3', name: '기본 쇼유 라멘', price: 12000, broth: '쇼유', texture: '보통', richness: '맑음', spiceLevel: '없음', description: '간장 타레 가미, 맑은 담백 국물' },
      { id: '7-4', name: '매운 쇼유 라멘', price: 12500, broth: '쇼유', texture: '보통', richness: '보통', spiceLevel: '약간', description: '청양 풍미 칼칼한 쇼유 국물' },
    ],
    detectiveReviews: [],
  },

  /* ── 미소 육수 ── */
  {
    id: '9',
    name: '미소야 울산 삼산',
    description: '미소·돼지 육수 · 보통면 · 진함',
    rating: 4.5,
    distance: '1.9km',
    imageUrl: 'https://images.unsplash.com/photo-1627489364800-ad1e97633699?w=400&h=300&fit=crop',
    tags: ['미소', '된장', '진국'],
    broth: ['미소', '돼지'],
    noodleThickness: '굵은 면',
    noodleShape: '웨이브면',
    selfMadeNoodles: false,
    texture: '보통',
    richness: '진함',
    spiceLevel: '없음',
    waiting: true,
    waitingTime: '약 15분',
    averageWaitTime: '평소 약 15분',
    operatingNote: '겨울 한정 메뉴 운영 · 재료 소진 시 마감',
    isLocal: true,
    signatureTags: ['직접 우린 육수', '기간 한정 메뉴'],
    signature: '홋카이도식 미소 3종 블렌딩이 특징. 버터 콘 토핑이 기본으로 올라가며, 겨울 한정 카니(게) 미소 라멘은 줄 서서 먹는 인기 메뉴입니다.',
    location: { lat: 35.5348, lng: 129.3253 },
    mapPos: { x: 122, y: 312 },
    mustTry: true,
    menus: [
      { id: '9-1', name: '삿포로 미소 라멘', price: 13000, broth: '미소', texture: '보통', richness: '진함', spiceLevel: '없음', description: '3종 미소 블렌드 + 버터 콘 기본 토핑', isSignature: true },
      { id: '9-2', name: '버터 콘 미소', price: 14000, broth: '미소', texture: '보통', richness: '진함', spiceLevel: '없음', description: '버터·콘·차슈 풀 토핑 프리미엄', isSignature: true },
      { id: '9-3', name: '매운 미소 라멘', price: 13500, broth: '미소', texture: '보통', richness: '진함', spiceLevel: '보통', description: '미소 베이스 매운 칠리 오일 가미' },
      { id: '9-4', name: '카니 미소 라멘', price: 16000, broth: '미소', texture: '퍼짐', richness: '진함', spiceLevel: '없음', description: '겨울 한정 · 홋카이도산 게 토핑', isLimited: true },
    ],
    detectiveReviews: [],
  },

];
