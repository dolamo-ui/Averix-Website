export interface NewsPost {
  id: string;
  category: string;
  /** ISO date for the <time> element */
  dateTime: string;
  dateLabel: string;
  title: string;
  summary: string;
  body: string[];
  /** Optional picture (https link) set in the admin. */
  image?: string;
}

/** Sample posts. Replace with real announcements as they happen. */
export const NEWS_POSTS: NewsPost[] = [
  {
    "id": "discord-open",
    "category": "Community",
    "dateTime": "2026-10-08",
    "dateLabel": "8 Oct 2026",
    "title": "The Averix Discord is open",
    "summary": "Our home for updates, event check-ins, team finding and playtests. Come say hello and grab your roles.",
    "body": [
      "The Discord is the primary hub for the Averix community. Expect announcements first, tournament check-ins, a place to find teammates and early access to playtests.",
      "Start in #welcome, then follow #announcements and #playtests. The channel list is a preview and will grow with the community."
    ]
  },
  {
    "id": "project-status",
    "category": "Development",
    "dateTime": "2026-10-14",
    "dateLabel": "14 Oct 2026",
    "title": "How we track every project",
    "summary": "From Concept to Released, every Averix game carries a clear status so you always know where it stands.",
    "body": [
      "Every Averix project carries one of six public statuses: Concept, Prototype, In Development, Early Access, Coming Soon or Released.",
      "You will see the status on the Games page and in each development update, so players, partners and press always know how far along a project is."
    ]
  },
  {
    "id": "community-night-1",
    "category": "Events",
    "dateTime": "2026-10-16",
    "dateLabel": "16 Oct 2026",
    "title": "Community Night #1 is on the calendar",
    "summary": "Casual lobbies, new friends and giveaways. Saturday 24 October, 20:00 SAST, online and free to join.",
    "body": [
      "Community Night is the relaxed way to meet the Averix community: casual lobbies, new teammates and a few giveaways.",
      "It runs online on Saturday 24 October at 20:00 SAST. Join the Discord for the lobby details, and see the Events page for the full schedule."
    ]
  },
  {
    "id": "averix-cup-1",
    "category": "Events",
    "dateTime": "2026-10-18",
    "dateLabel": "18 Oct 2026",
    "title": "Averix Cup #1: what to expect",
    "summary": "Our first tournament is planned for Saturday 7 November, 19:00 SAST, online with Discord check-in.",
    "body": [
      "Averix Cup #1 is our first community tournament: online, team-based and checked in through Discord.",
      "Format, entry details and prizes are published on the Events page before registration opens, so you always know what you are signing up for."
    ]
  },
  {
    "id": "meet-the-team",
    "category": "Studio",
    "dateTime": "2026-10-19",
    "dateLabel": "19 Oct 2026",
    "title": "Meet the team behind the worlds",
    "summary": "Five people covering management, development, sound, art and community.",
    "body": [
      "Tshepiso Nkhodi leads the studio as Managing Director. Linnah Msiza handles business development and coordinates the technical team. Bokamoso Pitso builds the games and the sound that goes with them. Francis Tinashe Sakala designs the visuals. Shane Motsapole looks after the community and audience.",
      "You can find the full team on the About section of the home page."
    ]
  },
  {
    "id": "playtest-weekend",
    "category": "Community",
    "dateTime": "2026-10-20",
    "dateLabel": "20 Oct 2026",
    "title": "Playtest Weekend: how to get a slot",
    "summary": "Try an early build and tell us what works. Planned for Saturday 28 November, 10:00 SAST. Limited slots.",
    "body": [
      "Playtests are how the community helps shape the games. Slots are limited and are announced in #playtests on Discord.",
      "Join the server, watch the announcements channel and be ready to share honest feedback with the team."
    ]
  }
];

export const NEWS_CATEGORIES = ['All', 'Studio', 'Development', 'Community', 'Events'] as const;
