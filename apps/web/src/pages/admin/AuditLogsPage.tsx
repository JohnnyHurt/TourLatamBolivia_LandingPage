import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AuditLogDTO } from '@tourlatam/types';
import { ShieldAlert, User, Clock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAuditLogs(1)
      .then((res) => {
        setLogs(res.logs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading audit logs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Historial de Auditoría</h2>
        <p className="text-xs text-slate-400">
          Registro inmutable de todas las acciones administrativas realizadas en la plataforma.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-700/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-4 px-6">Fecha & Hora</th>
                <th className="py-4 px-6">Usuario</th>
                <th className="py-4 px-6">Acción</th>
                <th className="py-4 px-6">Entidad</th>
                <th className="py-4 px-6">Detalles / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                      {new Date(log.timestamp).toLocaleString('es-ES')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{log.userName || 'System'}</div>
                    <div className="text-[10px] text-slate-400">{log.userEmail}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-slate-800 text-brand-cyan border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-200">{log.entity}</td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {log.details ? JSON.stringify(log.details) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
