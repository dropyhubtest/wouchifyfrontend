/**
 * dataCache.ts - Frontend in-memory TTL cache for API responses.
 *
 * Reduces redundant network calls on page navigation and component re-mounts.
 *
 * Caching strategy:
 *  - Public data (deals, stores, coupons, credit cards, loot deals): 20s TTL
 *  - Admin/panel data (submissions queue, all=true queries): never cached
 *  - Event-driven bust: listens for wouchify_*_updated events to invalidate immediately
 *
 * How cache invalidation works after ops-manager approves:
 *  1. Ops manager clicks Approve ? PATCH /api/submissions/:id/approve
 *  2. Backend clears its own server-side cache (routeCache.clearAll())
 *  3. Frontend fires wouchify_submissions_updated event
 *  4. This module hears that event and calls clearAll()
 *  5. Next component render fetches fresh data from backend
 *  ? Effective delay: ~0ms (same session), max 20s (other sessions/tabs)
 */

const DEFAULT_TTL_MS = 20 * 1000; // 20 seconds

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Get cached value or fetch from source function.
 * @param key Unique cache key
 * @param fn Async fetch function called on cache miss
 * @param ttlMs TTL override (default 20s). Pass 0 to disable caching.
 */
export async function cacheWrap<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  if (ttlMs === 0) return fn();

  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expiresAt > now) {
    return entry.data as T;
  }

  const data = await fn();
  cache.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

/**
 * Synchronously get cached value if it exists and is valid.
 * This prevents UI flashes by allowing components to initialize with cached data.
 */
export function getCached<T>(key: string): T | null {
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expiresAt > now) {
    return entry.data as T;
  }
  return null;
}

/**
 * Bust all cache entries whose key includes the given pattern.
 */
export function invalidate(keyPattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear entire cache (called when ops manager approves a submission).
 */
export function clearAll(): void {
  cache.clear();
}

// Listen for backend approval events dispatched by admin panels
// This ensures instant cache bust on the same client when ops manager approves
if (typeof window !== 'undefined') {
  const INVALIDATION_EVENTS = [
    'wouchify_submissions_updated',
    'wouchify_deals_updated',
    'wouchify_stores_updated',
    'wouchify_coupons_updated',
    'wouchify_creditcards_updated',
    'wouchify_lootdeals_updated',
  ];

  INVALIDATION_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, () => {
      clearAll();
    });
  });
}
