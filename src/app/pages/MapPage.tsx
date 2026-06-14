import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { mockShops, Shop, BrothType, NoodleThicknessType, TextureType, RichnessType, SpiceType } from '../types';
import { AppButton } from '../components/AppButton';

const BROTH_FILTERS: BrothType[] = ['돼지', '닭', '해물', '쇼유', '시오', '미소'];
const NOODLE_FILTERS: NoodleThicknessType[] = ['가는 면', '보통 면', '굵은 면'];
const TEXTURE_FILTERS: TextureType[] = ['꼬들', '보통', '퍼짐'];
const RICHNESS_FILTERS: RichnessType[] = ['진함', '보통', '맑음'];
const SPICE_FILTERS: SpiceType[] = ['없음', '약간', '보통', '강함'];
const EXTRA_FILTERS = ['웨이팅 없음', '자가제면'];

const MAP_W = 390;
const MAP_H = 480;

function UlsanMapSVG() {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}
    >
      <rect width={MAP_W} height={MAP_H} fill="#F2EAD7" />

      {/* 구역 블록들 */}
      <rect x="60" y="80" width="110" height="90" rx="4" fill="#EAE0CC" />
      <rect x="180" y="60" width="130" height="80" rx="4" fill="#EDE3D0" />
      <rect x="60" y="190" width="80" height="100" rx="4" fill="#E8DFCB" />
      <rect x="160" y="170" width="90" height="75" rx="4" fill="#EBE1CD" />
      <rect x="260" y="170" width="100" height="85" rx="4" fill="#E9DFCB" />
      <rect x="60" y="310" width="120" height="90" rx="4" fill="#E6DCCA" />
      <rect x="200" y="275" width="160" height="85" rx="4" fill="#EAE0CC" />

      {/* 공원 */}
      <rect x="315" y="70" width="65" height="75" rx="10" fill="#D4E8C8" />
      <ellipse cx="347" cy="107" rx="24" ry="18" fill="#C6DFB4" />

      {/* 태화강 */}
      <path d="M0 425 Q60 412 130 422 Q210 434 275 418 Q325 408 390 422" stroke="#A8C8E8" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M0 425 Q60 412 130 422 Q210 434 275 418 Q325 408 390 422" stroke="#BDDAEE" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* 주요 도로 */}
      <rect x="196" y="0" width="16" height={MAP_H} fill="#D9C9B0" />
      <rect x="0" y="252" width={MAP_W} height="14" fill="#D9C9B0" />
      <rect x="0" y="150" width={MAP_W} height="12" fill="#D9C9B0" />

      {/* 보조 도로 */}
      <rect x="118" y="0" width="7" height={MAP_H} fill="#DDD3BC" />
      <rect x="290" y="0" width="7" height={MAP_H} fill="#DDD3BC" />
      <rect x="0" y="78" width={MAP_W} height="6" fill="#DDD3BC" />
      <rect x="0" y="340" width={MAP_W} height="6" fill="#DDD3BC" />

      {/* 세부 도로 */}
      <rect x="58" y="0" width="4" height={MAP_H} fill="#E2D8C5" />
      <rect x="350" y="0" width="4" height={MAP_H} fill="#E2D8C5" />
      <rect x="0" y="200" width={MAP_W} height="4" fill="#E2D8C5" />
      <rect x="0" y="382" width={MAP_W} height="3" fill="#E2D8C5" />

      {/* 도로 중앙선 */}
      {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map((y) => (
        <rect key={y} x="202" y={y} width="4" height="18" rx="2" fill="#C9B99A" opacity="0.6" />
      ))}

      {/* 지역 라벨 */}
      <text x="82" y="136" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.75">삼산동</text>
      <text x="220" y="124" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.75">삼산중앙로</text>
      <text x="75" y="355" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.75">달동</text>
      <text x="220" y="315" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.75">삼산</text>
      <text x="324" y="104" fontSize="8" fill="#7A9E6A" fontWeight="700" opacity="0.85">공원</text>
      <text x="145" y="428" fontSize="9" fill="#7AAFD4" fontWeight="700" opacity="0.85">태화강</text>
    </svg>
  );
}

interface ShopPinProps {
  shop: Shop;
  isSelected: boolean;
  onSelect: (shop: Shop) => void;
}

function ShopPin({ shop, isSelected, onSelect }: ShopPinProps) {
  const brothColors: Record<string, string> = {
    '돼지': '#C4581A', '닭': '#D4852A', '해물': '#2A7AB5',
    '쇼유': '#5C3D8A', '시오': '#3A8A5A', '미소': '#9A5A1A',
  };
  const color = brothColors[shop.broth[0]] ?? '#E87C2A';

  return (
    <button
      onClick={() => onSelect(shop)}
      className="absolute transition-all duration-200 active:scale-110"
      style={{
        left: `${(shop.mapPos.x / MAP_W) * 100}%`,
        top: `${(shop.mapPos.y / MAP_H) * 100}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: isSelected ? 20 : 10,
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{ filter: isSelected ? `drop-shadow(0 4px 10px ${color}99)` : undefined }}
      >
        {/* 선택된 가게 라벨 */}
        {isSelected && (
          <div
            className="rounded-[8px] px-[8px] py-[3px] mb-[3px] whitespace-nowrap"
            style={{
              backgroundColor: '#2C1A0E',
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: '10px',
              fontWeight: 700,
              color: '#FFFBF5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            {shop.name}
          </div>
        )}
        <div
          className="rounded-full flex items-center justify-center transition-all"
          style={{
            width: isSelected ? '30px' : '22px',
            height: isSelected ? '30px' : '22px',
            backgroundColor: isSelected ? '#2C1A0E' : color,
            border: isSelected ? `3px solid ${color}` : '2.5px solid white',
            boxShadow: isSelected ? `0 0 0 2px ${color}` : '0 2px 6px rgba(0,0,0,0.22)',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: isSelected ? '8px' : '7px',
              height: isSelected ? '8px' : '7px',
              backgroundColor: isSelected ? color : 'rgba(255,255,255,0.85)',
            }}
          />
        </div>
        <div
          style={{
            width: 0, height: 0,
            borderLeft: `${isSelected ? 5 : 4}px solid transparent`,
            borderRight: `${isSelected ? 5 : 4}px solid transparent`,
            borderTop: `${isSelected ? 8 : 6}px solid ${isSelected ? '#2C1A0E' : color}`,
            marginTop: '-1px',
          }}
        />
      </div>
    </button>
  );
}

function MapFilterButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <AppButton onClick={onClick} variant="secondary" size="sm" selected={active} className="shrink-0">
      {children}
    </AppButton>
  );
}

export default function MapPage() {
  const navigate = useNavigate();
  const { theme, preference } = useApp();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(() => [
    ...preference.broth.map((broth) => `${broth} 육수`),
    ...(preference.noodleThickness ? [preference.noodleThickness] : []),
    ...(preference.texture ? [`${preference.texture} 식감`] : []),
    ...(preference.richness ? [`${preference.richness} 국물`] : []),
    ...(preference.spiceLevel ? [`맵기 ${preference.spiceLevel}`] : []),
  ]);
  const [searchText, setSearchText] = useState('');
  const localShops = useMemo(() => mockShops.filter((shop) => shop.isLocal), []);

  const filteredShops = useMemo(() => {
    if (activeFilters.length === 0) return localShops;
    return localShops.filter((shop) => {
      const brothFilters = activeFilters
        .filter((f) => f.endsWith(' 육수'))
        .map((f) => f.replace(' 육수', '') as BrothType);
      const noodleFilters = activeFilters.filter((f) => NOODLE_FILTERS.includes(f as NoodleThicknessType)) as NoodleThicknessType[];
      const textureFilters = activeFilters
        .filter((f) => f.endsWith(' 식감'))
        .map((f) => f.replace(' 식감', '') as TextureType);
      const richnessFilters = activeFilters
        .filter((f) => f.endsWith(' 국물'))
        .map((f) => f.replace(' 국물', '') as RichnessType);
      const spiceFilters = activeFilters
        .filter((f) => f.startsWith('맵기 '))
        .map((f) => f.replace('맵기 ', '') as SpiceType);
      const noWait = activeFilters.includes('웨이팅 없음');
      const selfNoodle = activeFilters.includes('자가제면');

      const brothMatch = brothFilters.length === 0 || brothFilters.some((f) => shop.broth.includes(f as BrothType));
      const noodleMatch = noodleFilters.length === 0 || noodleFilters.includes(shop.noodleThickness);
      const textureMatch = textureFilters.length === 0 || textureFilters.includes(shop.texture);
      const richnessMatch = richnessFilters.length === 0 || richnessFilters.includes(shop.richness);
      const spiceMatch = spiceFilters.length === 0 || spiceFilters.includes(shop.spiceLevel);
      const noWaitMatch = !noWait || !shop.waiting;
      const selfNoodleMatch = !selfNoodle || shop.selfMadeNoodles;

      return brothMatch && noodleMatch && textureMatch && richnessMatch && spiceMatch && noWaitMatch && selfNoodleMatch;
    });
  }, [activeFilters, localShops]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]);
  };

  const handlePinSelect = (shop: Shop) => {
    setSelectedShop((prev) => (prev?.id === shop.id ? null : shop));
    setShowFilterPanel(false);
  };

  return (
    <div className="h-full relative overflow-hidden" style={{ backgroundColor: '#F2EAD7' }}>
      {/* 지도 배경 */}
      <div className="absolute inset-0">
        <UlsanMapSVG />
      </div>

      {/* 흐린 핀 (필터 제외된 가게) */}
      <div className="absolute inset-0" style={{ zIndex: 4 }}>
        {localShops
          .filter((s) => !filteredShops.find((f) => f.id === s.id))
          .map((shop) => (
            <div
              key={shop.id}
              className="absolute"
              style={{
                left: `${(shop.mapPos.x / MAP_W) * 100}%`,
                top: `${(shop.mapPos.y / MAP_H) * 100}%`,
                transform: 'translate(-50%, -100%)',
                opacity: 0.25,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-[18px] h-[18px] rounded-full" style={{ backgroundColor: '#999', border: '2px solid white' }} />
                <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '5px solid #999' }} />
              </div>
            </div>
          ))}
      </div>

      {/* 활성 핀 */}
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        {filteredShops.map((shop) => (
          <ShopPin
            key={shop.id}
            shop={shop}
            isSelected={selectedShop?.id === shop.id}
            onSelect={handlePinSelect}
          />
        ))}
      </div>

      {/* 검색바 */}
      <div className="absolute top-0 left-0 right-0 px-[14px] pt-[72px]" style={{ zIndex: 15 }}>
        <button
          onClick={() => { setShowFilterPanel(true); setSelectedShop(null); }}
          className="w-full h-[46px] rounded-[14px] flex items-center gap-[10px] px-[14px] text-left active:scale-[0.98] transition-transform"
          aria-label="가게 또는 지역 검색하기"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 8px 22px ${theme.shadow}`,
          }}
        >
          <svg width="17" height="17" fill="none" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke={theme.accent} strokeWidth="1.8" />
            <path d="M12.2 12.2L16 16" stroke={theme.accent} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '13px', color: theme.mutedColor }}>
            가게 또는 지역을 검색하세요
          </span>
        </button>

        {activeFilters.length > 0 && (
          <div className="flex gap-[6px] mt-[8px] overflow-x-auto pb-[2px]" style={{ scrollbarWidth: 'none' }}>
            {activeFilters.map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className="flex-shrink-0 flex items-center gap-[4px] px-[10px] py-[5px] rounded-full active:scale-95 transition-transform"
                style={{ backgroundColor: '#2C1A0E', border: '1px solid #2C1A0E' }}
              >
                <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: '#FFFBF5' }}>{f}</span>
                <span style={{ fontSize: '10px', color: '#D4A882' }}>×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 필터 패널 */}
      {showFilterPanel && (
        <div
          className="absolute inset-0 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="가게 필터"
          style={{ zIndex: 30, backgroundColor: 'rgba(24,14,8,0.58)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowFilterPanel(false); }}
        >
          <div
            className="rounded-t-[22px] px-[20px] pt-[14px] pb-[28px] overflow-y-auto"
            style={{ backgroundColor: theme.pageBg, maxHeight: '88%' }}
          >
            <div className="w-[36px] h-[4px] rounded-full mx-auto mb-[16px]" style={{ backgroundColor: theme.border }} />

            <div className="flex items-center gap-[8px] mb-[16px]">
              <button onClick={() => setShowFilterPanel(false)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M13 4l-6 6 6 6" stroke={theme.accentSoft} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <div
                className="flex-1 h-[38px] rounded-[10px] flex items-center gap-[8px] px-[12px]"
                style={{ backgroundColor: theme.chipBg, border: `1px solid ${theme.border}` }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5" stroke={theme.mutedColor} strokeWidth="1.8" />
                  <path d="M11 11l3 3" stroke={theme.mutedColor} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="가게 이름 검색"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '13px', color: theme.titleColor }}
                />
              </div>
            </div>

            {searchText.trim() ? (
              <div className="flex flex-col gap-[6px] mb-[4px] max-h-[180px] overflow-y-auto">
                {localShops.filter((s) => s.name.includes(searchText)).map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => { setSelectedShop(shop); setShowFilterPanel(false); setSearchText(''); }}
                    className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[10px] active:scale-[0.98] transition-transform text-left"
                    style={{ backgroundColor: theme.chipBg }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20">
                      <path d="M10 2a5.5 5.5 0 015.5 5.5c0 4-5.5 10-5.5 10S4.5 11.5 4.5 7.5A5.5 5.5 0 0110 2z" stroke={theme.accentSoft} strokeWidth="1.8" fill="none" />
                    </svg>
                    <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '13px', color: theme.titleColor }}>{shop.name}</span>
                    <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', color: theme.mutedColor, marginLeft: 'auto' }}>{shop.broth.join('·')}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {activeFilters.length > 0 && (
                  <div
                    className="rounded-[10px] px-[12px] py-[8px] mb-[12px] flex items-center justify-between"
                    style={{ backgroundColor: theme.chipBg }}
                  >
                    <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', color: theme.subColor }}>
                      조건 {activeFilters.length}개 선택됨
                    </span>
                    <button onClick={() => setActiveFilters([])} style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', color: theme.mutedColor }}>
                      초기화
                    </button>
                  </div>
                )}

                <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: theme.subColor, marginBottom: '8px' }}>
                  육수 스타일
                </div>
                <div className="flex gap-[6px] flex-wrap mb-[12px]">
                  {BROTH_FILTERS.map((f) => (
                    <MapFilterButton key={f} active={activeFilters.includes(`${f} 육수`)} onClick={() => toggleFilter(`${f} 육수`)}>
                      {f} 육수
                    </MapFilterButton>
                  ))}
                </div>

                <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: theme.subColor, marginBottom: '8px' }}>
                  면 굵기
                </div>
                <div className="flex gap-[6px] flex-wrap mb-[12px]">
                  {NOODLE_FILTERS.map((f) => (
                    <MapFilterButton key={f} active={activeFilters.includes(f)} onClick={() => toggleFilter(f)}>
                      {f}
                    </MapFilterButton>
                  ))}
                </div>

                <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: theme.subColor, marginBottom: '8px' }}>
                  국물 농도와 면 식감
                </div>
                <div className="flex gap-[6px] flex-wrap mb-[12px]">
                  {RICHNESS_FILTERS.map((f) => (
                    <MapFilterButton key={`richness-${f}`} active={activeFilters.includes(`${f} 국물`)} onClick={() => toggleFilter(`${f} 국물`)}>
                      {f} 국물
                    </MapFilterButton>
                  ))}
                  {TEXTURE_FILTERS.map((f) => (
                    <MapFilterButton key={`texture-${f}`} active={activeFilters.includes(`${f} 식감`)} onClick={() => toggleFilter(`${f} 식감`)}>
                      {f} 식감
                    </MapFilterButton>
                  ))}
                </div>

                <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: theme.subColor, marginBottom: '8px' }}>
                  맵기
                </div>
                <div className="flex gap-[6px] flex-wrap mb-[12px]">
                  {SPICE_FILTERS.map((f) => (
                    <MapFilterButton key={f} active={activeFilters.includes(`맵기 ${f}`)} onClick={() => toggleFilter(`맵기 ${f}`)}>
                      {f}
                    </MapFilterButton>
                  ))}
                </div>

                <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 700, color: theme.subColor, marginBottom: '8px' }}>
                  추가 조건
                </div>
                <div className="flex gap-[6px] flex-wrap">
                  {EXTRA_FILTERS.map((f) => (
                    <MapFilterButton key={f} active={activeFilters.includes(f)} onClick={() => toggleFilter(f)}>
                      {f}
                    </MapFilterButton>
                  ))}
                </div>
              </>
            )}

            <AppButton
              onClick={() => setShowFilterPanel(false)}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-[18px]"
            >
              {activeFilters.length > 0 ? `조건 ${activeFilters.length}개 적용` : '조건 적용'}
            </AppButton>
          </div>
        </div>
      )}

      {/* 가게 미리보기 카드 */}
      {selectedShop && !showFilterPanel && (
        <div
          className="absolute left-0 right-0 rounded-t-[20px] px-[16px] pt-[14px] pb-[20px]"
          style={{
            bottom: 0,
            backgroundColor: theme.pageBg,
            borderTop: `1px solid ${theme.border}`,
            boxShadow: '0 -8px 28px rgba(0,0,0,0.16)',
            zIndex: 20,
          }}
        >
          <div className="w-[36px] h-[4px] rounded-full mx-auto mb-[12px]" style={{ backgroundColor: theme.border }} />

          <div
            className="flex gap-[12px] rounded-[14px] p-[12px] mb-[12px]"
            style={{ backgroundColor: theme.cardBg, border: `1.5px solid ${theme.accent}` }}
          >
            <div className="w-[62px] h-[62px] rounded-[10px] overflow-hidden flex-shrink-0">
              <img src={selectedShop.imageUrl} alt={selectedShop.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-[3px] flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '15px', fontWeight: 900, color: theme.titleColor }}>
                  {selectedShop.name}
                </span>
                <span
                  className="px-[6px] py-[1px] rounded-full"
                  style={{ backgroundColor: theme.accent + '22', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '9px', fontWeight: 700, color: theme.accent }}
                >
                  로컬
                </span>
              </div>
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', color: theme.subColor }}>
                {selectedShop.noodleThickness} · {selectedShop.noodleShape} · {selectedShop.description}
              </span>
              <div className="flex gap-[4px] mt-[3px] flex-wrap">
                {preference.broth.length > 0 && selectedShop.broth.some((b) => preference.broth.includes(b)) && (
                  <span className="px-[6px] py-[2px] rounded-full" style={{ backgroundColor: theme.accent, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '9px', fontWeight: 700, color: '#FFFBF5' }}>
                    취향 일치
                  </span>
                )}
                {!selectedShop.waiting && (
                  <span className="px-[6px] py-[2px] rounded-full" style={{ backgroundColor: theme.chipBg, border: `1px solid ${theme.border}`, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '9px', color: theme.subColor }}>
                    웨이팅 없음
                  </span>
                )}
                <span className="px-[6px] py-[2px] rounded-full" style={{ backgroundColor: theme.chipBg, border: `1px solid ${theme.border}`, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '9px', color: theme.subColor }}>
                  {selectedShop.distance}
                </span>
              </div>
            </div>
          </div>

          <AppButton
            onClick={() => navigate(`/shop/${selectedShop.id}`)}
            variant="cta"
            size="lg"
            fullWidth
          >
            가게 상세보기
          </AppButton>
        </div>
      )}

      {/* 필터 결과 토스트 */}
      {activeFilters.length > 0 && !showFilterPanel && !selectedShop && (
        <div
          className="absolute left-[16px] right-[16px] h-[42px] rounded-[12px] flex items-center justify-center"
          style={{ bottom: '16px', backgroundColor: '#2C1A0E', zIndex: 15 }}
        >
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', fontWeight: 700, color: '#FFFBF5' }}>
            조건에 맞는 로컬 가게만 표시했어요 ({filteredShops.length}곳)
          </span>
        </div>
      )}
    </div>
  );
}
