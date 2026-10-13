import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { SpeakerDTO, AgendaItemDTO } from '@tourlatam/types';
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Plus,
} from 'lucide-react';
import { getMediaUrl } from '../../utils/media';
import { compressImage } from '../../utils/imageCompressor';

const formatSessionDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const dateObj = dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T00:00:00.000Z`);
  return dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
};

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Speaker sessions state
  const [sessions, setSessions] = useState<AgendaItemDTO[]>([]);
  const [allAgendaItems, setAllAgendaItems] = useState<AgendaItemDTO[]>([]);
  const [updatingSessionId, setUpdatingSessionId] = useState<string | null>(null);
  const [sessionToast, setSessionToast] = useState<string | null>(null);
  const [selectedSessionToAssign, setSelectedSessionToAssign] = useState<string>('');

  const showToast = (msg: string) => {
    setSessionToast(msg);
    setTimeout(() => setSessionToast(null), 3500);
  };

  useEffect(() => {
    if (isEdit && id) {
      Promise.all([
        api.getSpeakerById(id).catch(async () => {
          const list = await api.getSpeakers(true);
          return list.find((s) => s.id === id) || null;
        }),
        api.getAgenda(true).catch(() => []),
      ])
        .then(([speakerData, agendaList]) => {
          if (speakerData) {
            setForm(speakerData);
            setSpecialtiesText(speakerData.specialties ? speakerData.specialties.join(', ') : '');
            if (Array.isArray(speakerData.sessions) && speakerData.sessions.length > 0) {
              setSessions(speakerData.sessions);
            }
          }
          if (Array.isArray(agendaList)) {
            setAllAgendaItems(agendaList);
            const speakerAgendas = agendaList.filter((item) => item.speakerId === id);
            if (speakerAgendas.length > 0) {
              setSessions(speakerAgendas);
            }
          }
        })
        .catch((err) => {
          console.error('Error loading speaker data:', err);
        })
        .finally(() => {
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
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    try {
      // 1. Compress image client-side to lightweight WebP (max 1000x1000, ~50-90KB)
      const { file, dataUrl } = await compressImage(rawFile, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.85,
      });

      // 2. Instantly set preview and durable Data URL in form state
      setPreviewUrl(dataUrl);
      setForm((prev) => ({ ...prev, photo: dataUrl }));

      // 3. Upload to backend media storage
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.uploadMedia(formData);
        if (res && res.url) {
          setForm((prev) => ({ ...prev, photo: res.url }));
        }
      } catch (uploadErr) {
        console.warn('Backend upload notice (using client dataUrl fallback):', uploadErr);
      }
    } catch (err: any) {
      console.error('Error handling photo:', err);
      alert(err.message || 'Error al procesar la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleSessionVisibility = async (session: AgendaItemDTO) => {
    setUpdatingSessionId(session.id);
    const newStatus = !session.isActive;
    try {
      await api.updateAgendaItem(session.id, { isActive: newStatus });
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, isActive: newStatus } : s))
      );
      setAllAgendaItems((prev) =>
        prev.map((s) => (s.id === session.id ? { ...s, isActive: newStatus } : s))
      );
      showToast(newStatus ? 'Sesión configurada como VISIBLE en la web' : 'Sesión configurada como OCULTA');
    } catch (err: any) {
      alert(err.message || 'Error al cambiar visibilidad de la sesión');
    } finally {
      setUpdatingSessionId(null);
    }
  };

  const handleUnlinkSession = async (sessionId: string) => {
    if (!confirm('¿Deseas desvincular esta sesión del speaker?')) return;
    setUpdatingSessionId(sessionId);
    try {
      await api.updateAgendaItem(sessionId, { speakerId: undefined });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setAllAgendaItems((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, speakerId: undefined } : s))
      );
      showToast('Sesión desvinculada del speaker');
    } catch (err: any) {
      alert(err.message || 'Error al desvincular sesión');
    } finally {
      setUpdatingSessionId(null);
    }
  };

  const handleAssignSession = async () => {
    if (!selectedSessionToAssign || !id) return;
    setUpdatingSessionId(selectedSessionToAssign);
    try {
      const updated = await api.updateAgendaItem(selectedSessionToAssign, { speakerId: id });
      const found = allAgendaItems.find((s) => s.id === selectedSessionToAssign);
      const updatedItem = found ? { ...found, speakerId: id } : updated;
      setSessions((prev) => [...prev.filter((s) => s.id !== selectedSessionToAssign), updatedItem]);
      setAllAgendaItems((prev) =>
        prev.map((s) => (s.id === selectedSessionToAssign ? { ...s, speakerId: id } : s))
      );
      setSelectedSessionToAssign('');
      showToast('Sesión asignada al speaker exitosamente');
    } catch (err: any) {
      alert(err.message || 'Error al asignar sesión');
    } finally {
      setUpdatingSessionId(null);
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
      name: (form.name || '').trim(),
      position: (form.position || '').trim(),
      company: (form.company || '').trim(),
      country: (form.country || '').trim(),
      photo: (form.photo || '').trim(),
      shortBio: (form.shortBio || '').trim(),
      fullBio: (form.fullBio || '').trim(),
      specialties: specsArray,
      linkedinUrl: (form.linkedinUrl || '').trim() || null,
      websiteUrl: (form.websiteUrl || '').trim() || null,
      videoUrl: (form.videoUrl || '').trim() || null,
      isFeatured: Boolean(form.isFeatured),
      displayOrder: Number(form.displayOrder ?? 0),
      isActive: form.isActive !== undefined ? Boolean(form.isActive) : true,
    };

    try {
      let savedSpeaker: SpeakerDTO;
      if (isEdit && id) {
        savedSpeaker = await api.updateSpeaker(id, payload);
      } else {
        savedSpeaker = await api.createSpeaker(payload);
      }

      // Synchronize landing cache if present
      try {
        const raw = localStorage.getItem('tourlatam_landing_cache_v1');
        if (raw) {
          const cacheData = JSON.parse(raw);
          if (Array.isArray(cacheData.speakers)) {
            cacheData.speakers = isEdit
              ? cacheData.speakers.map((s: any) => (s.id === id ? { ...s, ...savedSpeaker } : s))
              : [...cacheData.speakers, savedSpeaker];
            localStorage.setItem('tourlatam_landing_cache_v1', JSON.stringify(cacheData));
          }
        }
      } catch {
        // ignore
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
                  {previewUrl || form.photo ? (
                    <img
                      src={previewUrl || getMediaUrl(form.photo)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="photo"
                    value={form.photo || ''}
                    onChange={handleChange}
                    placeholder="/uploads/... o https://..."
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">Video Destacado (YouTube/Vimeo)</label>
                {form.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, videoUrl: '' }))}
                    className="text-[11px] text-red-400 hover:text-red-300 underline font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Quitar video</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                name="videoUrl"
                value={form.videoUrl || ''}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=... (opcional)"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-brand-cyan"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Deja este campo vacío para que no se muestre ningún video en el perfil público del speaker.
              </p>
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

        {/* ============================================================== */}
        {/* CONGRESS SESSIONS SECTION (Sesiones del Speaker en el Congreso) */}
        {/* ============================================================== */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white">Sesiones del Speaker en el Congreso</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700">
                  {sessions.length} {sessions.length === 1 ? 'sesión' : 'sesiones'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configura qué ponencias o talleres imparte este speaker y controla su visibilidad (visibles u ocultas en su perfil y en la agenda).
              </p>
            </div>

            {sessionToast && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{sessionToast}</span>
              </div>
            )}
          </div>

          {!isEdit ? (
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-dashed border-slate-700 text-center space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs text-slate-300 font-bold">Vincular sesiones tras guardar</p>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Una vez guardado el speaker por primera vez, podrás asociar sus ponencias de la agenda y configurar si están visibles u ocultas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-dark-900/60 border border-dashed border-slate-700 text-center space-y-2">
                  <p className="text-xs text-slate-300 font-semibold">
                    Este speaker aún no tiene sesiones asociadas en la agenda.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Puedes vincular una sesión existente utilizando el selector de abajo o crear nuevas en el módulo de Agenda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((sess) => {
                    const isUpdating = updatingSessionId === sess.id;
                    return (
                      <div
                        key={sess.id}
                        className={`p-4 rounded-2xl bg-dark-900/90 border transition-all ${
                          sess.isActive
                            ? 'border-slate-700 hover:border-slate-600'
                            : 'border-slate-800 bg-dark-950/60 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 uppercase tracking-wider">
                                {sess.type}
                              </span>
                              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-brand-cyan" />
                                {formatSessionDate(sess.date)}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {sess.startTime} - {sess.endTime}
                              </span>
                              {sess.room && (
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  {sess.room}
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-white truncate">{sess.title}</h4>

                            {sess.description && (
                              <p className="text-xs text-slate-400 line-clamp-2 font-light">
                                {sess.description}
                              </p>
                            )}
                          </div>

                          {/* Visibility Controls */}
                          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleToggleSessionVisibility(sess)}
                              disabled={isUpdating}
                              title={
                                sess.isActive
                                  ? 'La sesión es visible en la web. Clic para ocultarla.'
                                  : 'La sesión está oculta. Clic para hacerla visible.'
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                                sess.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
                                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
                              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {sess.isActive ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Visible en la web</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Oculta</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUnlinkSession(sess.id)}
                              disabled={isUpdating}
                              title="Desvincular esta sesión de este speaker"
                              className="p-1.5 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                            >
                              <Unlink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Assign existing session from agenda */}
              {allAgendaItems.filter((s) => s.speakerId !== id).length > 0 && (
                <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-brand-cyan" />
                    <span className="text-xs font-bold text-slate-300">
                      Asignar sesión existente de la agenda a este speaker
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <select
                      value={selectedSessionToAssign}
                      onChange={(e) => setSelectedSessionToAssign(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-xs focus:border-brand-cyan"
                    >
                      <option value="">-- Seleccionar sesión de la agenda para asignar --</option>
                      {allAgendaItems
                        .filter((s) => s.speakerId !== id)
                        .map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            [{ag.type}] {formatSessionDate(ag.date)} {ag.startTime} - {ag.title}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAssignSession}
                      disabled={!selectedSessionToAssign || Boolean(updatingSessionId)}
                      className="px-4 py-2 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan hover:text-dark-950 text-xs font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Asignar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
