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

export const LandingPage: React.FC = () => {
  const [settings, setSettings] = useState<EventSettingsDTO | null>(null);
  const [sections, setSections] = useState<PageSectionDTO[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusAreaDTO[]>([]);
  const [speakers, setSpeakers] = useState<SpeakerDTO[]>([]);
  const [sponsors, setSponsors] = useState<SponsorDTO[]>([]);
  const [agenda, setAgenda] = useState<AgendaItemDTO[]>([]);
  const [tickets, setTickets] = useState<TicketTypeDTO[]>([]);
  const [faqs, setFaqs] = useState<FAQDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllPublicData = async () => {
      try {
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

        if (results[0].status === 'fulfilled') setSettings(results[0].value);
        if (results[1].status === 'fulfilled') setSections(results[1].value);
        if (results[2].status === 'fulfilled') setFocusAreas(results[2].value);
        if (results[3].status === 'fulfilled') setSpeakers(results[3].value);
        if (results[4].status === 'fulfilled') setSponsors(results[4].value);
        if (results[5].status === 'fulfilled') setAgenda(results[5].value);
        if (results[6].status === 'fulfilled') setTickets(results[6].value);
        if (results[7].status === 'fulfilled') setFaqs(results[7].value);
      } catch (err) {
        console.error('Error loading public platform data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllPublicData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-300">Cargando TourLatam 2026...</span>
        </div>
      </div>
    );
  }

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
