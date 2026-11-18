'use client';

import { useState, type ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  count: number;
}

/** Status tabs for the Games page. Hides the cards (data-st) that are not in the chosen status. */
export default function GameFilter({ tabs, initial, children }: { tabs: Tab[]; initial: string; children: ReactNode }) {
  const [f, setF] = useState(initial);
  const cur = tabs.find((t) => t.id === f);
  const css = f === 'all' ? '' : `.gf[data-f="${f}"] .pj2:not([data-st="${f}"]){display:none}`;
  return (
    <>
      <div className="gtabs" role="tablist" aria-label="Filter games by status">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === f} className={t.id === f ? 'on' : undefined} onClick={() => setF(t.id)}>
            {t.label} <small>{t.count}</small>
          </button>
        ))}
      </div>
      <div className="gf" data-f={f}>
        <style>{css}</style>
        {children}
        {cur && cur.count === 0 && <p className="gempty">No games in “{cur.label}” yet. Check back soon.</p>}
      </div>
    </>
  );
}
