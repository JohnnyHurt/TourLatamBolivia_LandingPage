import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AgendaItemDTO, SpeakerDTO, AgendaType } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Clock, Calendar, MapPin } from 'lucide-react';

export const AgendaPage: React.FC = () => {
  const [items, setItems] = useState<AgendaItemDTO[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<AgendaItemDTO> | null>(null);

  const loadData = async () => {
    try {
      const [agRes, spRes] = await Promise.all([api.getAgenda(), api.getSpeakers()]);
      setItems(agRes);
      setSpeakers(spRes);
    } catch (err) {
      console.error('Error loading agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`¿Eliminar la sesión "${title}"?`)) {
      try {
        await api.deleteAgendaItem(id);
        setItems(items.filter((i) => i.id !== id));
      } catch (err: any) {
        alert(err.message || 'Error al eliminar');
      }
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await api.updateAgendaItem(editingItem.id, editingItem);
      } else {
        await api.createAgendaItem(editingItem);
      }
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al guardar la sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Agenda Oficial</h2>
          <p className="text-xs text-slate-400">
            Administra los horarios, ponencias, salas y ponentes asociados.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              date: new Date('2026-11-12').toISOString(),
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
                    <div className="text-[11px] text-slate-400">
                      {new Date(it.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
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
                    value={editingItem.date ? new Date(editingItem.date).toISOString().slice(0, 10) : ''}
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
