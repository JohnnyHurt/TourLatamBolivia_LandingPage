import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UserDTO, Role } from '@tourlatam/types';
import { Plus, UserCheck, ShieldCheck, User } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR' as Role,
  });

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser(form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'EDITOR' });
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Error al crear usuario');
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
          <h2 className="text-2xl font-black text-white">Gestión de Usuarios & RBAC</h2>
          <p className="text-xs text-slate-400">
            Administra los roles administrativos (ADMIN / EDITOR).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-cyan text-dark-900 font-extrabold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO USUARIO</span>
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-4 px-6">Nombre</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Rol RBAC</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Creado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white text-sm">{u.name}</td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                        u.role === 'ADMIN'
                          ? 'bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40'
                          : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      ACTIVO
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-dark-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Crear Nuevo Usuario CMS</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rol de Permisos</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white"
                >
                  <option value="EDITOR">EDITOR (Contenidos & Media)</option>
                  <option value="ADMIN">ADMIN (Acceso Total + Usuarios)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-cyan text-dark-900 font-bold"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
