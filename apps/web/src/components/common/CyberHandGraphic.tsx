import React from 'react';

interface CyberHandGraphicProps {
  className?: string;
}

export const CyberHandGraphic: React.FC<CyberHandGraphicProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Radial Backlight Aura */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-cyan/25 blur-3xl -top-10 -left-10 animate-pulse-slow" />
      <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-brand-magenta/30 blur-3xl -bottom-10 -right-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute w-64 h-64 rounded-full bg-brand-purple/35 blur-2xl top-1/3 left-1/4" />

      {/* Cybernetic Neural Hand SVG Graphic */}
      <svg
        viewBox="0 0 500 650"
        className="w-full h-auto max-w-[480px] drop-shadow-[0_0_35px_rgba(0,242,254,0.55)] filter"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="cyanToPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#8338EC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF007F" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="neonCyanGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00F2FE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="magentaSynapse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007F" stopOpacity="1" />
            <stop offset="100%" stopColor="#7928CA" stopOpacity="0.4" />
          </linearGradient>

          <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="electricGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neural Synapse Web / Polygons in Hand Form */}
        {/* Index Finger (Pointing Upward / Rightward toward title) */}
        <g filter="url(#superGlow)">
          {/* Main Index Finger Contour */}
          <path
            d="M 120 180 C 140 140 190 80 230 45 C 242 34 258 40 252 56 C 235 98 198 180 178 230"
            stroke="url(#cyanToPink)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Index Finger Inner Neural Filaments */}
          <path
            d="M 125 175 Q 185 105 235 48"
            stroke="#00F2FE"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 135 185 Q 195 120 245 52"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          {/* Fingertip Bright Star/Synapse */}
          <circle cx="236" cy="46" r="6" fill="#FFFFFF" filter="url(#superGlow)" />
          <circle cx="236" cy="46" r="14" fill="#00F2FE" opacity="0.4" />
        </g>

        {/* Middle Finger */}
        <g filter="url(#electricGlow)">
          <path
            d="M 180 225 C 210 170 270 120 310 95 C 322 88 335 98 328 112 C 298 165 245 245 220 280"
            stroke="url(#cyanToPink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 190 225 Q 260 140 315 98"
            stroke="#00F2FE"
            strokeWidth="2"
          />
          <circle cx="316" cy="97" r="5" fill="#FFFFFF" />
          <circle cx="316" cy="97" r="12" fill="#FF007F" opacity="0.35" />
        </g>

        {/* Ring Finger */}
        <g filter="url(#electricGlow)">
          <path
            d="M 225 275 C 265 225 330 185 375 160 C 388 153 398 165 390 178 C 352 235 295 305 265 340"
            stroke="url(#cyanToPink)"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path
            d="M 235 275 Q 320 205 380 165"
            stroke="#FF007F"
            strokeWidth="2"
          />
          <circle cx="380" cy="165" r="4.5" fill="#FFFFFF" />
        </g>

        {/* Pinky Finger */}
        <g filter="url(#electricGlow)">
          <path
            d="M 270 335 C 310 295 385 260 425 240 C 438 234 446 248 438 260 C 398 315 330 380 295 410"
            stroke="url(#cyanToPink)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 280 335 Q 375 275 430 245"
            stroke="#00F2FE"
            strokeWidth="1.8"
          />
          <circle cx="430" cy="245" r="4" fill="#FFFFFF" />
        </g>

        {/* Thumb */}
        <g filter="url(#electricGlow)">
          <path
            d="M 115 310 C 95 270 65 235 45 220 C 32 210 22 225 30 238 C 55 285 100 375 125 410"
            stroke="url(#cyanToPink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 110 305 Q 60 250 42 224"
            stroke="#00F2FE"
            strokeWidth="2.2"
          />
          <circle cx="40" cy="222" r="5" fill="#FFFFFF" />
          <circle cx="40" cy="222" r="11" fill="#00F2FE" opacity="0.4" />
        </g>

        {/* Palm Network (Triangular Synapse Meshes) */}
        <g filter="url(#electricGlow)">
          {/* Primary Palm Triangles & Nodes */}
          <polygon points="120,180 180,225 150,300" stroke="#00F2FE" strokeWidth="1.5" fill="rgba(0, 242, 254, 0.08)" />
          <polygon points="180,225 225,275 190,340" stroke="#8338EC" strokeWidth="1.5" fill="rgba(131, 56, 236, 0.12)" />
          <polygon points="225,275 270,335 230,390" stroke="#FF007F" strokeWidth="1.5" fill="rgba(255, 0, 127, 0.1)" />
          <polygon points="150,300 190,340 145,410" stroke="#00F2FE" strokeWidth="1.5" fill="rgba(0, 242, 254, 0.07)" />
          <polygon points="190,340 230,390 195,450" stroke="#8338EC" strokeWidth="1.5" fill="rgba(131, 56, 236, 0.15)" />
          <polygon points="230,390 295,410 255,475" stroke="#FF007F" strokeWidth="1.5" fill="rgba(255, 0, 127, 0.1)" />
          
          <polygon points="115,310 150,300 125,410" stroke="#00F2FE" strokeWidth="1.5" fill="rgba(0, 242, 254, 0.09)" />
          <polygon points="125,410 145,410 160,490" stroke="#8338EC" strokeWidth="1.5" fill="rgba(131, 56, 236, 0.12)" />
          <polygon points="145,410 195,450 160,490" stroke="#00F2FE" strokeWidth="1.5" fill="rgba(0, 242, 254, 0.1)" />
          <polygon points="195,450 255,475 220,530" stroke="#FF007F" strokeWidth="1.5" fill="rgba(255, 0, 127, 0.12)" />

          {/* Wrist to Forearm / Energy Currents */}
          <path
            d="M 160 490 C 150 540 140 590 130 640"
            stroke="url(#neonCyanGlow)"
            strokeWidth="3.5"
          />
          <path
            d="M 190 510 C 185 555 180 600 175 645"
            stroke="url(#cyanToPink)"
            strokeWidth="3"
          />
          <path
            d="M 220 530 C 225 570 230 610 235 650"
            stroke="url(#magentaSynapse)"
            strokeWidth="3.5"
          />
          <path
            d="M 255 475 C 270 530 285 585 300 640"
            stroke="#FF007F"
            strokeWidth="2.5"
          />

          {/* Interconnected Synapse Particle Nodes */}
          <circle cx="120" cy="180" r="3.5" fill="#00F2FE" />
          <circle cx="180" cy="225" r="3.5" fill="#FFFFFF" />
          <circle cx="225" cy="275" r="3.5" fill="#00F2FE" />
          <circle cx="270" cy="335" r="3.5" fill="#FF007F" />
          <circle cx="150" cy="300" r="3.5" fill="#FFFFFF" />
          <circle cx="190" cy="340" r="4.5" fill="#00F2FE" />
          <circle cx="230" cy="390" r="4" fill="#FF007F" />
          <circle cx="295" cy="410" r="3.5" fill="#00F2FE" />
          <circle cx="125" cy="410" r="3.5" fill="#8338EC" />
          <circle cx="145" cy="410" r="3.5" fill="#FFFFFF" />
          <circle cx="195" cy="450" r="4" fill="#00F2FE" />
          <circle cx="255" cy="475" r="3.5" fill="#FF007F" />
          <circle cx="160" cy="490" r="3.5" fill="#00F2FE" />
          <circle cx="220" cy="530" r="3.5" fill="#FFFFFF" />
        </g>

        {/* Ambient Glowing Energy Light Filaments */}
        <path
          d="M 100 220 Q 200 160 236 46 Q 280 180 380 165"
          stroke="#00F2FE"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          opacity="0.75"
        />
        <path
          d="M 40 222 Q 150 280 316 97 Q 350 250 430 245"
          stroke="#FF007F"
          strokeWidth="0.8"
          strokeDasharray="6 4"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};
