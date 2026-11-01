'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNow, pad2 } from '@/hooks/useNow';
import { fmtDate, fmtTime, nextEventIndex, type CommunityEvent } from './scheduleData';

/** "Next up" card with countdown, plus the clickable list of upcoming events. */
export default function Schedule({ events }: { events: CommunityEvent[] }) {
  const now = useNow(1000);
  const [picked, setPicked] = useState<number | null>(null);
  const [initial, setInitial] = useState(0);

  // Once the client knows the time, start on the next upcoming event.
  useEffect(() => setInitial(nextEventIndex(events, Date.now())), [events]);
  const current = picked ?? initial;
  const event = events[current] ?? events[0];
  if (!event) return null;
  const date = new Date(event.at);
  const s = now === null ? 0 : Math.floor(Math.max(0, date.getTime() - now) / 1000);

  return (
    <div className="sch rv">
      <div className="nxt">
        <span className="pill" id="nk">{event.kind}</span>
        <h3 id="nt">{event.title}</h3>
        <p id="np">{event.blurb}</p>
        <div className="cd" aria-live="off" suppressHydrationWarning>
          <div><b>{pad2(s / 86400)}</b><small>DAYS</small></div>
          <div><b>{pad2((s % 86400) / 3600)}</b><small>HRS</small></div>
          <div><b>{pad2((s % 3600) / 60)}</b><small>MIN</small></div>
          <div><b>{pad2(s % 60)}</b><small>SEC</small></div>
        </div>
        <p id="nm" style={{ fontSize: '.75rem', letterSpacing: '.14em' }}>
          {fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()} · {fmtTime(date)} SAST
        </p>
        {event.ticketUrl && (
          <a className="btn p" href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
            {/computicket/i.test(event.ticketUrl) ? 'Buy ticket on Computicket' : 'Get tickets'}
          </a>
        )}
        <Link className={event.ticketUrl ? 'btn s' : 'btn p'} href={event.id ? `/events#${event.id}` : '/events'}>Event details</Link>
      </div>
      <ul className="lst" id="lst">
        {events.map((e, i) => {
          const d = new Date(e.at);
          return (
            <li key={e.id ?? e.title}>
              <button type="button" className={i === current ? 'on' : undefined} onClick={() => setPicked(i)}>
                <span className="d">{fmtDate(d, { day: '2-digit' })}</span>
                <span>
                  <span className="m">
                    {fmtDate(d, { month: 'short', year: 'numeric' })} · {fmtTime(d)} SAST
                  </span>
                  <b>{e.title}</b>
                </span>
                <span className="pill">{e.kind}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
