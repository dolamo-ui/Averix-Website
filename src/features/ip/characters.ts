export interface Character {
  name: string;
  role: string;
  color: string;
  /** true = full profile, false = locked / classified */
  open: boolean;
  origin?: string;
  universe?: string;
  game?: string;
  desc?: string;
  backstory?: string;
  media?: string[];
  /** Optional artwork (e.g. '/assets/xyz.jpg'); replaces the placeholder silhouette. */
  img?: string;
}

/** IP data: add new characters here, nothing else needs editing. */
export const CHARACTERS: Character[] = [
  {
    name: 'Character Name',
    role: 'Main Character',
    origin: 'Averix Game',
    universe: '[Universe Name]',
    game: 'Project Alpha',
    color: '#00e5ff',
    open: true,
    desc: 'Placeholder description. A short, spoiler-light introduction to the main character goes here: who they are, what drives them and how they look and feel in the world.',
    backstory: "Placeholder backstory. The character's origin and key moments in the Averix universe go here. Final lore to be supplied by the Averix team.",
    media: ['Character artwork', 'Concept art', 'Screenshots', 'Related media'],
  },
  { name: 'Redacted', role: 'Unrevealed', color: '#9a6bff', open: false },
  { name: 'Redacted', role: 'Unrevealed', color: '#5ad0ff', open: false },
  { name: 'Redacted', role: 'Unrevealed', color: '#c08bff', open: false },
];
