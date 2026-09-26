import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { TicketTypeDTO } from '@tourlatam/types';

interface PricingSectionProps {
  tickets: TicketTypeDTO[];
  registrationUrl?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ tickets, registrationUrl }) => {
  // Only display tickets that are active / visible
  const visibleTickets = (tickets || []).filter((ticket) => ticket.isActive !== false);

  if (visibleTickets.length === 0) {
    return null;
  }

  return (
    <section id="pricing" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-brand-magenta/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-brand-cyan/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/15 border border-brand-purple/40 text-xs font-black text-purple-300 uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>PASES Y ACCESOS AL CONGRESO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Inversión y Tarifas
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Asegura tu lugar en el evento de dirección de proyectos más importante de 2026 con tarifas preferenciales.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {visibleTickets.map((ticket) => {
            const displayBs = ticket.priceBs ?? Math.round(ticket.price * 6.96);
            const featuresList = Array.isArray(ticket.features)
              ? ticket.features
              : typeof ticket.features === 'string'
              ? JSON.parse(ticket.features)
              : [];

            return (
              <div
                key={ticket.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  ticket.isFeatured
                    ? 'bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 border-2 border-brand-cyan shadow-glow-cyan'
                    : 'glass-card border border-dark-600 hover:border-brand-purple/50'
                }`}
              >
                {ticket.badgeText && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-cyanLight text-dark-950 text-[10px] font-black uppercase tracking-wider shadow-glow-cyan">
                    {ticket.badgeText}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{ticket.name}</h3>
                  {ticket.description && (
                    <p className="text-xs text-slate-300 font-light mb-6 leading-relaxed">
                      {ticket.description}
                    </p>
                  )}

                  {/* Precios: Bolivianos llamativo y USD secundario */}
                  <div className="mb-6 pb-6 border-b border-dark-600">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-brand-cyan tracking-wider">
                        Bs.
                      </span>
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {displayBs}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400">
                      <span>o</span>
                      <span className="text-brand-cyan font-bold">${ticket.price}</span>
                      <span className="text-xs text-slate-400 font-medium">USD</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {featuresList.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                        <div className="p-1 rounded-full bg-brand-cyan/20 text-brand-cyan shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Register Button */}
                <a
                  href={ticket.registrationUrl || registrationUrl || '#pricing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                    ticket.isFeatured
                      ? 'bg-gradient-to-r from-brand-pmiOrange to-brand-pmiOrangeDark text-white shadow-glow-pmi hover:brightness-110'
                      : 'bg-dark-800 text-white hover:bg-brand-cyan hover:text-dark-950 border border-dark-600'
                  }`}
                >
                  <span>SELECCIONAR PASE</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
