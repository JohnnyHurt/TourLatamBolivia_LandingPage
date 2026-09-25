import React from 'react';
import { EventSettingsDTO } from '@tourlatam/types';

interface HeroProps {
  settings: EventSettingsDTO | null;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[640px] max-h-[1080px] flex items-center pt-20 overflow-hidden bg-dark-900 geometric-facet-bg select-none"
    >
      {/* Polygonal Facet Geometric Mesh Backdrop */}
      <div className="poly-facets-pattern" />

      {/* Ambient Glow Lights — matching poster */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[500px] bg-brand-purple/25 blur-[150px] rounded-full" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-magenta/12 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cyan/12 blur-[130px] rounded-full" />
      </div>

      {/* ─── CYBER HAND — absolutely positioned on the RIGHT, exactly like the poster ─── */}
      <div
        className="absolute right-0 top-0 h-full pointer-events-none flex items-center justify-end"
        style={{ width: '50%', zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Soft glow aura behind the hand */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 60% 45%, rgba(0,242,254,0.10) 0%, rgba(121,40,202,0.06) 40%, transparent 70%)',
          }}
        />
        <img
          src="/Cyber_Hand_transparente.png"
          alt="Cyber Hand Tour Latam 2026"
          className="w-full h-full object-contain object-right select-none"
          style={{
            filter:
              'drop-shadow(0 0 45px rgba(0,242,254,0.38)) drop-shadow(0 0 90px rgba(121,40,202,0.28))',
          }}
          draggable={false}
        />
      </div>

      {/* ─── CONTENT — z-10 so it renders above the hand ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Left column stops at ~52% to let the hand dominate the right */}
        <div className="w-full lg:max-w-[58%] xl:max-w-[54%] flex flex-col justify-center text-left">
          {/* "Tour" — white, Barlow Standard Bold (Title Case) */}
          <div
            className="font-sans font-extrabold text-white leading-none select-none tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5.4rem)' }}
          >
            Tour
          </div>

          {/* "LATAM" — Barlow Standard Black 900, huge gradient Cyan → Violet → Magenta */}
          <div
            className="font-sans font-black uppercase gradient-text-latam select-none tracking-[-0.03em]"
            style={{
              fontSize: 'clamp(5.6rem, 15.5vw, 12rem)',
              lineHeight: 0.88,
              position: 'relative',
              zIndex: 20,
            }}
          >
            LATAM
          </div>

          {/* "Bolivia" — white, Barlow Standard Bold (Title Case) */}
          <div
            className="font-sans font-extrabold text-white leading-none select-none tracking-tight mt-1.5"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5.4rem)' }}
          >
            Bolivia
          </div>

          {/* "2026" — white, Barlow Standard Bold */}
          <div
            className="font-sans font-extrabold text-white leading-none select-none tracking-tight mt-1 mb-8"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 5.4rem)' }}
          >
            2026
          </div>

          {/* ── SUBTITLE: CONGRESO INTERNACIONAL… — 3 lines gradient Cyan to Magenta ── */}
          <h1
            className="font-sans font-extrabold uppercase gradient-text-latam leading-[1.12] select-none tracking-tight"
            style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)' }}
          >
            CONGRESO INTERNACIONAL<br />
            DE DIRECCIÓN<br />
            DE PROYECTOS
          </h1>
        </div>
      </div>
    </section>
  );
};
