// A tiny in-memory cache that stores answers for 5 minutes to avoid
// repeat TVmaze calls, with get and set helpers.
const CACHE_MS = 5 * 60 * 1000;
const cache = new Map();

// Returns the saved value for a key, or null if nothing is stored or it has expired.
export function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }

  console.log("Cache hit: " + key);
  return item.data;
}

// Stores a value under a key with an expiry time CACHE_MS in the future.
export function setCache(key, data) {
  cache.set(key, { data: data, expires: Date.now() + CACHE_MS });
}
