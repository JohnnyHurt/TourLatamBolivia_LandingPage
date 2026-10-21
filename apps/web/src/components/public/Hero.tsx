import React, { useState, useEffect } from 'react';
import { EventSettingsDTO } from '@tourlatam/types';

interface HeroProps {
  settings: EventSettingsDTO | null;
}

// Target Date: November 20, 2026 at 08:00 AM (GMT -4 / Bolivia Time BOT)
const TARGET_DATE_STRING = '2026-11-20T08:00:00-04:00';
const TARGET_TIMESTAMP = new Date(TARGET_DATE_STRING).getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const getTimeRemaining = (): TimeLeft => {
  const diff = TARGET_TIMESTAMP - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
};

export const Hero: React.FC<HeroProps> = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 pb-12 lg:py-20 overflow-hidden bg-dark-900 geometric-facet-bg select-none"
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
        <picture className="w-full h-full flex items-center justify-end">
          <source srcSet="/Cyber_Hand_transparente.webp" type="image/webp" />
          <img
            src="/Cyber_Hand_transparente.png"
            alt="Cyber Hand Tour Latam 2026"
            className="w-full h-full object-contain object-right select-none"
            style={{
              filter:
                'drop-shadow(0 0 45px rgba(0,242,254,0.38)) drop-shadow(0 0 90px rgba(121,40,202,0.28))',
            }}
            draggable={false}
            fetchPriority="high"
            decoding="async"
            width={1024}
            height={1536}
          />
        </picture>
      </div>

      {/* ─── CONTENT — z-10 so it renders above the hand ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Upper Title Block: Tour LATAM Bolivia 2026 — original full scale sizes */}
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
        </div>

        {/* ── LOWER ROW: "Congreso Internacional..." on left + Countdown between it and Cyber Hand ── */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8 xl:gap-12 w-full lg:max-w-[88%] xl:max-w-[82%]">
          {/* ── SUBTITLE: CONGRESO INTERNACIONAL… — 3 lines gradient Cyan to Magenta ── */}
          <h1
            className="font-sans font-extrabold uppercase gradient-text-latam leading-[1.12] select-none tracking-tight shrink-0"
            style={{ fontSize: 'clamp(1.3rem, 2.6vw, 2.2rem)' }}
          >
            CONGRESO INTERNACIONAL<br />
            DE DIRECCIÓN<br />
            DE PROYECTOS
          </h1>

          {/* ── Vertical divider separator on desktop ── */}
          <div
            className="hidden lg:block w-[1.5px] h-20 self-end bg-gradient-to-t from-brand-cyan/50 via-brand-purple/30 to-transparent shrink-0 mb-1"
            aria-hidden="true"
          />

          {/* ── COUNTDOWN TO EVENT: Placed between subtitle and the Cyber Hand ── */}
          <div className="w-full max-w-sm xl:max-w-md shrink-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                {timeLeft.isExpired
                  ? '¡Evento en Curso!'
                  : 'Inicia en • 20 Nov, 08:00 (GMT-4)'}
              </span>
            </div>

            {!timeLeft.isExpired ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {/* Days */}
                <div className="glass-panel relative rounded-xl p-2 sm:p-2.5 text-center border border-brand-purple/40 overflow-hidden group hover:border-brand-cyan/60 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta opacity-80" />
                  <span className="block text-xl sm:text-2xl font-black font-sans tracking-tight text-white tabular-nums drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                    Días
                  </span>
                </div>

                {/* Hours */}
                <div className="glass-panel relative rounded-xl p-2 sm:p-2.5 text-center border border-brand-purple/40 overflow-hidden group hover:border-brand-cyan/60 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta opacity-80" />
                  <span className="block text-xl sm:text-2xl font-black font-sans tracking-tight text-white tabular-nums drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                    Horas
                  </span>
                </div>

                {/* Minutes */}
                <div className="glass-panel relative rounded-xl p-2 sm:p-2.5 text-center border border-brand-purple/40 overflow-hidden group hover:border-brand-cyan/60 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta opacity-80" />
                  <span className="block text-xl sm:text-2xl font-black font-sans tracking-tight text-white tabular-nums drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                    Minutos
                  </span>
                </div>

                {/* Seconds */}
                <div className="glass-panel relative rounded-xl p-2 sm:p-2.5 text-center border border-brand-purple/40 overflow-hidden group hover:border-brand-cyan/60 transition-colors">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta opacity-80" />
                  <span className="block text-xl sm:text-2xl font-black font-sans tracking-tight text-brand-cyan tabular-nums drop-shadow-[0_0_12px_rgba(0,242,254,0.45)]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">
                    Segundos
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-xl p-3 border border-brand-cyan/50 text-center">
                <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  ¡El Congreso Tour LATAM 2026 ha comenzado!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

