import React from 'react';
import { ShieldCheck, Award, Globe, Rocket, CheckCircle2, Video } from 'lucide-react';
import { EventSettingsDTO } from '@tourlatam/types';
import { PmiBoliviaLogo } from '../common/PmiBoliviaLogo';

interface AboutProps {
  settings: EventSettingsDTO | null;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

  return (
    <section id="about" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Radiant Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-brand-purple/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-cyan/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>{settings?.organizerName || 'PMI Bolivia Chapter'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              {settings?.aboutTitle || 'El Encuentro Internacional de Dirección de Proyectos'}
            </h2>

            <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-purple-300 to-brand-magenta font-bold mb-6">
              {settings?.aboutSubtitle ||
                'Impulsando la transformación digital, agilidad estratégica e inteligencia artificial en Latinoamérica.'}
            </p>

            <div className="text-slate-300 space-y-4 leading-relaxed font-light mb-8 text-base sm:text-lg">
              <p>
                {settings?.aboutDescription ||
                  'TourLatam Bolivia 2026 es el congreso internacional cumbre que congrega a los líderes, directores de proyecto, gestores de PMO y expertos en agilidad e inteligencia artificial más influyentes de la región.'}
              </p>
              <p>
                En esta edición especial 100% virtual interactiva, transmitida en alta definición los días 20 y 21 de Noviembre de 2026, los asistentes accederán a conferencias magistrales, workshops prácticos de IA aplicada a la gestión y espacios de networking estratégico de alto impacto.
              </p>
            </div>

            {/* Key Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl glass-card border border-brand-cyan/30 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-brand-cyan/15 text-brand-cyan">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">24 PDUs Certificados</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Acreditación oficial conforme al Talent Triangle del PMI para renovar tus certificaciones.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-brand-magenta/30 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-brand-magenta/15 text-brand-magenta">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Modalidad Virtual HD</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Transmisión en vivo, chat con ponentes, traducción y acceso bajo demanda por 60 días.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image / Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-dark-600 group">
              <img
                src={settings?.aboutImageUrl || defaultImage}
                alt="TourLatam Stage"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel border-dark-600">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-purple to-brand-magenta flex items-center justify-center text-dark-950 font-black shadow-glow-cyan">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">Tour LATAM Bolivia 2026</h4>
                    <p className="text-xs text-brand-cyan font-semibold">20 y 21 de Noviembre • Virtual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
