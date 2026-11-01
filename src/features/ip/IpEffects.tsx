'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Plays the licensing "loader stripes" once, when that section scrolls into view. */
export function LicenseReveal() {
  useEffect(() => {
    const lic = document.getElementById('license');
    if (!lic) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      lic.classList.add('go');
      return;
    }
    const io = new IntersectionObserver(
      (entries, o) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            lic.classList.add('go');
            o.disconnect();
          }
        }),
      { rootMargin: '0px 0px -35% 0px' },
    );
    io.observe(lic);
    return () => io.disconnect();
  }, []);
  return null;
}
