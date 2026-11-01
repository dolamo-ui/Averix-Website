'use client';

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import EventDrawer, { artStyle } from './EventDrawer';
import { fmt, statusLabel, statusOf, when, type EventStatus, type SampleEvent } from './sampleEvents';
import { useEvents } from './useEvents';

type StatusFilter = 'all' | EventStatus;
type TypeFilter = 'all' | SampleEvent['type'];

const STATUS_CHIPS: Array<[StatusFilter, string]> = [['all', 'All'], ['up', 'Upcoming'], ['live', 'Live'], ['past', 'Past']];
const TYPE_CHIPS: Array<[TypeFilter, string]> = [['all', 'All types'], ['Tournament', 'Tournaments'], ['Community', 'Community'], ['Showcase', 'Showcases']];
const RANK: Record<EventStatus, number> = { live: 0, up: 1, past: 2 };

/** Search, filters, grid/list toggle, event cards and the details drawer. */
export default function EventExplorer() {
  const { events, base } = useEvents();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (base === null) return [];
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => (status === 'all' || statusOf(e, base) === status) && (type === 'all' || e.type === type))
      .filter((e) => !q || `${e.name} ${e.type} ${e.game}`.toLowerCase().includes(q))
      .sort(
        (a, b) =>
          RANK[statusOf(a, base)] - RANK[statusOf(b, base)] ||
          (statusOf(a, base) === 'past' ? b.start - a.start : a.start - b.start),
      );
  }, [events, base, query, status, type]);

  // Deep links: /events#averix-cup-1 opens that event.
  useEffect(() => {
    if (!events.length) return;
    const id = window.location.hash.slice(1);
    if (events.some((e) => e.id === id)) setOpenId(id);
  }, [events]);

  const open = (id: string) => {
    setOpenId(id);
    window.history.replaceState(null, '', `#${id}`);
  };
  const close = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);
  const reset = () => { setQuery(''); setStatus('all'); setType('all'); };

  const current = events.find((e) => e.id === openId) ?? null;
  const now = base ?? 0;

  return (
    <>
      <div className="tb" role="search">
        <label className="sr">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input id="q" type="search" placeholder="Search events" aria-label="Search events" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="ch" id="fs" role="group" aria-label="Status">
          {STATUS_CHIPS.map(([v, label]) => (
            <button key={v} aria-pressed={status === v} onClick={() => setStatus(v)}>{label}</button>
          ))}
        </div>
        <div className="ch" id="ft" role="group" aria-label="Type">
          {TYPE_CHIPS.map(([v, label]) => (
            <button key={v} aria-pressed={type === v} onClick={() => setType(v)}>{label}</button>
          ))}
        </div>
        <div className="vw" role="group" aria-label="Layout">
          <button id="vg" aria-pressed={view === 'grid'} aria-label="Grid view" onClick={() => setView('grid')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" /></svg>
          </button>
          <button id="vl" aria-pressed={view === 'list'} aria-label="List view" onClick={() => setView('list')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h18v4H3zM3 10h18v4H3zM3 16h18v4H3z" /></svg>
          </button>
        </div>
      </div>
      <div className="dm">
        <span id="cnt" role="status" aria-live="polite">
          {base !== null && <>Showing <b>{visible.length}</b> of {events.length} {events.some((x) => x.sample) ? 'sample ' : ''}events</>}
        </span>
        <span>{events.some((x) => x.sample) ? 'SAMPLE DATA · ' : ''}TIMES SHOWN IN <b>SAST</b></span>
      </div>
      <div id="grid" className={view === 'list' ? 'list' : undefined}>
        {base !== null && visible.length === 0 && (
          <div className="emp">
            <h3>No events match</h3>
            <p>Try a different search or filter. New events will appear here as soon as they&apos;re announced.</p>
            <button className="btn s" id="rs" onClick={reset}>Reset filters</button>
          </div>
        )}
        {visible.map((e, i) => {
          const st = statusOf(e, base ?? 0);
          return (
            <button
              key={e.id}
              className="ev"
              data-id={e.id}
              style={{ animationDelay: `${i * 70}ms` } as CSSProperties}
              aria-label={`${e.name}, ${when(e)}. View details`}
              onClick={() => open(e.id)}
            >
              <div className="ea" style={artStyle(e)}>
                <span className="tg">{e.type.toUpperCase()}{e.sample ? ' · SAMPLE' : ''}</span>
                <span className={`stt ${st}`}>{statusLabel(e, now)}</span>
                <div className="dt">
                  <b>{fmt(e.start, { day: '2-digit' })}</b>
                  <span>{fmt(e.start, { month: 'short' }).toUpperCase()} · {fmt(e.start, { weekday: 'short' }).toUpperCase()}</span>
                </div>
              </div>
              <div className="eb">
                <h3>{e.name}</h3>
                <p className="g">{e.game}</p>
                <dl className="em">
                  <div><dt>ENTRY</dt><dd>{e.entry}</dd></div>
                  <div><dt>PRIZE</dt><dd>{e.prize}</dd></div>
                  <div><dt>SLOTS</dt><dd>{e.slots}</dd></div>
                </dl>
                <div className="ef"><span>{when(e)}</span><span className="go">{e.ticketUrl && st !== 'past' ? 'GET TICKETS' : 'VIEW EVENT'}</span></div>
              </div>
            </button>
          );
        })}
      </div>
      <EventDrawer event={current} now={now} onClose={close} />
    </>
  );
}
