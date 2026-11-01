'use client';

import { pad2, useNow } from '@/hooks/useNow';
import { DAY, HOUR, statusOf } from './sampleEvents';
import { useEvents } from './useEvents';

/** Hero countdown to the next upcoming event. */
export default function NextUpCountdown() {
  const { events, base } = useEvents();
  const now = useNow(1000);
  const next =
    base === null ? undefined : events.filter((e) => statusOf(e, base) === 'up').sort((a, b) => a.start - b.start)[0];

  let ms = next && now !== null ? Math.max(0, next.start - now) : 0;
  const d = Math.floor(ms / DAY); ms %= DAY;
  const h = Math.floor(ms / HOUR); ms %= HOUR;
  const m = Math.floor(ms / 6e4);
  const s = Math.floor((ms % 6e4) / 1e3);

  return (
    <div className="cd" id="cd" hidden={!next}>
      <small>{next?.sample ? 'NEXT UP · SAMPLE EVENT' : 'NEXT UP'}</small>
      <b id="cdn">{next?.name}</b>
      <div className="t">
        <div><strong id="c1">{pad2(d)}</strong><em>DAYS</em></div>
        <div><strong id="c2">{pad2(h)}</strong><em>HRS</em></div>
        <div><strong id="c3">{pad2(m)}</strong><em>MIN</em></div>
        <div><strong id="c4">{pad2(s)}</strong><em>SEC</em></div>
      </div>
    </div>
  );
}
