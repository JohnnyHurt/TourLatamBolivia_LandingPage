import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js'; // FIX #5: shared singleton

const router = Router();

// GET /api/public/event-info
router.get('/event-info', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await prisma.eventSettings.findFirst();
    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          eventName: 'TourLatam 2026',
          organizerName: 'PMI Bolivia Chapter',
          startDate: new Date('2026-11-12T08:30:00Z'),
          endDate: new Date('2026-11-14T18:00:00Z'),
          city: 'Santa Cruz de la Sierra',
          venue: 'Centro de Convenciones Los Tajibos',
          modality: 'Híbrido (Presencial & Virtual)',
          registrationUrl: 'https://tourlatam.pmi-bolivia.org/registro',
          primaryCtaText: 'REGÍSTRATE AHORA',
          secondaryCtaText: 'CONOCE EL PROGRAMA',
        },
      });
    }

    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return res.json({
      success: true,
      data: {
        ...settings,
        startDate: settings.startDate.toISOString(),
        endDate: settings.endDate.toISOString(),
        updatedAt: settings.updatedAt.toISOString(),
        socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/page-sections
router.get('/page-sections', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await prisma.pageSection.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });

    return res.json({
      success: true,
      data: sections.map((s) => ({
        ...s,
        content: s.content ? JSON.parse(s.content) : null,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/focus-areas
router.get('/focus-areas', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const areas = await prisma.focusArea.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return res.json({
      success: true,
      data: areas,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/speakers
router.get('/speakers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const speakers = await prisma.speaker.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
    });

    return res.json({
      success: true,
      data: speakers.map((sp) => ({
        ...sp,
        specialties: sp.specialties ? JSON.parse(sp.specialties) : [],
        createdAt: sp.createdAt.toISOString(),
        updatedAt: sp.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/speakers/:slug
router.get('/speakers/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const speaker = await prisma.speaker.findUnique({
      where: { slug },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!speaker || !speaker.isActive) {
      return res.status(404).json({ success: false, error: 'Speaker not found' });
    }

    return res.json({
      success: true,
      data: {
        ...speaker,
        specialties: speaker.specialties ? JSON.parse(speaker.specialties) : [],
        sessions: speaker.sessions.map((s) => ({
          ...s,
          date: s.date.toISOString(),
        })),
        createdAt: speaker.createdAt.toISOString(),
        updatedAt: speaker.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/sponsors
router.get('/sponsors', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return res.json({
      success: true,
      data: sponsors.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/agenda
router.get('/agenda', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const agendaItems = await prisma.agendaItem.findMany({
      where: { isActive: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }, { displayOrder: 'asc' }],
      include: {
        speaker: {
          select: {
            id: true,
            slug: true,
            name: true,
            position: true,
            company: true,
            photo: true,
            country: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: agendaItems.map((item) => ({
        ...item,
        date: item.date.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/tickets
router.get('/tickets', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await prisma.ticketType.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return res.json({
      success: true,
      data: tickets.map((t) => ({
        ...t,
        features: t.features ? JSON.parse(t.features) : [],
        startDate: t.startDate ? t.startDate.toISOString() : null,
        endDate: t.endDate ? t.endDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/faqs
router.get('/faqs', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return res.json({
      success: true,
      data: faqs.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/testimonials
router.get('/testimonials', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
});

// SEO sitemap.xml
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  const baseUrl = process.env.PUBLIC_URL || `http://${req.headers.host}`;

  const speakers = await prisma.speaker.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
  const sponsors = await prisma.sponsor.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });

  let urls = [
    `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/#speakers</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/#agenda</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${baseUrl}/#pricing</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
  ];

  speakers.forEach((s) => {
    urls.push(`<url><loc>${baseUrl}/speakers/${s.slug}</loc><lastmod>${s.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`);
  });

  sponsors.forEach((sp) => {
    urls.push(`<url><loc>${baseUrl}/sponsors/${sp.slug}</loc><lastmod>${sp.updatedAt.toISOString()}</lastmod><priority>0.5</priority></url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  return res.send(xml);
});

// SEO robots.txt
router.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = process.env.PUBLIC_URL || `http://${req.headers.host}`;
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: ${baseUrl}/api/public/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  return res.send(robots);
});

export default router;
