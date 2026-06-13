import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '../AppContext';
import { mockShops } from '../types';
import { CloseIcon, NavIconButton } from '../components/NavIconButton';
import { AppButton } from '../components/AppButton';

const TEXTURE_OPTIONS = ['부드러움', '탄력 있음', '단단함'];
const RICHNESS_LEVELS = ['맑음', '보통', '진함'];
const TASTE_MATCH = ['낮음', '보통', '높음'];

export default function NotebookEntryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, addNotebookEntry } = useApp();

  const shopId = searchParams.get('shopId') || '';
  const shopNameParam = searchParams.get('shopName') || '';

  const shopData = shopId ? mockShops.find((s) => s.id === shopId) : null;
  const shopName = shopNameParam || shopData?.name || '';

  const { pageBg, chipBg, accent, accentSoft, subColor, mutedColor, labelColor, border, titleColor } = theme;

  const [menu, setMenu] = useState('');
  const [texture, setTexture] = useState<string | null>(null);
  const [richnessIdx, setRichnessIdx] = useState<number | null>(null);
  const [tasteMatch, setTasteMatch] = useState<string | null>(null);
  const [impression, setImpression] = useState('');
  const [saved, setSaved] = useState(false);

  const completedCount = [
    menu.trim(),
    texture,
    richnessIdx !== null ? RICHNESS_LEVELS[richnessIdx] : '',
    tasteMatch,
    impression.trim(),
  ].filter(Boolean).length;
  const canSave = completedCount === 5;

  const handleSave = () => {
    if (!canSave) return;
    addNotebookEntry({
      shopId: shopId || undefined,
      shopName,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      menu,
      memo: impression.trim(),
      texture: texture || undefined,
      richness: richnessIdx !== null ? RICHNESS_LEVELS[richnessIdx] : undefined,
      tasteMatch: tasteMatch || undefined,
      impression: impression.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      navigate('/notebook', { replace: true });
    }, 1200);
  };

  return (
    <div
      className="w-full min-h-full flex flex-col pb-[32px]"
      style={{ backgroundColor: pageBg }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-[20px] py-[16px] sticky top-0 z-10"
        style={{ backgroundColor: pageBg }}
      >
        <NavIconButton onClick={() => navigate(-1)} ariaLabel="탐정수첩 기록 닫기" size="sm">
          <CloseIcon />
        </NavIconButton>
        <span
          style={{
            fontFamily: "'WenQuanYi Zen Hei', sans-serif",
            fontSize: '15px',
            fontWeight: 900,
            color: titleColor,
          }}
        >
          탐정수첩 기록
        </span>
        <div className="size-[44px]" aria-hidden="true" />
      </div>

      {/* 가게명 표시 */}
      {shopName && (
        <div
          className="mx-[20px] mb-[4px] px-[14px] py-[10px] rounded-[10px] flex items-center gap-[8px]"
          style={{ backgroundColor: accent + '15', border: `1px solid ${accent}33` }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 20 20">
            <path d="M10 2a5.5 5.5 0 015.5 5.5c0 4-5.5 10-5.5 10S4.5 11.5 4.5 7.5A5.5 5.5 0 0110 2z" fill={accent} />
          </svg>
          <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', fontWeight: 700, color: accent }}>
            {shopName}
          </span>
        </div>
      )}

      {/* 폼 영역 */}
      <div className="flex flex-col gap-[20px] px-[20px] pt-[12px]">
        <div className="rounded-[10px] px-[12px] py-[10px] flex items-center justify-between" style={{ backgroundColor: chipBg }}>
          <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: subColor }}>
            모든 항목을 작성하면 기록을 저장할 수 있어요
          </span>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '12px', fontWeight: 700, color: canSave ? accent : mutedColor }}>
            {completedCount}/5
          </span>
        </div>

        {/* 먹은 메뉴 */}
        <div>
          <label style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: subColor, display: 'block', marginBottom: '8px' }}>
            먹은 메뉴 <span style={{ color: accent }}>*</span>
          </label>
          {shopData && shopData.menus.length > 0 && (
            <div className="flex gap-[6px] flex-wrap mb-[8px]">
              {shopData.menus.slice(0, 4).map((m) => (
                <AppButton
                  key={m.id}
                  onClick={() => setMenu(m.name)}
                  variant="secondary"
                  size="sm"
                  selected={menu === m.name}
                >
                  {m.name}
                </AppButton>
              ))}
            </div>
          )}
          <input
            type="text"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            placeholder="직접 입력..."
            className="w-full rounded-[10px] px-[14px] py-[11px] outline-none"
            style={{
              fontFamily: "'WenQuanYi Zen Hei', sans-serif",
              fontSize: '14px',
              color: titleColor,
              backgroundColor: chipBg,
              border: `1px solid ${menu.trim() ? accent + '66' : border}`,
            }}
          />
        </div>

        {/* 면 식감 */}
        <div>
          <label style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: subColor, display: 'block', marginBottom: '8px' }}>
            면 식감 <span style={{ color: accent }}>*</span>
          </label>
          <div className="grid grid-cols-3 gap-[8px]">
            {TEXTURE_OPTIONS.map((opt) => (
              <AppButton
                key={opt}
                onClick={() => setTexture((prev) => (prev === opt ? null : opt))}
                variant="secondary"
                size="md"
                selected={texture === opt}
                fullWidth
              >
                {opt}
              </AppButton>
            ))}
          </div>
        </div>

        {/* 국물 농도 */}
        <div>
          <label style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: subColor, display: 'block', marginBottom: '8px' }}>
            국물 농도 <span style={{ color: accent }}>*</span>
          </label>
          <div className="flex items-center gap-[0px]">
            {RICHNESS_LEVELS.map((level, i) => (
              <AppButton
                key={level}
                onClick={() => setRichnessIdx(i)}
                variant="secondary"
                size="md"
                selected={richnessIdx === i}
                className="flex-1"
                style={{
                  borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                  marginLeft: i > 0 ? '-1px' : '0',
                }}
              >
                {level}
              </AppButton>
            ))}
          </div>
        </div>

        {/* 예상 취향과의 일치 */}
        <div>
          <label style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: subColor, display: 'block', marginBottom: '8px' }}>
            예상 취향과의 일치 <span style={{ color: accent }}>*</span>
          </label>
          <div className="grid grid-cols-3 gap-[8px]">
            {TASTE_MATCH.map((opt) => (
              <AppButton
                key={opt}
                onClick={() => setTasteMatch((prev) => (prev === opt ? null : opt))}
                variant="secondary"
                size="md"
                selected={tasteMatch === opt}
                fullWidth
              >
                {opt}
              </AppButton>
            ))}
          </div>
        </div>

        {/* 짧은 인상 */}
        <div>
          <label style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: subColor, display: 'block', marginBottom: '8px' }}>
            짧은 인상 <span style={{ color: accent }}>*</span>
          </label>
          <textarea
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="맛, 분위기, 재방문 여부 등 자유롭게 남겨보세요"
            rows={4}
            className="w-full rounded-[12px] px-[14px] py-[12px] outline-none resize-none"
            style={{
              fontFamily: "'WenQuanYi Zen Hei', sans-serif",
              fontSize: '13px',
              lineHeight: 1.6,
              color: titleColor,
              backgroundColor: chipBg,
              border: `1px solid ${impression.trim() ? accent + '66' : border}`,
            }}
          />
        </div>

        {/* 저장 버튼 */}
        <AppButton
          onClick={handleSave}
          disabled={!canSave}
          variant="cta"
          size="lg"
          fullWidth
          selected={saved}
        >
          {saved ? '저장됨 ✓' : '기록 저장'}
        </AppButton>
      </div>

      {/* 저장 완료 토스트 */}
      {saved && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-[24px] px-[20px] h-[44px] rounded-[12px] flex items-center justify-center"
          style={{ backgroundColor: '#2C1A0E', zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
        >
          <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', fontWeight: 700, color: '#FFFBF5' }}>
            탐정수첩에 기록이 저장되었어요
          </span>
        </div>
      )}
    </div>
  );
}
