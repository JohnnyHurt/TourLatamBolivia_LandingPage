import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { FAQDTO } from '@tourlatam/types';
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const FAQS_CACHE_KEY = 'tourlatam_faqs_cache';

export const FAQsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQDTO[]>(() => {
    try {
      const cached = localStorage.getItem(FAQS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(FAQS_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQDTO> | null>(null);
  const [saving, setSaving] = useState(false);

  const loadFaqs = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      // includeAll = true to fetch active and inactive FAQs for admin
      const data = await api.getFAQs(true);
      if (Array.isArray(data)) {
        setFaqs(data);
        try {
          localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Error loading FAQs:', err);
      setError(err.message || 'No se pudieron sincronizar las preguntas frecuentes desde la base de datos.');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const handleDelete = async (id: string, question: string) => {
    if (confirm(`¿Estás seguro de eliminar la pregunta "${question}"?`)) {
      try {
        await api.deleteFAQ(id);
        const updated = faqs.filter((f) => f.id !== id);
        setFaqs(updated);
        try {
          localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        setToast('Pregunta frecuente eliminada exitosamente.');
        setTimeout(() => setToast(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Error al eliminar FAQ');
      }
    }
  };

  const handleToggleVisibility = async (faq: FAQDTO) => {
    const updatedStatus = !faq.isActive;
    try {
      const updated = await api.updateFAQ(faq.id, { isActive: updatedStatus });
      const newFaqs = faqs.map((f) => (f.id === faq.id ? { ...f, isActive: updated.isActive } : f));
      setFaqs(newFaqs);
      try {
        localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(newFaqs));
      } catch {
        // ignore
      }
      setToast(
        updatedStatus
          ? `"${faq.question.slice(0, 30)}..." ahora es visible en la Landing Page.`
          : `"${faq.question.slice(0, 30)}..." ahora está oculta para el público.`
      );
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al cambiar visibilidad');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question?.trim() || !editingFaq.answer?.trim()) {
      alert('La pregunta y la respuesta son obligatorias.');
      return;
    }

    setSaving(true);
    try {
      if (editingFaq.id) {
        const updated = await api.updateFAQ(editingFaq.id, {
          question: editingFaq.question,
          answer: editingFaq.answer,
          displayOrder: Number(editingFaq.displayOrder || 0),
          isActive: editingFaq.isActive ?? true,
        });
        setFaqs((prev) => {
          const next = prev.map((f) => (f.id === updated.id ? updated : f));
          try {
            localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
        setToast('Pregunta frecuente actualizada exitosamente.');
      } else {
        const created = await api.createFAQ({
          question: editingFaq.question,
          answer: editingFaq.answer,
          displayOrder: Number(editingFaq.displayOrder ?? faqs.length + 1),
          isActive: editingFaq.isActive ?? true,
        });
        setFaqs((prev) => {
          const next = [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder);
          try {
            localStorage.setItem(FAQS_CACHE_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
        setToast('Nueva pregunta frecuente agregada exitosamente.');
      }
      setEditingFaq(null);
      setTimeout(() => setToast(null), 3000);
      loadFaqs();
    } catch (err: any) {
      alert(err.message || 'Error al guardar FAQ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-cyan"></div>
        <p className="text-sm font-medium text-slate-300">Cargando preguntas frecuentes...</p>
        <p className="text-xs text-slate-500">Conectando con la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gestión de Preguntas Frecuentes (FAQ)</h2>
          <p className="text-xs text-slate-400">
            Administra las dudas habituales de los participantes, su orden y visibilidad en la Landing Page.
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
            onClick={loadFaqs}
            disabled={isSyncing}
            title="Refrescar desde la base de datos"
            className="p-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
          </button>

          <button
            onClick={() =>
              setEditingFaq({
                question: '',
                answer: '',
                displayOrder: faqs.length + 1,
                isActive: true,
              })
            }
            className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVA PREGUNTA</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Mostrando datos locales. {error}</span>
          </div>
          <button
            type="button"
            onClick={loadFaqs}
            className="underline font-bold hover:text-white flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* FAQs List or Empty State */}
      {faqs.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-700/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No hay preguntas frecuentes registradas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aún no se han redactado preguntas frecuentes para el evento o no se pudieron cargar.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={loadFaqs}
              className="px-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar carga</span>
            </button>
            <button
              onClick={() =>
                setEditingFaq({
                  question: '',
                  answer: '',
                  displayOrder: 1,
                  isActive: true,
                })
              }
              className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear primera pregunta</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  faq.isActive ? 'border-slate-700/80 bg-dark-800/80' : 'border-slate-800 bg-dark-900/60 opacity-60'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info & Order */}
                  <div
                    className="flex-1 cursor-pointer flex items-start gap-3.5"
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span className="w-7 h-7 rounded-lg bg-dark-900 border border-slate-700 text-brand-cyan font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      #{faq.displayOrder}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-brand-cyan shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            faq.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {faq.isActive ? 'VISIBLE EN LANDING' : 'OCULTA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(faq)}
                      title={faq.isActive ? 'Ocultar pregunta del público' : 'Hacer visible en la Landing'}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        faq.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-dark-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="hidden md:inline">{faq.isActive ? 'Visible' : 'Oculta'}</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditingFaq(faq)}
                      className="p-2 rounded-xl bg-dark-900 border border-slate-700 text-brand-cyan hover:bg-slate-700 transition-colors"
                      title="Editar pregunta"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id, faq.question)}
                      className="p-2 rounded-xl bg-dark-900 border border-slate-700 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-700/60 bg-dark-900/40 text-slate-300 text-xs leading-relaxed">
                    <p className="font-light whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-dark-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingFaq.id ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pregunta *</label>
                <input
                  type="text"
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="¿El evento entregará certificación oficial?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:border-brand-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Respuesta *</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Sí, al finalizar el congreso se emitirá un certificado oficial emitido por el PMI Bolivia Chapter acreditando 20 PDUs..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white focus:border-brand-cyan leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Orden de Visualización</label>
                  <input
                    type="number"
                    value={editingFaq.displayOrder ?? 0}
                    onChange={(e) => setEditingFaq({ ...editingFaq, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Estado de Visibilidad</label>
                  <select
                    value={editingFaq.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                  >
                    <option value="true">Visible en la Landing</option>
                    <option value="false">Oculta (Borrador)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-black hover:bg-white transition-all shadow-md flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? 'Guardando...' : 'GUARDAR PREGUNTA'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
