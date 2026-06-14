import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { TopNav } from './components/TopNav';
import { useApp } from './AppContext';
import { Toaster } from 'sonner';
import appIcon from '../imports/_______.png';

export default function Root() {
  const { theme, hasSeenSplash } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [transitioning, setTransitioning] = useState(false);
  const prevPath = useRef(path);

  // 첫 방문이면 스플래시로
  useEffect(() => {
    if (!hasSeenSplash) {
      navigate('/splash', { replace: true });
    }
  }, []);

  // 경로 변경 시 1초 로딩 오버레이
  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;
      setTransitioning(true);
      const t = setTimeout(() => setTransitioning(false), 1000);
      return () => clearTimeout(t);
    }
  }, [path]);

  // 탭바 숨김: 길찾기 / 기록 작성 / 설문 화면
  const hideNav = path.startsWith('/shop/') || path === '/notebook/entry' || path === '/preference' || path === '/login' || path === '/splash';
  const showTopNav = path === '/' || path === '/map' || path === '/shops' || path === '/notebook';

  return (
    <div className="min-h-screen flex justify-center items-start" style={{ backgroundColor: '#EDE5D8' }}>
      <div
        className="relative w-full max-w-[390px] flex flex-col shadow-[0_0_60px_rgba(120,70,20,0.15)] transition-colors duration-500"
        style={{ height: '100dvh', backgroundColor: theme.pageBg }}
      >
        {showTopNav && <TopNav overlay={path === '/map'} />}
        {/* 콘텐츠 영역: 지도는 overflow hidden, 나머지는 scroll */}
        <div
          className="flex-1 min-h-0"
          style={{
            overflowY: (path === '/map' || path.endsWith('/directions')) ? 'hidden' : 'auto',
            // @ts-ignore
            scrollbarWidth: 'none',
          }}
        >
          <Outlet />
        </div>
        {/* 하단 탭바 (상세/기록 작성 화면에서는 숨김) */}
        {!hideNav && <BottomNav />}

        {/* 화면 전환 로딩 오버레이 */}
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-200"
          style={{
            backgroundColor: theme.pageBg,
            opacity: transitioning ? 1 : 0,
            pointerEvents: transitioning ? 'auto' : 'none',
          }}
        >
          <div className="flex flex-col items-center gap-[16px]">
            <img
              src={appIcon}
              alt="면탐정"
              className="w-[72px] h-[72px] rounded-[18px]"
              style={{ boxShadow: '0 6px 20px rgba(232,124,42,0.30)' }}
            />
            <div
              className="w-[32px] h-[32px] rounded-full border-[3px] animate-spin"
              style={{ borderColor: theme.deepBg, borderTopColor: theme.accent }}
            />
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            color: theme.titleColor,
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}
