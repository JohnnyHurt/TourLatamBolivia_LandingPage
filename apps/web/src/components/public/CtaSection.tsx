import React from 'react';
import { ArrowRight, Sparkles, Video, Calendar } from 'lucide-react';
import { EventSettingsDTO } from '@tourlatam/types';

interface CtaSectionProps {
  settings: EventSettingsDTO | null;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ settings }) => {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-16 overflow-hidden bg-gradient-to-r from-brand-purple/40 via-dark-800 to-brand-cyan/25 border border-dark-600 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
          {/* Background poly facets overlay */}
          <div className="poly-facets-pattern opacity-10" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-black text-white mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>{settings?.organizerName || 'PMI Bolivia Chapter'}</span>
            </div>

            <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight mb-4">
              Tour <span className="gradient-text-latam">LATAM</span> Bolivia 2026
            </h2>

            <p className="text-brand-cyan text-sm sm:text-lg font-black uppercase tracking-wider mb-6">
              CONGRESO INTERNACIONAL DE DIRECCIÓN DE PROYECTOS • 20 Y 21 DE NOVIEMBRE
            </p>

            <p className="text-slate-300 text-base sm:text-lg font-light mb-10 leading-relaxed max-w-2xl mx-auto">
              Únete a la comunidad de líderes que están definiendo el futuro de la gestión de proyectos con Inteligencia Artificial, Agilidad y PMOs de alto valor.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={settings?.registrationUrl || '#pricing'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-2xl text-base font-black text-white bg-gradient-to-r from-brand-pmiOrange to-brand-pmiOrangeDark shadow-glow-pmi hover:brightness-110 transition-all transform hover:-translate-y-1 gap-3 uppercase tracking-wider"
              >
                <span>{settings?.primaryCtaText || 'REGÍSTRATE AHORA'}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#agenda"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 rounded-2xl text-base font-bold text-white glass-panel hover:bg-dark-700 transition-all uppercase tracking-wider"
              >
                <span>VER AGENDA COMPLETA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
