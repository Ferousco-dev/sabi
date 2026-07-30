"use client";

/**
 * Stale-while-revalidate data cache for dashboard pages.
 *
 * The old pattern — `useState` + `useEffect(fetch)` + a full-page spinner —
 * re-fetched and flashed a loader on EVERY visit, even when returning to a page
 * seen seconds ago. `useResource` keeps the last successful value in a
 * process-level cache keyed by a stable string, so revisiting a page renders the
 * previous data instantly and silently revalidates in the background.
 *
 * Usage:
 *   const { data, loading, refresh } = useResource("admin:students", getStudents);
 *   // `loading` is true only on the FIRST load (no cache yet). On revisits it
 *   // stays false and `data` is the cached value while a refresh runs.
 *
 * On mutation, call `refresh()` to re-pull, or `mutate(next)` to update the
 * cache optimistically. `clearResourceCache(prefix)` drops entries (e.g. on
 * logout, or after a write that invalidates several pages).
 */

import { useCallback, useEffect, useRef, useState } from "react";

const cache = new Map<string, unknown>();

/** Drop cached resources. No prefix clears everything (e.g. on logout). */
export function clearResourceCache(prefix?: string): void {
  if (!prefix) { cache.clear(); return; }
  for (const key of [...cache.keys()]) if (key.startsWith(prefix)) cache.delete(key);
}

export function useResource<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(() => cache.get(key) as T | undefined);
  const [loading, setLoading] = useState(() => !cache.has(key));
  const [error, setError] = useState(false);

  // Keep the latest fetcher without making it a dependency (callers often pass
  // an inline closure that changes identity every render).
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async (k: string) => {
    setError(false);
    if (!cache.has(k)) setLoading(true);
    try {
      const result = await fetcherRef.current();
      cache.set(k, result);
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-sync to cache on key change, then revalidate.
    setData(cache.get(key) as T | undefined);
    setLoading(!cache.has(key));
    run(key);
  }, [key, run]);

  /** Force a re-fetch (keeps showing current data meanwhile). */
  const refresh = useCallback(() => run(key), [key, run]);

  /** Write straight into the cache + state (optimistic update). */
  const mutate = useCallback((next: T) => {
    cache.set(key, next);
    setData(next);
  }, [key]);

  return { data, loading, error, refresh, mutate } as const;
}
