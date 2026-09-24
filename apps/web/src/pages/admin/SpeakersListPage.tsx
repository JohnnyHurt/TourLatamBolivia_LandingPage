import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SpeakerDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Award, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export const SpeakersListPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSpeakers = async () => {
    try {
      const data = await api.getSpeakers();
      setSpeakers(data);
    } catch (err) {
      console.error('Error loading speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpeakers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar al speaker "${name}"?`)) {
      try {
        await api.deleteSpeaker(id);
        setSpeakers(speakers.filter((s) => s.id !== id));
      } catch (err: any) {
        alert(err.message || 'Error al eliminar speaker');
      }
    }
  };

  const toggleActive = async (speaker: SpeakerDTO) => {
    try {
      const updated = await api.updateSpeaker(speaker.id, { isActive: !speaker.isActive });
      setSpeakers(speakers.map((s) => (s.id === speaker.id ? updated : s)));
    } catch (err: any) {
      alert(err.message || 'Error al actualizar estado');
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
          <h2 className="text-2xl font-black text-white">Gestión de Speakers</h2>
          <p className="text-xs text-slate-400">
            Administra a los conferencistas principales y su orden de aparición.
          </p>
        </div>

        <Link
          to="/admin/speakers/new"
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO SPEAKER</span>
        </Link>
      </div>

      {/* Speakers Table */}
      <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-4 px-6">Foto</th>
                <th className="py-4 px-6">Nombre & Cargo</th>
                <th className="py-4 px-6">Empresa & País</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-center">Orden</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {speakers.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                      <img src={sp.photo} alt={sp.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      {sp.name}
                      {sp.isFeatured && (
                        <span title="Featured Keynote">
                          <Award className="w-3.5 h-3.5 text-brand-magenta" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-brand-cyan">{sp.position}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-200">{sp.company}</div>
                    <div className="text-[11px] text-slate-400">{sp.country}</div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleActive(sp)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        sp.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {sp.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{sp.isActive ? 'ACTIVO' : 'INACTIVO'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-300">#{sp.displayOrder}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/speakers/${sp.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white inline-block"
                      title="Preview public profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/speakers/${sp.id}`}
                      className="p-2 rounded-lg bg-slate-800 text-brand-cyan hover:bg-slate-700 inline-block"
                      title="Edit speaker"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(sp.id, sp.name)}
                      className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 inline-block"
                      title="Delete speaker"
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
    </div>
  );
};
