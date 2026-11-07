export interface Member {
  id: string;
  name: string;
  role: string;
  /** Small label on the card, e.g. "Leadership". */
  dept: string;
  blurb: string;
  /** Optional photo (https link) set in the admin. Without one the card shows initials. */
  photo?: string;
}

export const initialsOf = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (w.length === 0) return '?';
  return ((w[0][0] ?? '') + (w.length > 1 ? (w[w.length - 1][0] ?? '') : '')).toUpperCase();
};

/** Built-in team, shown until the client saves their own in /admin > Team. */
export const TEAM: Member[] = [
  { id: 'tshepiso-nkhodi', name: 'Tshepiso Nkhodi', role: 'Managing Director', dept: 'Leadership', blurb: 'Studio direction, strategy and the long-term vision for Averix.' },
  { id: 'linnah-msiza', name: 'Linnah Msiza', role: 'Business Development Executive & Technical Team Coordinator', dept: 'Business & Tech', blurb: 'Partnerships, growth opportunities and keeping the technical team in sync.' },
  { id: 'bokamoso-pitso', name: 'Bokamoso Pitso', role: 'Game Developer & Sound Engineer', dept: 'Development', blurb: 'Building the games and shaping how they sound.' },
  { id: 'francis-tinashe-sakala', name: 'Francis Tinashe Sakala', role: 'Graphics Designer', dept: 'Art & Design', blurb: 'Visual identity, artwork and the look of the Averix universe.' },
  { id: 'shane-motsapole', name: 'Shane Motsapole', role: 'Community & Audience Lead', dept: 'Community', blurb: 'Growing the community and keeping players connected to the studio.' },
];
