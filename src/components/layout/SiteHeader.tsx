'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '@/lib/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    onScroll();
    const mq = window.matchMedia('(max-width: 900px)');
    const syncPhone = () => setPhone(mq.matches);
    const onSheet = (e: Event) => setSheetOpen(!!(e as CustomEvent<boolean>).detail);
    syncPhone();
    mq.addEventListener('change', syncPhone);
    window.addEventListener('averix:menu-state', onSheet);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('averix:menu-state', onSheet);
      mq.removeEventListener('change', syncPhone);
    };
  }, []);

  return (
    <header id="hd" className={scrolled ? 'sc' : undefined}>
      <Link className="brand" href="/" aria-label="Averix Games home">
        <img src="/assets/logo.png" alt="" width={40} height={40} />
        AVERIX <span>GAMES</span>
      </Link>
      <button
        id="mb"
        aria-expanded={open || sheetOpen}
        aria-controls={phone ? 'mx-sheet' : 'nv'}
        aria-label={phone ? 'Open menu' : undefined}
        onClick={() => {
          // Phones open the full-screen menu; tablets keep the dropdown.
          if (window.matchMedia('(max-width: 900px)').matches) window.dispatchEvent(new Event('averix:menu'));
          else setOpen((o) => !o);
        }}
      >
        <span className="mb-t">{open ? 'CLOSE' : 'MENU'}</span>
        <span className="mx-burger" aria-hidden="true" data-open={sheetOpen}>
          <i />
          <i />
          <i />
        </span>
      </button>
      <nav
        id="nv"
        aria-label="Main"
        className={open ? 'o' : undefined}
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
      >
        <ul>
          {NAV_ITEMS.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link className={active ? 'l on' : 'l'} href={href} aria-current={active ? 'page' : undefined}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
