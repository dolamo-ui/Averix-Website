import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { GAMES } from '@/features/games/gamesData';

// Every public page. Game pages are added automatically from src/features/games/gamesData.ts.
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/games', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/events', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/ip', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/community', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/news', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/music', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/partnerships', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...GAMES.map((g) => ({ url: `${SITE_URL}/games/${g.slug}`, lastModified, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
