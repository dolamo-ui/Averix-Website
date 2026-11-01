/**
 * GAME DATA: one entry per game page (/games/<slug>).
 * Edit this file as the studio reveals more. Anything left as null or empty shows a
 * "coming soon" placeholder, so a page never looks broken while details are still secret.
 */

export const PIPELINE = ['Concept', 'Prototype', 'In Development', 'Early Access', 'Coming Soon', 'Released'] as const;

export interface Game {
  slug: 'alpha' | 'beta' | 'gamma';
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
  links: { wishlist: string | null; download: string | null; play: string | null };
  /** Text shown (as a small toast) when a link above is still null. */
  linkMessages: { wishlist: string; download: string; play: string };
  primaryAction: 'wishlist' | 'download' | 'play';
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
    links: { wishlist: null, download: null, play: null },
    linkMessages: {
      wishlist: 'Wishlist opens when Project Alpha has a store page.',
      download: 'Downloads are not available yet.',
      play: 'Project Alpha is not playable yet.',
    },
    primaryAction: 'wishlist',
  },
  {
    slug: 'beta',
    name: 'Project Beta',
    no: '02',
    accent: '#9a6bff',
    status: 'Prototype',
    stage: 2,
    tagline: 'An experiment in how play can feel.',
    description:
      'Early experimental prototype exploring new mechanics and interactive gameplay loops. Details to be announced.',
    genre: 'To be announced',
    platforms: 'To be announced',
    release: 'To be announced',
    gameplay:
      'Project Beta is a testing ground for new ideas. The team is trying out mechanics and gameplay loops to find what feels great to play. What survives the experiments will shape what this project becomes.',
    story:
      'Prototypes are where Averix tests its boldest ideas quickly and honestly. Project Beta is at that early stage. As the concept settles, we will share what we learned and where it is heading.',
    logo: null,
    keyArt: null,
    trailer: null,
    screenshots: [],
    links: { wishlist: null, download: null, play: null },
    linkMessages: {
      wishlist: 'Wishlist opens when Project Beta has a store page.',
      download: 'Downloads are not available yet.',
      play: 'Alpha test sign-up is not open yet.',
    },
    primaryAction: 'play',
  },
  {
    slug: 'gamma',
    name: 'Project Gamma',
    no: '03',
    accent: '#5ad0ff',
    status: 'Coming Soon',
    stage: 5,
    tagline: 'A new Averix release is on the way.',
    description:
      'Upcoming studio release. Further announcements regarding gameplay trailers and release dates will be published soon.',
    genre: 'To be announced',
    platforms: 'To be announced',
    release: 'Release date to be announced',
    gameplay:
      'Gameplay trailers and details will be published here ahead of release. Follow the studio channels to be among the first to see them.',
    story:
      'Project Gamma is the furthest along of the Averix projects. The team will share the story behind it, including how it was made and who made it, as the announcement date approaches.',
    logo: null,
    keyArt: null,
    trailer: null,
    screenshots: [],
    links: { wishlist: null, download: null, play: null },
    linkMessages: {
      wishlist: 'Wishlist opens when Project Gamma has a store page.',
      download: 'Downloads are not available yet.',
      play: 'Pre-registration is not open yet.',
    },
    primaryAction: 'wishlist',
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);

/** The people behind the studio, shown as initials on game pages. Mirrors the About page. */
export const STUDIO_TEAM = [
  { initials: 'TN', name: 'Tshepiso Nkhodi', role: 'Managing Director' },
  { initials: 'LM', name: 'Linnah Msiza', role: 'Business Development & Technical Coordination' },
  { initials: 'BP', name: 'Bokamoso Pitso', role: 'Game Developer & Sound Engineer' },
  { initials: 'FS', name: 'Francis Tinashe Sakala', role: 'Graphics Designer' },
  { initials: 'SM', name: 'Shane Motsapole', role: 'Community & Audience Lead' },
] as const;
