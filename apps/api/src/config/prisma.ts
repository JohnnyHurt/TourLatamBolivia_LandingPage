import { PrismaClient } from '@prisma/client';

// Singleton pattern: only ONE PrismaClient instance for the entire API.
// Multiple instances in SQLite cause SQLITE_BUSY (database is locked) errors
// under concurrent write operations.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
