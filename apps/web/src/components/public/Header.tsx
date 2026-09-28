import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { EventSettingsDTO } from '@tourlatam/types';
import { PmiBoliviaLogo } from '../common/PmiBoliviaLogo';

interface HeaderProps {
  settings: EventSettingsDTO | null;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Speakers', href: '#speakers' },
    { name: 'Programa', href: '#agenda' },
    { name: 'Inversión', href: '#pricing' },
    { name: 'Patrocinadores', href: '#sponsors' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
          ? 'bg-dark-900/95 backdrop-blur-xl border-b border-dark-600/80 py-3 shadow-[0_10px_30px_rgba(11,4,24,0.9)]'
          : 'bg-transparent py-4 sm:py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Organizer */}
            <a href="#hero" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src="/PMI Logo Full Color.jpg"
                  alt="PMI Bolivia Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none font-display">
                  Tour <span className="gradient-text-latam font-black">LATAM</span> <span className="text-white text-xs sm:text-sm font-bold">2026</span>
                </div>
                <div className="text-[10px] font-bold text-brand-cyan tracking-wider uppercase flex items-center gap-1 mt-1">
                  <span>Bolivia</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">PMI Bolivia Chapter</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation (Visible on laptops & desktops from lg: 1024px upwards) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold text-slate-300 hover:text-brand-cyan transition-colors uppercase tracking-wider py-1 px-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA & Admin Link*/}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
              {/* <a
                href="/admin/login"
                className="text-xs font-bold text-slate-400 hover:text-brand-cyan px-3 py-2 rounded-xl hover:bg-dark-800 transition-colors"
              >
                //CMS Backoffice
              </a>*/}
              <a
                href={settings?.registrationUrl || '#pricing'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center px-5 xl:px-6 py-2.5 text-xs font-black tracking-wider btn-pmi-neon rounded-full uppercase gap-1.5 shadow-lg shadow-brand-pmiOrange/20 hover:scale-105 transition-all"
              >
                <span>{settings?.primaryCtaText || 'REGÍSTRATE AHORA'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-pmiOrange" />
              </a>
            </div>

            {/* Mobile / Tablet Actions (< 1024px) */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-3">
              <a
                href={settings?.registrationUrl || '#pricing'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[11px] font-black tracking-wider btn-pmi-neon rounded-full uppercase gap-1"
              >
                <span>{settings?.primaryCtaText || 'REGÍSTRATE'}</span>
                <ArrowRight className="w-3 h-3 text-brand-pmiOrange" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-200 hover:text-white bg-dark-800/80 hover:bg-dark-800 border border-dark-600/80 focus:outline-none transition-all active:scale-95 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-brand-cyan" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Drawer Dropdown (< 1024px) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-900/98 backdrop-blur-2xl border-b border-dark-600/90 px-6 pt-5 pb-8 mt-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="pb-4 border-b border-dark-600/60 mb-3 flex items-center justify-between">
              <PmiBoliviaLogo size="sm" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-dark-800 px-2.5 py-1 rounded-full border border-dark-600/60">
                Menú
              </span>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:text-brand-cyan hover:bg-dark-800/80 transition-colors"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                </a>
              ))}
            </div>
            <div className="pt-5 mt-3 border-t border-dark-600/80 flex flex-col gap-3">
              <a
                href={settings?.registrationUrl || '#pricing'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-black btn-pmi-neon rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{settings?.primaryCtaText || 'REGÍSTRATE AHORA'}</span>
                <ArrowRight className="w-4 h-4 text-brand-pmiOrange" />
              </a>
              <a
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-slate-400 hover:text-brand-cyan transition-colors bg-dark-800/50 rounded-xl border border-dark-700/60"
              >
                Acceso CMS Backoffice
              </a>
            </div>
          </div>
        )}
      </header >

      {/* Backdrop overlay for mobile menu */}
      {
        mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )
      }
    </>
  );
};
