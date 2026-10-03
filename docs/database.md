# Database Schema

TourLatam 2026 uses PostgreSQL as its primary database, interfaced through Prisma ORM.

## Core Models

### System
- **`User`**: Administrators and Editors accessing the Backoffice CMS.
- **`EventSettings`**: Singleton-like model storing global event configuration (dates, locations, hero content, SEO tracking IDs).
- **`AuditLog`**: Tracks actions performed by Users in the CMS.

### Event Content
- **`Speaker`**: Profiles of event speakers, including bios, photos, and social links.
- **`AgendaItem`**: Schedule blocks (Keynotes, Panels, Breaks). Relationships exist to `Speaker`.
- **`Sponsor`**: Companies sponsoring the event, categorized by tier (Title, Gold, Silver, etc.).
- **`FocusArea`**: Core themes/tracks of the congress.
- **`FAQ`**: Frequently asked questions.
- **`Testimonial`**: Reviews and quotes from past attendees or figures.

### Presentation & Structure
- **`PageSection`**: Controls visibility and ordering of sections on the public landing page.
- **`Media`**: Centralized registry for uploaded files (images, documents).
- **`SocialLink`**: Links to official event social media profiles.

### Commerce (Future Extensions)
- **`TicketType`**: Available passes for the event (prices, features, dates).
- **`Registration`**: Attendee records linked to TicketTypes.

## Migrations and Seeding
- `prisma/schema.prisma` is the source of truth.
- `npm run db:push` syncs the schema directly for rapid prototyping.
- `prisma/seed.ts` populates the database with default configuration and sample data.
