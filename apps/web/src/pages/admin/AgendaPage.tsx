import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { AgendaItemDTO, SpeakerDTO, AgendaType } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Clock, Calendar, MapPin, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

const AGENDA_CACHE_KEY = 'tourlatam_agenda_cache';
const SPEAKERS_CACHE_KEY = 'tourlatam_agenda_speakers_cache';

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

  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(AGENDA_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<AgendaItemDTO> | null>(null);

  const loadData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      // includeAll = true to fetch active and inactive sessions for admin
      const [agRes, spRes] = await Promise.all([api.getAgenda(true), api.getSpeakers(true)]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Agenda Oficial</h2>
          <p className="text-xs text-slate-400">
            Administra los horarios, ponencias, salas y ponentes asociados.
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
            onClick={() =>
              setEditingItem({
                date: '2026-11-20T00:00:00.000Z',
                startTime: '09:00',
                endTime: '10:00',
                title: '',
                type: 'KEYNOTE',
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
                  displayOrder: 1,
                  isActive: true,
                })
              }
              className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear primera sesión</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-4 px-6">Horario & Día</th>
                  <th className="py-4 px-6">Título Sesión</th>
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Speaker Asignado</th>
                  <th className="py-4 px-6">Sala</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {items.map((it) => (
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
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(it.id, it.title)}
                        className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sala / Auditorio</label>
                <input
                  type="text"
                  value={editingItem.room || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, room: e.target.value })}
                  placeholder="Auditorio Principal A"
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
