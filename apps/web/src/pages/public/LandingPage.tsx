import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  EventSettingsDTO,
  PageSectionDTO,
  FocusAreaDTO,
  SpeakerDTO,
  SponsorDTO,
  AgendaItemDTO,
  TicketTypeDTO,
  FAQDTO,
} from '@tourlatam/types';

import { Header } from '../../components/public/Header';
import { Hero } from '../../components/public/Hero';
import { EventInfo } from '../../components/public/EventInfo';
import { About } from '../../components/public/About';
import { FocusAreas } from '../../components/public/FocusAreas';
import { SpeakersSection } from '../../components/public/SpeakersSection';
import { AgendaSection } from '../../components/public/AgendaSection';
import { PricingSection } from '../../components/public/PricingSection';
import { SponsorsSection } from '../../components/public/SponsorsSection';
import { FAQSection } from '../../components/public/FAQSection';
import { CtaSection } from '../../components/public/CtaSection';
import { Footer } from '../../components/public/Footer';

const DEFAULT_SETTINGS: EventSettingsDTO = {
  id: 'default',
  eventName: 'Tour LATAM Bolivia 2026',
  organizerName: 'PMI Bolivia Chapter',
  tagline: 'Congreso Internacional de Dirección de Proyectos',
  startDate: '2026-11-20T08:30:00Z',
  endDate: '2026-11-21T18:30:00Z',
  city: 'Santa Cruz de la Sierra',
  venue: 'Transmisión HD Interactiva & Sede Virtual',
  address: 'PMI Bolivia Chapter — Modalidad 100% Virtual',
  modality: 'Modalidad Virtual (Streaming Internacional)',
  registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro',
  contactEmail: 'tourlatam@pmi-bolivia.org',
  contactPhone: '+591 3 334 5678',
  primaryCtaText: 'REGÍSTRATE AHORA',
  secondaryCtaText: 'VER PROGRAMA OFICIAL',
  heroTitle: 'Tour LATAM Bolivia 2026',
  heroSubtitle: 'Congreso Internacional de Dirección de Proyectos • PMO • Agilidad • IA',
  heroBackgroundUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80',
  heroVideoUrl: '',
  heroOverlayOpacity: 0.85,
  aboutTitle: 'Congreso Internacional de Dirección de Proyectos',
  aboutSubtitle: 'Impulsando el Futuro de la Gestión con PMO, Agilidad e Inteligencia Artificial',
  aboutDescription:
    'Tour LATAM Bolivia 2026 es el congreso internacional cumbre que reúne a líderes, directores de proyecto, gestores de PMO y expertos en agilidad e inteligencia artificial. Organizado por el PMI Bolivia Chapter, esta edición 100% virtual ofrece conferencias magistrales, workshops de IA y acreditación oficial de 24 PDUs.',
  aboutImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  gaTrackingId: '',
  gtmId: '',
  metaPixelId: '',
  socialLinks: [],
  updatedAt: new Date().toISOString(),
};

function getLocalCache() {
  try {
    const raw = localStorage.getItem('tourlatam_landing_cache_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore storage parse issues
  }
  return null;
}

export const LandingPage: React.FC = () => {
  const cached = getLocalCache();

  const [settings, setSettings] = useState<EventSettingsDTO | null>(cached?.settings || DEFAULT_SETTINGS);
  const [sections, setSections] = useState<PageSectionDTO[]>(cached?.sections || []);
  const [focusAreas, setFocusAreas] = useState<FocusAreaDTO[]>(cached?.focusAreas || []);
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>(cached?.speakers || []);
  const [sponsors, setSponsors] = useState<SponsorDTO[]>(cached?.sponsors || []);
  const [agenda, setAgenda] = useState<AgendaItemDTO[]>(cached?.agenda || []);
  const [tickets, setTickets] = useState<TicketTypeDTO[]>(cached?.tickets || []);
  const [faqs, setFaqs] = useState<FAQDTO[]>(cached?.faqs || []);

  useEffect(() => {
    let isMounted = true;

    const loadAllPublicData = async () => {
      try {
        // Try unified aggregated endpoint first (single network roundtrip)
        const aggregated = await api.getLandingData().catch(() => null);
        if (aggregated && isMounted) {
          if (aggregated.settings) setSettings(aggregated.settings);
          if (aggregated.sections?.length) setSections(aggregated.sections);
          if (aggregated.focusAreas?.length) setFocusAreas(aggregated.focusAreas);
          if (aggregated.speakers?.length) setSpeakers(aggregated.speakers);
          if (aggregated.sponsors?.length) setSponsors(aggregated.sponsors);
          if (aggregated.agenda?.length) setAgenda(aggregated.agenda);
          if (aggregated.tickets?.length) setTickets(aggregated.tickets);
          if (aggregated.faqs?.length) setFaqs(aggregated.faqs);

          try {
            localStorage.setItem('tourlatam_landing_cache_v1', JSON.stringify(aggregated));
          } catch (e) {}
          return;
        }

        // Fallback to concurrent individual endpoints
        const results = await Promise.allSettled([
          api.getEventInfo(),
          api.getPageSections(),
          api.getFocusAreas(),
          api.getSpeakers(),
          api.getSponsors(),
          api.getAgenda(),
          api.getTickets(),
          api.getFAQs(),
        ]);

        if (!isMounted) return;

        if (results[0].status === 'fulfilled' && results[0].value) setSettings(results[0].value);
        if (results[1].status === 'fulfilled' && results[1].value) setSections(results[1].value);
        if (results[2].status === 'fulfilled' && results[2].value) setFocusAreas(results[2].value);
        if (results[3].status === 'fulfilled' && results[3].value) setSpeakers(results[3].value);
        if (results[4].status === 'fulfilled' && results[4].value) setSponsors(results[4].value);
        if (results[5].status === 'fulfilled' && results[5].value) setAgenda(results[5].value);
        if (results[6].status === 'fulfilled' && results[6].value) setTickets(results[6].value);
        if (results[7].status === 'fulfilled' && results[7].value) setFaqs(results[7].value);
      } catch (err) {
        console.warn('Background data sync notice:', err);
      }
    };

    loadAllPublicData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Render sections according to DB displayOrder & isVisible flags
  const renderSection = (type: string) => {
    switch (type) {
      case 'HERO':
        return <Hero key="hero" settings={settings} />;
      case 'EVENT_INFO':
        return <EventInfo key="event-info" settings={settings} />;
      case 'ABOUT':
        return <About key="about" settings={settings} />;
      case 'FOCUS_AREAS':
        return <FocusAreas key="focus-areas" areas={focusAreas} />;
      case 'SPEAKERS':
        return <SpeakersSection key="speakers" speakers={speakers} />;
      case 'AGENDA':
        return <AgendaSection key="agenda" items={agenda} />;
      case 'PRICING':
        return <PricingSection key="pricing" tickets={tickets} registrationUrl={settings?.registrationUrl} />;
      case 'SPONSORS':
        return <SponsorsSection key="sponsors" sponsors={sponsors} />;
      case 'FAQ':
        return <FAQSection key="faq" faqs={faqs} />;
      case 'CTA':
        return <CtaSection key="cta" settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 selection:bg-brand-cyan selection:text-dark-900">
      <Header settings={settings} />

      <main>
        {sections.length > 0 ? (
          sections.map((sec) => renderSection(sec.sectionType))
        ) : (
          <>
            <Hero settings={settings} />
            <EventInfo settings={settings} />
            <About settings={settings} />
            <FocusAreas areas={focusAreas} />
            <SpeakersSection speakers={speakers} />
            <AgendaSection items={agenda} />
            <PricingSection tickets={tickets} registrationUrl={settings?.registrationUrl} />
            <SponsorsSection sponsors={sponsors} />
            <FAQSection faqs={faqs} />
            <CtaSection settings={settings} />
          </>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
};
