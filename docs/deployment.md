# TourLatam 2026 - Deployment Guide

## Production Docker Deployment

Run the complete multi-container stack (PostgreSQL + Express API + Nginx Web SPA):

```bash
docker-compose up -d --build
```

## Environment Variables
Ensure all environment variables in `.env` are configured:
- `DATABASE_URL`
- `JWT_SECRET`
- `STORAGE_PROVIDER` (local | s3 | r2 | supabase)
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`
- `STORAGE_ENDPOINT`
