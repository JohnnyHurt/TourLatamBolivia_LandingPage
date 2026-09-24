import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { PmiBoliviaLogo } from '../../components/common/PmiBoliviaLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@tourlatam.org');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      login(res.token, res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error de autenticación. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-cyan selection:text-dark-950">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[400px] h-[400px] bg-brand-cyan/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-dark-800/90 backdrop-blur-2xl border border-dark-600 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <PmiBoliviaLogo size="sm" />
          </div>
          <h1 className="text-2xl font-black text-white">
            Tour <span className="gradient-text-latam">LATAM</span> 2026
          </h1>
          <p className="text-xs font-bold text-brand-cyan mt-1 uppercase tracking-wider">
            Backoffice CMS • PMI Bolivia
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 p-3.5 rounded-2xl bg-dark-900 border border-dark-600 text-xs text-slate-300 space-y-1">
          <div className="font-black text-brand-cyan uppercase tracking-wider text-[10px]">Credenciales de Demostración:</div>
          <div><span className="font-bold text-white">ADMIN:</span> admin@tourlatam.org / Admin123!</div>
          <div><span className="font-bold text-white">EDITOR:</span> editor@tourlatam.org / Editor123!</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-900 border border-dark-600 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                placeholder="usuario@tourlatam.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-900 border border-dark-600 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-glow-cyan flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Iniciando sesión...</span>
            ) : (
              <>
                <span>INGRESAR AL SISTEMA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
