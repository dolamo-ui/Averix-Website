'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'motion';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/motion';
import { setupBackgroundVideos } from './backgroundVideos';

/**
 * Scroll and entrance animations for the home page (GSAP + ScrollTrigger, Motion),
 * plus the background-video playback rules. Renders nothing.
 */
export default function HomeEffects() {
  useEffect(() => {
    const rm = prefersReducedMotion();
    const q = <T extends Element>(sel: string) => document.querySelector<T>(sel);
    const qa = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));
    const cleanups: Array<() => void> = [setupBackgroundVideos(rm)];

    if (rm) {
      // Reduced motion: show everything straight away.
      document.body.classList.add('nomo');
      cleanups.push(() => document.body.classList.remove('nomo'));
      return () => cleanups.forEach((fn) => fn());
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.ln span', { yPercent: 110, duration: 1.1, stagger: 0.16, delay: 0.35 })
        .from('[data-in]', { opacity: 0, y: 18, duration: 0.8, stagger: 0.12 }, '-=.6');
      gsap.to('.hc', {
        yPercent: -12,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      // Reveal-on-scroll and art parallax
      qa('.rv').forEach((el) =>
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      );
      qa('.art').forEach((a) =>
        gsap.fromTo(a, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: a.parentElement, scrub: true } }),
      );
      gsap.to('#events .big', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '#events', scrub: true } });

      // Hero video: slow push-in + scroll and pointer parallax (GSAP owns the wrapper, Motion owns the fade)
      const wrapper = q<HTMLElement>('.frame .fs');
      if (wrapper) {
        gsap.fromTo(wrapper, { scale: 1.1 }, { scale: 1.03, duration: 10, ease: 'power2.out' });
        gsap.to(wrapper, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
        if (!isCoarsePointer()) {
          const qx = gsap.quickTo(wrapper, 'x', { duration: 1.4, ease: 'power3' });
          const qy = gsap.quickTo(wrapper, 'y', { duration: 1.4, ease: 'power3' });
          const onMove = (e: PointerEvent) => {
            qx((e.clientX / window.innerWidth - 0.5) * -34);
            qy((e.clientY / window.innerHeight - 0.5) * -22);
          };
          window.addEventListener('pointermove', onMove, { passive: true });
          cleanups.push(() => window.removeEventListener('pointermove', onMove));
        }
      }
    });
    cleanups.push(() => ctx.revert());

    // Motion: hero artwork fade-in + button press feedback
    const frame = q<HTMLElement>('.frame');
    if (frame) {
      frame.style.opacity = '0';
      animate(frame, { opacity: 1 }, { duration: 1.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] });
      qa<HTMLElement>('.btn.mo').forEach((b) => {
        const to = (v: number) => () => void animate(b, { scale: v }, { duration: 0.25 });
        const handlers: Array<[string, () => void]> = [
          ['pointerenter', to(1.05)],
          ['pointerleave', to(1)],
          ['pointerdown', to(0.96)],
          ['pointerup', to(1.05)],
        ];
        handlers.forEach(([t, fn]) => b.addEventListener(t, fn));
        cleanups.push(() => handlers.forEach(([t, fn]) => b.removeEventListener(t, fn)));
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
