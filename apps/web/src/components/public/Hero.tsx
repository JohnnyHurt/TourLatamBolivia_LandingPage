import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { EventSettingsDTO } from '@tourlatam/types';
import { PmiBoliviaLogo } from '../common/PmiBoliviaLogo';

interface HeroProps {
  settings: EventSettingsDTO | null;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-dark-900 geometric-facet-bg"
    >
      {/* Polygonal Facet Geometric Mesh Backdrop */}
      <div className="poly-facets-pattern" />

      {/* Ambient Glow Lights — matching poster */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[500px] bg-brand-purple/25 blur-[150px] rounded-full" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-magenta/12 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cyan/12 blur-[130px] rounded-full" />
      </div>

      {/* ─── CYBER HAND — absolutely positioned on the RIGHT, like the poster ─── */}
      {/* z-index 0 so text (z-10) renders on top and LATAM is never clipped */}
      <div
        className="absolute right-0 top-0 h-full pointer-events-none"
        style={{ width: '52%', zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Soft glow aura behind the hand */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, rgba(0,242,254,0.08) 0%, transparent 70%)',
          }}
        />
        <img
          src="/Cyber_Hand_transparente.png"
          alt=""
          className="w-full h-full object-contain object-right-top select-none"
          style={{
            filter:
              'drop-shadow(0 0 50px rgba(0,242,254,0.4)) drop-shadow(0 0 100px rgba(121,40,202,0.3))',
          }}
          draggable={false}
        />
      </div>

      {/* ─── CONTENT — z-10 so it renders above the hand ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Single column, text naturally stops at ~55% on large screens */}
        <div className="w-full lg:max-w-[58%] xl:max-w-[55%] flex flex-col justify-center text-left">

          {/* Organizer Badge 
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-dark-600 mb-8 text-xs font-bold text-brand-cyan w-fit">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-white font-bold font-condensed tracking-wider uppercase">
              {settings?.organizerName || 'PMI Bolivia Chapter'}
            </span>
            <span className="text-dark-500 mx-1">·</span>
            <span className="text-brand-magenta font-bold font-condensed tracking-wider uppercase">Presenta</span>
          </div>
          */}
          {/* ── MAIN TITLE — faithful to poster hierarchy ── */}
          {/* "Tour" — white, Barlow Condensed Bold */}
          <div
            className="font-condensed font-bold text-white uppercase leading-none select-none"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', letterSpacing: '0.03em' }}
          >
            Tour
          </div>

          {/* "LATAM" — Barlow Condensed Black 900, FULL WIDTH, gradient Cyan→Purple→Magenta */}
          <div
            className="font-condensed font-black uppercase gradient-text-latam select-none"
            style={{
              fontSize: 'clamp(5.5rem, 16vw, 12rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              // Render the gradient text above the hand image
              position: 'relative',
              zIndex: 20,
            }}
          >
            LATAM
          </div>

          {/* "Bolivia" — white, Barlow Condensed Bold */}
          <div
            className="font-condensed font-bold text-white uppercase leading-none select-none mt-1"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', letterSpacing: '0.03em' }}
          >
            Bolivia
          </div>
          {/* "2026" — white, Barlow Condensed Bold */}
          <div
            className="font-condensed font-bold text-white uppercase leading-none select-none mb-8"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', letterSpacing: '0.03em' }}
          >
            2026
          </div>

          {/* ── SUBTITLE: CONGRESO INTERNACIONAL… — gradient, condensed bold ── */}
          <div className="mb-8">
            <h1
              className="font-condensed font-bold uppercase gradient-text-latam leading-tight"
              style={{ fontSize: 'clamp(1.3rem, 3vw, 2.2rem)', letterSpacing: '0.01em' }}
            >
              CONGRESO INTERNACIONAL<br />
              DE DIRECCIÓN<br />
              DE PROYECTOS
            </h1>
          </div>

          {/* ── 3 PILLARS with neon separator lines ── */}
          <div className="mb-8 space-y-0 max-w-sm">
            {[
              { label: 'PMO' },
              { label: 'AGILIDAD' },
              { label: 'IA' },
            ].map(({ label }) => (
              <div key={label} className="py-2">
                <span
                  className="font-condensed font-bold text-white uppercase tracking-widest"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
                >
                  {label}
                </span>
                <div className="neon-line-cyan w-full mt-1" />
              </div>
            ))}
          </div>

          {/* ── DATES & MODALITY ── */}
          <div className="mb-8 space-y-0 max-w-sm">
            {[
              { label: '20 Y 21 DE NOVIEMBRE, 2026' },
              { label: 'MODALIDAD VIRTUAL' },
            ].map(({ label }) => (
              <div key={label} className="py-2">
                <span
                  className="font-condensed font-bold text-white uppercase tracking-widest"
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}
                >
                  {label}
                </span>
                <div className="neon-line-cyan w-full mt-1" />
              </div>
            ))}
          </div>

          {/* ── CTA BUTTONS ── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <a
              href={settings?.registrationUrl || '#pricing'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-condensed font-bold tracking-widest text-white bg-gradient-to-r from-brand-pmiOrange to-brand-pmiOrangeDark shadow-glow-pmi hover:brightness-110 transition-all transform hover:-translate-y-0.5 gap-3 uppercase group"
              style={{ fontSize: '0.95rem' }}
            >
              <span>{settings?.primaryCtaText || 'REGÍSTRATE AHORA'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#agenda"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-condensed font-bold tracking-widest text-white glass-panel hover:border-brand-magenta/60 hover:shadow-glow-magenta transition-all gap-3 uppercase"
              style={{ fontSize: '0.95rem' }}
            >
              <Play className="w-4 h-4 text-brand-magenta fill-brand-magenta" />
              <span>{settings?.secondaryCtaText || 'VER PROGRAMA OFICIAL'}</span>
            </a>
          </div>

          {/* ── PMI BOLIVIA LOGO ── */}
          <div className="pt-6 border-t border-dark-600/60">
            <PmiBoliviaLogo size="md" />
          </div>
        </div>

        {/* PDUs floating badge — positioned relative to content column */}
        <div
          className="absolute bottom-16 right-[8%] p-4 rounded-2xl glass-card border border-brand-cyan/40 shadow-glow-cyan backdrop-blur-xl animate-float hidden lg:block"
          style={{ zIndex: 15 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-brand-cyan font-black font-condensed text-base">
              24
            </div>
            <div>
              <div className="text-xs font-bold text-white font-condensed uppercase tracking-wider">PDUs Oficiales</div>
              <div className="text-[10px] text-brand-cyan font-medium">Acreditación Global PMI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
