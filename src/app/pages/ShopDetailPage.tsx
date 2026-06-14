import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockShops, SignatureTag, getMenuMatch, totalSelectedCount } from '../types';
import { useApp } from '../AppContext';
import { MatchedMenuCard } from '../components/MatchedMenuCard';
import { CloseIcon, NavIconButton } from '../components/NavIconButton';
import { AppButton } from '../components/AppButton';
import svgPaths from '../../imports/가게상세정보상세형/svg-g3qprezm69';

const SIGNATURE_ICONS: Record<SignatureTag, string> = {
  '수제면 제조': '🍜',
  '직접 우린 육수': '🫕',
  '기간 한정 메뉴': '⏰',
  '혼밥식 좌석': '🪑',
};

const SIGNATURE_DESC: Record<SignatureTag, string> = {
  '수제면 제조': '매일 직접 뽑는 면',
  '직접 우린 육수': '화학조미료 無',
  '기간 한정 메뉴': '시즌 스페셜',
  '혼밥식 좌석': '1인 카운터석',
};

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, preference, isShopSaved, getEntriesByShop, isLoggedIn, isFavorite, toggleFavorite } = useApp();
  const shop = mockShops.find((s) => s.id === id);

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { pageBg, cardBg, cardBg2, chipBg, accent, accentSoft, accentGlow, subColor, mutedColor, labelColor, border, deepBg } = theme;

  const savedStatus = shop ? isShopSaved(shop.id) : false;
  const favoriteStatus = shop ? isFavorite(shop.id) : false;
  const savedEntries = shop ? getEntriesByShop(shop.id) : [];

  const handleFavoriteToggle = () => {
    if (!shop) return;
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    toggleFavorite(shop.id);
  };

  const handleNotebookSave = () => {
    if (!shop) return;
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    navigate(`/notebook/entry?shopId=${shop.id}&shopName=${encodeURIComponent(shop.name)}`);
  };

  const handleLoginFromModal = (provider: 'kakao' | 'naver' | 'apple') => {
    setLoginModalOpen(false);
    if (provider === 'kakao') {
      navigate(`/auth/kakao?returnTo=/shop/${shop?.id}`);
    } else {
      navigate(`/login`);
    }
  };

  const selectedCount = totalSelectedCount(preference);
  const perfectMenus = selectedCount > 0
    ? shop?.menus.filter((m) => getMenuMatch(m, preference).score === selectedCount) ?? []
    : [];

  const handleDirections = () => {
    if (!shop) return;
    navigate(`/shop/${shop.id}/directions`);
  };


  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: pageBg }}>
        <div style={{ color: subColor }}>가게를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const metaItems = [
    { label: '평점', value: shop.rating.toFixed(1) },
    { label: '육수 종류', value: shop.broth.join('·') + ' 계열' },
    { label: '면 종류', value: `${shop.selfMadeNoodles ? '자가제면 ' : ''}${shop.noodleThickness} ${shop.noodleShape}` },
    { label: '면 식감', value: shop.texture },
    { label: '국물 농도', value: shop.richness },
    { label: '매운맛', value: shop.spiceLevel },
    { label: '현재 웨이팅', value: shop.waiting ? shop.waitingTime || '있음' : '없음' },
    { label: '평균 웨이팅', value: shop.averageWaitTime },
    { label: '운영 방식', value: shop.operatingNote },
  ];

  return (
    <div className="w-full transition-colors duration-500" style={{ backgroundColor: pageBg }}>
      <div className="sticky top-[14px] z-40 h-0 px-[16px] flex items-start justify-between pointer-events-none">
        <NavIconButton
          onClick={() => navigate(-1)}
          ariaLabel="가게 상세 닫기"
          className="pointer-events-auto"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <CloseIcon />
        </NavIconButton>

        <NavIconButton
          onClick={handleFavoriteToggle}
          ariaLabel={favoriteStatus ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          className="pointer-events-auto"
          selected={favoriteStatus}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <svg className="size-[21px]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            {favoriteStatus ? (
              <path
                d="M12 21C12 21 3 14.5 3 8.5a5 5 0 019-3 5 5 0 019 3C21 14.5 12 21 12 21z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ) : (
              <path
                d="M12 21C12 21 3 14.5 3 8.5a5 5 0 019-3 5 5 0 019 3C21 14.5 12 21 12 21z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </NavIconButton>
      </div>

      {/* Header Image */}
      <div className="w-full h-[220px] relative overflow-hidden">
        <img
          alt={shop.name}
          className="w-full h-[190%] object-cover absolute top-[-45%]"
          src={shop.imageUrl}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 40%, ${pageBg} 100%)`,
            opacity: 0.85,
          }}
        />

        {/* Broth badge */}
        <div
          className="absolute bottom-[16px] left-[16px] px-[10px] py-[4px] rounded-full z-10"
          style={{ backgroundColor: accent }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.5px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: labelColor }}
          >
            {shop.broth[0]} 육수
          </span>
        </div>

        {/* 수첩 저장 배지 */}
        {savedStatus && (
          <div
            className="absolute bottom-[16px] right-[16px] px-[10px] py-[4px] rounded-full z-10 flex items-center gap-[4px]"
            style={{ backgroundColor: accent + 'cc', backdropFilter: 'blur(6px)' }}
          >
            <svg className="size-[10px]" fill={labelColor} viewBox="0 0 20 20">
              <path d="M12 21C12 21 3 14.5 3 8.5a5 5 0 019-3 5 5 0 019 3C21 14.5 12 21 12 21z" />
            </svg>
            <span className="text-[10px]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: labelColor }}>
              수첩에 저장됨 ({savedEntries.length}회)
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className="px-[20px] pt-[24px] flex flex-col gap-[24px] pb-[40px] transition-colors duration-500"
        style={{ backgroundColor: cardBg2 }}
      >
        {/* Store Header */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-start gap-[14px]">
            <div className="flex flex-col gap-[8px] min-w-0 flex-1">
              <div className="flex gap-[10px] items-center flex-wrap">
                <span
                  className="text-[36px] tracking-[-1.2px]"
                  style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    lineHeight: 1.08,
                    fontWeight: 900,
                    color: theme.titleColor,
                  }}
                >
                  {shop.name}
                </span>
                {shop.waiting && (
                  <div
                    className="rounded-full px-[9px] py-[3px]"
                    style={{ border: `1px solid ${accent}` }}
                  >
                    <span
                      className="text-[10px] tracking-[0.5px]"
                      style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accent }}
                    >
                      웨이팅 있음
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="text-[14px] leading-relaxed"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
          >
            {shop.description}
          </div>
        </div>

        {/* Signature Tags */}
        {shop.signatureTags.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[8px] flex-wrap">
              {shop.signatureTags.map((tag) => (
                <div
                  key={tag}
                  className="flex flex-col items-center gap-[4px] px-[14px] py-[10px] rounded-[10px]"
                  style={{ backgroundColor: chipBg, border: `1px solid ${border}` }}
                >
                  <span className="text-[20px]">{SIGNATURE_ICONS[tag]}</span>
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600, color: accentSoft }}
                  >
                    {tag}
                  </span>
                  <span
                    className="text-[9px]"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif", color: mutedColor }}
                  >
                    {SIGNATURE_DESC[tag]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature Box */}
        <div
          className="rounded-[12px] p-[20px] flex flex-col gap-[8px]"
          style={{
            backgroundColor: deepBg,
            border: `1px solid ${accent}`,
            boxShadow: `0px 8px 24px 0px ${accentGlow}`,
          }}
        >
          <div
            className="text-[12px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accent }}
          >
            ✦ 이 가게만의 특이점
          </div>
          <div
            className="text-[15px] leading-relaxed"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              color: theme.titleColor,
            }}
          >
            {shop.signature}
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="flex flex-col gap-[0px]">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-[13px]"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
              >
                {item.label}
              </span>
              <span
                className="text-[14px]"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontWeight: 600,
                  color: theme.titleColor,
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* 메뉴 섹션 */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center justify-end">
            {selectedCount > 0 && (
              <span
                className="text-[11px]"
                style={{ fontFamily: "'Noto Sans KR', sans-serif", color: accentSoft }}
              >
                ✦ = 취향 일치
              </span>
            )}
          </div>

          {perfectMenus.length > 0 && (
            <div
              className="rounded-[10px] px-[14px] py-[10px] flex items-center gap-[8px]"
              style={{ backgroundColor: accent + '1a', border: `1.5px solid ${accent}` }}
            >
              <span className="text-[18px]">🎯</span>
              <div>
                <div
                  className="text-[12px]"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, color: accent }}
                >
                  선택한 취향과 딱 맞는 메뉴가 있어요!
                </div>
                <div
                  className="text-[11px] mt-[1px]"
                  style={{ fontFamily: "'Noto Sans KR', sans-serif", color: subColor }}
                >
                  {perfectMenus.map((m) => m.name).join(', ')}
                </div>
              </div>
            </div>
          )}

          <MatchedMenuCard
            menus={shop.menus}
            preference={preference}
            theme={theme}
            isRamen={true}
            mode="full"
          />
        </div>

        {/* Keyword Reviews */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[8px] flex-wrap">
            {shop.tags.map((tag) => (
              <div
                key={tag}
                className="rounded-[6px] px-[12px] py-[6px]"
                style={{
                  backgroundColor: '#e8f4e4',
                  border: `1px solid #b0d4a0`,
                }}
              >
                <span
                  className="text-[12px]"
                  style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    color: '#3a6a30',
                  }}
                >
                  [{tag}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 구조화된 탐정 리뷰 */}
        {shop.detectiveReviews.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-end">
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', color: accent }}>
                방문 인증 기록
              </span>
            </div>
            {shop.detectiveReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[12px] p-[14px] flex flex-col gap-[10px]"
                style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
              >
                <div className="grid grid-cols-2 gap-[8px]">
                  {[
                    { label: '면 식감', value: review.texture },
                    { label: '국물', value: review.broth },
                    { label: '분위기', value: review.atmosphere },
                    { label: '재방문', value: review.revisit },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[8px] p-[8px]" style={{ backgroundColor: chipBg }}>
                      <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', color: mutedColor }}>{item.label}</div>
                      <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', fontWeight: 600, color: theme.titleColor, marginTop: 3 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '12px', lineHeight: 1.6, color: subColor }}>
                  {review.note}
                </p>
                {review.verifiedVisit && (
                  <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '10px', color: accent }}>
                    탐정수첩 방문 인증 리뷰
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-[8px] pt-[4px]">
          {/* 탐정수첩에 저장 */}
          <AppButton
            onClick={handleNotebookSave}
            variant="secondary"
            size="lg"
            selected={savedStatus}
            fullWidth
            className="min-w-0"
          >
            <svg className="size-[16px]" fill="none" viewBox="0 0 18 20">
              <rect x="2" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
              <path d="M5 7h8M5 10.5h8M5 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] whitespace-nowrap">
              {savedStatus ? '저장됨 · 재방문' : '탐정수첩 저장'}
            </span>
          </AppButton>

          <AppButton
            onClick={handleDirections}
            variant="cta"
            size="lg"
            fullWidth
            className="min-w-0"
          >
            <div className="size-[18px]">
              <svg className="size-full" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p3be96a00} fill="currentColor" />
              </svg>
            </div>
            <span className="text-[13px]">길찾기</span>
          </AppButton>
        </div>
      </div>

      {/* 로그인 필요 모달 */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
          style={{ zIndex: 70, backgroundColor: 'rgba(24,14,8,0.62)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setLoginModalOpen(false); }}
        >
          <div
            className="w-full max-w-[390px] mx-auto rounded-t-[22px] px-[20px] pt-[14px] pb-[32px]"
            style={{ backgroundColor: pageBg, boxShadow: '0 -14px 44px rgba(30,16,8,0.22)' }}
          >
            <div className="w-[36px] h-[4px] rounded-full mx-auto mb-[16px]" style={{ backgroundColor: border }} />

            <div className="flex items-center justify-between mb-[16px]">
              <NavIconButton onClick={() => setLoginModalOpen(false)} ariaLabel="로그인 안내 닫기">
                <CloseIcon />
              </NavIconButton>
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '14px', fontWeight: 900, color: theme.titleColor }}>
                면탐정
              </span>
              <div className="size-[44px]" aria-hidden="true" />
            </div>

            <div id="login-required-title" className="text-center mb-[6px]">
              <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '18px', fontWeight: 900, color: theme.titleColor, lineHeight: 1.4 }}>
                기록을 저장하려면{'\n'}로그인이 필요해요
              </span>
            </div>
            <p className="text-center mb-[20px]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '13px', color: subColor }}>
              로그인하면 탐정수첩에 방문 기록을 남길 수 있어요.
            </p>

            <div className="flex flex-col gap-[8px]">
              <button
                onClick={() => handleLoginFromModal('kakao')}
                className="w-full h-[50px] rounded-[12px] flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform"
                style={{ backgroundColor: '#FEE500', boxShadow: '0 8px 18px rgba(90,65,0,0.14)' }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C5.58 2 2 4.91 2 8.5c0 2.28 1.44 4.27 3.6 5.44L4.7 17.3a.3.3 0 00.43.35l3.9-2.6c.32.04.64.06.97.06 4.42 0 8-2.91 8-6.51S14.42 2 10 2z" fill="#3A1D1D" />
                </svg>
                <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '14px', fontWeight: 700, color: '#3A1D1D' }}>카카오 로그인</span>
              </button>
              <span className="text-center py-[5px]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '11px', color: mutedColor }}>
                다른 방법으로 로그인
              </span>
              <AppButton
                onClick={() => handleLoginFromModal('naver')}
                variant="outline"
                size="lg"
                fullWidth
              >
                네이버 로그인
              </AppButton>
              <AppButton
                onClick={() => handleLoginFromModal('apple')}
                variant="outline"
                size="lg"
                fullWidth
              >
                Apple 로그인
              </AppButton>
              <AppButton
                onClick={() => setLoginModalOpen(false)}
                variant="secondary"
                size="md"
                fullWidth
              >
                닫기
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
