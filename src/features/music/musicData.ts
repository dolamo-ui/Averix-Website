export interface Track {
  n: string;
  title: string;
  time: string;
  /** Optional link where this track can be heard (https). */
  url?: string;
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  time: string;
  type: string;
  cover: string;
  /** Optional link where this release can be heard (https). */
  url?: string;
}

export interface Album {
  chip: string;
  title: string;
  subtitle: string;
  description: string;
  /** Credit lines, one per line. */
  credits: string;
  cover: string;
  /** "Listen Now" button. */
  listenUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  appleUrl: string;
  tracks: Track[];
}

export const RELEASE_TYPES = ['Single', 'EP', 'Album', 'Beat', 'Collaboration'] as const;

export const padTrack = (i: number) => String(i + 1).padStart(2, '0');

/** The Awakening: official game soundtrack. */
export const TRACKS: Track[] = [
  { n: '01', title: 'The Awakening (Level 1)', time: '3:42' },
  { n: '02', title: 'Neon Horizon (Level 2)', time: '4:15' },
  { n: '03', title: 'Broken Skies (Level 3)', time: '3:58' },
  { n: '04', title: 'Silent Forest (Level 4)', time: '4:32' },
  { n: '05', title: 'The Rise (Level 5)', time: '4:08' },
  { n: '06', title: 'Final Stand (Level 6)', time: '5:12' },
];

/** Built-in album, used until the client saves their own in /admin > Music. */
export const ALBUM: Album = {
  chip: 'Game 01',
  title: 'The Awakening',
  subtitle: 'Official Game Soundtrack',
  description: 'The first chapter of our journey. Each level unlocks a new sound, and together they form the story of The Awakening.',
  credits: 'Produced by Averix Studio\nIn collaboration with The Harmony Collective',
  cover: '/assets/music-album.jpg',
  listenUrl: '',
  spotifyUrl: '',
  youtubeUrl: '',
  appleUrl: '',
  tracks: TRACKS,
};

export const RELEASES: Release[] = [
  { id: 'into-the-void', title: 'Into the Void', artist: 'Averix Studio', time: '3:41', type: 'Single', cover: '/assets/music-rel1.jpg' },
  { id: 'midnight-city', title: 'Midnight City', artist: 'Averix Studio', time: '4:12', type: 'Single', cover: '/assets/music-rel2.jpg' },
  { id: 'better-days', title: 'Better Days', artist: 'Averix Studio', time: '3:28', type: 'Single', cover: '/assets/music-rel3.jpg' },
  { id: 'lost-in-sound', title: 'Lost in Sound', artist: 'Averix Studio', time: '3:56', type: 'Single', cover: '/assets/music-rel4.jpg' },
];
