export type EventStatus = 'up' | 'live' | 'past';

export interface SampleEvent {
  id: string;
  name: string;
  type: 'Tournament' | 'Community' | 'Showcase';
  game: string;
  /** start time (ms since epoch) */
  start: number;
  /** duration in hours */
  hours: number;
  entry: string;
  prize: string;
  slots: string;
  format: string;
  reg: string;
  deadline: string;
  platform: string;
  /** card artwork gradient: x%, y%, angle */
  art: [string, string, string];
  /** Ticket page (for example on Computicket). When set, the event shows a "Buy ticket" button. */
  ticketUrl?: string;
  /** Optional picture (https link) set in the admin. Shown on the card and in the details panel. */
  image?: string;
  /** true for the built-in sample events, so they can be labelled as samples. */
  sample?: boolean;
}

export const HOUR = 36e5;
export const DAY = 864e5;

/**
 * EVENT DATA: add or edit events here, the page builds itself from this list.
 * Dates are relative to `now` so the page always shows upcoming, live and past events.
 */
export function buildSampleEvents(now: number): SampleEvent[] {
  const at = (days: number, hour: number) => {
    const t = new Date(now + days * DAY);
    t.setHours(hour, 0, 0, 0);
    return t.getTime();
  };
  const PC_CONSOLE = 'PC and console (to be confirmed)';
  return [
    { id: 'averix-cup-1', name: 'Averix Cup #1', type: 'Tournament', game: 'FPS title · to be announced', start: at(12, 19), hours: 4, entry: 'R50', prize: 'R5,000', slots: '32 teams', format: 'Online · Single elimination', reg: 'Opens soon', deadline: '48 hours before start', platform: PC_CONSOLE, art: ['30%', '25%', '160deg'] },
    { id: 'community-night-1', name: 'Community Night #1', type: 'Community', game: 'Casual lobbies · to be announced', start: at(6, 20), hours: 3, entry: 'Free', prize: 'Giveaways', slots: 'Open lobby', format: 'Online · Casual', reg: 'Opens soon', deadline: 'Join on the night', platform: 'Any platform', art: ['70%', '30%', '200deg'] },
    { id: 'live-qualifier', name: 'Open Qualifier', type: 'Tournament', game: 'Racing title · to be announced', start: now - HOUR, hours: 3, entry: 'Free', prize: 'Qualifier spots', slots: '64 players', format: 'Online · Time trial', reg: 'Closed', deadline: 'Closed', platform: PC_CONSOLE, art: ['25%', '70%', '120deg'] },
    { id: 'duo-showdown', name: 'Duo Showdown', type: 'Tournament', game: 'Battle royale · to be announced', start: at(26, 18), hours: 5, entry: 'R30', prize: 'R2,500', slots: '64 duos', format: 'Online · Points race', reg: 'Not open yet', deadline: '48 hours before start', platform: PC_CONSOLE, art: ['60%', '20%', '180deg'] },
    { id: 'dev-reveal', name: 'Studio Showcase', type: 'Showcase', game: 'Averix projects', start: at(33, 19), hours: 1, entry: 'Free', prize: 'No prize', slots: 'Unlimited viewers', format: 'Online · Livestream', reg: 'Not open yet', deadline: 'Just tune in', platform: 'Browser', art: ['80%', '60%', '150deg'] },
    { id: 'season-opener', name: 'Season Opener', type: 'Tournament', game: 'FPS title · to be announced', start: at(-14, 19), hours: 4, entry: 'R50', prize: 'R5,000', slots: '32 teams', format: 'Online · Single elimination', reg: 'Closed', deadline: 'Closed', platform: PC_CONSOLE, art: ['40%', '40%', '210deg'] },
    { id: 'creator-clash', name: 'Creator Clash', type: 'Tournament', game: 'Arena brawler · to be announced', start: at(19, 18), hours: 3, entry: 'Free', prize: 'Featured spotlight', slots: '16 creators', format: 'Online · Bracket', reg: 'Opens soon', deadline: '72 hours before start', platform: PC_CONSOLE, art: ['85%', '35%', '140deg'] },
    { id: 'playtest-weekend', name: 'Playtest Weekend', type: 'Community', game: 'Early build · to be announced', start: at(40, 10), hours: 6, entry: 'Free', prize: 'Early access keys', slots: '500 players', format: 'Online · Open playtest', reg: 'Not open yet', deadline: 'Sign up before start', platform: 'PC (to be confirmed)', art: ['15%', '55%', '190deg'] },
    { id: 'lore-night', name: 'Lore Night', type: 'Showcase', game: 'Averix universe', start: at(55, 19), hours: 1, entry: 'Free', prize: 'No prize', slots: 'Unlimited viewers', format: 'Online · Livestream', reg: 'Not open yet', deadline: 'Just tune in', platform: 'Browser', art: ['50%', '80%', '170deg'] },
  ];
}

export const statusOf = (e: SampleEvent, now: number): EventStatus =>
  now < e.start ? 'up' : now < e.start + e.hours * HOUR ? 'live' : 'past';

export const statusLabel = (e: SampleEvent, now: number): string =>
  ({ up: e.reg.toUpperCase(), live: 'LIVE NOW', past: 'COMPLETED' })[statusOf(e, now)];

export const fmt = (t: number, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-ZA', { timeZone: 'Africa/Johannesburg', ...o }).format(t);

export const when = (e: SampleEvent) =>
  `${fmt(e.start, { weekday: 'short', day: 'numeric', month: 'short' })} · ${fmt(e.start, { hour: '2-digit', minute: '2-digit', hour12: false })} SAST`;
