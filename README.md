# TourLatam 2026 - PMI Bolivia Chapter

Welcome to the TourLatam 2026 Monorepo. This project houses the Web Platform (Landing Page) and Backoffice CMS for the international project management congress.

## Project Structure

This is an `npm` workspace monorepo:

*   **`apps/web`**: Frontend application (React, Vite, Tailwind). Includes public landing pages and private CMS panels.
*   **`apps/api`**: Backend REST API (Node.js, Express, Prisma).
*   **`packages/types`**: Shared TypeScript definitions used by both web and api.
*   **`docs`**: Technical documentation.
*   **`prisma`**: Database schema and seed scripts.
*   **`docker`**: Dockerfiles for production deployments.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Docker (for local database)

### Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Database**
    ```bash
    docker compose up -d postgres
    ```

3.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in the necessary values.

4.  **Database Migration & Seeding**
    ```bash
    npm run db:push
    npm run db:generate
    npm run db:seed
    ```

5.  **Run Development Servers**
    ```bash
    npm run dev
    ```
    This will concurrently start the API server and Web frontend.

## Documentation
- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)
- [Decisions Log](docs/decisions.md)
