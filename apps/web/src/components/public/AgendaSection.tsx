import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Sparkles, Video, Construction, Bell, CheckCircle2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { AgendaItemDTO, SpeakerDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';
import { downloadAgendaExcel, downloadAgendaPdf } from '../../utils/agendaExport';

interface AgendaSectionProps {
  items: AgendaItemDTO[];
  speakers?: SpeakerDTO[];
  sectionConfig?: any;
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({ items, speakers = [], sectionConfig }) => {
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
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

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
      case 'BREAK':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getChannelBadge = (channel?: string) => {
    const ch = (channel || 'Canal A').trim();
    if (ch === 'Canal B') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Canal B</span>
        </span>
      );
    }
    if (ch === 'Ambos Canales') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Ambos Canales</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
        <span>Canal A</span>
      </span>
    );
  };

  const getItemSpeakers = (item: AgendaItemDTO): SpeakerDTO[] => {
    if (item.speakers && item.speakers.length > 0) {
      return item.speakers;
    }
    const list: SpeakerDTO[] = [];
    if (item.speaker) list.push(item.speaker);
    if (item.coSpeaker) list.push(item.coSpeaker);

    if (
      item.description &&
      (item.description.includes('Emilse Kasem') || item.description.includes('Emilse')) &&
      !list.some((s) => s.slug === 'emilse-kasem')
    ) {
      const emilse = speakers.find((s) => s.slug === 'emilse-kasem');
      if (emilse) {
        list.push(emilse);
      }
    }
    return list;
  };

  // Group sessions by schedule blocks / time slots for the selected date
  const timeSlotGroups = useMemo(() => {
    const dayItems = items
      .filter((it) => it.date.split('T')[0] === selectedDate)
      .sort((a, b) => {
        const timeDiff = a.startTime.localeCompare(b.startTime);
        if (timeDiff !== 0) return timeDiff;
        const chA = (a.channel || 'Canal A').trim();
        const chB = (b.channel || 'Canal B').trim();
        if (chA === 'Canal A' && chB !== 'Canal A') return -1;
        if (chB === 'Canal A' && chA !== 'Canal A') return 1;
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });

    // If viewing a specific channel (Canal A or Canal B):
    if (selectedChannel !== 'all') {
      const filtered = dayItems.filter((it) => {
        const ch = (it.channel || 'Canal A').trim();
        return ch === selectedChannel || ch === 'Ambos Canales';
      });

      return filtered.map((item) => ({
        key: `${item.id}`,
        startTime: item.startTime,
        endTime: item.endTime,
        isParallel: false,
        canalA: undefined,
        canalB: undefined,
        ambos: undefined,
        singleItem: item,
        otherSessions: [] as AgendaItemDTO[],
      }));
    }

    // Default "Ambos Canales en Paralelo" view:
    // Group by unique time slot `${startTime} - ${endTime}`
    const map = new Map<
      string,
      {
        key: string;
        startTime: string;
        endTime: string;
        canalA?: AgendaItemDTO;
        canalB?: AgendaItemDTO;
        ambos?: AgendaItemDTO;
        singleItem?: AgendaItemDTO;
        otherSessions: AgendaItemDTO[];
      }
    >();

    dayItems.forEach((it) => {
      const timeKey = `${it.startTime} - ${it.endTime}`;
      if (!map.has(timeKey)) {
        map.set(timeKey, {
          key: timeKey,
          startTime: it.startTime,
          endTime: it.endTime,
          otherSessions: [],
        });
      }
      const slot = map.get(timeKey)!;
      const ch = (it.channel || 'Canal A').trim();

      if (ch === 'Canal A' && !slot.canalA) {
        slot.canalA = it;
      } else if (ch === 'Canal B' && !slot.canalB) {
        slot.canalB = it;
      } else if (ch === 'Ambos Canales' && !slot.ambos) {
        slot.ambos = it;
      } else {
        slot.otherSessions.push(it);
      }
    });

    return Array.from(map.values()).map((slot) => {
      const isParallel = Boolean(slot.canalA && slot.canalB);
      if (!isParallel && !slot.ambos) {
        slot.singleItem = slot.canalA || slot.canalB || slot.otherSessions[0];
      }
      return {
        ...slot,
        isParallel,
      };
    });
  }, [items, selectedDate, selectedChannel]);

  const renderParallelCard = (item: AgendaItemDTO, channelLabel: 'Canal A' | 'Canal B') => {
    const isCanalA = channelLabel === 'Canal A';

    return (
      <div
        key={item.id}
        className={`glass-card rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between h-full relative overflow-hidden group ${
          isCanalA
            ? 'border-brand-cyan/30 hover:border-brand-cyan/80 bg-gradient-to-b from-dark-800/95 to-dark-850/95 hover:shadow-[0_0_30px_rgba(0,242,254,0.18)]'
            : 'border-purple-500/30 hover:border-purple-400/80 bg-gradient-to-b from-dark-800/95 to-dark-850/95 hover:shadow-[0_0_30px_rgba(168,85,247,0.22)]'
        }`}
      >
        <div
          className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isCanalA
              ? 'bg-brand-cyan/10 group-hover:bg-brand-cyan/20'
              : 'bg-purple-500/10 group-hover:bg-purple-500/20'
          }`}
        />

        <div className="relative z-10">
          {/* Header Row: Channel Tag & Type Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                isCanalA
                  ? 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40 shadow-glow-cyan'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCanalA ? 'bg-brand-cyan animate-pulse' : 'bg-purple-400 animate-pulse'
                }`}
              />
              <span>{isCanalA ? 'Canal A' : 'Canal B'}</span>
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getTypeBadgeStyle(
                item.type
              )}`}
            >
              {item.type}
            </span>
          </div>

          {/* Room / Pilar Name */}
          {item.room && (
            <div className="flex items-center gap-1.5 text-xs text-brand-magenta font-semibold mb-2.5">
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{item.room}</span>
            </div>
          )}

          {/* Session Title */}
          <h3 className="text-base sm:text-lg font-black text-white mb-2 leading-snug group-hover:text-brand-cyan transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4 line-clamp-3">
              {item.description}
            </p>
          )}
        </div>

        {/* Speaker Footer */}
        {(() => {
          const sessionSpeakers = getItemSpeakers(item);
          if (sessionSpeakers.length === 0) return null;

          return (
            <div className="pt-3 mt-4 border-t border-slate-700/60 relative z-10 space-y-2.5">
              {sessionSpeakers.map((sp) => (
                <div key={sp.slug || sp.id} className="flex items-center gap-3">
                  <img
                    src={getMediaUrl(sp.photo)}
                    alt={sp.name}
                    className={`w-9 h-9 rounded-full object-cover object-top border shrink-0 ${
                      isCanalA
                        ? 'border-brand-cyan/50 shadow-glow-cyan'
                        : 'border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    }`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/speakers/${sp.slug}`}
                      className="text-xs font-bold text-slate-200 hover:text-brand-cyan flex items-center gap-1 group-hover/link:underline"
                    >
                      <span className="truncate">{sp.name}</span>
                      <ChevronRight className="w-3 h-3 text-brand-cyan shrink-0" />
                    </Link>
                    <span className="text-[10px] text-slate-400 block font-medium truncate">
                      {sp.position} • {sp.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    );
  };

  const renderFullWidthCard = (item: AgendaItemDTO) => {
    const isAmbos = (item.channel || 'Canal A') === 'Ambos Canales';
    const isBreak =
      item.type === 'BREAK' ||
      item.type === 'NETWORKING' ||
      item.title.toLowerCase().includes('receso') ||
      item.title.toLowerCase().includes('almuerzo');

    return (
      <div
        key={item.id}
        className={`glass-card rounded-2xl p-6 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group ${
          isBreak
            ? 'border-emerald-500/30 hover:border-emerald-400/60 bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]'
            : isAmbos
            ? 'border-amber-500/30 hover:border-amber-400/60 bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)]'
            : 'border-dark-600 hover:border-brand-cyan/50 bg-dark-800/80'
        }`}
      >
        {/* Left Column: Time & Room */}
        <div className="md:w-52 shrink-0">
          <div className="flex items-center gap-2 text-brand-cyan font-black text-lg">
            <Clock className="w-5 h-5 text-brand-cyan" />
            <span>
              {item.startTime} - {item.endTime}
            </span>
          </div>
          {item.room && (
            <div className="flex items-center gap-1.5 text-xs text-brand-magenta mt-1 font-semibold">
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>{item.room}</span>
            </div>
          )}
        </div>

        {/* Middle Column: Badges, Title & Speaker */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${getTypeBadgeStyle(
                item.type
              )}`}
            >
              {item.type}
            </span>

            {/* Channel Badge */}
            {getChannelBadge(item.channel)}
          </div>

          <h3 className="text-lg font-black text-white mb-2 leading-snug group-hover:text-brand-cyan transition-colors">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-3">
              {item.description}
            </p>
          )}

          {/* Speaker Footer */}
          {(() => {
            const sessionSpeakers = getItemSpeakers(item);
            if (sessionSpeakers.length === 0) return null;

            return (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {sessionSpeakers.map((sp) => (
                  <div key={sp.slug || sp.id} className="flex items-center gap-3">
                    <img
                      src={getMediaUrl(sp.photo)}
                      alt={sp.name}
                      className="w-9 h-9 rounded-full object-cover object-top border border-brand-cyan/40 shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                      }}
                    />
                    <div>
                      <Link
                        to={`/speakers/${sp.slug}`}
                        className="text-xs font-bold text-slate-200 hover:text-brand-cyan flex items-center gap-1"
                      >
                        <span>{sp.name}</span>
                        <ChevronRight className="w-3 h-3 text-brand-cyan shrink-0" />
                      </Link>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {sp.position} • {sp.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    );
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

          {!isUnderConstruction && items.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => downloadAgendaPdf(items, speakers)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-brand-cyan text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-glow-cyan group"
                title="Descargar el programa oficial completo en formato PDF imprimible"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Descargar Programa (PDF)</span>
                <Download className="w-3.5 h-3.5 opacity-80 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => downloadAgendaExcel(items, speakers)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] group"
                title="Descargar el cronograma comparativo por jornadas en archivo Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descargar en Excel (.xlsx)</span>
                <Download className="w-3.5 h-3.5 text-emerald-400 opacity-80 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
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
                  <div className="text-xs font-bold text-white">20 PDUs</div>
                  <div className="text-[11px] text-slate-400">Créditos certificados</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-dark-850/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">100% Virtual</div>
                  <div className="text-[11px] text-slate-400">Transmisión en Vivo: Airmeet</div>
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
                      className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-3 uppercase tracking-wider ${selectedDate === dateStr
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

            {/* Parallel Channels Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setSelectedChannel('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  selectedChannel === 'all'
                    ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                    : 'bg-dark-900/70 text-slate-400 hover:text-white border border-dark-700'
                }`}
              >
                Ambos Canales en Paralelo
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('Canal A')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  selectedChannel === 'Canal A'
                    ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/50 shadow-glow-cyan'
                    : 'bg-dark-900/70 text-slate-400 hover:text-brand-cyan border border-dark-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                <span>Canal A</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('Canal B')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  selectedChannel === 'Canal B'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-dark-900/70 text-slate-400 hover:text-purple-300 border border-dark-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Canal B</span>
              </button>
            </div>

            {/* Track Column Legend (Desktop, when in parallel mode) */}
            {selectedChannel === 'all' && (
              <div className="hidden md:grid grid-cols-2 gap-4 lg:gap-6 mb-6 max-w-6xl mx-auto px-1">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-cyan/15 via-brand-cyan/5 to-transparent border border-brand-cyan/30 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-brand-cyan">
                      Canal A • Track Principal
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transmisión 1</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border border-purple-500/30 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                      Canal B • Track Paralelo
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transmisión 2</span>
                </div>
              </div>
            )}

            {/* Sessions List */}
            <div className="space-y-6 max-w-6xl mx-auto">
              {timeSlotGroups.length > 0 ? (
                timeSlotGroups.map((slot) => {
                  if (slot.isParallel) {
                    return (
                      <div key={slot.key} className="space-y-3">
                        {/* Time Slot Divider Header */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs font-black text-brand-cyan shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>{slot.startTime} — {slot.endTime}</span>
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-slate-800 via-slate-700/50 to-transparent" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                            <span>2 Sesiones en Paralelo</span>
                          </span>
                        </div>

                        {/* 2-Column Side-by-Side Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                          {slot.canalA && renderParallelCard(slot.canalA, 'Canal A')}
                          {slot.canalB && renderParallelCard(slot.canalB, 'Canal B')}
                          {slot.otherSessions.map((it) =>
                            renderParallelCard(it, ((it.channel as any) || 'Canal A'))
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Single / Plenary / Break Session
                  const singleItem =
                    slot.ambos || slot.canalA || slot.canalB || slot.singleItem || slot.otherSessions[0];
                  if (!singleItem) return null;

                  return (
                    <div key={slot.key} className="space-y-2">
                      {renderFullWidthCard(singleItem)}
                    </div>
                  );
                })
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
