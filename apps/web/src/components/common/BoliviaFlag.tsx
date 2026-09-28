import React from 'react';

interface BoliviaFlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BoliviaFlag: React.FC<BoliviaFlagProps> = ({
  className = '',
  size = 'sm',
}) => {
  const dimensions = {
    sm: { width: 18, height: 13 },
    md: { width: 24, height: 17 },
    lg: { width: 30, height: 21 },
  }[size];

  return (
    <span
      className={`inline-flex items-center origin-left select-none align-middle ${className}`}
      title="Bolivia"
      style={{
        perspective: '400px',
      }}
    >
      <span className="animate-flag-wave inline-block origin-left">
        <svg
          viewBox="0 0 32 22"
          width={dimensions.width}
          height={dimensions.height}
          className="rounded-[2.5px] overflow-hidden drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] border border-white/20 block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Shading gradient to give fabric ripple depth */}
            <linearGradient id="bolivia-fabric-ripple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#000000" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="80%" stopColor="#000000" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Curved wave stripes for natural waving flag look */}
          {/* Top: Red (Rojo) */}
          <path
            d="M0 0.8C6 -0.6 14 2 22 0.8C26 0.2 29 0.4 32 0.8V7.8C29 7.4 26 7.2 22 7.8C14 9 6 6.4 0 7.8V0.8Z"
            fill="#D52B1E"
          />

          {/* Middle: Yellow (Amarillo) */}
          <path
            d="M0 7.8C6 6.4 14 9 22 7.8C26 7.2 29 7.4 32 7.8V14.8C29 14.4 26 14.2 22 14.8C14 16 6 13.4 0 14.8V7.8Z"
            fill="#FCD116"
          />

          {/* Bottom: Green (Verde) */}
          <path
            d="M0 14.8C6 13.4 14 16 22 14.8C26 14.2 29 14.4 32 14.8V21.8C29 21.4 26 21.2 22 21.8C14 23 6 20.4 0 21.8V14.8Z"
            fill="#007934"
          />

          {/* Fabric Lighting Overlay */}
          <rect
            x="0"
            y="0"
            width="32"
            height="22"
            fill="url(#bolivia-fabric-ripple)"
            style={{ mixBlendMode: 'overlay' }}
          />
        </svg>
      </span>
    </span>
  );
};
