import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { authenticateToken, requireRole, AuthenticatedRequest, hashPassword } from '../middleware/auth.js';
import { storageService } from '../services/StorageService.js';
import { AuditService } from '../services/AuditService.js';
import { prisma } from '../config/prisma.js'; // FIX #5: shared singleton

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all admin routes with JWT auth
router.use(authenticateToken);

// Helper for generating SEO friendly slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// FIX #4 helper: validate date strings before converting to Date
function parseDate(value: string | null | undefined): Date | null {
  if (!value || value.trim() === '') return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// -------------------------------------------------------------
// MEDIA LIBRARY MANAGER
// -------------------------------------------------------------
router.get('/media', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
});

router.post('/media/upload', upload.single('file'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await storageService.upload(req.file);

    const media = await prisma.media.create({
      data: {
        filename: result.filename,
        mimeType: result.mimeType,
        size: result.size,
        url: result.url,
        storageKey: result.storageKey,
        uploadedBy: req.user?.id || 'Unknown',
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'Media',
      entityId: media.id,
      details: { filename: media.filename, url: media.url },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
});

router.delete('/media/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      return res.status(404).json({ success: false, error: 'Media file not found' });
    }

    await storageService.delete(media.storageKey);
    await prisma.media.delete({ where: { id } });

    await AuditService.log({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'Media',
      entityId: id,
      details: { filename: media.filename },
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// SPEAKERS CMS CRUD
// -------------------------------------------------------------
const speakerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  position: z.string().min(2, 'Position is required'),
  company: z.string().min(2, 'Company is required'),
  country: z.string().min(2, 'Country is required'),
  photo: z.string().min(1, 'Photo URL is required'),
  shortBio: z.string().min(5, 'Short bio is required'),
  fullBio: z.string().min(10, 'Full biography is required'),
  specialties: z.array(z.string()).default([]),
  linkedinUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

router.post('/speakers', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = speakerSchema.parse(req.body);
    const generatedSlug = slugify(data.name);

    // FIX #2: destructure specialties to avoid sending raw array to Prisma
    const { specialties, ...rest } = data;

    const speaker = await prisma.speaker.create({
      data: {
        ...rest,
        slug: generatedSlug,
        specialties: JSON.stringify(specialties),
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'Speaker',
      entityId: speaker.id,
      details: { name: speaker.name, slug: speaker.slug },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: speaker });
  } catch (err) {
    next(err);
  }
});

router.put('/speakers/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = speakerSchema.partial().parse(req.body);

    const existing = await prisma.speaker.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Speaker not found' });

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = slugify(data.name);
    }

    // FIX #2: explicitly exclude specialties from spread to avoid type conflict
    const { specialties, ...restData } = data;

    const updated = await prisma.speaker.update({
      where: { id },
      data: {
        ...restData,
        slug,
        // Only update specialties if explicitly provided in the request
        ...(specialties !== undefined && { specialties: JSON.stringify(specialties) }),
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'Speaker',
      entityId: id,
      details: { name: updated.name },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/speakers/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.speaker.delete({ where: { id } });

    await AuditService.log({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'Speaker',
      entityId: id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'Speaker deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// SPONSORS CMS CRUD
// -------------------------------------------------------------
const sponsorSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  logo: z.string().min(1, 'Logo URL is required'),
  website: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tier: z.enum(['TITLE', 'GOLD', 'SILVER', 'BRONZE', 'MEDIA_PARTNER', 'COMMUNITY_PARTNER']),
  displayOrder: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

router.post('/sponsors', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const slug = slugify(data.name);

    const sponsor = await prisma.sponsor.create({
      data: { ...data, slug },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'Sponsor',
      entityId: sponsor.id,
      details: { name: sponsor.name, tier: sponsor.tier },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: sponsor });
  } catch (err) {
    next(err);
  }
});

router.put('/sponsors/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = sponsorSchema.partial().parse(req.body);

    const updated = await prisma.sponsor.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'Sponsor',
      entityId: id,
      details: { name: updated.name },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/sponsors/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.sponsor.delete({ where: { id } });

    await AuditService.log({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'Sponsor',
      entityId: id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'Sponsor deleted' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// TICKETS / PRICING CMS CRUD
// -------------------------------------------------------------
const ticketSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional().nullable(),
  price: z.number().min(0, 'Price cannot be negative'),
  originalPrice: z.number().optional().nullable(),
  currency: z.string().default('USD'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  registrationUrl: z.string().optional().nullable(),
  badgeText: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

router.post('/tickets', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = ticketSchema.parse(req.body);
    const { features, startDate, endDate, ...rest } = data;

    const ticket = await prisma.ticketType.create({
      data: {
        ...rest,
        features: JSON.stringify(features),
        // FIX #4: validate date strings before converting
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'TicketType',
      entityId: ticket.id,
      details: { name: ticket.name, price: ticket.price },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

router.put('/tickets/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = ticketSchema.partial().parse(req.body);
    const { features, startDate, endDate, ...rest } = data;

    const updated = await prisma.ticketType.update({
      where: { id },
      data: {
        ...rest,
        // FIX #4: only set features if explicitly provided
        ...(features !== undefined && { features: JSON.stringify(features) }),
        // FIX #4: parseDate handles empty string → null (no invalid Date crash)
        ...(startDate !== undefined && { startDate: parseDate(startDate) }),
        ...(endDate !== undefined && { endDate: parseDate(endDate) }),
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'TicketType',
      entityId: id,
      details: { name: updated.name },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/tickets/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.ticketType.delete({ where: { id } });

    await AuditService.log({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'TicketType',
      entityId: id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'Ticket deleted' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// AGENDA CMS CRUD
// -------------------------------------------------------------
const agendaSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().min(1, 'End time required'),
  title: z.string().min(2, 'Title required'),
  description: z.string().optional().nullable(),
  type: z.enum(['KEYNOTE', 'PANEL', 'WORKSHOP', 'BREAK', 'NETWORKING', 'OTHER']),
  // FIX #3: normalize empty string to null to avoid FK constraint errors
  speakerId: z.string().transform((v) => (v && v.trim() !== '' ? v : null)).nullable().optional(),
  room: z.string().optional().nullable(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

router.post('/agenda', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = agendaSchema.parse(req.body);

    const item = await prisma.agendaItem.create({
      data: {
        ...data,
        date: new Date(data.date),
        // FIX #3: speakerId already normalized to null by Zod transform above
        speakerId: data.speakerId ?? null,
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'AgendaItem',
      entityId: item.id,
      details: { title: item.title },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.put('/agenda/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = agendaSchema.partial().parse(req.body);

    const updated = await prisma.agendaItem.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        // FIX #3: normalize empty speakerId to null
        ...(data.speakerId !== undefined && { speakerId: data.speakerId ?? null }),
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'AgendaItem',
      entityId: id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/agenda/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.agendaItem.delete({ where: { id } });

    await AuditService.log({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'AgendaItem',
      entityId: id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'Agenda item deleted' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// EVENT SETTINGS CMS
// -------------------------------------------------------------

// Strict Zod schema for EventSettings — only fields that exist in the Prisma model
const eventSettingsSchema = z.object({
  eventName:          z.string().min(1).optional(),
  organizerName:      z.string().min(1).optional(),
  tagline:            z.string().optional().nullable(),
  startDate:          z.string().optional().nullable(),
  endDate:            z.string().optional().nullable(),
  city:               z.string().optional().nullable(),
  venue:              z.string().optional().nullable(),
  address:            z.string().optional().nullable(),
  modality:           z.string().optional().nullable(),
  registrationUrl:    z.string().optional().nullable(),
  contactEmail:       z.string().optional().nullable(),
  contactPhone:       z.string().optional().nullable(),
  primaryCtaText:     z.string().optional().nullable(),
  secondaryCtaText:   z.string().optional().nullable(),
  heroTitle:          z.string().optional().nullable(),
  heroSubtitle:       z.string().optional().nullable(),
  heroBackgroundUrl:  z.string().optional().nullable(),
  heroVideoUrl:       z.string().optional().nullable(),
  heroOverlayOpacity: z.number().optional().nullable(),
  aboutTitle:         z.string().optional().nullable(),
  aboutSubtitle:      z.string().optional().nullable(),
  aboutDescription:   z.string().optional().nullable(),
  aboutImageUrl:      z.string().optional().nullable(),
  aboutVideoUrl:      z.string().optional().nullable(),
  gaTrackingId:       z.string().optional().nullable(),
  gtmId:              z.string().optional().nullable(),
  metaPixelId:        z.string().optional().nullable(),
});

router.put('/event-settings', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // FIX #1: validate body through Zod schema first — unknown fields are stripped
    const body = eventSettingsSchema.parse(req.body);
    const { startDate, endDate, ...rest } = body;

    // Helper: convert null → undefined for Prisma create input (nullable optional fields)
    // Prisma's optional-String fields expect `string | undefined`, NOT `string | null`
    const n2u = <T>(v: T | null | undefined): T | undefined => (v === null ? undefined : v);

    // For Prisma update input, null means "clear the value" (set to NULL in DB), which IS valid
    // So we pass null through directly only in the update block.
    const existingRecord = await prisma.eventSettings.findFirst();

    const updated = await prisma.eventSettings.upsert({
      where: { id: existingRecord?.id ?? '' },
      create: {
        eventName:        rest.eventName        ?? 'Tour LATAM Bolivia 2026',
        organizerName:    rest.organizerName    ?? 'PMI Bolivia Chapter',
        startDate:        parseDate(startDate)  ?? new Date('2026-11-20T08:00:00Z'),
        endDate:          parseDate(endDate)    ?? new Date('2026-11-21T18:00:00Z'),
        city:             n2u(rest.city)        ?? 'Virtual',
        venue:            n2u(rest.venue)       ?? 'Online',
        registrationUrl:  n2u(rest.registrationUrl) ?? 'https://tourlatam.pmi-bolivia.org/registro',
        primaryCtaText:   n2u(rest.primaryCtaText)  ?? 'REGÍSTRATE AHORA',
        secondaryCtaText: n2u(rest.secondaryCtaText) ?? 'VER PROGRAMA OFICIAL',
        modality:         n2u(rest.modality)    ?? 'Modalidad Virtual',
        // Optional nullable fields — pass as undefined if null (not stored on first create)
        tagline:          n2u(rest.tagline),
        address:          n2u(rest.address),
        contactEmail:     n2u(rest.contactEmail),
        contactPhone:     n2u(rest.contactPhone),
        heroTitle:        n2u(rest.heroTitle),
        heroSubtitle:     n2u(rest.heroSubtitle),
        heroBackgroundUrl: n2u(rest.heroBackgroundUrl),
        heroVideoUrl:     n2u(rest.heroVideoUrl),
        heroOverlayOpacity: n2u(rest.heroOverlayOpacity),
        aboutTitle:       n2u(rest.aboutTitle),
        aboutSubtitle:    n2u(rest.aboutSubtitle),
        aboutDescription: n2u(rest.aboutDescription),
        aboutImageUrl:    n2u(rest.aboutImageUrl),
        aboutVideoUrl:    n2u(rest.aboutVideoUrl),
        gaTrackingId:     n2u(rest.gaTrackingId),
        gtmId:            n2u(rest.gtmId),
        metaPixelId:      n2u(rest.metaPixelId),
      },
      update: {
        // Required String fields: n2u() ensures null → undefined (no crash, field not updated)
        ...(rest.eventName        !== undefined && { eventName:        n2u(rest.eventName)        }),
        ...(rest.organizerName    !== undefined && { organizerName:    n2u(rest.organizerName)    }),
        ...(rest.city             !== undefined && { city:             n2u(rest.city)             }),
        ...(rest.venue            !== undefined && { venue:            n2u(rest.venue)            }),
        ...(rest.registrationUrl  !== undefined && { registrationUrl:  n2u(rest.registrationUrl)  }),
        ...(rest.primaryCtaText   !== undefined && { primaryCtaText:   n2u(rest.primaryCtaText)   }),
        ...(rest.secondaryCtaText !== undefined && { secondaryCtaText: n2u(rest.secondaryCtaText) }),
        ...(rest.modality         !== undefined && { modality:         n2u(rest.modality)         }),
        // Optional nullable String fields: null is valid in update (clears the DB column)
        tagline:          rest.tagline,
        address:          rest.address,
        contactEmail:     rest.contactEmail,
        contactPhone:     rest.contactPhone,
        heroTitle:        rest.heroTitle,
        heroSubtitle:     rest.heroSubtitle,
        heroBackgroundUrl: rest.heroBackgroundUrl,
        heroVideoUrl:     rest.heroVideoUrl,
        heroOverlayOpacity: rest.heroOverlayOpacity,
        aboutTitle:       rest.aboutTitle,
        aboutSubtitle:    rest.aboutSubtitle,
        aboutDescription: rest.aboutDescription,
        aboutImageUrl:    rest.aboutImageUrl,
        aboutVideoUrl:    rest.aboutVideoUrl,
        gaTrackingId:     rest.gaTrackingId,
        gtmId:            rest.gtmId,
        metaPixelId:      rest.metaPixelId,
        // FIX #4: validate dates — skip if invalid / empty string
        ...(startDate !== undefined && { startDate: parseDate(startDate) ?? undefined }),
        ...(endDate   !== undefined && { endDate:   parseDate(endDate)   ?? undefined }),
      },
    });



    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'EventSettings',
      entityId: updated.id,
      details: { eventName: updated.eventName },
      ipAddress: req.ip,
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.put('/page-sections/reorder', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body as { items: { id: string; displayOrder: number; isVisible: boolean }[] };

    for (const item of items) {
      await prisma.pageSection.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder, isVisible: item.isVisible },
      });
    }

    await AuditService.log({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'PageSection',
      details: { count: items.length },
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: 'Sections reordered successfully' });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// USER MANAGEMENT & AUDIT LOGS (ADMIN ONLY)
// -------------------------------------------------------------
router.get('/users', requireRole(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/users', requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['ADMIN', 'EDITOR']),
    });

    const data = schema.parse(req.body);
    const passwordHash = hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: passwordHash,
        role: data.role,
        isActive: true,
      },
    });

    await AuditService.log({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/audit-logs', requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '25', 10);
    const logs = await AuditService.getLogs(page, limit);
    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
});

export default router;
