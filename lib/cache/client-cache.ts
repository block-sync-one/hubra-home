const cache = new Map<string, any>();
const timestamps = new Map<string, number>();
const CACHE_TTL = 5 * 60 * 1000;

export function getClientCache<T>(key: string): T | null {
  const cached = cache.get(key);
  const timestamp = timestamps.get(key);

  if (!cached || !timestamp) return null;

  const age = Date.now() - timestamp;

  if (age >= CACHE_TTL) {
    cache.delete(key);
    timestamps.delete(key);

    return null;
  }

  return cached as T;
}

export function setClientCache<T>(key: string, data: T): void {
  cache.set(key, data);
  timestamps.set(key, Date.now());
}
