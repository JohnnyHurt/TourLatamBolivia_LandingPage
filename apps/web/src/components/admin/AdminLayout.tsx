import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  Ticket,
  Clock,
  Layers,
  Image as ImageIcon,
  UserCheck,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PmiBoliviaLogo } from '../common/PmiBoliviaLogo';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Event Settings', path: '/admin/event', icon: Settings },
    { label: 'Page Builder', path: '/admin/pages', icon: Layers },
    { label: 'Speakers', path: '/admin/speakers', icon: Users },
    { label: 'Sponsors', path: '/admin/sponsors', icon: Award },
    { label: 'Agenda Program', path: '/admin/agenda', icon: Clock },
    { label: 'Tickets / Pricing', path: '/admin/tickets', icon: Ticket },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
  ];

  if (isAdmin) {
    navItems.push(
      { label: 'User Management', path: '/admin/users', icon: UserCheck },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert }
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex selection:bg-brand-cyan selection:text-dark-950">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-dark-600 shrink-0">
        <div className="p-6 border-b border-dark-600 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-purple to-brand-magenta p-[1.5px] shadow-glow-cyan">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta text-sm">
              TL
            </div>
          </div>
          <div>
            <div className="font-black text-sm text-white leading-tight">Backoffice CMS</div>
            <div className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider">
              Tour LATAM 2026
            </div>
          </div>
        </div>

        {/* User Info Capsule */}
        <div className="p-3.5 mx-4 my-4 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-between">
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{user?.name}</div>
            <span className="inline-block text-[10px] font-black text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-magenta hover:bg-dark-800 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 shadow-glow-cyan font-black'
                    : 'text-slate-300 hover:text-white hover:bg-dark-750'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Link to Public Site */}
        <div className="p-4 border-t border-dark-600">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-900 border border-dark-600 text-xs font-bold text-slate-300 hover:text-white hover:border-brand-cyan/40 transition-colors"
          >
            <span>Ver Landing Pública</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-dark-800/90 backdrop-blur-xl border-b border-dark-600 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>Gestión de Contenidos & Evento</span>
              <span className="text-[10px] text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded-full uppercase">PMI Bolivia</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Ver sitio en vivo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
