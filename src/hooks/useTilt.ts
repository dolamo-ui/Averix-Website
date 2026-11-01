'use client';

import { useEffect } from 'react';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Pointer-follow 3D tilt. For every element matching `selector` it sets the
 * --rx / --ry CSS variables on the element's first child (the "tilt" layer).
 */
export function useTilt(selector: string) {
  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const layer = el.firstElementChild as HTMLElement | null;
      if (!layer) return;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        layer.style.setProperty('--ry', `${x * 10}deg`);
        layer.style.setProperty('--rx', `${-y * 10}deg`);
      };
      const leave = () => {
        layer.style.setProperty('--ry', '0deg');
        layer.style.setProperty('--rx', '0deg');
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [selector]);
}
