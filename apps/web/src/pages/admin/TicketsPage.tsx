import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TicketTypeDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, Ticket, CheckCircle2 } from 'lucide-react';

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState<Partial<TicketTypeDTO> | null>(null);

  const loadTickets = async () => {
    try {
      const data = await api.getTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar la tarifa "${name}"?`)) {
      try {
        await api.deleteTicket(id);
        setTickets(tickets.filter((t) => t.id !== id));
      } catch (err: any) {
        alert(err.message || 'Error al eliminar');
      }
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    try {
      if (editingTicket.id) {
        await api.updateTicket(editingTicket.id, editingTicket);
      } else {
        await api.createTicket(editingTicket);
      }
      setEditingTicket(null);
      loadTickets();
    } catch (err: any) {
      alert(err.message || 'Error al guardar tarifa');
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
          <h2 className="text-2xl font-black text-white">Gestión de Precios & Tickets</h2>
          <p className="text-xs text-slate-400">
            Administra las categorías de pases, precios, fechas de vigencia y características.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTicket({
              name: '',
              price: 0,
              originalPrice: undefined,
              currency: 'USD',
              features: ['Acceso a conferencias plenarias', 'Certificado 24 PDUs'],
              isFeatured: false,
              isActive: true,
              displayOrder: tickets.length + 1,
            })
          }
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVA TARIFA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((tk) => (
          <div key={tk.id} className="glass-card rounded-3xl p-6 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-cyan uppercase">{tk.badgeText || 'Pase Oficial'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTicket(tk)}
                    className="p-1.5 rounded bg-slate-800 text-brand-cyan hover:bg-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tk.id, tk.name)}
                    className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{tk.name}</h3>

              <div className="text-3xl font-black text-white mb-4">
                ${tk.price} <span className="text-xs text-slate-400">{tk.currency}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {tk.features.map((f, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Ticket Modal */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingTicket.id ? 'Editar Tarifa' : 'Nueva Tarifa'}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre de Tarifa</label>
                <input
                  type="text"
                  value={editingTicket.name || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Precio Actual (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTicket.price ?? 0}
                    onChange={(e) => setEditingTicket({ ...editingTicket, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Precio Regular / Original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTicket.originalPrice ?? ''}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Badge Promocional</label>
                <input
                  type="text"
                  value={editingTicket.badgeText || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, badgeText: e.target.value })}
                  placeholder="Ej: Early Bird, Más Vendido"
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-bold"
                >
                  Guardar Tarifa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
