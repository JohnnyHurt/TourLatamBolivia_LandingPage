import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MediaDTO } from '@tourlatam/types';
import { Upload, Search, Trash2, Copy, Check, Image as ImageIcon, FileText } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaDTO[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      const data = await api.getMedia();
      setMediaList(data);
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await api.uploadMedia(formData);
      setMediaList([res, ...mediaList]);
    } catch (err: any) {
      alert(err.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (confirm(`¿Eliminar el archivo "${filename}"?`)) {
      try {
        await api.deleteMedia(id);
        setMediaList(mediaList.filter((m) => m.id !== id));
      } catch (err: any) {
        alert(err.message || 'Error al eliminar');
      }
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Media Library</h2>
          <p className="text-xs text-slate-400">
            Gestor de archivos multimedia (Imágenes, documentos, vectores).
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Subiendo...' : 'SUBIR NUEVO ARCHIVO'}</span>
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de archivo..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-cyan"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((m) => {
          const isImage = m.mimeType.startsWith('image/');

          return (
            <div
              key={m.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-700/80 group flex flex-col justify-between"
            >
              <div className="h-32 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                {isImage ? (
                  <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-10 h-10 text-slate-500" />
                )}
                <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(m.url, m.id)}
                    className="p-2 rounded-lg bg-dark-900 text-brand-cyan hover:bg-slate-800"
                    title="Copiar URL"
                  >
                    {copiedId === m.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.filename)}
                    className="p-2 rounded-lg bg-dark-900 text-red-400 hover:bg-red-500/20"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-dark-800 text-[11px]">
                <div className="font-bold text-white truncate" title={m.filename}>
                  {m.filename}
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5">
                  {(m.size / 1024).toFixed(1)} KB • {m.mimeType.split('/')[1]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
