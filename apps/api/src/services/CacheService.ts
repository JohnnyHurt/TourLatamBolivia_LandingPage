interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      // Don't immediately delete; can be used as stale fallback if needed
      return null;
    }
    return entry.data as T;
  }

  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? (entry.data as T) : null;
  }

  set<T>(key: string, data: T, ttlSeconds = 300): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService();
