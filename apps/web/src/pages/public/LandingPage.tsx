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
    'Tour LATAM Bolivia 2026 es el congreso internacional cumbre que reúne a líderes, directores de proyecto, gestores de PMO y expertos en agilidad e inteligencia artificial. Organizado por el PMI Bolivia Chapter, esta edición 100% virtual ofrece conferencias magistrales, workshops de IA y acreditación oficial de 20 PDUs.',
  aboutImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  gaTrackingId: '',
  gtmId: '',
  metaPixelId: '',
  socialLinks: [],
  updatedAt: new Date().toISOString(),
};

const DEFAULT_TICKETS: TicketTypeDTO[] = [
  {
    id: 'a52e8761-da8d-4d79-907c-c78b59af0f63',
    name: 'NO MIEMBROS',
    description: 'Pase general para profesionales no asociados al PMI con descuento anticipado.',
    price: 29,
    priceBs: 290,
    originalPrice: 320,
    currency: 'USD',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-08-31T23:59:59.000Z',
    features: [
      'Acceso completo a 2 días de conferencias magistrales',
      'Acceso a Workshops inmersivos de IA & Agilidad',
      'Certificado oficial de asistencia con PDU credits (20 PDUs)',
      'Networking International',
      'Acceso a la plataforma virtual por 60 días post-evento',
    ],
    registrationUrl: 'https://lck.page.link/s6vi',
    badgeText: 'PRE VENTA',
    isFeatured: false,
    isActive: true,
    displayOrder: 0,
    createdAt: '2026-09-24T23:20:19.981Z',
    updatedAt: '2026-10-11T00:23:37.381Z',
  },
  {
    id: '4252d1f1-e888-450d-a2b4-8364c2dab57b',
    name: 'MIEMBROS - PMI BOLIVIA',
    description: 'Tarifa preferencial para miembros activos de cualquier capítulo del PMI a nivel global.',
    price: 15,
    priceBs: 150,
    originalPrice: 150,
    currency: 'USD',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-08-31T23:59:59.000Z',
    features: [
      'Acceso completo a 2 días de conferencias magistrales',
      'Acceso a Workshops inmersivos de IA & Agilidad',
      'Certificado oficial de asistencia con PDU credits (20 PDUs)',
      'Networking International',
      'Acceso a la plataforma virtual por 60 días post-evento',
    ],
    registrationUrl: 'https://lck.page.link/SrmV',
    badgeText: 'PRE VENTA',
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: '2026-09-24T23:20:19.743Z',
    updatedAt: '2026-10-11T00:48:25.000Z',
  },
  {
    id: '53ee5971-c022-4fec-b3ed-7bec994f50ec',
    name: 'ESTUDIANTES',
    description: 'Precio preferencial para Estudiantes de Pre-grado y Post-grado',
    price: 20,
    priceBs: 200,
    originalPrice: 550,
    currency: 'USD',
    features: [
      'Acceso completo a 2 días de conferencias magistrales',
      'Acceso a Workshops inmersivos de IA & Agilidad',
      'Certificado oficial de asistencia.',
      'Networking International',
      'Acceso a la plataforma virtual por 60 días post-evento',
    ],
    registrationUrl: 'https://lck.page.link/ZfwU',
    badgeText: 'PRE VENTA',
    isFeatured: false,
    isActive: true,
    displayOrder: 2,
    createdAt: '2026-09-24T23:20:20.102Z',
    updatedAt: '2026-10-11T00:38:06.479Z',
  },
];

function getLocalCache() {
  try {
    const raw = localStorage.getItem('tourlatam_landing_cache_v5');
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
  const [tickets, setTickets] = useState<TicketTypeDTO[]>(
    cached?.tickets && cached.tickets.length > 0 ? cached.tickets : DEFAULT_TICKETS
  );
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
            localStorage.setItem('tourlatam_landing_cache_v5', JSON.stringify(aggregated));
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

        const newSettings = results[0].status === 'fulfilled' && results[0].value ? results[0].value : settings;
        const newSections = results[1].status === 'fulfilled' && results[1].value ? results[1].value : sections;
        const newFocus = results[2].status === 'fulfilled' && results[2].value ? results[2].value : focusAreas;
        const newSpeakers = results[3].status === 'fulfilled' && results[3].value ? results[3].value : speakers;
        const newSponsors = results[4].status === 'fulfilled' && results[4].value ? results[4].value : sponsors;
        const newAgenda = results[5].status === 'fulfilled' && results[5].value ? results[5].value : agenda;
        const newTickets = results[6].status === 'fulfilled' && results[6].value ? results[6].value : tickets;
        const newFaqs = results[7].status === 'fulfilled' && results[7].value ? results[7].value : faqs;

        if (newSettings) setSettings(newSettings);
        if (newSections?.length) setSections(newSections);
        if (newFocus?.length) setFocusAreas(newFocus);
        if (newSpeakers?.length) setSpeakers(newSpeakers);
        if (newSponsors?.length) setSponsors(newSponsors);
        if (newAgenda?.length) setAgenda(newAgenda);
        if (newTickets?.length) setTickets(newTickets);
        if (newFaqs?.length) setFaqs(newFaqs);

        try {
          localStorage.setItem(
            'tourlatam_landing_cache_v1',
            JSON.stringify({
              settings: newSettings,
              sections: newSections,
              focusAreas: newFocus,
              speakers: newSpeakers,
              sponsors: newSponsors,
              agenda: newAgenda,
              tickets: newTickets,
              faqs: newFaqs,
            })
          );
        } catch (e) {}
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
      case 'AGENDA': {
        const agendaSec = sections.find((s) => s.sectionType === 'AGENDA');
        return <AgendaSection key="agenda" items={agenda} sectionConfig={agendaSec?.content} />;
      }
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
            <AgendaSection items={agenda} sectionConfig={sections.find((s) => s.sectionType === 'AGENDA')?.content} />
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
