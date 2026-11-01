export interface Track {
  n: string;
  title: string;
  time: string;
}

export interface Release {
  title: string;
  artist: string;
  time: string;
  type: string;
  cover: string;
}

/** The Awakening: official game soundtrack. */
export const TRACKS: Track[] = [
  { n: '01', title: 'The Awakening (Level 1)', time: '3:42' },
  { n: '02', title: 'Neon Horizon (Level 2)', time: '4:15' },
  { n: '03', title: 'Broken Skies (Level 3)', time: '3:58' },
  { n: '04', title: 'Silent Forest (Level 4)', time: '4:32' },
  { n: '05', title: 'The Rise (Level 5)', time: '4:08' },
  { n: '06', title: 'Final Stand (Level 6)', time: '5:12' },
];

export const RELEASES: Release[] = [
  { title: 'Into the Void', artist: 'Averix Studio', time: '3:41', type: 'Single', cover: '/assets/music-rel1.jpg' },
  { title: 'Midnight City', artist: 'Averix Studio', time: '4:12', type: 'Single', cover: '/assets/music-rel2.jpg' },
  { title: 'Better Days', artist: 'Averix Studio', time: '3:28', type: 'Single', cover: '/assets/music-rel3.jpg' },
  { title: 'Lost in Sound', artist: 'Averix Studio', time: '3:56', type: 'Single', cover: '/assets/music-rel4.jpg' },
];
