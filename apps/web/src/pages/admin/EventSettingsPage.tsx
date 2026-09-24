import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { EventSettingsDTO } from '@tourlatam/types';
import { Save, CheckCircle2, Settings, Globe, Calendar, MapPin, Sparkles } from 'lucide-react';

export const EventSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<EventSettingsDTO>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.getEventInfo().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateEventSettings(settings);
      setSettings(updated);
      setToast('Configuración del evento guardada exitosamente.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al guardar la configuración');
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
          <h2 className="text-2xl font-black text-white">Event Settings</h2>
          <p className="text-xs text-slate-400">
            Administra la información general, fechas, sede, CTAs y códigos de analítica.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic General Info Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-brand-cyan" />
            <span>Información General del Congreso</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Nombre del Evento</label>
              <input
                type="text"
                name="eventName"
                value={settings.eventName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Organizador</label>
              <input
                type="text"
                name="organizerName"
                value={settings.organizerName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Eslogan / Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>
          </div>
        </div>

        {/* Date & Location Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-brand-magenta" />
            <span>Fechas, Ubicación y Modalidad</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Fecha Inicio</label>
              <input
                type="datetime-local"
                name="startDate"
                value={settings.startDate ? new Date(settings.startDate).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Fecha Fin</label>
              <input
                type="datetime-local"
                name="endDate"
                value={settings.endDate ? new Date(settings.endDate).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad / País</label>
              <input
                type="text"
                name="city"
                value={settings.city || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Modalidad</label>
              <input
                type="text"
                name="modality"
                value={settings.modality || ''}
                onChange={handleChange}
                placeholder="Presencial / Híbrido / Virtual"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Sede / Venue</label>
              <input
                type="text"
                name="venue"
                value={settings.venue || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>
          </div>
        </div>

        {/* CTAs & Registration Links */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Llamados a la Acción (CTAs) y Registro</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">URL de Registro Principal</label>
              <input
                type="url"
                name="registrationUrl"
                value={settings.registrationUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Texto CTA Principal</label>
              <input
                type="text"
                name="primaryCtaText"
                value={settings.primaryCtaText || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Texto CTA Secundario</label>
              <input
                type="text"
                name="secondaryCtaText"
                value={settings.secondaryCtaText || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Tracking IDs */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Analítica y Marketing Tracking (GA4 / GTM / Meta)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Google Analytics ID</label>
              <input
                type="text"
                name="gaTrackingId"
                value={settings.gaTrackingId || ''}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Google Tag Manager ID</label>
              <input
                type="text"
                name="gtmId"
                value={settings.gtmId || ''}
                onChange={handleChange}
                placeholder="GTM-XXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Meta Pixel ID</label>
              <input
                type="text"
                name="metaPixelId"
                value={settings.metaPixelId || ''}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-sm hover:bg-white transition-all shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'GUARDAR CONFIGURACIÓN'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
