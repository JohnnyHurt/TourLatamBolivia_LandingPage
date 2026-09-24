# TourLatam 2026 - System Architecture Document

## Overview
TourLatam 2026 is an enterprise-grade full-stack web platform built for the **PMI Bolivia Chapter** to host the International Project Management Congress. The platform features a dynamic public landing page and a modular backoffice CMS.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Zod, JWT authentication.
- **Database**: PostgreSQL (with SQLite compatibility for rapid local dev).
- **Storage**: Abstracted S3-compatible storage service supporting Cloudflare R2, AWS S3, Supabase Storage, and local filesystem fallback.

## Security & Access Control
- **Authentication**: JWT stored in HttpOnly secure cookies & Bearer headers.
- **Authorization**: Role-Based Access Control (`ADMIN` vs `EDITOR`).
- **Audit Logging**: Immutable tracking of all administrative CRUD operations.
