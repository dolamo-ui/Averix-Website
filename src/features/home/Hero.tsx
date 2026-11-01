'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import HeroScene from './HeroScene';

/** Home hero: looping background video (with optional sound), 3D artefact and the headline. */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const userToggled = useRef(false);

  // Keep the <video> element in sync with the sound button.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !soundOn;
    if (soundOn) {
      v.volume = 0.8;
      if (v.paused) v.play().catch(() => {});
    }
  }, [soundOn]);

  useEffect(() => {
    const v = video.current;
    const hero = section.current;
    if (!v || !hero) return;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, opts);
      cleanups.push(() => window.removeEventListener(type, fn));
    };

    if (prefersReducedMotion()) {
      v.removeAttribute('autoplay');
      v.pause();
      return;
    }

    // Play only while the hero is on screen.
    const io = new IntersectionObserver((e) => (e[0].isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 });
    io.observe(hero);
    cleanups.push(() => io.disconnect());

    // Autoplay can be blocked until the visitor interacts.
    const resume = () => {
      if (!v.paused) return;
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
    };
    (['pointerdown', 'touchstart', 'keydown', 'scroll'] as const).forEach((t) => on(t, resume, { once: true, passive: true }));

    // Browsers block autoplay with sound, so the first click / key press switches it on.
    const firstGesture = (e: Event) => {
      if (userToggled.current || (e.target as HTMLElement | null)?.closest?.('#snd')) return;
      if (v.muted && window.scrollY < window.innerHeight) setSoundOn(true);
    };
    (['pointerdown', 'keydown'] as const).forEach((t) => on(t, firstGesture, { once: true }));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="hero" ref={section}>
      <div className="frame" aria-hidden="true">
        <div className="fs">
          <video
            ref={video}
            id="hv"
            src="/assets/hero-bg.mp4"
            poster="/assets/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            width={640}
            height={480}
            onError={() => console.warn('Hero video failed to load')}
          />
        </div>
      </div>
      <HeroScene />
      <div className="hc">
        <div className="tag" data-in="">INDEPENDENT GAME STUDIO · BUILDING WHAT&apos;S NEXT</div>
        <h1>
          <span className="ln"><span>We build</span></span>
          <span className="ln"><span className="g">worlds.</span></span>
        </h1>
        <p data-in="">Averix Games is an emerging game studio creating original worlds, bold gaming experiences and communities built around play.</p>
        <div className="cta" data-in="">
          <Link className="btn p mo" href="/games">Explore our games</Link>
          <Link className="btn s mo" href="/about">Discover Averix</Link>
        </div>
      </div>
      <div className="scr" data-in=""><i />SCROLL</div>
      <button
        className="snd"
        id="snd"
        type="button"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
        onClick={(e) => {
          e.stopPropagation();
          userToggled.current = true;
          setSoundOn((s) => !s);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          <g className="off"><path d="m16 9 5 6M21 9l-5 6" /></g>
          <g className="on"><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></g>
        </svg>
        <span id="sndt">{soundOn ? 'Sound on' : 'Sound off'}</span>
      </button>
    </section>
  );
}
