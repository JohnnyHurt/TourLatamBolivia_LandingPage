import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Sparkles, Video, Construction, Bell, CheckCircle2 } from 'lucide-react';
import { AgendaItemDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';

interface AgendaSectionProps {
  items: AgendaItemDTO[];
  sectionConfig?: any;
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({ items, sectionConfig }) => {
  // Normalize sectionConfig if received as string or double-encoded JSON
  let resolvedConfig: any = sectionConfig;
  if (typeof resolvedConfig === 'string') {
    try {
      resolvedConfig = JSON.parse(resolvedConfig);
      if (typeof resolvedConfig === 'string') {
        resolvedConfig = JSON.parse(resolvedConfig);
      }
    } catch {
      resolvedConfig = null;
    }
  }

  // Fallback to local storage configuration if not present in props
  if (!resolvedConfig || resolvedConfig.isUnderConstruction === undefined) {
    try {
      const stored = localStorage.getItem('tourlatam_agenda_section_config');
      if (stored) {
        resolvedConfig = { ...JSON.parse(stored), ...resolvedConfig };
      }
    } catch {
      // ignore
    }
  }

  // Under construction unless explicitly published (isUnderConstruction === false)
  const isUnderConstruction =
    resolvedConfig?.isUnderConstruction !== undefined
      ? Boolean(resolvedConfig.isUnderConstruction)
      : true;

  const noticeTitle = resolvedConfig?.noticeTitle || 'Agenda Oficial en Proceso de Confirmación';
  const noticeMessage = resolvedConfig?.noticeMessage || 'Estamos ultimando detalles con nuestros ponentes internacionales y organizando los horarios de cada sesión magistral y workshop para brindarte la mejor experiencia formativa. El cronograma completo será publicado muy pronto.';
  const badgeText = resolvedConfig?.badgeText || 'PROGRAMA EN DEFINICIÓN';

  // Extract unique dates or fallback to 20 & 21 Nov 2026
  const extractedDates = Array.from(
    new Set(items.map((it) => it.date.split('T')[0]))
  ).sort();

  const uniqueDates = extractedDates.length > 0 ? extractedDates : ['2026-11-20', '2026-11-21'];

  const [selectedDate, setSelectedDate] = useState<string>(uniqueDates[0]);

  const filteredItems = items.filter(
    (it) => it.date.split('T')[0] === selectedDate
  );

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'KEYNOTE':
        return 'bg-brand-magenta/20 text-brand-magenta border-brand-magenta/50 shadow-glow-magenta';
      case 'PANEL':
        return 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/50 shadow-glow-cyan';
      case 'WORKSHOP':
        return 'bg-brand-purple/20 text-purple-300 border-brand-purple/50';
      case 'NETWORKING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <section id="agenda" className="py-24 bg-dark-850 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-brand-purple/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUnderConstruction ? badgeText : 'CRONOGRAMA OFICIAL DEL CONGRESO'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Programa por Jornadas
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            2 días intensivos de Keynotes magistrales, paneles de debate y workshops de IA, Agilidad y PMO.
          </p>
        </div>

        {isUnderConstruction ? (
          /* Under Construction / In Progress Card */
          <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 border border-brand-cyan/30 text-center relative overflow-hidden shadow-2xl bg-gradient-to-b from-dark-800/90 to-dark-900/95">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-brand-magenta/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-6 shadow-glow-cyan animate-pulse">
              <Construction className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
              <Clock className="w-3.5 h-3.5" />
              <span>Próximamente disponible</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
              {noticeTitle}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-light">
              {noticeMessage}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left pt-6 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-dark-850/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">20 & 21 Nov</div>
                  <div className="text-[11px] text-slate-400">Jornadas oficiales</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-dark-850/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-magenta shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">24 PDUs</div>
                  <div className="text-[11px] text-slate-400">Créditos certificados</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-dark-850/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">100% Virtual</div>
                  <div className="text-[11px] text-slate-400">Transmisión HD</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#registro"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-cyan text-dark-950 font-black text-xs hover:bg-white transition-all shadow-glow-cyan uppercase tracking-wider"
              >
                <span>Asegurar mi cupo en Pre-Venta</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Day Tabs */}
            {uniqueDates.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {uniqueDates.map((dateStr, idx) => {
              const d = new Date(dateStr + 'T12:00:00Z');
              const formattedDay = d.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                timeZone: 'UTC',
              });

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-3 uppercase tracking-wider ${
                    selectedDate === dateStr
                      ? 'bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 shadow-glow-cyan scale-105'
                      : 'bg-dark-800 text-slate-300 hover:bg-dark-750 border border-dark-600'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    Jornada 0{idx + 1}: <span className="capitalize">{formattedDay}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-dark-600 hover:border-brand-cyan/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 bg-dark-800/80"
              >
                {/* Left Column: Time & Room */}
                <div className="md:w-48 shrink-0">
                  <div className="flex items-center gap-2 text-brand-cyan font-black text-lg">
                    <Clock className="w-5 h-5" />
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-magenta mt-1 font-semibold">
                    <Video className="w-3.5 h-3.5" />
                    <span>{item.room || 'Transmisión en Vivo'}</span>
                  </div>
                </div>

                {/* Middle Column: Title & Speaker */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${getTypeBadgeStyle(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>

                  {item.description && (
                    <p className="text-xs text-slate-300 font-light leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}

                  {item.speaker && (
                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src={getMediaUrl(item.speaker.photo)}
                        alt={item.speaker.name}
                        className="w-9 h-9 rounded-full object-cover border border-brand-cyan/40"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                        }}
                      />
                      <div>
                        <Link
                          to={`/speakers/${item.speaker.slug}`}
                          className="text-xs font-bold text-slate-200 hover:text-brand-cyan flex items-center gap-1"
                        >
                          {item.speaker.name}
                          <ChevronRight className="w-3 h-3 text-brand-cyan" />
                        </Link>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {item.speaker.position} • {item.speaker.company}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 glass-panel rounded-2xl border border-dark-600 text-slate-400">
              <Clock className="w-8 h-8 text-brand-cyan mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold">Cargando sesiones para esta jornada...</p>
            </div>
          )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
