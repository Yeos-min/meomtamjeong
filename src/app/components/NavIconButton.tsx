import { CSSProperties, ReactNode } from 'react';
import { useApp } from '../AppContext';

type NavIconButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  selected?: boolean;
  size?: 'sm' | 'md';
  style?: CSSProperties;
};

export function NavIconButton({ ariaLabel, children, onClick, className = '', selected = false, style }: NavIconButtonProps) {
  const { theme } = useApp();

  return (
    <button
      onClick={onClick}
      className={`size-[44px] rounded-[14px] flex items-center justify-center active:scale-95 transition-transform ${className}`}
      style={{
        backgroundColor: selected ? theme.subColor : theme.cardBg,
        border: `1px solid ${selected ? theme.subColor : theme.border}`,
        boxShadow: `0 8px 20px ${theme.shadow}`,
        color: selected ? theme.labelColor : theme.subColor,
        ...style,
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function CloseIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M6 6l10 10M16 6L6 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
