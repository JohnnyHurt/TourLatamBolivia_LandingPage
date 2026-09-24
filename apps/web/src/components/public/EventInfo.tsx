import React from 'react';
import { Calendar, Video, Layers, Award, Users } from 'lucide-react';
import { EventSettingsDTO } from '@tourlatam/types';

interface EventInfoProps {
  settings: EventSettingsDTO | null;
}

export const EventInfo: React.FC<EventInfoProps> = ({ settings }) => {
  const items = [
    {
      icon: Calendar,
      label: 'FECHA OFICIAL',
      value: '20 y 21 Nov 2026',
      subtext: '2 Jornadas Intensivas',
      color: 'text-brand-cyan',
      borderColor: 'border-brand-cyan/30',
      bgColor: 'bg-brand-cyan/10',
    },
    {
      icon: Video,
      label: 'MODALIDAD',
      value: 'Modalidad Virtual',
      subtext: 'Transmisión HD Interactiva',
      color: 'text-brand-magenta',
      borderColor: 'border-brand-magenta/30',
      bgColor: 'bg-brand-magenta/10',
    },
    {
      icon: Layers,
      label: 'EJES TEMÁTICOS',
      value: 'PMO • Agilidad • IA',
      subtext: '3 Pilares Estratégicos',
      color: 'text-brand-purple',
      borderColor: 'border-brand-purple/30',
      bgColor: 'bg-brand-purple/10',
    },
    {
      icon: Award,
      label: 'ACREDITACIÓN',
      value: '24 PDUs Certificados',
      subtext: 'Talent Triangle PMI',
      color: 'text-brand-cyan',
      borderColor: 'border-brand-cyan/30',
      bgColor: 'bg-brand-cyan/10',
    },
    {
      icon: Users,
      label: 'SPEAKERS',
      value: '20+ Referentes',
      subtext: 'Líderes de Latinoamérica',
      color: 'text-brand-magenta',
      borderColor: 'border-brand-magenta/30',
      bgColor: 'bg-brand-magenta/10',
    },
  ];

  return (
    <section className="relative z-20 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(11,4,24,0.95)] border border-dark-600 bg-dark-800/90 backdrop-blur-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-dark-600">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`pt-4 sm:pt-0 ${idx !== 0 ? 'lg:pl-6' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${item.bgColor} border ${item.borderColor} ${item.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                      {item.label}
                    </span>
                    <p className="text-base font-black text-white mt-0.5">{item.value}</p>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">{item.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
