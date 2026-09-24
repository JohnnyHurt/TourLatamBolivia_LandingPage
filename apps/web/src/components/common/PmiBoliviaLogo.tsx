import React from 'react';

interface PmiBoliviaLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge';
  size?: 'sm' | 'md' | 'lg';
}

export const PmiBoliviaLogo: React.FC<PmiBoliviaLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-11 text-sm',
    lg: 'h-16 text-base',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* PMI Geometric Emblem */}
      <div className="relative flex items-center shrink-0">
        <svg
          viewBox="0 0 140 120"
          className={
            size === 'sm' ? 'w-10 h-8' : size === 'lg' ? 'w-20 h-16' : 'w-14 h-12'
          }
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Left P */}
          <rect x="5" y="5" width="55" height="50" rx="6" fill="#0B0418" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M22 18H38C43.5 18 48 22 48 27C48 32 43.5 36 38 36H30V43H22V18ZM30 25V30H37C39 30 40.5 28.8 40.5 27.5C40.5 26.2 39 25 37 25H30Z" fill="#FFFFFF" />

          {/* Top Right Orange Chevron / Diamond */}
          <rect x="68" y="5" width="55" height="50" rx="6" fill="#FF5E14" />
          <path d="M85 18L105 30L85 42L92 30L85 18Z" fill="#FFFFFF" opacity="0.95" />
          <circle cx="108" cy="30" r="4" fill="#00F2FE" />

          {/* Bottom Left Cyan I & Pillars */}
          <rect x="5" y="62" width="55" height="50" rx="6" fill="#00F2FE" />
          <path d="M18 74H48V80H37V96H48V102H18V96H29V80H18V74Z" fill="#0B0418" />

          {/* Bottom Right South America Map Contour */}
          <rect x="68" y="62" width="55" height="50" rx="6" fill="#1D0B38" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="3" />
          {/* Stylized Bolivia / South America silhouette */}
          <path
            d="M86 72C90 71 96 73 100 76C104 79 106 84 104 88C102 92 98 96 95 101C92 105 89 108 88 106C86 102 83 95 82 91C80 86 82 78 86 72Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
          <circle cx="95" cy="88" r="3.5" fill="#FF5E14" />
        </svg>
      </div>

      {/* Official Typography */}
      {variant !== 'badge' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white tracking-wider text-sm sm:text-base">
              Project Management
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white tracking-wider text-sm sm:text-base">
              Institute<span className="text-brand-magenta">.</span>
            </span>
          </div>
          <span className="font-black text-brand-cyan uppercase tracking-widest text-xs sm:text-sm mt-0.5">
            Bolivia
          </span>
        </div>
      )}
    </div>
  );
};
