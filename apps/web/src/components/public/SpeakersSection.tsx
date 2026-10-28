import React, { useState, useMemo } from 'react';
import { Linkedin, ArrowUpRight, Award, Sparkles, Search, ChevronDown, ChevronUp, Users, CheckCircle2 } from 'lucide-react';
import { SpeakerDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';
import { CountryFlag } from '../common/CountryFlag';
import { CONFIRMED_SPEAKERS_LIST } from '../../data/confirmedSpeakers';

interface SpeakersSectionProps {
  speakers: SpeakerDTO[];
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  // Toggle to show/hide the temporary confirmed speakers roster now that all speakers are uploaded
  const SHOW_CONFIRMED_ROSTER = false;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate unique countries and counts from confirmed list
  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CONFIRMED_SPEAKERS_LIST.forEach((s) => {
      counts[s.country] = (counts[s.country] || 0) + 1;
    });
    return counts;
  }, []);

  const uniqueCountries = useMemo(() => {
    return Object.keys(countryCounts).sort((a, b) => a.localeCompare(b, 'es'));
  }, [countryCounts]);

  // Filter speakers based on search term and country filter, sorted alphabetically by country and name
  const filteredConfirmedSpeakers = useMemo(() => {
    const list = CONFIRMED_SPEAKERS_LIST.filter((speaker) => {
      const matchesCountry =
        selectedCountry === 'all' || speaker.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchesSearch =
        searchTerm.trim() === '' ||
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        speaker.country.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchesCountry && matchesSearch;
    });

    return list.sort((a, b) => {
      const countryCompare = a.country.localeCompare(b.country, 'es');
      if (countryCompare !== 0) return countryCompare;
      return a.name.localeCompare(b.name, 'es');
    });
  }, [searchTerm, selectedCountry]);

  // Show a subset if not expanded and no active filter/search
  const hasFilterActive = searchTerm.trim() !== '' || selectedCountry !== 'all';
  const displayedSpeakers = hasFilterActive || isExpanded
    ? filteredConfirmedSpeakers
    : filteredConfirmedSpeakers.slice(0, 16);

  return (
    <section id="speakers" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-magenta/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-brand-cyan/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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

        {/* Separate Keynote from Non-Keynote Speakers */}
        {(() => {
          const keynoteSpeakers = (speakers || []).filter((s) => s.isFeatured);
          // Non-keynote speakers: sorted 1st by Country (A-Z), then by Name (A-Z)
          const nonKeynoteSpeakers = (speakers || [])
            .filter((s) => !s.isFeatured)
            .slice()
            .sort((a, b) => {
              const countryCompare = (a.country || '')
                .trim()
                .localeCompare((b.country || '').trim(), 'es', { sensitivity: 'base' });
              if (countryCompare !== 0) return countryCompare;
              return (a.name || '')
                .trim()
                .localeCompare((b.name || '').trim(), 'es', { sensitivity: 'base' });
            });

          return (
            <>
              {/* Featured Keynote Speakers Cards Grid (2x2 centered) */}
              {keynoteSpeakers.length > 0 && (
                <div
                  className={`grid gap-8 mb-20 mx-auto justify-center ${
                    keynoteSpeakers.length === 4 || keynoteSpeakers.length === 2
                      ? 'grid-cols-1 md:grid-cols-2 max-w-5xl'
                      : keynoteSpeakers.length === 1
                      ? 'grid-cols-1 max-w-md'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl'
                  }`}
                >
                  {keynoteSpeakers.map((speaker) => (
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
                              className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-95 pointer-events-none" />

                          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white text-[10px] font-black tracking-wider uppercase shadow-glow-magenta flex items-center gap-1.5">
                            <Award className="w-3 h-3" />
                            Keynote Speaker
                          </div>

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
              )}

              {/* ── Non-Keynote Speakers Section (Simpler card, smaller photo, 3 in a row) ── */}
              {nonKeynoteSpeakers.length > 0 && (
                <div className={SHOW_CONFIRMED_ROSTER ? "mb-20" : "mb-6"}>
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-widest mb-3">
                      <Users className="w-3.5 h-3.5" />
                      <span>SPEAKERS & CONFERENCISTAS</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                      Especialistas y Líderes de la Región
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light">
                      Profesionales destacados que liderarán workshops, conferencias y paneles temáticos en TourLatam Bolivia 2026.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {nonKeynoteSpeakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border border-dark-600/80 hover:border-brand-cyan/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div>
                          {/* Compact Photo (h-56 sm:h-64 with object-top for natural portrait framing) */}
                          <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-b from-dark-800 to-dark-950 flex items-center justify-center">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                              <div className="w-14 h-14 rounded-full bg-dark-900 border border-slate-700/80 flex items-center justify-center text-brand-cyan font-black text-lg shadow-lg">
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
                                className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : null}
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90 pointer-events-none" />

                            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-white">
                              {speaker.country && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-200 bg-dark-950/85 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-dark-600 shadow-md">
                                  <CountryFlag country={speaker.country} size="xs" />
                                  <span>{speaker.country}</span>
                                </span>
                              )}
                              {speaker.linkedinUrl && (
                                <a
                                  href={speaker.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-full bg-dark-950/85 text-slate-300 hover:text-brand-cyan hover:bg-dark-800 transition-colors border border-dark-600 shadow-md"
                                  title="LinkedIn"
                                >
                                  <Linkedin className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-5">
                            <p className="text-[11px] font-bold text-brand-cyan truncate mb-1" title={speaker.position}>
                              {speaker.position}
                            </p>
                            <h4 className="text-base sm:text-lg font-black text-white group-hover:text-brand-cyan transition-colors mb-1 leading-snug">
                              {speaker.name}
                            </h4>
                            {speaker.company && (
                              <p className="text-xs text-slate-400 font-medium truncate mb-2">
                                {speaker.company}
                              </p>
                            )}
                            {speaker.shortBio && (
                              <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-2 mb-3">
                                {speaker.shortBio}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                          <Link
                            to={`/speakers/${speaker.slug}`}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-dark-800/90 hover:bg-brand-cyan hover:text-dark-950 text-xs font-black text-slate-200 transition-all uppercase tracking-wider group-hover:shadow-glow-cyan"
                          >
                            <span>Ver perfil</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* ─── CONFIRMED SPEAKERS ROSTER (Ongoing upload stage) ─── */}
        {SHOW_CONFIRMED_ROSTER && (
          <>
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-brand-cyan/25 bg-gradient-to-b from-dark-850/90 to-dark-900/90 shadow-2xl relative overflow-hidden">
          {/* Decorative ambient gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/15 blur-[100px] rounded-full pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-dark-600/70 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-wider mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Lineup en Expansión • {CONFIRMED_SPEAKERS_LIST.length} Ponentes Confirmados</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Lista de Ponentes Confirmados
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light leading-relaxed">
                Mientras completamos sus biografías, fotos oficiales y agendas de conferencias en la plataforma, te presentamos a los profesionales confirmados de toda Latinoamérica y el mundo:
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ponente o país..."
                className="w-full bg-dark-950/80 border border-dark-600/90 focus:border-brand-cyan rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Country Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-8 relative z-10">
            <button
              type="button"
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan'
                  : 'bg-dark-800/80 text-slate-300 hover:bg-dark-750 hover:text-white border border-dark-600/60'
              }`}
            >
              <span>Todos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedCountry === 'all' ? 'bg-dark-950/20 text-dark-950' : 'bg-dark-900 text-slate-400'
              }`}>
                {CONFIRMED_SPEAKERS_LIST.length}
              </span>
            </button>

            {uniqueCountries.map((country) => {
              const isSelected = selectedCountry.toLowerCase() === country.toLowerCase();
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => setSelectedCountry(isSelected ? 'all' : country)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-cyan text-dark-950 shadow-glow-cyan'
                      : 'bg-dark-800/80 text-slate-300 hover:bg-dark-750 hover:text-white border border-dark-600/60'
                  }`}
                >
                  <CountryFlag country={country} size="xs" />
                  <span>{country}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-dark-950/20 text-dark-950' : 'bg-dark-900 text-slate-400'
                  }`}>
                    {countryCounts[country]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirmed Speakers Grid */}
          {displayedSpeakers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 relative z-10">
              {displayedSpeakers.map((speaker) => {
                // Check if this speaker already exists in loaded CMS speakers with full detail
                const matchingLoadedSpeaker = (speakers || []).find(
                  (s) => s.name.trim().toLowerCase() === speaker.name.trim().toLowerCase()
                );

                const CardContent = (
                  <div className="w-full flex items-center justify-between gap-3 min-h-[52px]">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Photo or Initials Avatar */}
                      {matchingLoadedSpeaker?.photo ? (
                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-brand-cyan/40 shrink-0 shadow-md relative bg-dark-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <img
                            src={getMediaUrl(matchingLoadedSpeaker.photo)}
                            alt={speaker.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/30 border border-brand-cyan/30 flex items-center justify-center text-xs font-black text-brand-cyan shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          {speaker.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4
                          title={speaker.name}
                          className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug break-words"
                        >
                          {speaker.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CountryFlag country={speaker.country} size="xs" />
                          <span className="text-[11px] text-slate-400 font-medium">
                            {speaker.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {matchingLoadedSpeaker ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                          <span>Ver perfil</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0"
                          title="Ponente Confirmado"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Confirmado</span>
                        </span>
                      )}
                    </div>
                  </div>
                );

                return matchingLoadedSpeaker ? (
                  <Link
                    key={speaker.name}
                    to={`/speakers/${matchingLoadedSpeaker.slug}`}
                    className="glass-card rounded-2xl p-3.5 sm:p-4 border border-dark-600/80 hover:border-brand-cyan/60 bg-dark-850/80 hover:bg-dark-800 transition-all duration-200 group flex items-center shadow-md hover:shadow-[0_4px_20px_rgba(0,242,254,0.12)] cursor-pointer h-full"
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div
                    key={speaker.name}
                    className="glass-card rounded-2xl p-3.5 sm:p-4 border border-dark-600/80 hover:border-brand-cyan/40 bg-dark-850/80 hover:bg-dark-800/90 transition-all duration-200 group flex items-center shadow-md h-full"
                  >
                    {CardContent}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 relative z-10 bg-dark-900/50 rounded-2xl border border-dark-700/60">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">
                No se encontraron ponentes confirmados que coincidan con &ldquo;{searchTerm}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('all');
                }}
                className="mt-3 text-xs font-bold text-brand-cyan hover:underline cursor-pointer"
              >
                Limpiar búsqueda y filtros
              </button>
            </div>
          )}

          {/* Show More / Show Less Toggle (when no active search/filter) */}
          {!hasFilterActive && filteredConfirmedSpeakers.length > 16 && (
            <div className="mt-8 text-center relative z-10 pt-4 border-t border-dark-700/60">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-dark-800 hover:bg-dark-750 text-xs font-bold text-brand-cyan border border-brand-cyan/30 hover:border-brand-cyan/60 transition-all hover:scale-105 cursor-pointer shadow-lg"
              >
                {isExpanded ? (
                  <>
                    <span>Mostrar menos</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Ver los {filteredConfirmedSpeakers.length} ponentes confirmados</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Notice: Ongoing speaker lineup updates callout */}
        <div className="mt-12 max-w-3xl mx-auto">
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
                Estamos en pleno proceso de confirmación e incorporación de nuevos ponentes internacionales para el congreso. Sus biografías detalladas, conferencias y horarios se irán publicando progresivamente. <span className="text-white font-bold">¡Mantente atento a las próximas actualizaciones!</span>
              </p>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
    </section>
  );
};

