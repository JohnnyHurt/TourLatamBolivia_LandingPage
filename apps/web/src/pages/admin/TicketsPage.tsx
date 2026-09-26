import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TicketTypeDTO } from '@tourlatam/types';
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Sparkles, LayoutTemplate, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTicketCardProps {
  tk: TicketTypeDTO;
  onEdit: (tk: TicketTypeDTO) => void;
  onDelete: (id: string, name: string) => void;
}

const SortableTicketCard: React.FC<SortableTicketCardProps> = ({ tk, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tk.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const isVisible = tk.isActive !== false;
  const displayBs = tk.priceBs ?? Math.round(tk.price * 6.96);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
        !isVisible
          ? 'border-amber-500/40 bg-dark-800/80 shadow-md'
          : tk.isFeatured
          ? 'bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 border-2 border-brand-cyan shadow-glow-cyan'
          : 'glass-card border-slate-700/80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mr-1 hover:text-brand-cyan text-slate-500">
              <GripVertical className="w-5 h-5" />
            </div>
            {tk.badgeText ? (
              <span className="text-[10px] font-black text-brand-cyan uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-cyan/10 border border-brand-cyan/20">
                {tk.badgeText}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pase Oficial
              </span>
            )}

            {tk.isFeatured ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 px-2 py-0.5 rounded-full shadow-glow-cyan">
                <Sparkles className="w-2.5 h-2.5" />
                NEÓN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                <LayoutTemplate className="w-2.5 h-2.5" />
                ESTÁNDAR
              </span>
            )}

            {isVisible ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <Eye className="w-3 h-3" />
                VISIBLE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <EyeOff className="w-3 h-3" />
                NO VISIBLE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(tk)}
              className="p-1.5 rounded-lg bg-slate-800 text-brand-cyan hover:bg-slate-700 transition-colors"
              title="Editar tarifa"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(tk.id, tk.name)}
              className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Eliminar tarifa"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{tk.name}</h3>

        {/* Precios: Bs. llamativo y USD secundario */}
        <div className="mb-4 p-3 rounded-2xl bg-dark-900/60 border border-slate-800">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-black text-brand-cyan">Bs.</span>
            <span className="text-3xl font-black text-white">{displayBs}</span>
          </div>
          <div className="text-xs font-medium text-slate-400 mt-0.5">
            o <span className="text-brand-cyan font-bold">${tk.price}</span> USD
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {tk.features?.map((f, i) => (
            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState<Partial<TicketTypeDTO> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTickets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update display order sequentially
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          displayOrder: index,
        }));
        
        // Call API
        api.reorderTickets(
          updatedItems.map((item) => ({ id: item.id, displayOrder: item.displayOrder }))
        ).catch((err) => console.error('Failed to reorder', err));

        return updatedItems;
      });
    }
  };

  const loadTickets = async () => {
    try {
      // Fetch all tickets for CMS management (both active and inactive)
      const data = await api.getAdminTickets().catch(() => api.getTickets(true));
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
      const payload: Partial<TicketTypeDTO> = {
        ...editingTicket,
        priceBs:
          editingTicket.priceBs !== undefined && editingTicket.priceBs !== null
            ? Number(editingTicket.priceBs)
            : null,
        price: Number(editingTicket.price) || 0,
        isFeatured: Boolean(editingTicket.isFeatured),
        isActive: editingTicket.isActive !== false,
      };

      if (editingTicket.id) {
        await api.updateTicket(editingTicket.id, payload);
      } else {
        await api.createTicket(payload);
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
            Administra tarifas en Bolivianos (Bs.) y Dólares (USD), estilo de tarjeta (Neón o Estándar) y visibilidad.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTicket({
              name: '',
              priceBs: 105,
              price: 15,
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SortableContext
            items={tickets.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            {tickets.map((tk) => (
              <SortableTicketCard
                key={tk.id}
                tk={tk}
                onEdit={setEditingTicket}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* Modal Editar / Crear Tarifa */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-800 border border-slate-700/80 rounded-3xl p-6 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto">
            <h3 className="text-xl font-black text-white mb-4">
              {editingTicket.id ? 'Editar Tarifa' : 'Nueva Tarifa'}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre de Tarifa *</label>
                <input
                  type="text"
                  value={editingTicket.name || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, name: e.target.value })}
                  placeholder="Ej: Miembros (Membresía Activa)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 focus:border-brand-cyan text-white font-medium"
                  required
                />
              </div>

              {/* 2 Precios: Bolivianos (llamativo) y Dólares (USD) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/30">
                  <label className="block text-brand-cyan font-black mb-1 flex items-center justify-between">
                    <span>Precio en Bolivianos (Bs.) *</span>
                    <span className="text-[9px] uppercase tracking-wider bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-extrabold">
                      Principal
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-brand-cyan font-black">Bs.</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editingTicket.priceBs ?? ''}
                      onChange={(e) =>
                        setEditingTicket({
                          ...editingTicket,
                          priceBs: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      placeholder="Ej. 105"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-dark-900 border border-brand-cyan/40 focus:border-brand-cyan text-white text-base font-black"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Es el precio más visible en la tarjeta.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-dark-900/60 border border-slate-700">
                  <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                    <span>Precio en Dólares (USD) *</span>
                    <span className="text-[9px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-semibold">
                      Secundario
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingTicket.price ?? 0}
                      onChange={(e) =>
                        setEditingTicket({
                          ...editingTicket,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ej. 15"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-dark-900 border border-slate-700 focus:border-brand-cyan text-white text-base font-bold"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Opción de precio alternativa en USD.
                  </p>
                </div>
              </div>

              {/* Selector de Tipo de Tarjeta (Estilo visual) */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">
                  Tipo / Estilo de Tarjeta
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opción 1: Estándar (como la 1ª tarjeta) */}
                  <button
                    type="button"
                    onClick={() => setEditingTicket({ ...editingTicket, isFeatured: false })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      !editingTicket.isFeatured
                        ? 'bg-dark-900 border-brand-cyan/80 ring-2 ring-brand-cyan/20 shadow-lg'
                        : 'bg-dark-900/50 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs">Estilo Estándar</span>
                      {!editingTicket.isFeatured && (
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5">
                      Fondo oscuro clásico y bordes discretos (como la primera tarjeta).
                    </p>
                    <div className="h-6 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-medium">
                      Borde discreto
                    </div>
                  </button>

                  {/* Opción 2: Destacada Neón (como las 2 de la derecha) */}
                  <button
                    type="button"
                    onClick={() => setEditingTicket({ ...editingTicket, isFeatured: true })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      editingTicket.isFeatured
                        ? 'bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-brand-cyan ring-2 ring-brand-cyan/30 shadow-glow-cyan'
                        : 'bg-dark-900/50 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-brand-cyan text-xs">Destacada (Neón Cyan)</span>
                      {editingTicket.isFeatured && (
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5">
                      Borde cyan brillante con resplandor neón (como las 2 de la derecha).
                    </p>
                    <div className="h-6 rounded-lg bg-dark-900 border-2 border-brand-cyan text-brand-cyan flex items-center justify-center text-[10px] font-black shadow-glow-cyan">
                      Resplandor Neón Cyan
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Badge Promocional</label>
                <input
                  type="text"
                  value={editingTicket.badgeText || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, badgeText: e.target.value })}
                  placeholder="Ej: PRE VENTA, EARLY BIRD, MÁS POPULAR"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 focus:border-brand-cyan text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Beneficios / Características (una por línea)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(editingTicket.features) ? editingTicket.features.join('\n') : ''}
                  onChange={(e) =>
                    setEditingTicket({
                      ...editingTicket,
                      features: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  placeholder="Acceso a conferencias plenarias&#10;Certificado 24 PDUs&#10;Kit oficial del participante"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 focus:border-brand-cyan text-white font-normal"
                />
              </div>

              {/* Visibilidad en la página pública */}
              <div className="p-3.5 rounded-2xl bg-dark-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-white text-xs">
                    Visible en la página pública
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {editingTicket.isActive !== false
                      ? 'La tarjeta se mostrará activamente a los visitantes'
                      : 'La tarjeta estará oculta en la página web pública'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTicket.isActive !== false}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        isActive: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-black hover:bg-brand-cyanLight transition-all shadow-lg shadow-brand-cyan/20"
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
