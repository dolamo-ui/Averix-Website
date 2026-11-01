'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** About page extras: the roadmap fills in when scrolled into view, team cards get a cursor-follow glow. */
export default function AboutEffects() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cleanups: Array<() => void> = [];

    const roadmap = document.querySelector('.rm');
    if (roadmap && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              roadmap.classList.add('in');
              io.disconnect();
            }
          }),
        { threshold: 0.5 },
      );
      io.observe(roadmap);
      cleanups.push(() => io.disconnect());
    }

    document.querySelectorAll<HTMLElement>('.slot').forEach((card) => {
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      card.addEventListener('pointermove', move);
      cleanups.push(() => card.removeEventListener('pointermove', move));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
  return null;
}
