import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { NavIconButton } from '../components/NavIconButton';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { getRecommendedShops, theme } = useApp();
  const shops = getRecommendedShops();

  const { pageBg, cardBg, chipBg, accent, accentSoft, titleColor, subColor, mutedColor, labelColor, border } = theme;

  return (
    <div className="w-full pb-[32px] transition-colors duration-500" style={{ backgroundColor: pageBg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-[20px] py-[14px] flex items-center gap-[14px] transition-colors duration-500"
        style={{ backgroundColor: pageBg }}
      >
        <NavIconButton onClick={() => navigate(-1)} ariaLabel="이전 화면으로 돌아가기" size="sm">
          <svg className="size-[16px]" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavIconButton>
        <span
          className="text-[20px] tracking-[-1px]"
          style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accent }}
        >
          면탐정
        </span>
        <span
          className="text-[13px] opacity-60"
          style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
        >
          탐색 결과
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full px-[20px] pt-[8px] flex flex-col gap-[24px]">
        {/* Title Section */}
        <div className="flex flex-col gap-[4px]">
          <div
            className="text-[28px] tracking-[-1.4px]"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              lineHeight: '1.2',
              color: titleColor,
            }}
          >
            <p className="mb-0">당신을 위한</p>
            <p>탐색 결과</p>
          </div>
          <div
            className="text-[13px] leading-relaxed"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
          >
            취향 분석 기반으로 엄선한 울산의 숨은 라멘집입니다
          </div>
        </div>

        {/* Shop Cards */}
        <div
          className="flex flex-col rounded-[14px] overflow-hidden"
          style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
        >
          {shops.map((shop, idx) => (
            <button
              key={shop.id}
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="w-full text-left active:opacity-70 transition-opacity"
            >
              {/* Card Row */}
              <div className="flex items-start gap-[14px] px-[16px] py-[14px]">
                {/* Left: Image */}
                <div className="relative shrink-0">
                  <div
                    className="rounded-[10px] overflow-hidden"
                    style={{ width: 80, height: 80 }}
                  >
                    <img
                      alt={shop.name}
                      className="w-full h-full object-cover"
                      src={shop.imageUrl}
                    />
                  </div>
                  {/* Rank badge */}
                  <div
                    className="absolute top-[-6px] left-[-6px] size-[20px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accent }}
                  >
                    <span
                      className="text-[10px]"
                      style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: labelColor }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-[5px]">
                  {/* Name + rating */}
                  <div className="flex items-center justify-between gap-[8px]">
                    <span
                      className="text-[16px] tracking-[-0.4px] truncate"
                      style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: titleColor }}
                    >
                      {shop.name}
                    </span>
                    <div className="flex items-center gap-[3px] shrink-0">
                      <svg className="size-[10px]" fill={accent} viewBox="0 0 12 12">
                        <path d="M6 1l1.545 3.13L11 4.635 8.5 7.075l.59 3.425L6 8.885l-3.09 1.615.59-3.425L1 4.635l3.455-.505L6 1z" />
                      </svg>
                      <span
                        className="text-[12px]"
                        style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: titleColor }}
                      >
                        {shop.rating}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    className="text-[12px] leading-snug line-clamp-1"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
                  >
                    {shop.description}
                  </div>

                  {/* Broth + Spice badges */}
                  <div className="flex gap-[5px] flex-wrap mt-[2px]">
                    <span
                      className="px-[7px] py-[2px] rounded-[4px] text-[10px]"
                      style={{ backgroundColor: chipBg, color: subColor, fontFamily: "'Noto Sans KR', sans-serif" }}
                    >
                      {shop.broth.join('·')} 육수
                    </span>
                    {shop.spiceLevel !== '없음' && (
                      <span
                        className="px-[7px] py-[2px] rounded-[4px] text-[10px]"
                        style={{ backgroundColor: chipBg, color: subColor, fontFamily: "'Noto Sans KR', sans-serif" }}
                      >
                        🌶 {shop.spiceLevel}
                      </span>
                    )}
                    <span
                      className="px-[7px] py-[2px] rounded-[4px] text-[10px]"
                      style={{ backgroundColor: chipBg, color: subColor, fontFamily: "'Noto Sans KR', sans-serif" }}
                    >
                      {shop.richness}
                    </span>
                  </div>

                  {/* Signature text */}
                  {shop.signatureTags.length > 0 && (
                    <div className="flex items-center gap-[4px] flex-wrap mt-[1px]">
                      <svg className="size-[9px] shrink-0" fill={accent} viewBox="0 0 10 10">
                        <path d="M5 0.5l1.1 2.8 3 .3-2.2 2 .7 3-2.6-1.5L2.4 8.6l.7-3L.9 3.6l3-.3L5 .5z" />
                      </svg>
                      <span
                        className="text-[11px] leading-snug"
                        style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accent }}
                      >
                        {shop.signatureTags.join(' · ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <div className="self-center shrink-0">
                  <svg className="size-[14px]" fill="none" viewBox="0 0 16 16">
                    <path d="M6 12l4-4-4-4" stroke={mutedColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Divider (not on last item) */}
              {idx < shops.length - 1 && (
                <div className="mx-[16px]" style={{ height: 1, backgroundColor: border }} />
              )}
            </button>
          ))}
        </div>

        {/* Map Button */}
        <button
          onClick={() => navigate('/map')}
          className="rounded-[12px] py-[16px] flex gap-[10px] items-center justify-center transition-colors"
          style={{ backgroundColor: chipBg, border: `1px solid ${border}` }}
        >
          <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke={accentSoft} strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="8" r="2" stroke={accentSoft} strokeWidth="2" />
          </svg>
          <span
            className="text-[14px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accentSoft }}
          >
            지도에서 더 찾아보기
          </span>
        </button>
      </div>
    </div>
  );
}
