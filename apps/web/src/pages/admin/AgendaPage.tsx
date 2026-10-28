import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../../services/api';
import { AgendaItemDTO, SpeakerDTO, AgendaType, PageSectionDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Clock, Calendar, MapPin, RefreshCw, AlertCircle, Loader2, Construction, Eye, CheckCircle2, Sliders, Radio, Tv, Search, Filter } from 'lucide-react';

const AGENDA_CACHE_KEY = 'tourlatam_agenda_cache_v2';
const SPEAKERS_CACHE_KEY = 'tourlatam_agenda_speakers_cache_v2';
const AGENDA_SECTION_CACHE_KEY = 'tourlatam_agenda_section_config';

const formatDateLabel = (dateStr?: string) => {
  if (!dateStr) return '';
  const dateObj = dateStr.includes('T')
    ? new Date(dateStr)
    : new Date(`${dateStr}T00:00:00.000Z`);
  return dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
};

interface AgendaSectionConfig {
  isUnderConstruction: boolean;
  noticeTitle: string;
  noticeMessage: string;
  badgeText: string;
}

const DEFAULT_SECTION_CONFIG: AgendaSectionConfig = {
  isUnderConstruction: true,
  noticeTitle: 'Agenda Oficial en Proceso de Confirmación',
  noticeMessage: 'Estamos ultimando detalles con nuestros ponentes internacionales y organizando los horarios de cada sesión magistral y workshop para brindarte la mejor experiencia formativa. El cronograma completo será publicado muy pronto.',
  badgeText: 'PROGRAMA EN DEFINICIÓN',
};

export const AgendaPage: React.FC = () => {
  const [items, setItems] = useState<AgendaItemDTO[]>(() => {
    try {
      const cached = localStorage.getItem(AGENDA_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  });

  const [speakers, setSpeakers] = useState<SpeakerDTO[]>(() => {
    try {
      const cached = localStorage.getItem(SPEAKERS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  });

  const [sectionConfig, setSectionConfig] = useState<AgendaSectionConfig>(() => {
    try {
      const cached = localStorage.getItem(AGENDA_SECTION_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return DEFAULT_SECTION_CONFIG;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(AGENDA_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configToast, setConfigToast] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<AgendaItemDTO> | null>(null);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Counts of sessions per channel
  const channelCounts = useMemo(() => {
    const counts = { all: items.length, 'Canal A': 0, 'Canal B': 0, 'Ambos Canales': 0 };
    items.forEach((it) => {
      const ch = it.channel || 'Canal A';
      if (ch === 'Canal B') counts['Canal B']++;
      else if (ch === 'Ambos Canales') counts['Ambos Canales']++;
      else counts['Canal A']++;
    });
    return counts;
  }, [items]);

  // Filtered sessions based on channel tab and search query
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const itemChannel = it.channel || 'Canal A';
      const matchesChannel =
        selectedChannelFilter === 'all' ||
        itemChannel === selectedChannelFilter ||
        (selectedChannelFilter !== 'all' && itemChannel === 'Ambos Canales');
      const matchesSearch =
        searchQuery.trim() === '' ||
        it.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (it.speaker?.name && it.speaker.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (it.room && it.room.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesChannel && matchesSearch;
    });
  }, [items, selectedChannelFilter, searchQuery]);

  const loadData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      // includeAll = true to fetch active and inactive sessions for admin
      const [agRes, spRes, secRes] = await Promise.all([
        api.getAgenda(true),
        api.getSpeakers(true),
        api.getPageSections(),
      ]);

      if (Array.isArray(agRes)) {
        setItems(agRes);
        try {
          localStorage.setItem(AGENDA_CACHE_KEY, JSON.stringify(agRes));
        } catch {
          // ignore
        }
      }

      if (Array.isArray(spRes)) {
        setSpeakers(spRes);
        try {
          localStorage.setItem(SPEAKERS_CACHE_KEY, JSON.stringify(spRes));
        } catch {
          // ignore
        }
      }

      if (Array.isArray(secRes)) {
        const agendaSec = secRes.find((s) => s.sectionType === 'AGENDA');
        if (agendaSec?.content) {
          const cfg: AgendaSectionConfig = {
            isUnderConstruction: agendaSec.content.isUnderConstruction ?? true,
            noticeTitle: agendaSec.content.noticeTitle || DEFAULT_SECTION_CONFIG.noticeTitle,
            noticeMessage: agendaSec.content.noticeMessage || DEFAULT_SECTION_CONFIG.noticeMessage,
            badgeText: agendaSec.content.badgeText || DEFAULT_SECTION_CONFIG.badgeText,
          };
          setSectionConfig(cfg);
          try {
            localStorage.setItem(AGENDA_SECTION_CACHE_KEY, JSON.stringify(cfg));
          } catch {
            // ignore
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading agenda:', err);
      setError(err.message || 'No se pudo sincronizar la agenda desde la base de datos.');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const syncLandingCacheConfig = (cfg: AgendaSectionConfig) => {
    try {
      localStorage.setItem(AGENDA_SECTION_CACHE_KEY, JSON.stringify(cfg));
      const raw = localStorage.getItem('tourlatam_landing_cache_v1');
      if (raw) {
        const landingData = JSON.parse(raw);
        if (Array.isArray(landingData.sections)) {
          landingData.sections = landingData.sections.map((s: any) =>
            s.sectionType === 'AGENDA' ? { ...s, content: cfg } : s
          );
          localStorage.setItem('tourlatam_landing_cache_v1', JSON.stringify(landingData));
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSaveSectionConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    try {
      await api.updatePageSection('AGENDA', {
        content: sectionConfig,
      });
      syncLandingCacheConfig(sectionConfig);
      setConfigToast(
        sectionConfig.isUnderConstruction
          ? 'Modo "Agenda en Proceso" activado exitosamente.'
          : 'Agenda oficial publicada en la Landing Page.'
      );
      setTimeout(() => setConfigToast(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error al guardar la visibilidad de la agenda');
    } finally {
      setSavingConfig(false);
    }
  };

  const toggleUnderConstructionQuick = async () => {
    const nextState = !sectionConfig.isUnderConstruction;
    const nextConfig = { ...sectionConfig, isUnderConstruction: nextState };
    setSectionConfig(nextConfig);
    setSavingConfig(true);
    try {
      await api.updatePageSection('AGENDA', {
        content: nextConfig,
      });
      syncLandingCacheConfig(nextConfig);
      setConfigToast(
        nextState
          ? 'Modo "Agenda en Proceso" activado. En la landing se mostrará el mensaje en proceso.'
          : '¡Agenda Oficial Activada! En la landing se mostrará el cronograma con sesiones.'
      );
      setTimeout(() => setConfigToast(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar el estado de la agenda');
      setSectionConfig(sectionConfig); // rollback
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`¿Eliminar la sesión "${title}"?`)) {
      try {
        await api.deleteAgendaItem(id);
        const updated = items.filter((i) => i.id !== id);
        setItems(updated);
        try {
          localStorage.setItem(AGENDA_CACHE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      } catch (err: any) {
        alert(err.message || 'Error al eliminar');
      }
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = {
        ...editingItem,
        channel: editingItem.channel || 'Canal A',
        date: editingItem.date
          ? (editingItem.date.includes('T')
              ? editingItem.date
              : `${editingItem.date}T00:00:00.000Z`)
          : new Date().toISOString(),
      };

      if (editingItem.id) {
        await api.updateAgendaItem(editingItem.id, payload);
      } else {
        await api.createAgendaItem(payload);
      }
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al guardar la sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-cyan"></div>
        <p className="text-sm font-medium text-slate-300">Cargando agenda oficial...</p>
        <p className="text-xs text-slate-500">Conectando con la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {configToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{configToast}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Agenda Oficial</h2>
          <p className="text-xs text-slate-400">
            Administra los horarios, ponencias, salas y la visualización pública en la Landing Page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSyncing && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[11px] font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sincronizando con BD...</span>
            </div>
          )}

          <button
            type="button"
            onClick={loadData}
            disabled={isSyncing}
            title="Refrescar agenda desde la base de datos"
            className="p-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-200 hover:text-white hover:border-brand-cyan/50 transition-all text-xs font-bold flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-brand-cyan" />
            <span>Configurar Mensaje</span>
          </button>

          <button
            onClick={() =>
              setEditingItem({
                date: '2026-11-20T00:00:00.000Z',
                startTime: '09:00',
                endTime: '10:00',
                title: '',
                type: 'KEYNOTE',
                channel: selectedChannelFilter !== 'all' ? selectedChannelFilter : 'Canal A',
                room: '',
                displayOrder: items.length + 1,
                isActive: true,
              })
            }
            className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVA SESIÓN</span>
          </button>
        </div>
      </div>

      {/* Agenda Public Visibility Switch Banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        sectionConfig.isUnderConstruction
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              sectionConfig.isUnderConstruction
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {sectionConfig.isUnderConstruction ? (
                <Construction className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Estado en la Landing Page:{' '}
                  <span className={sectionConfig.isUnderConstruction ? 'text-amber-400' : 'text-emerald-400'}>
                    {sectionConfig.isUnderConstruction
                      ? 'Mensaje "Agenda en Proceso" Activo'
                      : 'Agenda Oficial Publicada (Cronograma Completo)'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {sectionConfig.isUnderConstruction
                  ? 'Los visitantes ven una tarjeta destacada informando que la agenda está en definición. Las sesiones que cargues abajo se mantienen privadas hasta que desactives este mensaje.'
                  : 'Los visitantes de la Landing pueden ver el cronograma por jornadas con todas las sesiones activas.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleUnderConstructionQuick}
              disabled={savingConfig}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 ${
                sectionConfig.isUnderConstruction
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-dark-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-dark-950'
              }`}
            >
              {savingConfig ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : sectionConfig.isUnderConstruction ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <Construction className="w-3.5 h-3.5" />
              )}
              <span>
                {savingConfig
                  ? 'Guardando...'
                  : sectionConfig.isUnderConstruction
                  ? 'PUBLICAR AGENDA COMPLETA'
                  : 'MOSTRAR MENSAJE EN PROCESO'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Configuration Details Drawer/Accordion */}
      {showConfigPanel && (
        <form onSubmit={handleSaveSectionConfig} className="glass-panel p-6 rounded-3xl border border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-cyan" />
            <span>Personalizar Mensaje de "Agenda en Proceso"</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Título del Mensaje</label>
              <input
                type="text"
                value={sectionConfig.noticeTitle}
                onChange={(e) => setSectionConfig({ ...sectionConfig, noticeTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Badge Superior</label>
              <input
                type="text"
                value={sectionConfig.badgeText}
                onChange={(e) => setSectionConfig({ ...sectionConfig, badgeText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Descripción / Texto Explicativo</label>
              <textarea
                rows={3}
                value={sectionConfig.noticeMessage}
                onChange={(e) => setSectionConfig({ ...sectionConfig, noticeMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white leading-relaxed"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfigPanel(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold hover:text-white"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={savingConfig}
              className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-950 text-xs font-black hover:bg-white transition-all shadow-md"
            >
              {savingConfig ? 'Guardando...' : 'GUARDAR TEXTOS'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Mostrando datos locales. {error}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="underline font-bold hover:text-white flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-700/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No hay sesiones en la agenda</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aún no se han programado sesiones para el evento o no se pudieron cargar desde el servidor.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar carga</span>
            </button>
            <button
              onClick={() =>
                setEditingItem({
                  date: '2026-11-20T00:00:00.000Z',
                  startTime: '09:00',
                  endTime: '10:00',
                  title: '',
                  type: 'KEYNOTE',
                  channel: 'Canal A',
                  room: '',
                  displayOrder: 1,
                  isActive: true,
                })
              }
              className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear primera sesión</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Channel Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-dark-800/80 border border-slate-700/80">
            {/* Parallel Channel Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-dark-900 p-1.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedChannelFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedChannelFilter === 'all'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Todos ({channelCounts.all})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannelFilter('Canal A')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedChannelFilter === 'Canal A'
                    ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-brand-cyan'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                <span>Canal A ({channelCounts['Canal A']})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannelFilter('Canal B')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedChannelFilter === 'Canal B'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Canal B ({channelCounts['Canal B']})</span>
              </button>

              {channelCounts['Ambos Canales'] > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedChannelFilter('Ambos Canales')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedChannelFilter === 'Ambos Canales'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Ambos ({channelCounts['Ambos Canales']})</span>
                </button>
              )}
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar sesión, speaker o sala..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-dark-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Sessions Table */}
          <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-4 px-6">Horario & Día</th>
                    <th className="py-4 px-6">Título Sesión</th>
                    <th className="py-4 px-6">Canal</th>
                    <th className="py-4 px-6">Tipo</th>
                    <th className="py-4 px-6">Speaker Asignado</th>
                    <th className="py-4 px-6">Sala</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No hay sesiones que coincidan con el filtro seleccionado.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-brand-cyan flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {it.startTime} - {it.endTime}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {formatDateLabel(it.date)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-sm">{it.title}</div>
                        </td>
                        <td className="py-4 px-6">
                          {it.channel === 'Canal B' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              Canal B
                            </span>
                          ) : it.channel === 'Ambos Canales' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Ambos
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                              Canal A
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-brand-magenta border border-slate-700">
                            {it.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-200">
                          {it.speaker?.name || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-slate-400">{it.room || 'Auditorio Principal'}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setEditingItem(it)}
                            className="p-2 rounded-lg bg-slate-800 text-brand-cyan hover:bg-slate-700"
                            title="Editar sesión"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(it.id, it.title)}
                            className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Agenda Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem.id ? 'Editar Sesión' : 'Nueva Sesión de Agenda'}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título de la Sesión *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editingItem.date ? editingItem.date.slice(0, 10) : ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hora Inicio</label>
                  <input
                    type="text"
                    value={editingItem.startTime || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, startTime: e.target.value })}
                    placeholder="09:00"
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hora Fin</label>
                  <input
                    type="text"
                    value={editingItem.endTime || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, endTime: e.target.value })}
                    placeholder="10:30"
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Sesión</label>
                  <select
                    value={editingItem.type || 'KEYNOTE'}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as AgendaType })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="KEYNOTE">KEYNOTE</option>
                    <option value="PANEL">PANEL</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="NETWORKING">NETWORKING</option>
                    <option value="BREAK">BREAK</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Speaker Asignado</label>
                  <select
                    value={editingItem.speakerId || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, speakerId: e.target.value || undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="">-- Sin speaker asignado --</option>
                    {speakers.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.company})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Canal de Transmisión (Paralelo) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-bold">
                    Canal de Transmisión (En Paralelo) *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Transmisión en vivo simultánea
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, channel: 'Canal A' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                      (editingItem.channel || 'Canal A') === 'Canal A'
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,242,254,0.25)] ring-1 ring-brand-cyan/50'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      (editingItem.channel || 'Canal A') === 'Canal A' ? 'bg-brand-cyan animate-pulse' : 'bg-slate-500'
                    }`} />
                    <span>Canal A</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, channel: 'Canal B' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                      editingItem.channel === 'Canal B'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      editingItem.channel === 'Canal B' ? 'bg-purple-400 animate-pulse' : 'bg-slate-500'
                    }`} />
                    <span>Canal B</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, channel: 'Ambos Canales' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                      editingItem.channel === 'Ambos Canales'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      editingItem.channel === 'Ambos Canales' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                    }`} />
                    <span>Ambos Canales</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sala / Auditorio (Nombre específico)</label>
                <input
                  type="text"
                  value={editingItem.room || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, room: e.target.value })}
                  placeholder="Ej: Sala IA & Estrategia, Laboratorio Virtual"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-bold"
                >
                  Guardar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
