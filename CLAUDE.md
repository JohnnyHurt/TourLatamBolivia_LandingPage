# TourLatam 2026 - AI Agent Guidelines (CLAUDE.md)

Welcome! This document provides instructions for AI agents (Claude, Antigravity, etc.) working on the TourLatam 2026 Monorepo.

## Project Context
This is the Web Platform & Backoffice CMS for the "TourLatam 2026" event organized by PMI Bolivia Chapter.
It is a monorepo managed with `npm` workspaces.

## Structure
- `/apps/web`: React/Vite Frontend (Landing page & CMS Backoffice)
- `/apps/api`: Express/Node Backend
- `/packages/types`: Shared TypeScript interfaces and DTOs
- `/prisma`: Prisma schema and seeds
- `/docker`: Dockerfiles for production builds
- `/docs`: Technical documentation

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, `@dnd-kit`
- **Backend**: Node.js, Express, Prisma, Zod, JWT, AWS S3
- **Database**: PostgreSQL
- **Language**: TypeScript throughout the monorepo

## Development Commands
From the project root:
- `npm run dev`: Starts both frontend and backend concurrently.
- `npm run build`: Builds types, then api, then web.
- `npm run typecheck`: Runs TS compiler checks without emitting files.
- `npm run lint`: Runs linters.
- `npm run db:generate`: Generates Prisma client.
- `npm run db:push`: Pushes schema to the database.
- `npm run db:seed`: Seeds the database using `tsx`.

## Core Guidelines for Agents
1. **Never modify source code when asked to only analyze or document.**
2. **Do not execute `git add`, `git commit`, or `git push` autonomously.** The user must handle version control.
3. **Respect the Monorepo:** When making changes that affect both frontend and backend (e.g., API payloads), update `/packages/types` first, then update both consumers.
4. **Caching:** The backend has a caching mechanism in place for public endpoints (e.g., `/api/public/landing-data`). Be mindful of cache invalidation when data changes.
5. **Aesthetics:** The frontend should maintain a premium, dynamic design with animations and proper SEO. Do not degrade the visual quality.
