import { PrismaClient } from '@prisma/client';

// Singleton pattern: only ONE PrismaClient instance for the entire API.
// Multiple instances in SQLite cause SQLITE_BUSY (database is locked) errors
// under concurrent write operations.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Ensure PgBouncer pooler connection strings include pgbouncer=true to prevent
// PostgresError: prepared statement "s..." does not exist
let dbUrl = process.env.DATABASE_URL || '';
if (
  dbUrl &&
  (dbUrl.includes('pooler.supabase.com') || dbUrl.includes(':6543') || dbUrl.includes('pgbouncer')) &&
  !dbUrl.includes('pgbouncer=true')
) {
  dbUrl += dbUrl.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
  process.env.DATABASE_URL = dbUrl;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
