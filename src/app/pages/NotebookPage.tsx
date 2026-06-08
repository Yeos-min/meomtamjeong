import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router';
import { NotebookEntry, mockShops } from '../types';
import { CompareView } from '../components/CompareView';
import { AppButton } from '../components/AppButton';
import imgRamen from '../../imports/탐정수첩📓/10e8596bf94cb0e55bdf2cc012009e43255159ba.png';

interface ShopGroup {
  key: string;
  shopId?: string;
  shopName: string;
  imageUrl?: string;
  entries: NotebookEntry[];
}

function EntryCard({
  entry,
  onUpdate,
  onDelete,
  theme,
  isLatest,
}: {
  entry: NotebookEntry;
  onUpdate: (id: string, updates: Partial<Omit<NotebookEntry, 'id'>>) => void;
  onDelete: (id: string) => void;
  theme: any;
  isLatest: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editMenu, setEditMenu] = useState(entry.menu);
  const [editMemo, setEditMemo] = useState(entry.memo);
  const { chipBg, border, accent, accentSoft, subColor, mutedColor, labelColor } = theme;

  const handleSaveEdit = () => {
    onUpdate(entry.id, { menu: editMenu, memo: editMemo });
    setEditing(false);
  };

  return (
    <div
      className="rounded-[10px] p-[14px] flex flex-col gap-[8px]"
      style={{
        backgroundColor: isLatest ? accent + '0e' : chipBg,
        border: `1px solid ${isLatest ? accent + '44' : border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ fontFamily: "'Manrope', sans-serif", color: mutedColor }}>
          {entry.date}
          {isLatest && (
            <span className="ml-[6px] px-[5px] py-[1px] rounded-[3px] text-[9px]"
              style={{ backgroundColor: accent, color: labelColor, fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>
              최신
            </span>
          )}
        </span>
        <div className="flex gap-[6px]">
          <AppButton
            onClick={() => { setEditing(!editing); setEditMenu(entry.menu); setEditMemo(entry.memo); }}
            variant={editing ? 'soft' : 'secondary'}
            size="sm"
          >
            수정
          </AppButton>
          <AppButton
            onClick={() => onDelete(entry.id)}
            variant="secondary"
            size="sm"
          >
            삭제
          </AppButton>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col gap-[6px]">
          <input
            value={editMenu}
            onChange={(e) => setEditMenu(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none rounded-[6px] px-[8px] py-[6px]"
            style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: theme.titleColor, border: `1px solid ${border}` }}
          />
          <textarea
            value={editMemo}
            onChange={(e) => setEditMemo(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-[12px] outline-none resize-none rounded-[6px] px-[8px] py-[6px]"
            style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: subColor, border: `1px solid ${border}` }}
          />
          <div className="flex gap-[6px]">
            <AppButton onClick={handleSaveEdit} variant="primary" size="sm" className="flex-1">
              저장
            </AppButton>
            <AppButton onClick={() => setEditing(false)} variant="secondary" size="sm">
              취소
            </AppButton>
          </div>
        </div>
      ) : (
        <>
          <div className="text-[14px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: theme.titleColor, fontWeight: 600 }}>
            {entry.menu}
          </div>
          {entry.memo && (
            <div className="text-[12px] leading-relaxed" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: subColor }}>
              {entry.memo}
            </div>
          )}
          {(entry.texture || entry.richness || entry.tasteMatch) && (
            <div className="flex gap-[5px] flex-wrap mt-[3px]">
              {[entry.texture, entry.richness && `국물 ${entry.richness}`, entry.tasteMatch && `취향 ${entry.tasteMatch}`]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={item as string}
                    className="px-[7px] py-[2px] rounded-full text-[10px]"
                    style={{ backgroundColor: accent + '16', border: `1px solid ${accent}33`, color: accent, fontFamily: "'WenQuanYi Zen Hei', sans-serif" }}
                  >
                    {item}
                  </span>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function NotebookPage() {
  const { notebookEntries, addNotebookEntry, updateNotebookEntry, deleteNotebookEntry, theme, isLoggedIn, userName, logout, favoriteShopIds, preference } = useApp();
  const navigate = useNavigate();

  const [compareTarget, setCompareTarget] = useState<ShopGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'stats' | 'favorites'>('records');

  const { pageBg, cardBg, chipBg, deepBg, accent, accentSoft, subColor, mutedColor, labelColor, border } = theme;
  const titleColor = theme.titleColor;

  const shopGroups = useMemo<ShopGroup[]>(() => {
    const map = new Map<string, ShopGroup>();
    notebookEntries.forEach((entry) => {
      const key = entry.shopId ?? entry.shopName;
      if (!map.has(key)) {
        const shopData = entry.shopId ? mockShops.find((s) => s.id === entry.shopId) : undefined;
        map.set(key, { key, shopId: entry.shopId, shopName: entry.shopName, imageUrl: shopData?.imageUrl, entries: [] });
      }
      map.get(key)!.entries.push(entry);
    });
    map.forEach((g) => g.entries.sort((a, b) => b.date.localeCompare(a.date)));
    return Array.from(map.values()).sort((a, b) => b.entries[0].date.localeCompare(a.entries[0].date));
  }, [notebookEntries]);

  // 브로스 분포 계산
  const brothDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    notebookEntries.forEach((entry) => {
      const shop = entry.shopId ? mockShops.find((s) => s.id === entry.shopId) : null;
      if (shop) {
        shop.broth.forEach((b) => { counts[b] = (counts[b] || 0) + 1; });
      }
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));
  }, [notebookEntries]);

  const favoriteShops = mockShops.filter((s) => favoriteShopIds.includes(s.id));
  const structuredRecordCount = notebookEntries.filter((entry) => entry.texture && entry.richness && entry.tasteMatch).length;

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const toggleExpand = (key: string) =>
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const preferenceLabel = [
    preference.broth.length > 0 ? preference.broth.join('·') : null,
    preference.noodleThickness,
    preference.texture,
    preference.richness,
  ].filter(Boolean).join(' · ') || '취향 미설정';

  return (
    <div className="w-full pb-[32px] transition-colors duration-500" style={{ backgroundColor: pageBg }}>

      {/* 프로필 헤더 */}
      <div className="px-[20px] pt-[20px] pb-[16px]" style={{ backgroundColor: pageBg }}>
        <div className="flex items-center gap-[14px] pb-[16px]" style={{ borderBottom: `1px solid ${border}` }}>
          {/* 아바타 */}
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accent + '22', border: `2px solid ${accent}` }}
          >
            {isLoggedIn ? (
              <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '20px', fontWeight: 700, color: accent }}>
                {userName.charAt(0)}
              </span>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke={accent} strokeWidth="1.8" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-[2px]">
            <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '16px', fontWeight: 900, color: titleColor }}>
              {isLoggedIn ? userName : '비회원'}
            </span>
            <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: mutedColor }}>
              {preferenceLabel}
            </span>
          </div>
          {isLoggedIn ? (
            <AppButton
              onClick={() => { logout(); navigate('/login'); }}
              variant="secondary"
              size="sm"
              className="ml-auto"
            >
              로그아웃
            </AppButton>
          ) : (
            <AppButton
              onClick={() => navigate('/login')}
              variant="primary"
              size="sm"
              className="ml-auto"
            >
              로그인
            </AppButton>
          )}
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-3 gap-[8px] mt-[14px]">
          {[
            { label: '방문', value: shopGroups.length },
            { label: '저장', value: favoriteShopIds.length },
            { label: '기록', value: notebookEntries.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[12px] py-[10px] flex flex-col items-center gap-[2px]"
              style={{ backgroundColor: chipBg, border: `1px solid ${border}` }}
            >
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '22px', fontWeight: 900, color: titleColor }}>
                {stat.value}
              </span>
              <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: mutedColor }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex px-[20px] gap-[8px] mb-[16px]">
        {([['records', '기록'], ['stats', '분포'], ['favorites', '즐겨찾기']] as const).map(([key, label]) => (
          <AppButton
            key={key}
            onClick={() => setActiveTab(key)}
            variant="secondary"
            size="md"
            selected={activeTab === key}
            className="flex-1"
          >
            {label}
          </AppButton>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-[20px] flex flex-col gap-[12px]">

        {/* 기록 탭 */}
        {activeTab === 'records' && (
          <>
            {shopGroups.length === 0 ? (
              <div className="flex flex-col items-center gap-[16px] py-[60px] text-center">
                <div
                  className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: chipBg }}
                >
                  <svg width="30" height="30" fill="none" viewBox="0 0 18 20">
                    <rect x="2" y="2" width="14" height="16" rx="2" stroke={mutedColor} strokeWidth="1.5" fill="none" />
                    <path d="M5 7h8M5 10.5h5" stroke={mutedColor} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <div className="text-[17px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: titleColor }}>아직 기록이 없어요</div>
                  <div className="text-[13px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: mutedColor }}>가게 상세에서 수첩에 저장해보세요</div>
                </div>
                <AppButton
                  onClick={() => navigate('/')}
                  variant="primary"
                  size="md"
                >
                  라멘 탐색하러 가기
                </AppButton>
              </div>
            ) : (
              <>
                {shopGroups.map((group) => {
                  const isExpanded = expandedKeys.has(group.key);
                  const shopData = group.shopId ? mockShops.find((s) => s.id === group.shopId) : undefined;
                  const latestEntry = group.entries[0];
                  const hasMultiple = group.entries.length >= 2;

                  return (
                    <div key={group.key} className="rounded-[14px] overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}>
                      {/* 가게 헤더 */}
                      <div className="relative">
                        {group.imageUrl && (
                          <img src={group.imageUrl} alt={group.shopName} className="w-full object-cover" style={{ height: '72px', filter: 'brightness(0.4) saturate(0.6)' }} />
                        )}
                        <div className={`${group.imageUrl ? 'absolute inset-0' : ''} flex items-center justify-between px-[16px] py-[12px]`}>
                          <div className="flex items-center gap-[10px]">
                            <div className="size-[36px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accent + '30', border: `1.5px solid ${accent}` }}>
                              <svg className="size-[16px]" fill={accent} viewBox="0 0 18 20">
                                <rect x="2" y="2" width="14" height="16" rx="2" fill={accent + '40'} stroke={accent} strokeWidth="1.5" />
                                <path d="M5 7h8M5 10.5h8M5 14h5" stroke={accent} strokeWidth="1.3" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-[16px] tracking-[-0.3px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontWeight: 700, color: group.imageUrl ? '#fff' : titleColor }}>
                                {group.shopName}
                              </div>
                              <div className="text-[11px]" style={{ fontFamily: "'Manrope', sans-serif", color: group.imageUrl ? 'rgba(255,255,255,0.6)' : mutedColor }}>
                                총 {group.entries.length}번 방문 · 최근 {latestEntry.date}
                              </div>
                            </div>
                          </div>
                          {group.shopId && (
                            <AppButton
                              onClick={() => navigate(`/shop/${group.shopId}`)}
                              variant={group.imageUrl ? 'text' : 'secondary'}
                              size="sm"
                              style={group.imageUrl ? { color: '#fff', backgroundColor: 'rgba(255,255,255,0.15)' } : undefined}
                            >
                              상세 →
                            </AppButton>
                          )}
                        </div>
                      </div>

                      {/* 기록 카드들 */}
                      <div className="p-[14px] flex flex-col gap-[8px]">
                        <EntryCard entry={latestEntry} onUpdate={updateNotebookEntry} onDelete={deleteNotebookEntry} theme={theme} isLatest={true} />

                        {hasMultiple && (
                          <>
                            {isExpanded && group.entries.slice(1).map((entry) => (
                              <EntryCard key={entry.id} entry={entry} onUpdate={updateNotebookEntry} onDelete={deleteNotebookEntry} theme={theme} isLatest={false} />
                            ))}
                            <AppButton
                              onClick={() => toggleExpand(group.key)}
                              variant="secondary"
                              size="md"
                              fullWidth
                            >
                              <span className="text-[11px]">
                                {isExpanded ? '접기' : `이전 기록 ${group.entries.length - 1}건 보기`}
                              </span>
                              <svg className="size-[12px] transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} fill="none" viewBox="0 0 12 12">
                                <path d="M2 4l4 4 4-4" stroke={mutedColor} strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </AppButton>
                          </>
                        )}

                        {/* 재방문 기록 추가 버튼 */}
                        <div className="flex gap-[6px]">
                          <AppButton
                            onClick={() => navigate(`/notebook/entry?shopId=${group.shopId || ''}&shopName=${encodeURIComponent(group.shopName)}`)}
                            variant="soft"
                            size="md"
                            className="flex-1"
                          >
                            <svg className="size-[12px]" fill="none" viewBox="0 0 14 14">
                              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-[11px]">재방문 기록 추가</span>
                          </AppButton>
                          {hasMultiple && (
                            <AppButton
                              onClick={() => setCompareTarget(group)}
                              variant="secondary"
                              size="md"
                              className="flex-1"
                            >
                              <span className="text-[11px]">이전 기록 비교</span>
                            </AppButton>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 분위기 이미지 */}
                <div className="h-[110px] rounded-[14px] overflow-hidden relative mt-[4px]">
                  <img alt="Atmosphere" className="w-full h-[180%] object-cover absolute top-[-40%] opacity-40" src={imgRamen} style={{ filter: 'saturate(0)' }} />
                  <div className="absolute inset-0 flex items-end p-[16px]" style={{ background: `linear-gradient(to bottom, transparent, ${pageBg}CC)` }}>
                    <span className="text-[10px] tracking-[2px] uppercase" style={{ fontFamily: "'Manrope', sans-serif", color: mutedColor }}>
                      Authentic Investigation
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* 분포 탭 */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-[16px]">
            <div className="rounded-[14px] p-[16px]" style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center justify-between mb-[14px]">
                <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', fontWeight: 900, color: titleColor }}>먹은 스타일 분포</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: mutedColor }}>{notebookEntries.length}건 기준</span>
              </div>

              {brothDistribution.length === 0 ? (
                <div className="py-[20px] text-center">
                  <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', color: mutedColor }}>기록이 쌓이면 분포가 나타나요</span>
                </div>
              ) : (
                <div className="flex flex-col gap-[10px]">
                  {brothDistribution.map(({ name, pct }) => (
                    <div key={name} className="grid items-center gap-[8px]" style={{ gridTemplateColumns: '36px 1fr 32px' }}>
                      <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: subColor }}>{name}</span>
                      <div className="h-[7px] rounded-full overflow-hidden" style={{ backgroundColor: border }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: accent }} />
                      </div>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 700, color: titleColor, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              )}
              {structuredRecordCount > 0 && (
                <div className="mt-[14px] pt-[12px]" style={{ borderTop: `1px solid ${border}` }}>
                  <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: mutedColor }}>
                    면 식감·국물·취향 일치를 입력한 구조화 기록 {structuredRecordCount}건
                  </span>
                </div>
              )}
            </div>

            {/* 최근 기록 */}
            <div>
              <div className="flex items-center justify-between mb-[10px]">
                <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', fontWeight: 900, color: titleColor }}>최근 기록</span>
              </div>
              <div className="flex flex-col gap-[8px]">
                {notebookEntries.slice(0, 3).map((entry) => {
                  const shop = entry.shopId ? mockShops.find((s) => s.id === entry.shopId) : null;
                  return (
                    <div
                      key={entry.id}
                      className="flex gap-[10px] rounded-[12px] p-[10px]"
                      style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
                    >
                      <div className="w-[48px] h-[48px] rounded-[8px] overflow-hidden flex-shrink-0" style={{ backgroundColor: chipBg }}>
                        {shop && <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                        <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', fontWeight: 700, color: titleColor }}>{entry.shopName}</span>
                        <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: subColor }}>{entry.menu}</span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px', color: mutedColor }}>{entry.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 즐겨찾기 탭 */}
        {activeTab === 'favorites' && (
          <div className="flex flex-col gap-[8px]">
            {favoriteShops.length === 0 ? (
              <div className="flex flex-col items-center gap-[14px] py-[60px] text-center">
                <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center" style={{ backgroundColor: chipBg }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M12 21C12 21 3 14.5 3 8.5a5 5 0 019-3 5 5 0 019 3C21 14.5 12 21 12 21z" stroke={mutedColor} strokeWidth="1.8" fill="none" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <div style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '16px', color: titleColor }}>즐겨찾기한 가게가 없어요</div>
                  <div style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '13px', color: mutedColor }}>가게 상세에서 ♡를 눌러 저장하세요</div>
                </div>
                <AppButton
                  onClick={() => navigate('/map')}
                  variant="primary"
                  size="md"
                >
                  지도로 탐색하기
                </AppButton>
              </div>
            ) : (
              favoriteShops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => navigate(`/shop/${shop.id}`)}
                  className="flex gap-[12px] rounded-[12px] p-[10px] active:scale-[0.98] transition-transform text-left"
                  style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
                >
                  <div className="w-[56px] h-[56px] rounded-[10px] overflow-hidden flex-shrink-0">
                    <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                    <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', fontWeight: 700, color: titleColor }}>{shop.name}</span>
                    <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: subColor }}>{shop.description}</span>
                    <div className="flex gap-[4px] flex-wrap mt-[2px]">
                      {shop.broth.map((b) => (
                        <span key={b} className="px-[6px] py-[1px] rounded-full" style={{ backgroundColor: chipBg, border: `1px solid ${border}`, fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '10px', color: subColor }}>{b}</span>
                      ))}
                      {shop.signatureTags.slice(0, 1).map((t) => (
                        <span key={t} className="px-[6px] py-[1px] rounded-full" style={{ backgroundColor: accent + '18', border: `1px solid ${accent}33`, fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '10px', color: accent }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="flex-shrink-0 self-center">
                    <path d="M6 3l5 5-5 5" stroke={mutedColor} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Compare View Modal */}
      {compareTarget && (
        <CompareView
          shopName={compareTarget.shopName}
          entries={compareTarget.entries}
          isOpen={!!compareTarget}
          onClose={() => setCompareTarget(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
