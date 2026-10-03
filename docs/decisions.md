# Architectural Decisions Log (ADR)

This document records important architectural decisions made during the development of TourLatam 2026.

## 1. Monorepo with npm Workspaces
**Decision**: Use a single repository for frontend, backend, and shared types using `npm` workspaces.
**Reason**: High coupling of data structures between the CMS interface, the API, and the Public Landing Page. A shared `packages/types` folder guarantees that DTOs and interfaces are always in sync, reducing runtime errors caused by mismatched API contracts.

## 2. Unified Landing Page API Endpoint
**Decision**: Create a single `/api/public/landing-data` endpoint.
**Reason**: The landing page requires data from multiple models (Settings, Speakers, Agenda, Sponsors, etc.). Making 8 separate API calls slowed down the initial page load. A unified endpoint reduces network waterfall, lowers latency, and makes it easier to apply a single cache policy.

## 3. Instant Render Strategy (Client-side)
**Decision**: Implement local storage caching in the React Frontend (`LandingPage.tsx`).
**Reason**: To achieve near-instantaneous load times on repeat visits. The application serves the cached JSON payload immediately while fetching fresh data in the background, minimizing layout shifts and improving UX.

## 4. Prisma as ORM
**Decision**: Use Prisma with PostgreSQL.
**Reason**: Excellent TypeScript support and auto-generation of types. The declarative schema makes it easy to visualize relationships and prototype rapidly using `db:push`.
