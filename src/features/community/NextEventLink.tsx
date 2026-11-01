'use client';

import { useNow, pad2 } from '@/hooks/useNow';
import { nextEventIndex, type CommunityEvent } from './scheduleData';

/** Hero "NEXT EVENT" chip with a live D/H/M countdown. */
export default function NextEventLink({ events }: { events: CommunityEvent[] }) {
  const now = useNow(1000);
  const event = events[nextEventIndex(events, now)];
  if (!event) return null;
  const s = now === null ? 0 : Math.floor(Math.max(0, new Date(event.at).getTime() - now) / 1000);
  return (
    <a className="nx" href="#sched">
      <small>NEXT EVENT</small>
      <b id="hn">{event.title}</b>
      <span id="hc2" suppressHydrationWarning>
        {pad2(s / 86400)}D {pad2((s % 86400) / 3600)}H {pad2((s % 3600) / 60)}M
      </span>
    </a>
  );
}
