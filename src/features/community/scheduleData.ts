export interface CommunityEvent {
  /** Event id on the Events page (events#id). Empty for the built-in samples. */
  id?: string;
  /** Ticket page (for example Computicket). */
  ticketUrl?: string;
  title: string;
  /** ISO timestamp (SAST, +02:00) */
  at: string;
  kind: string;
  blurb: string;
}

/** Match schedule: edit this list to add events. */
export const COMMUNITY_EVENTS: CommunityEvent[] = [
  { title: 'Community Night #1', at: '2026-10-24T20:00:00+02:00', kind: 'Community', blurb: 'Casual lobbies, new friends and giveaways. Free to join.' },
  { title: 'Averix Cup #1', at: '2026-11-07T19:00:00+02:00', kind: 'Tournament', blurb: '32 teams, R50 entry, R5,000 prize pool. Online with Discord check-in.' },
  { title: 'Playtest Weekend', at: '2026-11-28T10:00:00+02:00', kind: 'Playtest', blurb: 'Try an early build and tell us what works. Free, limited slots.' },
];

const TZ = 'Africa/Johannesburg';
const LOCALE = 'en-GB';

export const fmtDate = (d: Date, o: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString(LOCALE, { timeZone: TZ, ...o });
export const fmtTime = (d: Date) =>
  d.toLocaleTimeString(LOCALE, { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

/** Index of the first event that has not started yet (or the last event if all are past). */
export function nextEventIndex(events: CommunityEvent[], now: number | null): number {
  if (now === null || events.length === 0) return 0;
  const i = events.findIndex((e) => new Date(e.at).getTime() > now);
  return i < 0 ? events.length - 1 : i;
}
