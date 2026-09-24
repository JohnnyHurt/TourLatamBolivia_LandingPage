# TourLatam 2026 - REST API Specification

## Public Endpoints
- `GET /api/public/event-info`: Event configuration & social links
- `GET /api/public/page-sections`: Page sections order & visibility
- `GET /api/public/focus-areas`: Congress focus pillars
- `GET /api/public/speakers`: Active speakers list
- `GET /api/public/speakers/:slug`: Detailed speaker profile & sessions
- `GET /api/public/sponsors`: Active sponsors categorized by tier
- `GET /api/public/agenda`: Schedule items grouped by date
- `GET /api/public/tickets`: Registration passes & prices
- `GET /api/public/faqs`: Accordion FAQs
- `GET /api/public/sitemap.xml`: SEO XML sitemap
- `GET /api/public/robots.txt`: Search engine crawling rules

## Auth Endpoints
- `POST /api/auth/login`: Authenticate and receive JWT cookie/token
- `POST /api/auth/logout`: End session
- `GET /api/auth/me`: Current logged in user info

## Admin Endpoints (Requires JWT)
- `PUT /api/admin/event-settings`: Update settings
- `PUT /api/admin/page-sections/reorder`: Reorder sections
- `POST / PUT / DELETE /api/admin/speakers`: Speaker CRUD
- `POST / PUT / DELETE /api/admin/sponsors`: Sponsor CRUD
- `POST / PUT / DELETE /api/admin/agenda`: Agenda CRUD
- `POST / PUT / DELETE /api/admin/tickets`: Ticket CRUD
- `POST / DELETE /api/admin/media`: Upload & delete files
- `GET / POST /api/admin/users`: User management (ADMIN only)
- `GET /api/admin/audit-logs`: Activity logs (ADMIN only)
