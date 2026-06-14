import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useApp } from '../AppContext';

type AppButtonVariant = 'cta' | 'primary' | 'secondary' | 'soft' | 'outline' | 'text';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  selected?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
};

const sizeClass: Record<AppButtonSize, string> = {
  sm: 'h-[34px] px-[13px] rounded-full text-[12px]',
  md: 'h-[46px] px-[14px] rounded-[14px] text-[14px]',
  lg: 'h-[52px] px-[16px] rounded-[14px] text-[15px]',
};

export function AppButton({
  children,
  variant = 'secondary',
  size = 'md',
  selected = false,
  fullWidth = false,
  disabled = false,
  className = '',
  style,
  ...buttonProps
}: AppButtonProps) {
  const { theme } = useApp();

  const base: CSSProperties = {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontWeight: selected ? 800 : 700,
  };

  const variantStyle: CSSProperties = (() => {
    if (disabled) {
      return {
        backgroundColor: theme.chipBg,
        border: `1px solid ${theme.border}`,
        color: theme.mutedColor,
        boxShadow: 'none',
        opacity: 0.62,
        cursor: 'not-allowed',
      };
    }

    switch (variant) {
      case 'cta':
        if (selected) {
          return {
            background: `linear-gradient(135deg, ${theme.accentSoft}, ${theme.accent})`,
            border: `1px solid ${theme.accent}`,
            color: theme.labelColor,
            boxShadow: `0 8px 18px ${theme.accentGlow}`,
          };
        }
        return {
          background: `linear-gradient(135deg, ${theme.accentSoft}, ${theme.accent})`,
          border: `1px solid ${theme.accent}`,
          color: theme.labelColor,
          boxShadow: `0 10px 26px ${theme.accentGlow}`,
        };
      case 'primary':
        if (selected) {
          return {
            backgroundColor: theme.subColor,
            border: `1px solid ${theme.subColor}`,
            color: theme.labelColor,
            boxShadow: `0 8px 20px ${theme.shadow}`,
          };
        }
        return {
          backgroundColor: theme.subColor,
          border: `1px solid ${theme.subColor}`,
          color: theme.labelColor,
          boxShadow: `0 8px 20px ${theme.shadow}`,
        };
      case 'soft':
        if (selected) {
          return {
            backgroundColor: theme.subColor,
            border: `1px solid ${theme.subColor}`,
            color: theme.labelColor,
            boxShadow: `0 8px 20px ${theme.shadow}`,
          };
        }
        return {
          backgroundColor: `${theme.accent}16`,
          border: `1px solid ${theme.accent}66`,
          color: theme.accent,
          boxShadow: 'none',
        };
      case 'outline':
        if (selected) {
          return {
            backgroundColor: theme.subColor,
            border: `1px solid ${theme.subColor}`,
            color: theme.labelColor,
            boxShadow: `0 8px 20px ${theme.shadow}`,
          };
        }
        return {
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.border}`,
          color: theme.subColor,
          boxShadow: 'none',
        };
      case 'text':
        if (selected) {
          return {
            backgroundColor: theme.subColor,
            border: `1px solid ${theme.subColor}`,
            color: theme.labelColor,
            boxShadow: `0 8px 20px ${theme.shadow}`,
          };
        }
        return {
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          color: theme.accent,
          boxShadow: 'none',
        };
      case 'secondary':
      default:
        if (selected) {
          return {
            backgroundColor: theme.subColor,
            border: `1px solid ${theme.subColor}`,
            color: theme.labelColor,
            boxShadow: `0 8px 20px ${theme.shadow}`,
          };
        }
        return {
          backgroundColor: theme.chipBg,
          border: `1px solid ${theme.border}`,
          color: theme.subColor,
          boxShadow: 'none',
        };
    }
  })();

  return (
    <button
      {...buttonProps}
      disabled={disabled}
      className={`${fullWidth ? 'w-full' : ''} ${sizeClass[size]} inline-flex items-center justify-center gap-[8px] transition-all active:scale-[0.98] disabled:active:scale-100 ${className}`}
      style={{
        ...base,
        ...variantStyle,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
