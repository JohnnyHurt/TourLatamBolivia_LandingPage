import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SpeakerDTO, EventSettingsDTO } from '@tourlatam/types';
import { api } from '../../services/api';
import { ArrowLeft, Linkedin, Globe, Video, MapPin, Clock, Calendar, Award, Sparkles } from 'lucide-react';
import { Header } from '../../components/public/Header';
import { Footer } from '../../components/public/Footer';
import { getMediaUrl } from '../../utils/media';
import { CountryFlag } from '../../components/common/CountryFlag';

const formatSessionDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const rawDate = dateStr.split('T')[0];
  if (rawDate === '2026-11-20') return 'Viernes 20 de Noviembre';
  if (rawDate === '2026-11-21') return 'Sábado 21 de Noviembre';

  const dateObj = new Date(`${rawDate}T00:00:00.000Z`);
  const formatted = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const SpeakerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [speaker, setSpeaker] = useState<SpeakerDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<EventSettingsDTO | null>(() => {
    try {
      const raw = localStorage.getItem('tourlatam_landing_cache_v1');
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached?.settings) return cached.settings;
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (!settings) {
      api.getEventInfo().then((data) => setSettings(data)).catch(() => {});
    }
  }, [settings]);

  useEffect(() => {
    if (slug) {
      api
        .getSpeakerBySlug(slug)
        .then((data) => {
          setSpeaker(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Speaker not found');
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cargando ponente...</span>
        </div>
      </div>
    );
  }

  if (error || !speaker) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Speaker no encontrado</h2>
        <p className="text-slate-400 mb-6">El ponente solicitado no existe o ha sido desactivado.</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-950 font-bold hover:bg-white"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-brand-cyan selection:text-dark-950">
      <Header settings={settings} />

      <main className="pt-32 pb-24 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-brand-purple/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-brand-cyan/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Link */}
          <Link
            to="/#speakers"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-cyan transition-colors mb-8 uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a la lista de Speakers</span>
          </Link>

          {/* Profile Header Card */}
          <div className="glass-panel rounded-3xl p-8 border border-dark-600 mb-10 shadow-2xl bg-dark-800/90">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Speaker Avatar Image */}
              <div className="md:col-span-4 relative">
                <div className="w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-dark-800 to-dark-950 shadow-xl border border-dark-600 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-24 h-24 rounded-full bg-dark-900 border border-slate-700/80 flex items-center justify-center text-brand-cyan font-black text-3xl shadow-xl">
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
                      className="relative z-10 w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                {speaker.isFeatured && (
                  <span className="absolute top-4 left-4 z-20 px-3.5 py-1 rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-glow-magenta">
                    <Award className="w-3.5 h-3.5" />
                    Keynote Speaker
                  </span>
                )}
              </div>

              {/* Speaker Metadata */}
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 border border-dark-600 text-xs font-bold text-slate-300 mb-3">
                  <CountryFlag country={speaker.country} size="sm" />
                  <span>{speaker.country}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
                  {speaker.name}
                </h1>

                <p className="text-base sm:text-lg font-bold text-brand-cyan mb-1">{speaker.position}</p>
                <p className="text-sm text-slate-400 font-medium mb-6">{speaker.company}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {speaker.specialties?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-dark-900 text-xs font-bold text-brand-cyan border border-brand-cyan/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {speaker.linkedinUrl && (
                    <a
                      href={speaker.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 hover:bg-brand-cyan hover:text-dark-950 text-xs font-black text-white transition-all border border-dark-600 uppercase tracking-wider"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Perfil LinkedIn</span>
                    </a>
                  )}
                  {speaker.websiteUrl && (
                    <a
                      href={speaker.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 hover:bg-dark-700 text-xs font-bold text-slate-200 transition-all border border-dark-600 uppercase tracking-wider"
                    >
                      <Globe className="w-4 h-4 text-brand-cyan" />
                      <span>Sitio Web</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="glass-panel rounded-3xl p-8 border border-dark-600 mb-10 bg-dark-800/80">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              <span>Biografía Profesional</span>
            </h3>
            <div className="text-slate-300 text-base leading-relaxed space-y-4 font-light whitespace-pre-line">
              {speaker.fullBio || speaker.shortBio}
            </div>
          </div>

          {/* Video Embed Section if present */}
          {speaker.videoUrl && speaker.videoUrl.trim() !== '' && (
            <div className="glass-panel rounded-3xl p-8 border border-dark-600 mb-10 bg-dark-800/80">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-magenta" />
                <span>Presentación / Video Destacado</span>
              </h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-dark-600">
                <iframe
                  src={
                    speaker.videoUrl.includes('youtube.com') || speaker.videoUrl.includes('youtu.be')
                      ? speaker.videoUrl
                          .replace('watch?v=', 'embed/')
                          .replace('youtu.be/', 'www.youtube.com/embed/')
                      : speaker.videoUrl.includes('vimeo.com') && !speaker.videoUrl.includes('player.vimeo.com')
                      ? speaker.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
                      : speaker.videoUrl
                  }
                  title={`Video of ${speaker.name}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Sessions list */}
          {speaker.sessions && speaker.sessions.length > 0 && (
            <div className="glass-panel rounded-3xl p-8 border border-dark-600 bg-dark-800/80">
              <h3 className="text-xl font-black text-white mb-6">Sesiones en el Congreso</h3>
              <div className="space-y-4">
                {speaker.sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-5 rounded-2xl bg-dark-900 border border-dark-600 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-brand-cyan/20 text-brand-cyan uppercase tracking-wider">
                          {sess.type}
                        </span>
                        {sess.channel && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              sess.channel === 'Canal B'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                                : sess.channel === 'Ambos Canales'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                : 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sess.channel === 'Canal B'
                                  ? 'bg-purple-400'
                                  : sess.channel === 'Ambos Canales'
                                  ? 'bg-amber-400'
                                  : 'bg-brand-cyan'
                              }`}
                            />
                            <span>{sess.channel}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-white">{sess.title}</h4>
                      {sess.description && (
                        <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                          {sess.description}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right text-xs text-slate-400 shrink-0 flex flex-col sm:items-end gap-1.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-dark-700">
                      {/* Día de la sesión */}
                      {sess.date && (
                        <div className="flex items-center gap-1.5 font-bold text-brand-magenta text-xs">
                          <Calendar className="w-3.5 h-3.5 text-brand-magenta shrink-0" />
                          <span>{formatSessionDate(sess.date)}</span>
                        </div>
                      )}
                      {/* Horario */}
                      <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                        <Clock className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                        <span>
                          {sess.startTime} - {sess.endTime}
                        </span>
                      </div>
                      {/* Sala / Pilar */}
                      {sess.room && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Video className="w-3 h-3 text-brand-magenta shrink-0" />
                          <span>{sess.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
};
