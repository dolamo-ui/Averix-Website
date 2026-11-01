'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { DISCORD_URL } from '@/lib/site';

/** Averix phone layer: bottom tab bar, full-screen menu sheet, scroll progress, tap feedback, data-saver mode. */

const ICONS: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  games: (
    <>
      <path d="M6 12h4M8 10v4" />
      <path d="M15 12h.01M18 10h.01" />
      <path d="M17.3 5H6.7a4 4 0 0 0-4 3.6C2.6 9.4 2 14.5 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.4-1.4A2 2 0 0 1 9.8 16h4.4a2 2 0 0 1 1.4.6L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.6-6.6-.7-7.3A4 4 0 0 0 17.3 5z" />
    </>
  ),
  events: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 10h18" />
    </>
  ),
  community: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
};

const TABS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/games', label: 'Games', icon: 'games' },
  { href: '/events', label: 'Events', icon: 'events' },
  { href: '/community', label: 'Squad', icon: 'community' },
] as const;

/** Every page with a one-line "what is this" so first-time visitors know where to go. */
const SHEET_LINKS = [
  { href: '/', label: 'Home', note: 'Start here' },
  { href: '/games', label: 'Games', note: 'Our projects and how far along they are' },
  { href: '/events', label: 'Events', note: 'Tournaments and community nights' },
  { href: '/ip', label: 'IP', note: 'Original worlds and characters' },
  { href: '/about', label: 'About', note: 'The studio, the team, the plan' },
  { href: '/community', label: 'Community', note: 'Discord, socials and playtests' },
  { href: '/news', label: 'News', note: 'Updates from the studio' },
  { href: '/partnerships', label: 'Partnerships', note: 'Publishers, sponsors and brands' },
  { href: '/music', label: 'Music', note: 'Soundtrack and releases' },
] as const;

const SOCIALS = [
  { label: 'Discord', href: DISCORD_URL },
  { label: 'X', href: 'https://x.com/averixgames' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@avxgames' },
  { label: 'Instagram', href: 'https://www.instagram.com/avxgame?stkn=am12azMyd24xaG90' },
];

const buzz = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
};

const isActive = (href: string, path: string) => (href === '/' ? path === '/' : path.startsWith(href));

export default function MobileLayer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef({ y0: 0, dy: 0, on: false });

  const setMenu = useCallback((v: boolean) => {
    setOpen(v);
    window.dispatchEvent(new CustomEvent('averix:menu-state', { detail: v }));
  }, []);

  // Header button (and anything else) asks for the sheet through a window event.
  useEffect(() => {
    const toggle = () => setOpen((o) => {
      const n = !o;
      window.dispatchEvent(new CustomEvent('averix:menu-state', { detail: n }));
      return n;
    });
    window.addEventListener('averix:menu', toggle);
    return () => window.removeEventListener('averix:menu', toggle);
  }, []);

  // Close on navigation.
  useEffect(() => {
    setMenu(false);
  }, [pathname, setMenu]);

  // Lock page scroll + Escape while the sheet is open.
  useEffect(() => {
    const el = document.documentElement;
    el.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => {
      el.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setMenu]);

  // Scroll progress + hide the tab bar while reading downwards.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--mx-p', String(max > 0 ? Math.min(1, y / max) : 0));
      if (Math.abs(y - last) > 8) {
        const nearEnd = max - y < 160;
        setHidden(y > last && y > 240 && !nearEnd);
        last = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      document.documentElement.style.removeProperty('--mx-p');
    };
  }, [pathname]);

  // Tap ripple on buttons and cards.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const host = (e.target as HTMLElement).closest<HTMLElement>('.btn, .mx-q, .mx-tab, .mx-link, .pill, .ch button');
      if (!host) return;
      const r = host.getBoundingClientRect();
      const d = Math.max(r.width, r.height) * 1.6;
      const s = document.createElement('span');
      s.className = 'mx-rip';
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.appendChild(s);
      setTimeout(() => s.remove(), 650);
    };
    document.addEventListener('pointerdown', onDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  // Data-saver / slow network: stop the big background videos and keep the posters.
  useEffect(() => {
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lite = !!c && (c.saveData || /^(slow-2g|2g|3g)$/.test(c.effectiveType ?? ''));
    if (!lite) return;
    document.documentElement.classList.add('lite');
    document.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.removeAttribute('autoplay');
      v.removeAttribute('src');
      v.load();
    });
  }, []);

  // Swipe the sheet down to close.
  const onTouchStart = (e: React.TouchEvent) => {
    if ((sheet.current?.scrollTop ?? 0) > 0) return;
    drag.current = { y0: e.touches[0].clientY, dy: 0, on: true };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current;
    if (!d.on) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y0);
    if (d.dy > 0 && sheet.current) {
      sheet.current.style.transition = 'none';
      sheet.current.style.transform = `translateY(${d.dy}px)`;
    }
  };
  const onTouchEnd = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    if (sheet.current) {
      sheet.current.style.transition = '';
      sheet.current.style.transform = '';
    }
    if (d.dy > 110) {
      buzz(10);
      setMenu(false);
    }
  };

  const tabIdx = TABS.findIndex((t) => isActive(t.href, pathname));
  const idx = tabIdx === -1 ? 4 : tabIdx;

  return (
    <>
      <div className="mx-prog" aria-hidden="true"><i /></div>

      <div ref={bar} className="mx-tabs" data-hide={hidden && !open} role="navigation" aria-label="Quick navigation">
        <ul style={{ ['--i' as string]: idx }}>
          <li className="mx-ind" aria-hidden="true" />
          {TABS.map((t, i) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`mx-tab${idx === i ? ' on' : ''}`}
                aria-current={idx === i ? 'page' : undefined}
                onClick={() => buzz()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[t.icon]}</svg>
                <span>{t.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`mx-tab${idx === 4 ? ' on' : ''}`}
              aria-expanded={open}
              aria-controls="mx-sheet"
              onClick={() => {
                buzz();
                setMenu(!open);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS.menu}</svg>
              <span>More</span>
            </button>
          </li>
        </ul>
      </div>

      <div
        id="mx-sheet"
        ref={sheet}
        className={`mx-sheet${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="mx-grab" aria-hidden="true" />
        <div className="mx-sh-top">
          <Link className="brand" href="/" aria-label="Averix Games home">
            <img src="/assets/logo.png" alt="" width={36} height={36} />
            AVERIX <span>GAMES</span>
          </Link>
          <button type="button" className="mx-x" aria-label="Close menu" onClick={() => setMenu(false)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="mx-eyebrow">WHERE TO?</div>
        <ul className="mx-links">
          {SHEET_LINKS.map((l, i) => (
            <li key={l.href} style={{ ['--d' as string]: `${i * 38}ms` }}>
              <Link href={l.href} className={`mx-link${isActive(l.href, pathname) ? ' on' : ''}`} onClick={() => buzz()}>
                <em>{String(i + 1).padStart(2, '0')}</em>
                <span>
                  <b>{l.label}</b>
                  <small>{l.note}</small>
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-sh-foot">
          <a className="btn p" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Join the Discord</a>
          <div className="mx-soc">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
