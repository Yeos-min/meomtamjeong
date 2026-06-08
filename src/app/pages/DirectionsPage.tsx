import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { mockShops } from '../types';
import { CloseIcon, NavIconButton } from '../components/NavIconButton';
import { AppButton } from '../components/AppButton';

const MAP_W = 390;
const MAP_H = 480;

// 고정된 현재 위치 (삼산 중심부)
const CURRENT_POS = { x: 204, y: 263 };

type TravelMode = '도보' | '자전거' | '대중교통';

const MODE_INFO: Record<TravelMode, { speed: number; unit: string; label: string }> = {
  '도보': { speed: 70, unit: 'm/min', label: '도보' },
  '자전거': { speed: 200, unit: 'm/min', label: '자전거' },
  '대중교통': { speed: 400, unit: 'm/min', label: '대중교통' },
};

// mapPos 픽셀 거리 → 실제 거리 (1px ≈ 5m)
const PX_TO_M = 5;

function calcRoute(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distPx = Math.sqrt(dx * dx + dy * dy);
  const distM = Math.round(distPx * PX_TO_M / 10) * 10; // 10m 단위 반올림
  return { distM };
}

// 도로 격자를 따라 꺾이는 경로 생성 (최대 2번 꺾음)
function buildRoutePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  // 주요 도로 x축: 58, 119, 197, 291, 350
  // 주요 도로 y축: 78, 151, 200, 253, 340
  const roads_x = [58, 119, 197, 291, 350];
  const roads_y = [78, 151, 200, 253, 340];

  // 출발점과 목적지 사이에서 가장 가까운 도로 교차점을 경유점으로 잡는다
  const midX = roads_x.reduce((prev, cur) =>
    Math.abs(cur - (from.x + to.x) / 2) < Math.abs(prev - (from.x + to.x) / 2) ? cur : prev
  );
  const midY = roads_y.reduce((prev, cur) =>
    Math.abs(cur - (from.y + to.y) / 2) < Math.abs(prev - (from.y + to.y) / 2) ? cur : prev
  );

  // from → (midX, from.y) → (midX, midY) → to  형태로 경로 구성
  return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${midY} L ${to.x} ${to.y}`;
}

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
      <rect x="60" y="80" width="110" height="90" rx="4" fill="#EAE0CC" />
      <rect x="180" y="60" width="130" height="80" rx="4" fill="#EDE3D0" />
      <rect x="60" y="190" width="80" height="100" rx="4" fill="#E8DFCB" />
      <rect x="160" y="170" width="90" height="75" rx="4" fill="#EBE1CD" />
      <rect x="260" y="170" width="100" height="85" rx="4" fill="#E9DFCB" />
      <rect x="60" y="310" width="120" height="90" rx="4" fill="#E6DCCA" />
      <rect x="200" y="275" width="160" height="85" rx="4" fill="#EAE0CC" />
      <rect x="315" y="70" width="65" height="75" rx="10" fill="#D4E8C8" />
      <ellipse cx="347" cy="107" rx="24" ry="18" fill="#C6DFB4" />
      <path d="M0 425 Q60 412 130 422 Q210 434 275 418 Q325 408 390 422" stroke="#A8C8E8" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M0 425 Q60 412 130 422 Q210 434 275 418 Q325 408 390 422" stroke="#BDDAEE" strokeWidth="12" fill="none" strokeLinecap="round" />
      <rect x="196" y="0" width="16" height={MAP_H} fill="#D9C9B0" />
      <rect x="0" y="252" width={MAP_W} height="14" fill="#D9C9B0" />
      <rect x="0" y="150" width={MAP_W} height="12" fill="#D9C9B0" />
      <rect x="118" y="0" width="7" height={MAP_H} fill="#DDD3BC" />
      <rect x="290" y="0" width="7" height={MAP_H} fill="#DDD3BC" />
      <rect x="0" y="78" width={MAP_W} height="6" fill="#DDD3BC" />
      <rect x="0" y="340" width={MAP_W} height="6" fill="#DDD3BC" />
      <rect x="58" y="0" width="4" height={MAP_H} fill="#E2D8C5" />
      <rect x="350" y="0" width="4" height={MAP_H} fill="#E2D8C5" />
      <rect x="0" y="200" width={MAP_W} height="4" fill="#E2D8C5" />
      <rect x="0" y="382" width={MAP_W} height="3" fill="#E2D8C5" />
      <text x="82" y="136" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.7">삼산동</text>
      <text x="220" y="124" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.7">삼산중앙로</text>
      <text x="75" y="355" fontSize="9" fill="#9A8868" fontWeight="700" opacity="0.7">달동</text>
      <text x="145" y="428" fontSize="9" fill="#7AAFD4" fontWeight="700" opacity="0.8">태화강</text>
    </svg>
  );
}

export default function DirectionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useApp();
  const [mode, setMode] = useState<TravelMode>('도보');

  const shop = mockShops.find((s) => s.id === id);
  if (!shop) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: theme.pageBg }}>
        <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", color: theme.subColor }}>가게를 찾을 수 없어요</span>
      </div>
    );
  }

  const dest = shop.mapPos;
  const { distM } = calcRoute(CURRENT_POS, dest);
  const modeInfo = MODE_INFO[mode];
  const timeMin = Math.max(1, Math.round(distM / modeInfo.speed));
  const routePath = buildRoutePath(CURRENT_POS, dest);

  const { accent, accentSoft, chipBg, border, titleColor, subColor, labelColor } = theme;

  return (
    <div className="w-full flex flex-col" style={{ height: '100%', backgroundColor: theme.pageBg }}>
      {/* 상단 바 */}
      <div
        className="flex items-center justify-between px-[16px] py-[12px] z-10 flex-shrink-0"
        style={{ backgroundColor: theme.pageBg, borderBottom: `1px solid ${border}` }}
      >
        <NavIconButton onClick={() => navigate(-1)} ariaLabel="길찾기 닫기">
          <CloseIcon />
        </NavIconButton>
        <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '15px', fontWeight: 900, color: titleColor }}>
          길찾기
        </span>
        <div className="size-[44px]" aria-hidden="true" />
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 배경 지도 */}
        <UlsanMapSVG />

        {/* 경로 및 마커 오버레이 */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* 경로 선 (그림자) */}
          <path
            d={routePath}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 경로 선 (본체) */}
          <path
            d={routePath}
            stroke="#2C6EE8"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0"
          />
          {/* 경로 선 (흰 테두리 강조) */}
          <path
            d={routePath}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
          />

          {/* 현재 위치 (파란 점) */}
          <circle
            cx={CURRENT_POS.x}
            cy={CURRENT_POS.y}
            r="10"
            fill="rgba(44,110,232,0.18)"
          />
          <circle
            cx={CURRENT_POS.x}
            cy={CURRENT_POS.y}
            r="6"
            fill="#2C6EE8"
            stroke="white"
            strokeWidth="2.5"
          />

          {/* 목적지 핀 */}
          <circle
            cx={dest.x}
            cy={dest.y - 18}
            r="13"
            fill="#2C1A0E"
            stroke="#E87C2A"
            strokeWidth="3"
          />
          <circle cx={dest.x} cy={dest.y - 18} r="5" fill="#E87C2A" />
          <path
            d={`M ${dest.x - 5} ${dest.y - 7} L ${dest.x} ${dest.y + 2} L ${dest.x + 5} ${dest.y - 7}`}
            fill="#2C1A0E"
          />

          {/* 목적지 라벨 */}
          <rect
            x={dest.x - 36}
            y={dest.y - 54}
            width="72"
            height="22"
            rx="6"
            fill="#2C1A0E"
          />
          <text
            x={dest.x}
            y={dest.y - 38}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#FFFBF5"
            fontFamily="WenQuanYi Zen Hei, sans-serif"
          >
            {shop.name}
          </text>

          {/* 현재 위치 라벨 */}
          <rect
            x={CURRENT_POS.x - 24}
            y={CURRENT_POS.y + 12}
            width="48"
            height="18"
            rx="5"
            fill="rgba(44,110,232,0.9)"
          />
          <text
            x={CURRENT_POS.x}
            y={CURRENT_POS.y + 24}
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="white"
            fontFamily="WenQuanYi Zen Hei, sans-serif"
          >
            현재 위치
          </text>
        </svg>
      </div>

      {/* 하단 정보 카드 */}
      <div
        className="flex-shrink-0 px-[16px] pt-[16px] pb-[24px]"
        style={{ backgroundColor: theme.pageBg, borderTop: `1px solid ${border}` }}
      >
        {/* 소요 시간 & 거리 */}
        <div className="mb-[12px]">
          <div className="flex items-baseline gap-[8px]">
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '26px', fontWeight: 900, color: titleColor }}>
              {timeMin}분
            </span>
            <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', color: subColor }}>
              {shop.name}까지
            </span>
          </div>
          <div className="flex gap-[6px] mt-[6px]">
            <span
              className="px-[8px] py-[3px] rounded-full"
              style={{ backgroundColor: '#2C6EE8' + '18', border: '1px solid #2C6EE8' + '44', fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', fontWeight: 700, color: '#2C6EE8' }}
            >
              {mode}
            </span>
            <span
              className="px-[8px] py-[3px] rounded-full"
              style={{ backgroundColor: chipBg, border: `1px solid ${border}`, fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: subColor }}
            >
              {distM >= 1000 ? `${(distM / 1000).toFixed(1)}km` : `${distM}m`}
            </span>
            {shop.waiting && (
              <span
                className="px-[8px] py-[3px] rounded-full"
                style={{ backgroundColor: accent + '18', border: `1px solid ${accent}44`, fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: accent }}
              >
                웨이팅 {shop.waitingTime}
              </span>
            )}
          </div>
        </div>

        {/* 이동 수단 탭 */}
        <div className="flex gap-[6px] mb-[14px]">
          {(['도보', '자전거', '대중교통'] as TravelMode[]).map((m) => (
            <AppButton
              key={m}
              onClick={() => setMode(m)}
              variant="secondary"
              size="md"
              selected={mode === m}
              className="flex-1"
            >
              {m}
            </AppButton>
          ))}
        </div>

        {/* 경로 안내 시작 버튼 */}
        <AppButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {/* 실제 내비는 미구현 — 시뮬레이션용 */}}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M3 11l19-9-9 19-2-8-8-2z" fill="currentColor" />
          </svg>
          경로 안내 시작
        </AppButton>
      </div>
    </div>
  );
}
