'use client';

import { useCallback, useEffect, useState } from 'react';
import SafeImg from '@/components/ui/SafeImg';
import type { VaultItem } from './ipData';

const Lock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

/** Concept Art Vault: unlocked tiles with a picture open full size; the rest stay locked and show their message when tapped. */
export default function VaultGrid({ items }: { items: VaultItem[] }) {
  const [sel, setSel] = useState<number | null>(null);
  const shown = items.map((it, i) => ({ it, i })).filter(({ it }) => it.open && it.img);
  const pos = sel === null ? -1 : shown.findIndex((s) => s.i === sel);

  const step = useCallback(
    (d: number) => {
      if (!shown.length || pos < 0) return;
      setSel(shown[(pos + d + shown.length) % shown.length].i);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pos, shown.length],
  );

  useEffect(() => {
    if (sel === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [sel, step]);

  const cur = sel === null ? null : items[sel];

  return (
    <>
      <div className="gal rv">
        {items.map((it, i) =>
          it.open && it.img ? (
            <button key={it.id} className="gt open" type="button" aria-label={`Open artwork ${it.tag}`} onClick={() => setSel(i)}>
              <SafeImg src={it.img} alt="" />
              <span className="tagx">{it.tag}</span>
            </button>
          ) : (
            <button key={it.id} className="gt" type="button" data-msg={it.msg} aria-label={`Locked: ${it.tag}`}>
              <Lock />
              <span className="tagx">{it.tag}</span>
            </button>
          ),
        )}
      </div>
      {cur && (
        <div className="lbx" role="dialog" aria-modal="true" aria-label={cur.tag} onClick={() => setSel(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <SafeImg src={cur.img} alt={cur.tag} />
            <figcaption>{cur.tag}</figcaption>
          </figure>
          <button className="lx x" type="button" aria-label="Close" onClick={() => setSel(null)}>×</button>
          {shown.length > 1 && (
            <>
              <button className="lx p" type="button" aria-label="Previous artwork" onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
              <button className="lx n" type="button" aria-label="Next artwork" onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
