import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import appIcon from '../../imports/_______.png';
import { AppButton } from '../components/AppButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useApp();

  const handleSocialLogin = (provider: 'kakao' | 'naver' | 'apple') => {
    if (provider === 'kakao') {
      navigate('/auth/kakao');
    } else {
      login(provider);
      navigate('/', { replace: true });
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/', { replace: true });
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start"
      style={{ backgroundColor: '#EDE5D8' }}
    >
      <div
        className="w-full max-w-[390px] flex flex-col items-center justify-center px-[32px]"
        style={{ height: '100dvh', backgroundColor: '#FFFBF5' }}
      >
        {/* 로고 */}
        <div className="flex flex-col items-center gap-[10px] mb-[48px]">
          <img
            src={appIcon}
            alt="면탐정"
            className="w-[80px] h-[80px] rounded-[20px]"
            style={{ boxShadow: '0 8px 28px rgba(232,124,42,0.30)' }}
          />

          <span
            style={{
              fontFamily: "'WenQuanYi Zen Hei', sans-serif",
              fontSize: '28px',
              fontWeight: 900,
              letterSpacing: '-0.05em',
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
              textAlign: 'center',
            }}
          >
            라멘 취향으로 찾는 로컬 맛집
          </span>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="w-full flex flex-col gap-[10px]">
          {/* 카카오 */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform"
            style={{ backgroundColor: '#FEE500', border: '1px solid #E6CF00' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C5.58 2 2 4.91 2 8.5c0 2.28 1.44 4.27 3.6 5.44L4.7 17.3a.3.3 0 00.43.35l3.9-2.6c.32.04.64.06.97.06 4.42 0 8-2.91 8-6.51S14.42 2 10 2z"
                fill="#3A1D1D"
              />
            </svg>
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#3A1D1D',
              }}
            >
              카카오로 시작하기
            </span>
          </button>

          {/* 네이버 */}
          <button
            onClick={() => handleSocialLogin('naver')}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform"
            style={{ backgroundColor: '#03C75A', border: '1px solid #02A84C' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3h4.2l3.6 5.6V3H15v12h-4.2L7.2 9.4V15H3V3z" fill="white" />
            </svg>
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              네이버로 시작하기
            </span>
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-[10px] active:scale-[0.98] transition-transform"
            style={{ backgroundColor: '#000000', border: '1px solid #333' }}
          >
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path
                d="M14.8 10.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-1.9-3.7-1.9-1.6-.1-3 .9-3.8.9-.8 0-2-.9-3.3-.9C4.4 4.7 2 6.3 2 9.8c0 2.2.9 4.5 1.9 6 1 1.5 1.8 2.2 3 2.2 1.2 0 1.7-.8 3.1-.8 1.5 0 1.8.7 3.1.7 1.3 0 2.2-.9 3-2.1.9-1.4 1.3-2.8 1.3-2.9-.1 0-2.6-1-2.6-3.4z"
                fill="white"
              />
              <path
                d="M12.4 2.5C13.2 1.6 13.7.4 13.5-.1c-1.1.1-2.4.8-3.1 1.7-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.7 3.1-2.2z"
                fill="white"
              />
            </svg>
            <span
              style={{
                fontFamily: "'WenQuanYi Zen Hei', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              Apple로 시작하기
            </span>
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-[12px] my-[4px]">
            <div className="flex-1 h-[1px]" style={{ backgroundColor: '#E0D5C8' }} />
            <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: '#B0978A' }}>
              또는
            </span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: '#E0D5C8' }} />
          </div>

          {/* 비회원 */}
          <AppButton
            onClick={handleGuest}
            variant="outline"
            size="md"
            fullWidth
          >
            비회원으로 시작하기
          </AppButton>
        </div>

        <p
          className="mt-[24px] text-center"
          style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: '#B0978A' }}
        >
          로그인하면 탐정수첩에 방문 기록을 남길 수 있어요
        </p>
      </div>
    </div>
  );
}
