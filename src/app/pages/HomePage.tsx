import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { mockShops } from '../types';
import { AppButton } from '../components/AppButton';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, preference } = useApp();
  const {
    pageBg, cardBg, chipBg, deepBg, accent, accentSoft,
    titleColor, subColor, mutedColor, labelColor, border, shadow, accentGlow,
  } = theme;

  const hasPreference = preference.broth.length > 0 || preference.noodleThickness || preference.texture || preference.richness || preference.spiceLevel;
  const localShops = mockShops.filter((shop) => shop.isLocal);
  const featuredShops = localShops.slice(0, 3);
  const preferenceSummary = [
    preference.broth.length > 0 ? preference.broth.join('·') : null,
    preference.noodleThickness,
    preference.texture,
    preference.richness,
  ].filter(Boolean).join(' · ');

  return (
    <div className="w-full pb-[28px] transition-colors duration-500" style={{ backgroundColor: pageBg }}>
      <section className="px-[20px] pt-[20px]">
        <button
          onClick={() => navigate('/shops')}
          className="w-full h-[46px] rounded-[14px] flex items-center gap-[10px] px-[14px] mb-[14px] text-left active:scale-[0.98] transition-transform"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}`, boxShadow: `0 8px 22px ${shadow}` }}
          aria-label="가게 또는 지역 검색하기"
        >
          <svg width="17" height="17" fill="none" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke={accent} strokeWidth="1.8" />
            <path d="M12.2 12.2L16 16" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', color: mutedColor }}>
            가게 또는 지역을 검색하세요
          </span>
        </button>

        <div
          className="rounded-[24px] px-[20px] pt-[24px] pb-[20px] overflow-hidden relative"
          style={{ backgroundColor: deepBg, border: `1px solid ${border}`, boxShadow: `0 14px 34px ${shadow}` }}
        >
          <div className="absolute right-[-42px] top-[-34px] size-[150px] rounded-full" style={{ backgroundColor: accent + '18' }} />
          <div className="absolute right-[18px] bottom-[-38px] size-[110px] rounded-full" style={{ backgroundColor: accentSoft + '18' }} />

          <div className="relative">
            <h1
              className="tracking-[-1.4px]"
              style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '28px', lineHeight: 1.18, fontWeight: 900, color: titleColor }}
            >
              취향으로 찾는<br />울산 로컬 라멘
            </h1>
            <p className="mt-[10px] leading-relaxed" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', color: subColor }}>
              체인점보다 내 취향에 맞는 단독 운영 라멘집을 먼저 보여드려요.
            </p>

            <div className="flex flex-col gap-[10px] mt-[20px]">
              <AppButton
                onClick={() => navigate('/preference')}
                variant="cta"
                size="lg"
                fullWidth
              >
                취향에 맞게 찾기
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </AppButton>
              <AppButton
                onClick={() => navigate('/map')}
                variant="primary"
                size="md"
                fullWidth
              >
                지도에서 바로 보기
              </AppButton>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[20px] mt-[16px]">
        <div className="grid grid-cols-3 gap-[8px]">
          {[
            { label: '로컬 가게', value: localShops.length },
            { label: '취향 필터', value: 5 },
            { label: '체인 제외', value: '제외' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[14px] py-[12px] text-center" style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '21px', fontWeight: 900, color: titleColor }}>
                {stat.value}
              </div>
              <div className="mt-[2px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: mutedColor }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-[20px] mt-[22px]">
        <div className="flex items-center justify-between mb-[10px]">
          <h2 style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '17px', fontWeight: 900, color: titleColor }}>
            로컬 라멘 미리보기
          </h2>
          <button onClick={() => navigate('/shops')} style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: accent, fontWeight: 700 }}>
            전체 보기
          </button>
        </div>
        <div className="flex flex-col gap-[10px]">
          {featuredShops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="w-full rounded-[14px] p-[10px] flex gap-[12px] text-left active:scale-[0.98] transition-transform"
              style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
            >
              <div className="w-[64px] h-[64px] rounded-[11px] overflow-hidden shrink-0" style={{ backgroundColor: chipBg }}>
                <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-[8px]">
                  <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '15px', fontWeight: 900, color: titleColor }}>
                    {shop.name}
                  </span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: accent, fontWeight: 800 }}>
                    {shop.distance}
                  </span>
                </div>
                <div className="mt-[3px] truncate" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: subColor }}>
                  {shop.description}
                </div>
                <div className="flex gap-[4px] flex-wrap mt-[7px]">
                  {shop.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-[7px] py-[2px] rounded-full" style={{ backgroundColor: chipBg, fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '10px', color: mutedColor }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-[20px] mt-[22px]">
        <div className="rounded-[16px] p-[16px]" style={{ backgroundColor: hasPreference ? accent + '12' : chipBg, border: `1px solid ${hasPreference ? accent + '44' : border}` }}>
          <div style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', fontWeight: 900, color: titleColor }}>
            {hasPreference ? '현재 저장된 취향' : '아직 취향을 설정하지 않았어요'}
          </div>
          <div className="mt-[6px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: hasPreference ? subColor : mutedColor }}>
            {hasPreference ? preferenceSummary : '설문을 완료하면 지도에서 취향 필터가 자동으로 적용됩니다.'}
          </div>
        </div>
      </section>
    </div>
  );
}
