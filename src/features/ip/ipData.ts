/**
 * Built-in content for the parts of the IP page that the client edits in /admin > IP.
 * These are the texts the page showed before the admin existed, so nothing changes until she edits something.
 */
export type GameSlug = 'alpha' | 'beta' | 'gamma';
export const GAME_SLUGS: GameSlug[] = ['alpha', 'beta', 'gamma'];

/** Firestore document ids inside the `ip` collection. */
export const UNIVERSE_DOC = 'universe';
export const LINKS_DOC = 'links';

export interface Universe {
  chip: string;
  label: string;
  title: string;
  desc: string;
  /** Which game the universe starts in. Its name and page link come from the Games tab. */
  game: GameSlug;
  status: string;
  genre: string;
  platforms: string;
  /** Small side note under the details. Empty = not shown. */
  note: string;
  /** Small label on the artwork. */
  tag: string;
  /** Optional artwork. Empty = the animated rings. */
  img: string;
}

export const UNIVERSE: Universe = {
  chip: 'Concept · Working title',
  label: 'Universe 01 · [Universe Name]',
  title: 'A world still being drawn.',
  desc: 'The first Averix universe is the foundation for Project Alpha and the characters, stories and music that will grow around it. Setting, tone and lore will be revealed step by step through the Averix news and community.',
  game: 'alpha',
  status: 'Concept',
  genre: 'To be announced',
  platforms: 'To be announced',
  note: 'Placeholder copy: final universe name and lore to be supplied by Averix.',
  tag: 'UNIVERSE_01 · CONCEPT',
  img: '',
};

/** The one-line "how this game connects to the IP" shown on each card in IP × Games. */
export const GAME_LINKS: Record<GameSlug, string> = {
  alpha: 'Home of Universe 01 and the first Averix characters.',
  beta: 'IP connection to be confirmed.',
  gamma: 'IP connection to be confirmed.',
};

export interface VaultItem {
  id: string;
  /** Small label on the tile, e.g. CONCEPT_01. */
  tag: string;
  /** Message shown when a locked tile is tapped. */
  msg: string;
  /** Artwork. A tile only opens when it is unlocked AND has a picture. */
  img: string;
  open: boolean;
  order: number;
}

export const VAULT: VaultItem[] = [
  { id: 'concept-01', tag: 'CONCEPT_01 · LOCKED', msg: 'Concept art will be revealed with the first universe announcement.', img: '', open: false, order: 1 },
  { id: 'character-02', tag: 'CHARACTER_02', msg: 'Character art unlocks when profiles are revealed.', img: '', open: false, order: 2 },
  { id: 'world-03', tag: 'WORLD_03', msg: 'Environment art unlocks with the first world reveal.', img: '', open: false, order: 3 },
  { id: 'keyframe-04', tag: 'KEYFRAME_04', msg: 'Key frames will be shown closer to launch.', img: '', open: false, order: 4 },
  { id: 'sound-05', tag: 'SOUND_05', msg: 'Music teasers are planned for a later reveal.', img: '', open: false, order: 5 },
];
