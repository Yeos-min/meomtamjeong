import { useLocation, useNavigate } from 'react-router';
import { useApp } from '../AppContext';

type TopNavProps = {
  overlay?: boolean;
};

export function TopNav({ overlay = false }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useApp();
  const isMap = location.pathname === '/map';
  const title = location.pathname === '/'
    ? '면탐정'
    : isMap
      ? '지도'
      : location.pathname === '/shops'
        ? '가게'
        : '수첩';

  return (
    <header
      className={`${overlay ? 'absolute top-0 left-0 right-0' : 'shrink-0'} h-[60px] px-[20px] flex items-center justify-between backdrop-blur-[12px]`}
      style={{
        background: overlay
          ? `linear-gradient(to bottom, ${theme.deepBg}F2 0%, ${theme.deepBg}B8 70%, transparent 100%)`
          : theme.navBg,
        borderBottom: overlay ? 'none' : `1px solid ${theme.border}`,
        zIndex: 35,
      }}
    >
      <button
        onClick={() => navigate(location.pathname === '/' ? '/' : location.pathname)}
        className="flex items-center active:opacity-70"
        aria-label={`${title} 화면`}
      >
        <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '22px', fontWeight: 900, color: location.pathname === '/' ? theme.accent : theme.titleColor }}>
          {title}
        </span>
      </button>
      <div aria-hidden="true" />
    </header>
  );
}
