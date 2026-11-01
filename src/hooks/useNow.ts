'use client';

import { useEffect, useState } from 'react';

/**
 * Current time in ms, refreshed every `intervalMs`. Returns `null` on the server
 * and on the first client render so server and client markup match.
 */
export function useNow(intervalMs = 1000, enabled = true): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    if (!enabled) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
  return now;
}

export const pad2 = (n: number) => String(Math.max(0, Math.floor(n))).padStart(2, '0');
