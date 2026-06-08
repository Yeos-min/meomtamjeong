import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import appIcon from '../../imports/_______.png';

export default function SplashPage() {
  const navigate = useNavigate();
  const { setHasSeenSplash } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasSeenSplash();
      navigate('/login', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-start"
      style={{ backgroundColor: '#EDE5D8' }}
    >
      <div
        className="relative w-full max-w-[390px] flex flex-col items-center justify-center"
        style={{ height: '100dvh', backgroundColor: '#FFFBF5' }}
      >
        {/* 로고 */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="relative">
            <img
              src={appIcon}
              alt="면탐정"
              className="w-[100px] h-[100px] rounded-[24px]"
              style={{ boxShadow: '0 8px 32px rgba(232,124,42,0.35)' }}
            />
          </div>

          <div className="flex flex-col items-center gap-[6px]">
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '32px',
                fontWeight: 900,
                letterSpacing: '-0.06em',
                color: '#2C1A0E',
              }}
            >
              면탐정
            </span>
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '13px',
                color: '#8B6A50',
              }}
            >
              나만의 라멘을 찾는 중...
            </span>
          </div>

          {/* 로딩 스피너 */}
          <div
            className="w-[28px] h-[28px] rounded-full border-[3px] mt-[8px]"
            style={{
              borderColor: '#E8D5C0',
              borderTopColor: '#E87C2A',
              animation: 'spin 0.9s linear infinite',
            }}
          />
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
