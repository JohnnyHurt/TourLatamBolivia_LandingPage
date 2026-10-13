import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SponsorDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, AlertCircle, Loader2, Award } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

const SPONSORS_CACHE_KEY = 'tourlatam_sponsors_cache';

export const SponsorsListPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorDTO[]>(() => {
    try {
      const cached = localStorage.getItem(SPONSORS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(SPONSORS_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSponsors = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      // includeAll = true to fetch active and inactive sponsors for admin
      const data = await api.getSponsors(true);
      if (Array.isArray(data)) {
        setSponsors(data);
        try {
          localStorage.setItem(SPONSORS_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Error loading sponsors:', err);
      setError(err.message || 'No se pudo sincronizar la lista de patrocinadores desde la base de datos.');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el patrocinador "${name}"?`)) {
      try {
        await api.deleteSponsor(id);
        const updated = sponsors.filter((s) => s.id !== id);
        setSponsors(updated);
        try {
          localStorage.setItem(SPONSORS_CACHE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
      } catch (err: any) {
        alert(err.message || 'Error al eliminar sponsor');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-cyan"></div>
        <p className="text-sm font-medium text-slate-300">Cargando patrocinadores...</p>
        <p className="text-xs text-slate-500">Conectando con la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Sponsors</h2>
          <p className="text-xs text-slate-400">
            Administra a las marcas patrocinadoras y sus niveles de patrocinio.
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
            onClick={loadSponsors}
            disabled={isSyncing}
            title="Refrescar lista desde la base de datos"
            className="p-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
          </button>

          <Link
            to="/admin/sponsors/new"
            className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVO SPONSOR</span>
          </Link>
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
            onClick={loadSponsors}
            className="underline font-bold hover:text-white flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {sponsors.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-700/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No hay patrocinadores registrados</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aún no se han registrado marcas patrocinadoras en la plataforma o no se pudieron cargar.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadSponsors}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar carga</span>
            </button>
            <Link
              to="/admin/sponsors/new"
              className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear patrocinador</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-4 px-6">Logo</th>
                  <th className="py-4 px-6">Empresa</th>
                  <th className="py-4 px-6">Categoría Tier</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-center">Orden</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {sponsors.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-800 p-1 flex items-center justify-center border border-slate-700 relative">
                        <span className="text-xs font-bold text-brand-cyan">
                          {sp.name.slice(0, 2).toUpperCase()}
                        </span>
                        {sp.logo ? (
                          <img
                            src={getMediaUrl(sp.logo)}
                            alt={sp.name}
                            className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{sp.name}</div>
                      {sp.website && (
                        <a
                          href={sp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-cyan hover:underline flex items-center gap-1"
                        >
                          {sp.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-800 text-brand-cyan border border-slate-700">
                        {sp.tier}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          sp.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {sp.isActive ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-300">#{sp.displayOrder}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/admin/sponsors/${sp.id}`}
                        className="p-2 rounded-lg bg-slate-800 text-brand-cyan hover:bg-slate-700 inline-block"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(sp.id, sp.name)}
                        className="p-2 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 inline-block"
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
    </div>
  );
};
