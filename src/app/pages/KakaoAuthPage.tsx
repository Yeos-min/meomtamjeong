import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '../AppContext';

export default function KakaoAuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();

  // returnTo: 로그인 후 돌아갈 경로 (기본: /)
  const returnTo = searchParams.get('returnTo') || '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      login('kakao');
      navigate(returnTo, { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-start"
      style={{ backgroundColor: '#EDE5D8' }}
    >
      <div
        className="w-full max-w-[390px] flex flex-col items-center justify-center px-[32px]"
        style={{ height: '100dvh', backgroundColor: '#FFFBF5' }}
      >
        <div
          className="w-full rounded-[20px] flex flex-col items-center gap-[20px] px-[24px] py-[36px]"
          style={{ backgroundColor: '#FFF8F2', border: '1px solid #E8D5C0' }}
        >
          {/* 카카오 로고 */}
          <div
            className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C5.58 2 2 4.91 2 8.5c0 2.28 1.44 4.27 3.6 5.44L4.7 17.3a.3.3 0 00.43.35l3.9-2.6c.32.04.64.06.97.06 4.42 0 8-2.91 8-6.51S14.42 2 10 2z"
                fill="#3A1D1D"
              />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-[8px] text-center">
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '18px',
                fontWeight: 900,
                color: '#2C1A0E',
              }}
            >
              카카오 인증 진행 중
            </span>
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '13px',
                color: '#8B6A50',
                lineHeight: 1.6,
              }}
            >
              잠시 후 이전 화면으로 돌아갑니다.
            </span>
          </div>

          {/* 스피너 */}
          <div
            className="w-[36px] h-[36px] rounded-full border-[4px]"
            style={{
              borderColor: '#F5EAD8',
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
