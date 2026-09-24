# TourLatam 2026 - Database Schema Documentation

## Prisma Schema Overview
The database uses Prisma ORM with strict foreign key integrity, unique constraints, and soft delete / active status flags.

### Core Models
- `User`: Administrative accounts with roles `ADMIN` or `EDITOR`.
- `EventSettings`: Global event configuration (dates, venue, modality, CTAs, analytics IDs).
- `PageSection`: Landing page section order (`displayOrder`) and visibility (`isVisible`).
- `FocusArea`: Main congress pillars (AI, PMO, Agility).
- `Speaker`: Keynote and breakout speakers with SEO slug `/speakers/:slug`.
- `AgendaItem`: Congress schedule items grouped by date.
- `TicketType`: Passes, pricing, features checklist, registration links.
- `Sponsor`: Patrocinadores categorized by tiers (TITLE, GOLD, SILVER, BRONZE, MEDIA, COMMUNITY).
- `Media`: File metadata tracking stored images and documents.
- `AuditLog`: Security audit log entries.
