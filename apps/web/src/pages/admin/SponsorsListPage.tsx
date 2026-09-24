import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SponsorDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export const SponsorsListPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<SponsorDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSponsors = async () => {
    try {
      const data = await api.getSponsors();
      setSponsors(data);
    } catch (err) {
      console.error('Error loading sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el patrocinador "${name}"?`)) {
      try {
        await api.deleteSponsor(id);
        setSponsors(sponsors.filter((s) => s.id !== id));
      } catch (err: any) {
        alert(err.message || 'Error al eliminar sponsor');
      }
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
          <h2 className="text-2xl font-black text-white">Gestión de Sponsors</h2>
          <p className="text-xs text-slate-400">
            Administra a las marcas patrocinadoras y sus niveles de patrocinio.
          </p>
        </div>

        <Link
          to="/admin/sponsors/new"
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO SPONSOR</span>
        </Link>
      </div>

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
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-800 p-1 flex items-center justify-center border border-slate-700">
                      <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
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
    </div>
  );
};
