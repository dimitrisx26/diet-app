import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiry?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /** The cached entries */
  private cache: Map<string, CacheEntry<any>> = new Map();

  /** Default cache duration is 5 minutes */
  private readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000;

  /**
   * Get a cached value by key
   * @param key The cache key
   * @returns The cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttlMs Time to live in milliseconds (optional)
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
    };

    if (ttlMs !== undefined) {
      entry.expiry = Date.now() + ttlMs;
    }

    this.cache.set(key, entry);
  }

  /**
   * Delete a specific entry from cache
   * @param key The cache key to delete
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear all expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry && entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}
