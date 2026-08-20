import React from 'react';

interface CreabraLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const CreabraLogo: React.FC<CreabraLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  onClick,
}) => {
  const iconHeight = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}
      title="Creabra"
    >
      {/* Creabra Official Brand Cat Silhouette */}
      <svg
        height={iconHeight}
        viewBox="0 0 120 90"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-zinc-950 transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Cat Head Silhouette with stylized ears and cheeks */}
        <path
          d="M 16 10
             L 38 46
             C 52 41, 68 41, 82 46
             L 104 10
             C 100 32, 108 50, 104 62
             C 98 74, 82 82, 60 82
             C 38 82, 22 74, 16 62
             C 12 50, 20 32, 16 10 Z"
          fill="currentColor"
        />
        {/* Left Cheek Whiskers */}
        <path
          d="M 22 66 C 14 69, 8 72, 3 74"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 25 74 C 18 78, 12 83, 8 87"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Cheek Whiskers */}
        <path
          d="M 98 66 C 106 69, 112 72, 117 74"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 95 74 C 102 78, 108 83, 112 87"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* CREABRA Bold Brand Typography */}
      {!iconOnly && (
        <span
          className="text-zinc-950 font-black tracking-tighter leading-none"
          style={{
            fontSize: size === 'sm' ? '1.15rem' : size === 'lg' ? '1.65rem' : '1.35rem',
            fontFamily:
              'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.035em',
          }}
        >
          CREABRA
        </span>
      )}
    </div>
  );
};
