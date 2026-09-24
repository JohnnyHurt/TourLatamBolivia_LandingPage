import React from 'react';
import { Award, ExternalLink, Sparkles } from 'lucide-react';
import { SponsorDTO } from '@tourlatam/types';

interface SponsorsSectionProps {
  sponsors: SponsorDTO[];
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ sponsors }) => {
  const tiers = ['TITLE', 'GOLD', 'SILVER', 'MEDIA_PARTNER'];

  const getTierTitle = (tier: string) => {
    switch (tier) {
      case 'TITLE':
        return 'Main Partner & Patrocinador Oficial';
      case 'GOLD':
        return 'Patrocinadores Gold';
      case 'SILVER':
        return 'Patrocinadores Silver';
      case 'MEDIA_PARTNER':
        return 'Media Partners & Aliados Institucionales';
      default:
        return 'Aliados';
    }
  };

  return (
    <section id="sponsors" className="py-24 bg-dark-850 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALIANZAS ESTRATÉGICAS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Patrocinadores y Aliados
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Empresas e instituciones líderes comprometidas con el impulso de la dirección de proyectos y la innovación.
          </p>
        </div>

        <div className="space-y-12">
          {tiers.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;

            return (
              <div key={tier} className="text-center">
                <span className="inline-block text-xs font-black text-brand-cyan tracking-widest uppercase mb-6 px-4 py-1 rounded-full bg-dark-800 border border-dark-600">
                  {getTierTitle(tier)}
                </span>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center max-w-5xl mx-auto">
                  {tierSponsors.map((sponsor) => (
                    <a
                      key={sponsor.id}
                      href={sponsor.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center group border border-dark-600 hover:border-brand-cyan/50 hover:shadow-glow-cyan transition-all bg-dark-800/80 min-h-[140px]"
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-14 max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                      />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white mt-3 flex items-center gap-1 transition-colors">
                        <span>{sponsor.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-brand-cyan transition-opacity" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
