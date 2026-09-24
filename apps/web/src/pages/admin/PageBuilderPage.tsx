import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PageSectionDTO } from '@tourlatam/types';
import { Eye, EyeOff, ArrowUp, ArrowDown, Save, Layers, CheckCircle2 } from 'lucide-react';

export const PageBuilderPage: React.FC = () => {
  const [sections, setSections] = useState<PageSectionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.getPageSections().then((data) => {
      setSections(data.sort((a, b) => a.displayOrder - b.displayOrder));
      setLoading(false);
    });
  }, []);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newArr = [...sections];
    const temp = newArr[idx];
    newArr[idx] = newArr[idx - 1];
    newArr[idx - 1] = temp;

    // Recalculate displayOrder
    newArr.forEach((s, i) => (s.displayOrder = i + 1));
    setSections(newArr);
  };

  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const newArr = [...sections];
    const temp = newArr[idx];
    newArr[idx] = newArr[idx + 1];
    newArr[idx + 1] = temp;

    newArr.forEach((s, i) => (s.displayOrder = i + 1));
    setSections(newArr);
  };

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.reorderSections(
        sections.map((s) => ({ id: s.id, displayOrder: s.displayOrder, isVisible: s.isVisible }))
      );
      setToast('Orden y visibilidad de secciones actualizadas.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al guardar secciones');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Landing Page Section Builder</h2>
          <p className="text-xs text-slate-400">
            Reordena o activa/desactiva la visibilidad de las secciones de la página principal.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'GUARDAR CAMBIOS'}</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              sec.isVisible
                ? 'glass-card border-slate-700'
                : 'bg-dark-900/60 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-brand-cyan">
                #{sec.displayOrder}
              </div>

              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{sec.title || sec.sectionType}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {sec.sectionType}
                  </span>
                </h4>
                <p className="text-xs text-slate-400">{sec.subtitle || 'Sección oficial de la Landing'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                title="Mover arriba"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === sections.length - 1}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                title="Mover abajo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleVisibility(sec.id)}
                className={`p-2 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                  sec.isVisible
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
                title="Alternar visibilidad"
              >
                {sec.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{sec.isVisible ? 'Visible' : 'Oculta'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
