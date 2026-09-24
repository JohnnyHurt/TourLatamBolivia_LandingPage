import React, { useEffect, useState } from 'react';
import { Users, Award, Ticket, Clock, Layers, ShieldCheck, ArrowUpRight, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { SpeakerDTO, SponsorDTO, AgendaItemDTO, TicketTypeDTO, AuditLogDTO } from '@tourlatam/types';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>([]);
  const [sponsors, setSponsors] = useState<SponsorDTO[]>([]);
  const [agenda, setAgenda] = useState<AgendaItemDTO[]>([]);
  const [tickets, setTickets] = useState<TicketTypeDTO[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [spData, spoData, agData, tkData] = await Promise.all([
          api.getSpeakers(),
          api.getSponsors(),
          api.getAgenda(),
          api.getTickets(),
        ]);
        setSpeakers(spData);
        setSponsors(spoData);
        setAgenda(agData);
        setTickets(tkData);

        try {
          const logsData = await api.getAuditLogs(1);
          setAuditLogs(logsData.logs.slice(0, 6));
        } catch {
          // Ignored if user role is EDITOR
        }
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-cyan"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Speakers',
      value: speakers.length,
      sub: `${speakers.filter((s) => s.isFeatured).length} Destacados`,
      icon: Users,
      color: 'text-brand-cyan',
      path: '/admin/speakers',
    },
    {
      title: 'Patrocinadores',
      value: sponsors.length,
      sub: `${sponsors.filter((s) => s.tier === 'TITLE' || s.tier === 'GOLD').length} Title/Gold`,
      icon: Award,
      color: 'text-brand-magenta',
      path: '/admin/sponsors',
    },
    {
      title: 'Sesiones Agenda',
      value: agenda.length,
      sub: `${agenda.filter((a) => a.type === 'KEYNOTE').length} Keynotes`,
      icon: Clock,
      color: 'text-purple-400',
      path: '/admin/agenda',
    },
    {
      title: 'Tarifas / Tickets',
      value: tickets.length,
      sub: 'Categorías activas',
      icon: Ticket,
      color: 'text-amber-400',
      path: '/admin/tickets',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-purple/30 via-dark-800 to-brand-cyan/20 border border-dark-600 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
            SISTEMA DE GESTIÓN INTEGRAL
          </span>
          <h2 className="text-3xl font-black text-white mt-1">Tour <span className="gradient-text-latam">LATAM</span> Bolivia 2026</h2>
          <p className="text-xs text-slate-400 mt-1">
            Administra los contenidos, speakers, patrocinadores y agenda oficial sin modificar código fuente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/event"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 font-black text-xs hover:bg-white transition-colors shadow-glow-cyan uppercase tracking-wider"
          >
            Configuración del Evento
          </Link>
          <Link
            to="/admin/pages"
            className="px-5 py-2.5 rounded-xl bg-dark-700 text-white font-bold text-xs hover:bg-dark-600 border border-dark-600 transition-colors uppercase tracking-wider"
          >
            Page Builder
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="glass-card rounded-2xl p-6 border border-dark-600 hover:border-brand-cyan/50 hover:shadow-glow-cyan transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-dark-900 border border-dark-600 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{card.value}</div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>{card.sub}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-cyan transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Log Stream */}
      {auditLogs.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-dark-600 bg-dark-800/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-cyan" />
              <span>Actividad Reciente del Sistema</span>
            </h3>
            <Link to="/admin/audit-logs" className="text-xs font-bold text-brand-cyan hover:underline">
              Ver todos los logs
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-dark-950 border border-dark-600 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-extrabold bg-slate-800 text-brand-cyan border border-slate-700">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-bold text-white">{log.userName}</span>
                    <span className="text-slate-400"> realizó cambios en </span>
                    <span className="font-semibold text-slate-200">{log.entity}</span>
                  </div>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
