'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { DISCORD_URL } from '@/lib/site';
import { prefersReducedMotion } from '@/lib/motion';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

const SLIDES = [
  { title: 'Join The Big Tournaments', text: 'Beyond esports tournaments, include a broader calendar of gaming events, conferences, and conventions. and connect with each other.', cta: 'JOIN NOW', href: '#grid' },
  { title: 'Conferences & Conventions', text: 'Explore gaming conferences, conventions and community meetups across the year, all in one calendar.', cta: 'VIEW CALENDAR', href: '#grid' },
  { title: 'Connect With Players', text: 'Meet other players, teams and creators, and keep the conversation going on the Averix Discord.', cta: 'JOIN DISCORD', href: DISCORD_URL, external: true },
];
const N = SLIDES.length;
const AUTOPLAY_MS = 5500;

/** Auto-advancing, swipeable highlights carousel (arrow keys work too). */
export default function TournamentCarousel() {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(true);
  const hold = useRef(false);
  const drag = useRef({ on: false, moved: false, startX: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  indexRef.current = index;
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const show = useCallback((n: number) => setIndex(((n % N) + N) % N), []);

  const play = useCallback(() => {
    clearInterval(timer.current);
    if (prefersReducedMotion()) return;
    timer.current = setInterval(() => {
      if (!hold.current && visible && !document.hidden) show(indexRef.current + 1);
    }, AUTOPLAY_MS);
  }, [show, visible]);

  useEffect(() => {
    play();
    return () => clearInterval(timer.current);
  }, [play]);

  const to = (n: number) => {
    show(n);
    play();
  };

  useEffect(() => {
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((x) => setVisible(x.isIntersecting)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.on) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 8) d.moved = true;
      setOffset(dx * 0.5);
    };
    const end = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.on) return;
      d.on = false;
      setDragging(false);
      setOffset(0);
      const dx = e.clientX - d.startX;
      if (e.type === 'pointerup' && Math.abs(dx) > 45) to(indexRef.current + (dx < 0 ? 1 : -1));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); to(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); to(index - 1); }
  };
  const swallowClickAfterDrag = (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={wrap}
      className={dragging ? 'jt-w dg' : 'jt-w'}
      id="jtw"
      data-s={index}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Events highlights. Swipe or use the arrow keys."
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') hold.current = true; }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !drag.current.on) hold.current = false; }}
      onFocus={() => { hold.current = true; }}
      onBlur={() => { hold.current = false; }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('.jt-d')) return;
        drag.current = { on: true, moved: false, startX: e.clientX };
        setDragging(true);
      }}
      onClickCapture={swallowClickAfterDrag}
    >
      <div className="jt-f">
        <div className="jt-b">
          <div className={dragging ? 'jt-sls dr' : 'jt-sls'} style={offset ? ({ transform: `translateX(${offset}px)` } as CSSProperties) : undefined}>
            {SLIDES.map((s, k) => (
              <div key={s.title} className={['jt-sl', k === index ? 'on' : '', k < index ? 'pv' : ''].join(' ').trim()}>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <a className="jt-btn" href={s.href} {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span>{s.cta} <Arrow /></span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <img className="jt-l" src="/assets/jt-left.png" alt="" width={170} height={241} />
      <img className="jt-r" src="/assets/jt-right.png" alt="" width={178} height={241} />
      <div className="jt-d">
        {SLIDES.map((s, k) => (
          <i key={s.title} className={k === index ? 'on' : undefined} data-i={k} onClick={(e) => { e.stopPropagation(); to(k); }} />
        ))}
      </div>
    </div>
  );
}
