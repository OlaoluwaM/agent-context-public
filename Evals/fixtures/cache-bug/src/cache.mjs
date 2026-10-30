export function cachedLookup(cache, key, compute) {
  if (cache[key]) {
    return cache[key];
  }

  const value = compute();
  cache[key] = value;
  return value;
}
