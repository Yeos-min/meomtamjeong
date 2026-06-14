import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { mockShops } from '../types';
import { AppButton } from '../components/AppButton';

const FILTERS = ['전체', '웨이팅 없음', '자가제면', '돈코츠', '쇼유'] as const;
type ShopFilter = typeof FILTERS[number];

export default function ShopsPage() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('전체');

  const localShops = useMemo(() => mockShops.filter((shop) => shop.isLocal), []);
  const filteredShops = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return localShops.filter((shop) => {
      const matchesFilter =
        activeFilter === '전체'
          ? true
          : activeFilter === '웨이팅 없음'
            ? !shop.waiting
            : activeFilter === '자가제면'
              ? shop.selfMadeNoodles
              : activeFilter === '돈코츠'
                ? shop.broth.includes('돼지')
                : shop.broth.includes('쇼유');

      if (!matchesFilter) return false;
      if (!keyword) return true;

      const haystack = [
        shop.name,
        shop.description,
        shop.broth.join(' '),
        shop.noodleThickness,
        shop.texture,
        shop.richness,
        shop.tags.join(' '),
        shop.signature,
      ].join(' ').toLowerCase();

      return haystack.includes(keyword);
    });
  }, [activeFilter, localShops, query]);

  return (
    <div className="w-full pb-[28px] transition-colors duration-500" style={{ backgroundColor: theme.pageBg }}>
      <section className="px-[20px] pt-[18px]">
        <div className="flex items-end justify-between gap-[12px]">
          <div>
            <h1
              className="tracking-[-1px]"
              style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '25px', lineHeight: 1.18, fontWeight: 900, color: theme.titleColor }}
            >
              울산 삼산<br />로컬 라멘 가게
            </h1>
          </div>
          <div
            className="px-[10px] py-[8px] rounded-[12px] text-center"
            style={{ backgroundColor: theme.deepBg, border: `1px solid ${theme.border}` }}
          >
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '18px', fontWeight: 900, color: theme.titleColor }}>
              {filteredShops.length}
            </div>
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', color: theme.mutedColor }}>
              표시 중
            </div>
          </div>
        </div>

        <label
          className="mt-[16px] h-[46px] rounded-[14px] flex items-center gap-[10px] px-[14px]"
          style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: `0 8px 22px ${theme.shadow}` }}
        >
          <svg width="17" height="17" fill="none" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke={theme.accent} strokeWidth="1.8" />
            <path d="M12.2 12.2L16 16" stroke={theme.accent} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="가게명, 육수, 태그로 찾아보기"
            className="flex-1 bg-transparent outline-none"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '13px', color: theme.titleColor }}
          />
        </label>

        <div className="flex gap-[8px] overflow-x-auto mt-[12px] pb-[2px]" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <AppButton
                key={filter}
                onClick={() => setActiveFilter(filter)}
                variant="secondary"
                size="sm"
                selected={active}
                className="shrink-0"
              >
                {filter}
              </AppButton>
            );
          })}
        </div>
      </section>

      <section className="px-[20px] mt-[16px]">
        <div
          className="rounded-[18px] p-[14px]"
          style={{ backgroundColor: theme.deepBg, border: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center justify-between">
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '14px', fontWeight: 900, color: theme.titleColor }}>
              체인 제외 로컬 중심
            </div>
            <AppButton
              onClick={() => navigate('/map')}
              variant="text"
              size="sm"
            >
              지도에서 보기
            </AppButton>
          </div>
          <p className="mt-[6px] leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', color: theme.subColor }}>
            면탐정은 프랜차이즈보다 단독 운영 가게와 취향 정보가 뚜렷한 라멘집을 먼저 보여줘요.
          </p>
        </div>
      </section>

      <section className="px-[20px] mt-[14px] flex flex-col gap-[10px]">
        {filteredShops.map((shop) => (
          <button
            key={shop.id}
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="w-full rounded-[18px] p-[12px] text-left active:scale-[0.985] transition-transform"
            style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: `0 8px 22px ${theme.shadow}` }}
          >
            <div className="flex gap-[12px]">
              <div className="w-[92px] h-[92px] rounded-[14px] overflow-hidden shrink-0" style={{ backgroundColor: theme.chipBg }}>
                <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-[8px]">
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '17px', fontWeight: 900, color: theme.titleColor }}>
                      {shop.name}
                    </div>
                    <div className="mt-[4px]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', color: theme.subColor }}>
                      평점 {shop.rating.toFixed(1)} · {shop.distance}
                    </div>
                  </div>
                  {shop.mustTry && (
                    <span
                      className="px-[7px] py-[4px] rounded-full shrink-0"
                      style={{ backgroundColor: theme.accent + '16', color: theme.accent, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', fontWeight: 800 }}
                    >
                      추천
                    </span>
                  )}
                </div>

                <div className="mt-[8px] line-clamp-2" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', lineHeight: 1.45, color: theme.subColor }}>
                  {shop.description}
                </div>

                <div className="flex gap-[5px] flex-wrap mt-[9px]">
                  {shop.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-[7px] py-[3px] rounded-full"
                      style={{ backgroundColor: theme.chipBg, color: theme.mutedColor, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', fontWeight: 700 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[6px] mt-[11px]">
              {[
                ['대기', shop.waiting ? shop.waitingTime ?? shop.averageWaitTime : '없음'],
                ['면', shop.selfMadeNoodles ? '자가제면' : shop.noodleThickness],
                ['국물', shop.richness],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[10px] px-[8px] py-[7px]"
                  style={{ backgroundColor: theme.cardBg2, border: `1px solid ${theme.border}` }}
                >
                  <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', color: theme.mutedColor }}>
                    {label}
                  </div>
                  <div className="mt-[2px] truncate" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 800, color: theme.titleColor }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </button>
        ))}

        {filteredShops.length === 0 && (
          <div
            className="rounded-[18px] px-[18px] py-[26px] text-center"
            style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
          >
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '15px', fontWeight: 900, color: theme.titleColor }}>
              조건에 맞는 가게가 없어요
            </div>
            <AppButton
              onClick={() => {
                setQuery('');
                setActiveFilter('전체');
              }}
              variant="primary"
              size="sm"
              className="mt-[12px]"
            >
              전체 목록 보기
            </AppButton>
          </div>
        )}
      </section>
    </div>
  );
}
