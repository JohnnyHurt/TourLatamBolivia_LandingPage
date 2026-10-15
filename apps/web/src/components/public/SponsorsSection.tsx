import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { SponsorDTO } from '@tourlatam/types';
import { getMediaUrl } from '../../utils/media';

interface SponsorsSectionProps {
  sponsors: SponsorDTO[];
}

interface SponsorCardProps {
  sponsor: SponsorDTO;
  tier: string;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, tier }) => {
  const [isLightBg, setIsLightBg] = useState(false);
  const logoUrl = sponsor.logo ? getMediaUrl(sponsor.logo) : null;

  useEffect(() => {
    if (!logoUrl) return;

    // Detect if the logo image has a white/light background or is transparent
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        // If image is opaque (a > 128) and bright, it's a light/white background
        if (a > 128) {
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 200) {
            setIsLightBg(true);
          }
        }
      } catch {
        // Fallback: default to dark
      }
    };
    img.src = logoUrl;
  }, [logoUrl]);

  // Tier-based height for the logo stage
  const stageHeightClass = {
    TITLE: 'h-36 sm:h-44',
    GOLD: 'h-32 sm:h-36',
    SILVER: 'h-24 sm:h-28',
    MEDIA_PARTNER: 'h-20 sm:h-24',
  }[tier] || 'h-32 sm:h-36';

  // Tier-based max size for the logo
  const logoSizeClass = {
    TITLE: 'max-h-28 sm:max-h-36 max-w-[88%]',
    GOLD: 'max-h-24 sm:max-h-28 max-w-[88%]',
    SILVER: 'max-h-16 sm:max-h-20 max-w-[85%]',
    MEDIA_PARTNER: 'max-h-14 sm:max-h-16 max-w-[85%]',
  }[tier] || 'max-h-24 sm:max-h-28 max-w-[88%]';

  return (
    <a
      href={sponsor.website || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between group border border-dark-600/80 hover:border-brand-cyan/60 transition-all duration-300 bg-gradient-to-b from-dark-800/95 via-dark-850 to-dark-900 shadow-lg hover:shadow-[0_12px_40px_rgba(0,242,254,0.18)] hover:-translate-y-1.5 relative overflow-hidden"
    >
      {/* Subtle hover accent sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Dedicated Logo Stage: Adapts to light/white logos vs transparent dark logos */}
      <div
        className={`w-full ${stageHeightClass} rounded-2xl flex items-center justify-center p-4 transition-all duration-300 relative overflow-hidden ${
          isLightBg
            ? 'bg-white shadow-[0_4px_25px_rgba(0,0,0,0.18)] border border-slate-200/80 group-hover:shadow-[0_8px_30px_rgba(0,242,254,0.2)]'
            : 'bg-dark-950/75 border border-dark-600/70 shadow-inner group-hover:border-brand-cyan/30'
        }`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={sponsor.name}
            className={`${logoSizeClass} w-auto h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-sm font-black text-slate-400 uppercase tracking-wider">{sponsor.name}</span>
        )}
      </div>

      {/* Sponsor Name & Link */}
      <div className="mt-4 pt-2 flex items-center justify-between gap-2 border-t border-dark-700/60 relative z-10">
        <span className="text-xs sm:text-sm font-bold text-slate-300 group-hover:text-white transition-colors truncate">
          {sponsor.name}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-cyan shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
};

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

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'TITLE':
        return 'bg-gradient-to-r from-amber-400/15 to-yellow-500/15 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]';
      case 'GOLD':
        return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/35 shadow-[0_0_15px_rgba(0,242,254,0.12)]';
      case 'SILVER':
        return 'bg-slate-400/10 text-slate-300 border-slate-500/30';
      default:
        return 'bg-dark-800 text-slate-400 border-dark-600';
    }
  };

  return (
    <section id="sponsors" className="py-24 bg-dark-850 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-cyan/5 blur-[140px] rounded-full pointer-events-none" />

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

        <div className="space-y-16">
          {tiers.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;

            return (
              <div key={tier} className="text-center">
                <div className="inline-flex items-center justify-center mb-8">
                  <span
                    className={`text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full border ${getTierBadgeStyle(
                      tier
                    )}`}
                  >
                    {getTierTitle(tier)}
                  </span>
                </div>

                <div
                  className={`grid gap-6 sm:gap-8 justify-center mx-auto ${
                    tier === 'TITLE'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl'
                  }`}
                >
                  {tierSponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} tier={tier} />
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
