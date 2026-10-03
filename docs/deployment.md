# Deployment Guide

## Local Environment
Local development relies on Docker for infrastructure.
- `docker-compose.yml` provides a `postgres:16-alpine` database.
- It also includes definitions for running the `api` and `web` containers locally, though typically developers use `npm run dev` to run the node processes directly on their host machine for better HMR and debugging.

## Production Topology
The application is designed to be deployed across modern PaaS providers.

1.  **Frontend (Web)**
    - Target: **Vercel** or Netlify.
    - Build Command: `npm run build --workspace=apps/web`
    - Output Directory: `apps/web/dist`
    - Environment Variables: Must point API URLs to the production backend.

2.  **Backend (API)**
    - Target: **Render**, Railway, or AWS.
    - Build Command: `npm run build --workspace=apps/api`
    - Start Command: `npm run start --workspace=apps/api`
    - Environment Variables: Needs `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.
    - Features: Must have connection to the Production PostgreSQL instance.

3.  **Database**
    - Managed PostgreSQL instance (e.g., Supabase, Neon, RDS).

## Docker Builds
Standalone Dockerfiles are provided in `/docker`:
- `docker/Dockerfile.api`: Multi-stage build for the Express backend.
- `docker/Dockerfile.web`: Build for the React frontend, usually served via Nginx in containerized environments.
