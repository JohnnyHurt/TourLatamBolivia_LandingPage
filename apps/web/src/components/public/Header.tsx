import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
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

  const navLinks = [
    //    { name: 'Inicio', href: '#hero' },
    //    { name: 'El Congreso', href: '#about' },
    //{ name: 'Pilares (PMO • Agilidad • IA)', href: '#focus-areas' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Programa', href: '#agenda' },
    { name: 'Inversión', href: '#pricing' },
    { name: 'Patrocinadores', href: '#sponsors' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-dark-900/95 backdrop-blur-xl border-b border-dark-600/80 py-3 shadow-[0_10px_30px_rgba(11,4,24,0.9)]'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Organizer */}
          <a href="#hero" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-purple to-brand-magenta p-[1.5px] group-hover:shadow-glow-cyan transition-all">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta text-lg">
                TL
              </div>
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                Tour <span className="gradient-text-latam font-black">LATAM</span> <span className="text-white text-sm font-bold">2026</span>
              </div>
              <div className="text-[10px] font-bold text-brand-cyan tracking-wider uppercase flex items-center gap-1 mt-1">
                <span>Bolivia</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">PMI Bolivia Chapter</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-slate-300 hover:text-brand-cyan transition-colors uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/admin/login"
              className="text-xs font-bold text-slate-400 hover:text-brand-cyan px-3 py-2 rounded-xl hover:bg-dark-800 transition-colors"
            >
              CMS Backoffice
            </a>
            <a
              href={settings?.registrationUrl || '#pricing'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-black tracking-wider btn-pmi-neon rounded-full uppercase gap-1.5"
            >
              <span>{settings?.primaryCtaText || 'REGÍSTRATE AHORA'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-pmiOrange" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-dark-800 border border-dark-600 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-dark-900/98 backdrop-blur-2xl border-b border-dark-600 px-6 pt-4 pb-8 mt-3 space-y-3 shadow-2xl">
          <div className="pb-3 border-b border-dark-600/60 mb-2">
            <PmiBoliviaLogo size="sm" />
          </div>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-brand-cyan hover:bg-dark-800 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-dark-600/80 flex flex-col gap-3">
            <a
              href={settings?.registrationUrl || '#pricing'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 text-xs font-black btn-pmi-neon rounded-xl uppercase tracking-wider"
            >
              {settings?.primaryCtaText || 'REGÍSTRATE AHORA'}
            </a>
            <a
              href="/admin/login"
              className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Acceso CMS Backoffice
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
