import React from 'react';
import { Linkedin, Globe, Video, ArrowUpRight, Award, MapPin, Sparkles } from 'lucide-react';
import { SpeakerDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';
import { CountryFlag } from '../common/CountryFlag';

interface SpeakersSectionProps {
  speakers: SpeakerDTO[];
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  return (
    <section id="speakers" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-magenta/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-magenta/10 border border-brand-magenta/30 text-xs font-black text-brand-magenta uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KEYNOTE SPEAKERS INTERNACIONALES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Ponentes de Clase Mundial
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Conoce a los líderes que compartirán su visión sobre PMO, Agilidad e Inteligencia Artificial en TourLatam Bolivia 2026.
          </p>
        </div>

        {/* Speakers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between border border-dark-600 hover:border-brand-cyan/50 transition-all duration-300"
            >
              <div>
                {/* Photo & Featured Badge */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-dark-800 to-dark-950 flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-20 h-20 rounded-full bg-dark-900 border border-slate-700/80 flex items-center justify-center text-brand-cyan font-black text-2xl shadow-xl">
                      {speaker.name
                        .split(' ')
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  </div>
                  {speaker.photo ? (
                    <img
                      src={getMediaUrl(speaker.photo)}
                      alt={speaker.name}
                      className="relative z-10 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-95 pointer-events-none" />

                  {speaker.isFeatured && (
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white text-[10px] font-black tracking-wider uppercase shadow-glow-magenta flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      Keynote Speaker
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 bg-dark-950/85 px-3 py-1 rounded-full backdrop-blur-md border border-dark-600 shadow-lg">
                      <CountryFlag country={speaker.country} size="sm" />
                      <span>{speaker.country}</span>
                    </span>
                    {speaker.linkedinUrl && (
                      <a
                        href={speaker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-dark-950/85 text-slate-300 hover:text-brand-cyan hover:bg-dark-800 transition-colors border border-dark-600 shadow-lg"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-xs font-bold text-brand-cyan">{speaker.position}</p>
                    {speaker.country && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-dark-800/80 px-2.5 py-0.5 rounded-full border border-dark-600/80">
                        <CountryFlag country={speaker.country} size="xs" />
                        <span>{speaker.country}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-brand-cyan transition-colors mb-1">
                    {speaker.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-4">{speaker.company}</p>

                  <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3 mb-4">
                    {speaker.shortBio}
                  </p>

                  {/* Specialty Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {speaker.specialties?.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-dark-800 text-[10px] font-bold text-brand-cyan border border-brand-cyan/20"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link to Profile Page */}
              <div className="px-6 pb-6">
                <Link
                  to={`/speakers/${speaker.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-dark-800 hover:bg-brand-cyan hover:text-dark-950 text-xs font-black text-white transition-all uppercase tracking-wider group-hover:shadow-glow-cyan"
                >
                  <span>VER PERFIL COMPLETO</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Notice: Ongoing speaker lineup updates */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-brand-cyan/30 bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 shadow-[0_0_35px_rgba(0,242,254,0.12)] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-cyan/15 blur-2xl rounded-full pointer-events-none" />

            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-cyan">
                  ACTUALIZACIÓN CONTINUA DE PONENTES
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Estamos en pleno proceso de confirmación e incorporación de nuevos ponentes internacionales para el congreso. <span className="text-white font-bold">¡Mantente atento a las próximas publicaciones y novedades!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
