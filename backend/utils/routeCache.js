/**
 * routeCache.js - Lightweight in-process TTL cache for API routes.
 *
 * Design:
 *  - Uses a plain Map: key => { data, expiresAt }
 *  - Default TTL: 20 seconds for public data
 *  - invalidate(keyPattern): busts all cache entries whose key includes pattern
 *  - wrap(key, fn, ttlMs): returns cached value or calls fn() and caches result
 *
 * Why 20 seconds?
 *  - Content changes only via exec submission + ops-manager approval.
 *  - On approval, invalidate() is called immediately => 0s visible delay.
 *  - 20s TTL is a safety net for edge cases (different tabs, server restart).
 *  - Future: swap this module for Redis by implementing the same interface.
 */

const DEFAULT_TTL_MS = 20 * 1000; // 20 seconds

const cache = new Map();

/**
 * Get a cached result or compute it.
 * @param {string} key - Cache key (e.g. 'deals', 'stores', 'credit-cards')
 * @param {Function} fn - Async function called on cache miss
 * @param {number} [ttlMs] - Optional TTL override in milliseconds
 * @returns {Promise<any>}
 */
async function wrap(key, fn, ttlMs = DEFAULT_TTL_MS) {
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expiresAt > now) {
    return entry.data;
  }
  
  // Enforce a strict 3-second timeout on all database fetch functions
  // so the API doesn't hang indefinitely if MongoDB Atlas blocks the local IP
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Database query timeout (3s). Check your MongoDB Atlas Network IP Whitelist.')), 3000)
  );
  
  const data = await Promise.race([fn(), timeoutPromise]);
  cache.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

/**
 * Invalidate all cache entries whose key includes the given pattern.
 * Call this from any mutation route (approve, create, update, delete).
 * @param {string} keyPattern - Partial key string to match
 */
function invalidate(keyPattern) {
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear the entire cache (e.g. after seeding or mass data operations).
 */
function clearAll() {
  cache.clear();
}

/**
 * Return current cache size (for health/debug endpoints).
 */
function size() {
  return cache.size;
}

module.exports = { wrap, invalidate, clearAll, size };
