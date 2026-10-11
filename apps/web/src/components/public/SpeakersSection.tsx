import React from 'react';
import { Linkedin, Globe, Video, ArrowUpRight, Award, MapPin, Sparkles } from 'lucide-react';
import { SpeakerDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';

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
                <div className="relative h-72 overflow-hidden bg-dark-950">
                  <img
                    src={getMediaUrl(speaker.photo)}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-95" />

                  {speaker.isFeatured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white text-[10px] font-black tracking-wider uppercase shadow-glow-magenta flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      Keynote Speaker
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-200 bg-dark-950/80 px-3 py-1 rounded-full backdrop-blur-md border border-dark-600">
                      <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                      {speaker.country}
                    </span>
                    {speaker.linkedinUrl && (
                      <a
                        href={speaker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-dark-950/80 text-slate-300 hover:text-brand-cyan hover:bg-dark-800 transition-colors border border-dark-600"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-white group-hover:text-brand-cyan transition-colors mb-1">
                    {speaker.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-cyan mb-1">{speaker.position}</p>
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
      </div>
    </section>
  );
};
