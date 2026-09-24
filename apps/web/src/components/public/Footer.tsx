import React from 'react';
import { ShieldCheck, Linkedin, Facebook, Instagram, Youtube, Twitter, Heart } from 'lucide-react';
import { EventSettingsDTO, SocialLinkDTO } from '@tourlatam/types';
import { PmiBoliviaLogo } from '../common/PmiBoliviaLogo';

interface FooterProps {
  settings: EventSettingsDTO | null;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return Linkedin;
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'x':
      case 'twitter':
        return Twitter;
      default:
        return Linkedin;
    }
  };

  const socialLinks: SocialLinkDTO[] = settings?.socialLinks || [
    { id: '1', platform: 'LinkedIn', url: 'https://www.linkedin.com/company/pmi-bolivia-chapter', displayOrder: 1, isActive: true },
    { id: '2', platform: 'Facebook', url: 'https://www.facebook.com/pmiboliviachapter', displayOrder: 2, isActive: true },
    { id: '3', platform: 'Instagram', url: 'https://www.instagram.com/pmi_bolivia', displayOrder: 3, isActive: true },
    { id: '4', platform: 'YouTube', url: 'https://www.youtube.com/@pmiboliviachapter', displayOrder: 4, isActive: true },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-600 pt-16 pb-12 text-slate-400 text-sm relative overflow-hidden">
      {/* Background glow light */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-brand-purple/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            {/*<div className="mb-6">
              <PmiBoliviaLogo size="md" />
            </div>*/}
            <img src="/public/Logo-PMIBO.jpg" alt="PMI Bolivia Logo" height={120} width={120} />


            <div className="font-black text-2xl text-white mb-2">
              Tour <span className="gradient-text-latam">LATAM</span> Bolivia 2026
            </div>
            <div className="text-xs font-bold text-brand-cyan uppercase tracking-wider mb-4">
              CONGRESO INTERNACIONAL DE DIRECCIÓN DE PROYECTOS
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6 max-w-sm">
              PMO, Agilidad e Inteligencia Artificial. 20 y 21 de Noviembre, 2026. Organizado con la garantía de excelencia del PMI Bolivia Chapter.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((sl) => {
                const Icon = getSocialIcon(sl.platform);
                return (
                  <a
                    key={sl.id}
                    href={sl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-dark-800 border border-dark-600 text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/50 hover:bg-dark-750 transition-all"
                    aria-label={sl.platform}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Navegación del Congreso</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#hero" className="hover:text-brand-cyan transition-colors py-1">Inicio</a>
              <a href="#about" className="hover:text-brand-cyan transition-colors py-1">Sobre el Evento</a>
              <a href="#focus-areas" className="hover:text-brand-cyan transition-colors py-1">PMO • Agilidad • IA</a>
              <a href="#speakers" className="hover:text-brand-cyan transition-colors py-1">Keynote Speakers</a>
              <a href="#agenda" className="hover:text-brand-cyan transition-colors py-1">Programa 20-21 Nov</a>
              <a href="#pricing" className="hover:text-brand-cyan transition-colors py-1">Pases y Tarifas</a>
              <a href="#sponsors" className="hover:text-brand-cyan transition-colors py-1">Patrocinadores</a>
              <a href="#faq" className="hover:text-brand-cyan transition-colors py-1">Preguntas Frecuentes</a>
            </div>
          </div>

          {/* Legal & Contact */}
          <div className="md:col-span-3">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Contacto y Organización</h4>
            <div className="text-xs space-y-2 text-slate-400">
              <p><span className="text-white font-bold">Organiza:</span> PMI Bolivia Chapter</p>
              <p><span className="text-white font-bold">Modalidad:</span> Virtual HD Streaming</p>
              <p><span className="text-white font-bold">Fechas:</span> 20 y 21 de Noviembre, 2026</p>
              <p><span className="text-white font-bold">Email:</span> {settings?.contactEmail || 'contacto@pmi-bolivia.org'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-600 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Tour LATAM Bolivia 2026. PMI Bolivia Chapter. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacidad</a>
            <a href="#" className="hover:text-slate-300">Términos</a>
            <a href="/admin/login" className="hover:text-brand-cyan text-slate-400 font-bold">CMS Backoffice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
