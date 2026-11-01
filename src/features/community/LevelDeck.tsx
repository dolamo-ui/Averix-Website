'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { DISCORD_URL } from '@/lib/site';
import { prefersReducedMotion } from '@/lib/motion';

interface Level {
  title: string;
  text: string;
  unlocks: string;
  cta: { label: string; href: string; external?: boolean };
}

const LEVELS: Level[] = [
  { title: 'Join the Discord', text: 'Say hello in the welcome channel and grab your roles.', unlocks: 'roles & channels', cta: { label: 'Join the Discord', href: DISCORD_URL, external: true } },
  { title: 'Follow the journey', text: 'Follow us on X, TikTok and Instagram for updates.', unlocks: 'news first', cta: { label: 'See social links', href: '#comms' } },
  { title: 'Play an event', text: 'Enter a tournament or drop in on a community night.', unlocks: 'prizes & rankings', cta: { label: 'View events', href: '/events' } },
  { title: 'Shape the games', text: 'Join playtests and share feedback with the team.', unlocks: 'early builds', cta: { label: 'Join a playtest', href: DISCORD_URL, external: true } },
];

const N = LEVELS.length;
const pad = (n: number) => String(n).padStart(2, '0');

/** Swipeable "level up" card deck with a progress rail. */
export default function LevelDeck() {
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ on: false, moved: false, startX: 0, startLeft: 0 });
  const raf = useRef(0);

  const goTo = useCallback((i: number) => {
    const dk = deck.current;
    const card = cards.current[Math.max(0, Math.min(N - 1, i))];
    if (!dk || !card) return;
    dk.scrollTo({
      left: card.offsetLeft - (dk.clientWidth - card.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  // Keep `active` in sync with whichever card is closest to the centre of the deck.
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const dk = deck.current;
      if (!dk) return;
      const mid = dk.scrollLeft + dk.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.current.forEach((c, k) => {
        if (!c) return;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (dist < bestDist) [best, bestDist] = [k, dist];
      });
      setActive(best);
    });
  };

  // Mouse drag-to-scroll (touch uses native scrolling).
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.on || !deck.current) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 4) d.moved = true;
      deck.current.scrollLeft = d.startLeft - dx;
    };
    const up = () => {
      if (!drag.current.on) return;
      drag.current.on = false;
      setDragging(false);
      goTo(activeRef.current);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      cancelAnimationFrame(raf.current);
    };
  }, [goTo]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !deck.current) return;
    drag.current = { on: true, moved: false, startX: e.clientX, startLeft: deck.current.scrollLeft };
    setDragging(true);
  };
  // A drag should not count as a click on a card button/link.
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
  };

  return (
    <>
      <div className="rail rv" role="tablist" aria-label="Levels" style={{ '--p': `${(active / (N - 1)) * 100}%` } as CSSProperties}>
        <i className="rf" />
        {LEVELS.map((_, i) => (
          <button
            key={i}
            className={['nd', i === active ? 'on' : '', i < active ? 'hit' : ''].join(' ').trim()}
            type="button"
            role="tab"
            aria-label={`Level ${pad(i + 1)}`}
            aria-selected={i === active}
            onClick={() => goTo(i)}
          >
            <span>{pad(i + 1)}</span>
          </button>
        ))}
      </div>
      <div
        ref={deck}
        className={dragging ? 'deck dg' : 'deck'}
        id="deck"
        tabIndex={0}
        aria-label="Swipe through the levels"
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
      >
        {LEVELS.map((lv, i) => (
          <article key={lv.title} ref={(el) => { cards.current[i] = el; }} className={i === active ? 'lc on' : 'lc'}>
            <span className="big" aria-hidden="true">{pad(i + 1)}</span>
            <span className="lv">LVL {pad(i + 1)}</span>
            <b>{lv.title}</b>
            <p>{lv.text}</p>
            <em>Unlocks: {lv.unlocks}</em>
            {lv.cta.external ? (
              <a className="btn p" href={lv.cta.href} target="_blank" rel="noopener noreferrer">{lv.cta.label}</a>
            ) : lv.cta.href.startsWith('#') ? (
              <a className="btn p" href={lv.cta.href}>{lv.cta.label}</a>
            ) : (
              <Link className="btn p" href={lv.cta.href}>{lv.cta.label}</Link>
            )}
          </article>
        ))}
      </div>
      <div className="ctl">
        <button type="button" id="lp" aria-label="Previous level" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
        <span id="ln">LEVEL {active + 1} / {N}</span>
        <button type="button" id="lx" aria-label="Next level" disabled={active === N - 1} onClick={() => goTo(active + 1)}>→</button>
      </div>
    </>
  );
}
