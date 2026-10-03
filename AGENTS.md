# TourLatam 2026 - General Agent Directives (AGENTS.md)

This file contains global constraints and operating procedures for autonomous coding agents (like Antigravity) operating in this repository.

## 1. Safety and Constraints
- **NO Autonomous Git Commits**: Never run `git add`, `git commit`, or `git push`. The repository owner controls the version history.
- **Do NOT Assume Information**: Only document or assert what is verified in the codebase.
- **Workflow**: ANALYZE -> DOCUMENT -> VALIDATE. Always read the code before proposing changes.

## 2. Monorepo Navigation
- Use standard `npm` workspace commands (e.g., `npm run dev --workspace=apps/web`).
- Shared logic/types are located in `packages/types`. If an API response changes, update the types here first, then propagate the changes to `apps/api` and `apps/web`.
- Before suggesting a database change, check `prisma/schema.prisma` and use `npm run db:generate` or `npm run db:push` ONLY if authorized by the user.

## 3. Architecture Rules
- **Backend (`apps/api`)**: Uses Express. Ensure all public endpoints are properly cached. Validation is done via Zod.
- **Frontend (`apps/web`)**: Uses React + Vite. Emphasizes instant rendering. Use local storage for initial load caching (Instant Render pattern). Images should use WebP and `fetchpriority="high"` for above-the-fold content.

## 4. Environment
- The app relies on a `.env` file containing `DATABASE_URL`, `JWT_SECRET`, etc.
- Docker is configured for local development and database hosting (`docker-compose.yml`).
