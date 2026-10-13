import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { EventSettingsDTO } from '@tourlatam/types';
import {
  Save,
  CheckCircle2,
  Settings,
  Globe,
  Calendar,
  MapPin,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Loader2,
  Share2,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';

const SETTINGS_CACHE_KEY = 'tourlatam_event_settings_cache';

export const EventSettingsPage: React.FC = () => {
  // Instant Render: Seed initial state from localStorage if available
  const [settings, setSettings] = useState<Partial<EventSettingsDTO>>(() => {
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return {};
  });

  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(SETTINGS_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const data = await api.getEventInfo();
      if (data && typeof data === 'object') {
        setSettings(data);
        try {
          localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore quota error
        }
      }
    } catch (err: any) {
      console.error('Error fetching event settings:', err);
      setError(err.message || 'No se pudo conectar con el servidor para obtener los datos más recientes.');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const getSocialUrl = (platform: string) => {
    return settings.socialLinks?.find((s) => s.platform.toLowerCase() === platform.toLowerCase())?.url || '';
  };

  const handleSocialChange = (platform: string, url: string) => {
    setSettings((prev) => {
      const list = [...(prev.socialLinks || [])];
      const idx = list.findIndex((s) => s.platform.toLowerCase() === platform.toLowerCase());
      if (idx >= 0) {
        list[idx] = { ...list[idx], url };
      } else {
        list.push({ id: '', platform, url, displayOrder: list.length + 1, isActive: true });
      }
      return { ...prev, socialLinks: list };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateEventSettings(settings);
      setSettings(updated);
      try {
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      setToast('Configuración del evento guardada exitosamente.');
      setTimeout(() => setToast(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-cyan"></div>
        <p className="text-sm font-medium text-slate-300">Cargando configuración del evento...</p>
        <p className="text-xs text-slate-500">Conectando con la base de datos...</p>
      </div>
    );
  }

  // If loading failed completely and there are no cached settings
  if (error && Object.keys(settings).length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl glass-panel border border-red-500/30 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">No se pudo cargar la configuración</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-bold text-xs hover:bg-white transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar conexión</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Event Settings</h2>
          <p className="text-xs text-slate-400">
            Administra la información general, fechas, sede, CTAs y códigos de analítica.
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
            onClick={fetchSettings}
            disabled={isSyncing}
            title="Refrescar datos desde la base de datos"
            className="p-2.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refrescar</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Mostrando versión en caché local. {error}</span>
          </div>
          <button
            type="button"
            onClick={fetchSettings}
            className="underline font-bold hover:text-white flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

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

        {/* Social Links Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Share2 className="w-5 h-5 text-brand-cyan" />
            <span>Redes Sociales Oficiales (Footer)</span>
          </h3>

          <p className="text-xs text-slate-400">
            Configura los enlaces a las redes sociales oficiales del congreso. Se mostrarán automáticamente en el pie de página (footer) de la web.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </label>
              <input
                type="url"
                value={getSocialUrl('LinkedIn')}
                onChange={(e) => handleSocialChange('LinkedIn', e.target.value)}
                placeholder="https://www.linkedin.com/company/..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-500" />
                <span>Facebook</span>
              </label>
              <input
                type="url"
                value={getSocialUrl('Facebook')}
                onChange={(e) => handleSocialChange('Facebook', e.target.value)}
                placeholder="https://www.facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </label>
              <input
                type="url"
                value={getSocialUrl('Instagram')}
                onChange={(e) => handleSocialChange('Instagram', e.target.value)}
                placeholder="https://www.instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </label>
              <input
                type="url"
                value={getSocialUrl('YouTube')}
                onChange={(e) => handleSocialChange('YouTube', e.target.value)}
                placeholder="https://www.youtube.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>X (Twitter)</span>
              </label>
              <input
                type="url"
                value={getSocialUrl('X') || getSocialUrl('Twitter')}
                onChange={(e) => handleSocialChange('X', e.target.value)}
                placeholder="https://x.com/..."
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
