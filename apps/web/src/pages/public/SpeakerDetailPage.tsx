import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SpeakerDTO } from '@tourlatam/types';
import { api } from '../../services/api';
import { ArrowLeft, Linkedin, Globe, Video, MapPin, Clock, Award, Sparkles } from 'lucide-react';
import { Header } from '../../components/public/Header';
import { Footer } from '../../components/public/Footer';

export const SpeakerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [speaker, setSpeaker] = useState<SpeakerDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Header settings={null} />

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
                <div className="w-full h-80 rounded-2xl overflow-hidden bg-dark-950 shadow-xl border border-dark-600">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {speaker.isFeatured && (
                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-gradient-to-r from-brand-magenta to-brand-purple text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-glow-magenta">
                    <Award className="w-3.5 h-3.5" />
                    Keynote Speaker
                  </span>
                )}
              </div>

              {/* Speaker Metadata */}
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 border border-dark-600 text-xs font-bold text-slate-300 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
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
          {speaker.videoUrl && (
            <div className="glass-panel rounded-3xl p-8 border border-dark-600 mb-10 bg-dark-800/80">
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-magenta" />
                <span>Presentación / Video Destacado</span>
              </h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-dark-600">
                <iframe
                  src={
                    speaker.videoUrl.includes('youtube.com') || speaker.videoUrl.includes('youtu.be')
                      ? speaker.videoUrl.replace('watch?v=', 'embed/')
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
                  <div key={sess.id} className="p-5 rounded-2xl bg-dark-900 border border-dark-600 flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-brand-cyan/20 text-brand-cyan uppercase tracking-wider mb-2">
                        {sess.type}
                      </span>
                      <h4 className="text-base font-black text-white">{sess.title}</h4>
                      {sess.description && (
                        <p className="text-xs text-slate-400 mt-1 font-light">{sess.description}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-400 shrink-0 ml-4">
                      <div className="flex items-center gap-1 font-bold text-white">
                        <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                        {sess.startTime} - {sess.endTime}
                      </div>
                      {sess.room && <div className="mt-1 text-[11px] text-slate-400">{sess.room}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={null} />
    </div>
  );
};
