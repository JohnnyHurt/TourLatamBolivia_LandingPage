import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SpeakerDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Award, ExternalLink, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';
import { CountryFlag } from '../../components/common/CountryFlag';

export const SpeakersListPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'keynote' | 'regular'>('all');

  const loadSpeakers = async () => {
    try {
      const data = await api.getSpeakers(true);
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

  const filteredSpeakers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return speakers.filter((sp) => {
      // Search matching (name, position, company, country)
      if (term) {
        const nameMatch = sp.name?.toLowerCase().includes(term);
        const positionMatch = sp.position?.toLowerCase().includes(term);
        const companyMatch = sp.company?.toLowerCase().includes(term);
        const countryMatch = sp.country?.toLowerCase().includes(term);
        if (!nameMatch && !positionMatch && !companyMatch && !countryMatch) {
          return false;
        }
      }

      // Type filter (keynote vs regular)
      if (typeFilter === 'keynote' && !sp.isFeatured) return false;
      if (typeFilter === 'regular' && sp.isFeatured) return false;

      return true;
    });
  }, [speakers, searchTerm, typeFilter]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Speakers</h2>
          <p className="text-xs text-slate-400">
            Administra a los conferencistas principales, regulares y su orden de aparición.
          </p>
        </div>

        <Link
          to="/admin/speakers/new"
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO SPEAKER</span>
        </Link>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-dark-800/60 p-4 rounded-2xl border border-slate-700/80">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cargo, empresa o país..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-900 border border-slate-700 focus:border-brand-cyan text-white text-xs placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills and Counter */}
        <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end text-xs">
          <div className="flex items-center bg-dark-900 rounded-xl p-1 border border-slate-700 shadow-sm">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                typeFilter === 'all'
                  ? 'bg-brand-cyan text-dark-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({speakers.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('keynote')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                typeFilter === 'keynote'
                  ? 'bg-brand-cyan text-dark-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Keynotes ({speakers.filter((s) => s.isFeatured).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('regular')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                typeFilter === 'regular'
                  ? 'bg-brand-cyan text-dark-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regulares ({speakers.filter((s) => !s.isFeatured).length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium px-2 py-1">
            Mostrando <strong className="text-white">{filteredSpeakers.length}</strong> de {speakers.length}
          </span>
        </div>
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
              {filteredSpeakers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {speakers.length === 0 ? (
                      'No se encontraron speakers registrados en la base de datos.'
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 text-slate-600 mb-1" />
                        <p className="text-sm text-slate-300 font-medium">
                          No se encontraron speakers que coincidan con los filtros aplicados.
                        </p>
                        <p className="text-xs text-slate-500">
                          Intenta con otro término de búsqueda o limpia los filtros.
                        </p>
                        {(searchTerm || typeFilter !== 'all') && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm('');
                              setTypeFilter('all');
                            }}
                            className="mt-2 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-cyan text-xs font-bold transition-colors border border-slate-700 hover:border-brand-cyan/40"
                          >
                            Limpiar búsqueda y filtros
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSpeakers.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 relative flex items-center justify-center shadow-inner">
                        <span className="text-xs font-bold text-brand-cyan">
                          {sp.name
                            .split(' ')
                            .map((n) => n[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                        {sp.photo ? (
                          <img
                            src={getMediaUrl(sp.photo)}
                            alt={sp.name}
                            className="absolute inset-0 w-full h-full object-cover object-top"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
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
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <CountryFlag country={sp.country} size="xs" />
                        <span>{sp.country}</span>
                      </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
