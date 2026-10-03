# Architecture

The TourLatam 2026 platform follows a decoupled client-server architecture organized within an npm monorepo.

## 1. Overview

- **Frontend (`apps/web`)**: A Single Page Application (SPA) built with React and Vite. It handles both the public-facing landing page and the secure Backoffice CMS for event administrators.
- **Backend (`apps/api`)**: A RESTful Node.js/Express API that serves data to the frontend and processes business logic.
- **Database**: PostgreSQL, managed via Prisma ORM.

## 2. Frontend Architecture
- **Framework**: React 18 with Vite for fast builds and HMR.
- **Styling**: Tailwind CSS for utility-first styling.
- **State Management**: React context/hooks for local state.
- **Performance Strategy**:
  - The public landing page utilizes a unified API call (`/api/public/landing-data`) to fetch all necessary rendering data at once.
  - Implements an "Instant Render" pattern utilizing `localStorage` to cache API responses, allowing the page to render immediately on reload while fetching fresh data in the background.
  - Media assets are optimized (WebP formats, lazy loading for below-fold content).

## 3. Backend Architecture
- **Framework**: Express.js.
- **Data Validation**: Zod is used for runtime request validation.
- **Authentication**: JWT-based authentication for the CMS Backoffice (`/api/auth/*` and private routes).
- **Caching**: Edge caching is configured via middleware on public routes using `Cache-Control` headers (e.g., `s-maxage`, `stale-while-revalidate`) to reduce database load.

## 4. Shared Packages
- **`packages/types`**: Contains Data Transfer Objects (DTOs) and TypeScript interfaces. Ensuring the API and Web clients are type-synchronized without duplicating definitions.

## 5. Security
- Helmet is used for HTTP headers.
- CORS is configured to restrict origins.
- Rate limiting is applied to the API to prevent abuse.
- Passwords are encrypted using bcrypt.
