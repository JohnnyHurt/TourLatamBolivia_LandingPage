import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SponsorDTO, SponsorTier } from '@tourlatam/types';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';

export const SponsorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<SponsorDTO>>({
    name: '',
    logo: '',
    website: '',
    description: '',
    tier: 'SILVER',
    displayOrder: 0,
    isFeatured: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      api.getSponsors().then((list) => {
        const found = list.find((s) => s.id === id);
        if (found) setForm(found);
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await api.uploadMedia(formData);
      setForm((prev) => ({ ...prev, logo: res.url }));
    } catch (err: any) {
      alert(err.message || 'Error al subir el logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && id) {
        await api.updateSponsor(id, form);
      } else {
        await api.createSponsor(form);
      }
      navigate('/admin/sponsors');
    } catch (err: any) {
      alert(err.message || 'Error al guardar sponsor');
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
        <Link
          to="/admin/sponsors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Sponsors</span>
        </Link>
        <h2 className="text-xl font-black text-white">
          {isEdit ? 'Editar Sponsor' : 'Crear Nuevo Sponsor'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de la Empresa *</label>
              <input
                type="text"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Categoría Tier *</label>
              <select
                name="tier"
                value={form.tier || 'SILVER'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              >
                <option value="TITLE">TITLE SPONSOR</option>
                <option value="GOLD">GOLD SPONSOR</option>
                <option value="SILVER">SILVER SPONSOR</option>
                <option value="BRONZE">BRONZE SPONSOR</option>
                <option value="MEDIA_PARTNER">MEDIA PARTNER</option>
                <option value="COMMUNITY_PARTNER">COMMUNITY PARTNER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Orden de Aparición</label>
              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder ?? 0}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Sitio Web Oficial</label>
              <input
                type="url"
                name="website"
                value={form.website || ''}
                onChange={handleChange}
                placeholder="https://empresa.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            {/* Logo Uploader */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Logo Oficial (PNG / SVG / WebP) *</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-slate-800 border border-slate-700 p-2 flex items-center justify-center shrink-0">
                  {form.logo ? (
                    <img src={form.logo} alt="Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    name="logo"
                    value={form.logo || ''}
                    onChange={handleChange}
                    placeholder="URL de imagen"
                    className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs"
                    required
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-brand-cyan hover:bg-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Subiendo...' : 'Subir logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Descripción de la Empresa</label>
              <textarea
                name="description"
                rows={3}
                value={form.description || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={Boolean(form.isActive)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-dark-900 border-slate-700 text-brand-cyan focus:ring-0"
                />
                <span>Sponsor Activo</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-sm hover:bg-white transition-all shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'GUARDAR SPONSOR'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
