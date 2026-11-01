'use client';

import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Fades `.rv` elements in (adds the `in` class) as they scroll into view.
 * With reduced motion (or no IntersectionObserver) it adds `nomo` to <body>,
 * which the page CSS uses to show everything immediately.
 */
export function useReveal(root: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled || !root.current) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      document.body.classList.add('nomo');
      return () => document.body.classList.remove('nomo');
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    root.current.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root, enabled]);
}
