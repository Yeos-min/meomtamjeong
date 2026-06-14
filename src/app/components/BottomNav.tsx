import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../AppContext';

export function BottomNav() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { theme }  = useApp();
  const path       = location.pathname;

  const isHome     = path === '/' || path === '/results' || path === '/events';
  const isMap      = path === '/map';
  const isShop     = path === '/shops' || path.startsWith('/shop/');
  const isNotebook = path === '/notebook';

  // 순서: 홈 / 지도 / 가게 / 수첩
  type NavItem = {
    key: string;
    label: string;
    active: boolean;
    onClick: () => void;
    icon: (active: boolean) => JSX.Element;
  };

  const navItems: NavItem[] = [
    {
      key: 'home',
      label: '홈',
      active: isHome,
      onClick: () => navigate('/'),
      icon: (active) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          {/* roof */}
          <path
            d="M2 9.5L10 3l8 6.5"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* walls */}
          <path
            d="M4 8.5V16a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1V8.5"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
    },
    {
      key: 'map',
      label: '지도',
      active: isMap,
      onClick: () => navigate('/map'),
      icon: (active) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M10 2a5.5 5.5 0 015.5 5.5c0 4-5.5 10-5.5 10S4.5 11.5 4.5 7.5A5.5 5.5 0 0110 2z"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill={active ? theme.labelColor + '30' : 'none'}
          />
          <circle
            cx="10" cy="7.5" r="2"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      ),
    },
    {
      key: 'shop',
      label: '가게',
      active: isShop,
      onClick: () => navigate('/shops'),
      icon: (active) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M4 8.5h12l-1-4.5H5L4 8.5z"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.7"
            strokeLinejoin="round"
            fill={active ? theme.labelColor + '26' : 'none'}
          />
          <path
            d="M5 8.5V17h10V8.5M8 17v-4h4v4"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 8.5c.6 1 1.8 1 2.4 0 .6 1 1.8 1 2.4 0 .6 1 1.8 1 2.4 0 .6 1 1.8 1 2.4 0 .6 1 1.8 1 2.4 0"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: 'notebook',
      label: '수첩',
      active: isNotebook,
      onClick: () => navigate('/notebook'),
      icon: (active) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 18 20">
          <rect
            x="2" y="2" width="14" height="16" rx="2"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M5 7h8M5 10.5h8M5 14h5"
            stroke={active ? theme.labelColor : theme.mutedColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="shrink-0 backdrop-blur-[12px] h-[72px] flex items-center justify-around px-2 transition-colors duration-500"
      style={{
        backgroundColor: theme.navBg,
        borderTop: `1px solid ${theme.border}`,
        boxShadow: `0px -4px 20px 0px ${theme.shadow}`,
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className="flex flex-col items-center gap-[4px] px-3 py-2 rounded-xl transition-all duration-200 active:scale-[0.92]"
          style={
            item.active
              ? {
                  backgroundColor: theme.subColor,
                  boxShadow: `0px 8px 18px 0px ${theme.shadow}`,
                }
              : { opacity: 0.55 }
          }
        >
          {item.icon(item.active)}
          <span
            className="tracking-wide"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: '10px',
              fontWeight: item.active ? 700 : 400,
              color: item.active ? theme.labelColor : theme.mutedColor,
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
