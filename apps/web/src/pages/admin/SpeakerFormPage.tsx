import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SpeakerDTO } from '@tourlatam/types';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';

export const SpeakerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<SpeakerDTO>>({
    name: '',
    position: '',
    company: '',
    country: '',
    photo: '',
    shortBio: '',
    fullBio: '',
    specialties: [],
    linkedinUrl: '',
    websiteUrl: '',
    videoUrl: '',
    isFeatured: false,
    displayOrder: 0,
    isActive: true,
  });

  const [specialtiesText, setSpecialtiesText] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      api.getSpeakers().then((list) => {
        const found = list.find((s) => s.id === id);
        if (found) {
          setForm(found);
          setSpecialtiesText(found.specialties ? found.specialties.join(', ') : '');
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await api.uploadMedia(formData);
      setForm((prev) => ({ ...prev, photo: res.url }));
    } catch (err: any) {
      alert(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const specsArray = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      specialties: specsArray,
    };

    try {
      if (isEdit && id) {
        await api.updateSpeaker(id, payload);
      } else {
        await api.createSpeaker(payload);
      }
      navigate('/admin/speakers');
    } catch (err: any) {
      alert(err.message || 'Error al guardar speaker');
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
          to="/admin/speakers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Speakers</span>
        </Link>
        <h2 className="text-xl font-black text-white">
          {isEdit ? 'Editar Speaker' : 'Crear Nuevo Speaker'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo *</label>
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
              <label className="block text-xs font-bold text-slate-300 mb-1">Cargo / Posición *</label>
              <input
                type="text"
                name="position"
                value={form.position || ''}
                onChange={handleChange}
                placeholder="Global Head of AI"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Empresa / Institución *</label>
              <input
                type="text"
                name="company"
                value={form.company || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">País *</label>
              <input
                type="text"
                name="country"
                value={form.country || ''}
                onChange={handleChange}
                placeholder="Bolivia"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
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

            {/* Photo Uploader */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Fotografía del Speaker *</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  {form.photo ? (
                    <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    name="photo"
                    value={form.photo || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs"
                    required
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-brand-cyan hover:bg-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Subiendo...' : 'Subir archivo de foto'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Bios */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Breve Resumen (Short Bio) *</label>
              <textarea
                name="shortBio"
                rows={2}
                value={form.shortBio || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Biografía Completa *</label>
              <textarea
                name="fullBio"
                rows={4}
                value={form.fullBio || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
                required
              />
            </div>

            {/* Specialties */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Especialidades (separadas por coma)
              </label>
              <input
                type="text"
                value={specialtiesText}
                onChange={(e) => setSpecialtiesText(e.target.value)}
                placeholder="AI & GenAI, PMO Strategy, Agile at Scale"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            {/* URLs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Perfil LinkedIn</label>
              <input
                type="url"
                name="linkedinUrl"
                value={form.linkedinUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Video Destacado (YouTube/Vimeo)</label>
              <input
                type="url"
                name="videoUrl"
                value={form.videoUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={Boolean(form.isFeatured)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-dark-900 border-slate-700 text-brand-cyan focus:ring-0"
                />
                <span>Keynote Speaker Destacado</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={Boolean(form.isActive)}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-dark-900 border-slate-700 text-brand-cyan focus:ring-0"
                />
                <span>Speaker Activo en Landing</span>
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
            <span>{saving ? 'Guardando...' : 'GUARDAR SPEAKER'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
