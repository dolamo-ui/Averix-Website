/**
 * GAME DATA: one entry per game page (/games/<slug>).
 * Edit this file as the studio reveals more. Anything left as null or empty shows a
 * "coming soon" placeholder, so a page never looks broken while details are still secret.
 */

export const PIPELINE = ['Concept', 'Prototype', 'In Development', 'Early Access', 'Coming Soon', 'Released'] as const;

export interface Game {
  slug: string;
  name: string;
  no: string;
  /** Accent colour for this game's page. */
  accent: string;
  status: string;
  /** Stage in PIPELINE, 1 to 6. */
  stage: number;
  tagline: string;
  description: string;
  genre: string;
  platforms: string;
  release: string;
  gameplay: string;
  story: string;
  /** Game logo in /public (png/svg). Null shows the title as text. */
  logo: string | null;
  /** Path to key art in /public (for example '/assets/alpha-key-art.jpg'). Leave null until the studio has its own art. */
  keyArt: string | null;
  /** Trailer: an mp4 in /public or a YouTube video id. Null shows the "trailer coming soon" frame. */
  trailer: { kind: 'mp4'; src: string; poster?: string } | { kind: 'youtube'; id: string } | null;
  /** Screenshot paths in /public. Empty shows placeholder frames. */
  screenshots: string[];
  /** Real store / download / play links. Null shows a "not open yet" message when clicked. */
  links: { waitlist: string | null; download: string | null; play: string | null };
  /** Text shown (as a small toast) when a link above is still null. */
  linkMessages: { waitlist: string; download: string; play: string };
  primaryAction: 'waitlist' | 'download' | 'play';
}

export const GAMES: Game[] = [
  {
    slug: 'alpha',
    name: 'Project Alpha',
    no: '01',
    accent: '#00e5ff',
    status: 'In Development',
    stage: 3,
    tagline: 'The first Averix world, taking shape.',
    description:
      'Upcoming original title currently in active development. Official concept art, lore, and screenshots coming soon.',
    genre: 'To be announced',
    platforms: 'To be announced',
    release: 'To be announced',
    gameplay:
      'Gameplay details are being kept under wraps while the core of the game is built. Mechanics, modes and the moment-to-moment experience will be revealed here as they are ready to be shown.',
    story:
      'Project Alpha is the studio\'s main focus right now. The team is building the foundations of the game, its world and its look. As the project moves forward, this is where we will share how it is coming together, from early sketches to playable builds.',
    logo: null,
    keyArt: null,
    trailer: null,
    screenshots: [],
    links: { waitlist: null, download: null, play: null },
    linkMessages: {
      waitlist: 'The waiting list opens soon. Join the Discord to hear first.',
      download: 'Downloads are not available yet.',
      play: 'Project Alpha is not playable yet.',
    },
    primaryAction: 'waitlist',
  },
];

/** Status tabs on the Games page (the default tab is the first one). */
export const FILTERS = ['In Development', 'Prototype', 'Coming Soon', 'Early Access', 'Released'] as const;
export const statusId = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
export const ACCENTS = ['#00e5ff', '#9a6bff', '#5ad0ff', '#ff6bd6', '#ffb84d'];

/** Starting point for games the client adds in /admin. */
export const blankGame = (slug: string, name: string, n = 4): Game => ({
  slug, name, no: String(n).padStart(2, '0'), accent: ACCENTS[(n - 1) % ACCENTS.length],
  status: 'In Development', stage: 3, tagline: 'An Averix original.',
  description: 'More details about this game are coming soon.',
  genre: 'To be announced', platforms: 'To be announced', release: 'To be announced',
  gameplay: 'Gameplay details will be shared here soon.', story: 'The story behind this game will be shared here soon.',
  logo: null, keyArt: null, trailer: null, screenshots: [],
  links: { waitlist: null, download: null, play: null },
  linkMessages: { waitlist: 'The waiting list opens soon. Join the Discord to hear first.', download: 'Downloads are not available yet.', play: 'Not playable yet.' },
  primaryAction: 'waitlist',
});

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
