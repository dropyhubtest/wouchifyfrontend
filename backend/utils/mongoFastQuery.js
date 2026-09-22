const mongoose = require('mongoose');

let isAtlasHealthy = true;
let lastUnhealthyTime = 0;
const HEALTH_COOLDOWN_MS = 30000;

function reportMongoError(err) {
  if (err && (
    err.name === 'MongoNetworkTimeoutError' || 
    err.name === 'MongoServerSelectionError' || 
    err.name === 'MongoNetworkError' ||
    err.code === 'ECONNRESET' ||
    err.message?.includes('timed out') ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('ECONNRESET') ||
    err.message?.includes('bufferCommands = false')
  )) {
    if (isAtlasHealthy) {
      console.warn(`[MongoFastQuery] Atlas network latency/disconnect detected (${err.message}). Tripping circuit breaker to instant in-memory store for 30s.`);
    }
    isAtlasHealthy = false;
    lastUnhealthyTime = Date.now();
  }
}

/**
 * Executes a MongoDB/Mongoose query with circuit breaker and hard timeout.
 * If Atlas is lagging, circuit breaker trips to instant in-memory store (<1ms).
 *
 * @param {Function|Promise} queryFn Function returning Mongoose query or the query promise
 * @param {Function} fallbackFn Function returning data from the local in-memory store
 * @param {number} timeoutMs Maximum wait time before instant fallback (default: 200ms)
 * @returns {Promise<any>}
 */
async function fastQuery(queryFn, fallbackFn, timeoutMs = 200) {
  const now = Date.now();
  // If circuit breaker is open, serve instant in-memory response (<1ms)
  if (!isAtlasHealthy && now - lastUnhealthyTime < HEALTH_COOLDOWN_MS) {
    return fallbackFn();
  }

  if (mongoose.connection.readyState !== 1) {
    return fallbackFn();
  }

  let timer;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), timeoutMs);
  });

  try {
    const mongoPromise = typeof queryFn === 'function' ? queryFn() : queryFn;
    const result = await Promise.race([
      Promise.resolve(mongoPromise).then(data => ({ data, timedOut: false })).catch(err => ({ data: null, error: err, timedOut: false })),
      timeoutPromise
    ]);
    clearTimeout(timer);

    if (result.timedOut) {
      reportMongoError(new Error('Query timed out'));
      return fallbackFn();
    }

    if (result.error) {
      reportMongoError(result.error);
      return fallbackFn();
    }

    // Atlas responded successfully in time
    isAtlasHealthy = true;

    if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
      const fb = fallbackFn();
      if (Array.isArray(fb) && fb.length > 0) return fb;
    }

    return result.data;
  } catch (err) {
    clearTimeout(timer);
    reportMongoError(err);
    return fallbackFn();
  }
}

/**
 * Runs a background database operation asynchronously.
 * Catches and logs errors without throwing or blocking Express response cycles.
 *
 * @param {Function} task Async function to execute
 * @param {string} label Log label
 */
function safeBackground(task, label = 'Background Task') {
  setImmediate(async () => {
    try {
      await task();
    } catch (err) {
      reportMongoError(err);
      console.warn(`[${label}] note:`, err.message);
    }
  });
}

module.exports = {
  fastQuery,
  safeBackground
};
