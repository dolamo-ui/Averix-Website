/** The three cards in the home page "Our Universes" section. Edited in /admin > Universes. */
export interface UniverseCard {
  id: string;
  /** Small label above the title, e.g. "CONCEPT · DETAILS SOON" or "IN DEVELOPMENT". */
  status: string;
  title: string;
  desc: string;
  /** Optional picture (https link). Empty = the built-in artwork. */
  img: string;
  /** Where the card goes: a page on this site (starts with /) or an https link. Empty = the card is not clickable. */
  link: string;
  /** Text of the button on the card. Empty = no button. */
  button: string;
}

export const UNIVERSE_CARD_IDS = ['universe1', 'universe2', 'universe3'] as const;

/** Built-in text, used until the client saves their own. */
export const UNIVERSE_DEFAULTS: UniverseCard[] = [
  {
    id: 'universe1',
    status: 'CONCEPT · DETAILS SOON',
    title: 'Untitled Game 01',
    desc: 'A new world in the making. Title, key art, genre and platforms will be revealed here as the project takes shape.',
    img: '',
    link: '/games',
    button: 'Discover project',
  },
  {
    id: 'universe2',
    status: 'CONCEPT · DETAILS SOON',
    title: 'Untitled Game 02',
    desc: "Room for the next big idea. Prototypes, gameplay and development stories will be shared here when they're ready.",
    img: '',
    link: '/games',
    button: '',
  },
  {
    id: 'universe3',
    status: 'CONCEPT · DETAILS SOON',
    title: 'Original World 01',
    desc: 'Characters, worlds and stories designed to live beyond the screen. Original Averix IP will be introduced here.',
    img: '',
    link: '/games',
    button: '',
  },
];

/** Accepts a page on this site ("/games", "/ip") or an https:// link. Anything else returns ''. */
export function cleanCardLink(input: string | undefined | null): string {
  const v = (input ?? '').trim();
  if (/^\/(?!\/)[^\s]*$/.test(v)) return v;
  return /^https:\/\/[^\s]+$/i.test(v) ? v : '';
}
