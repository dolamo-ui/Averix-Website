import { firebaseConfig, firebaseEnabled, NEWS_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { NEWS_POSTS, type NewsPost } from './posts';

type FsValue = { stringValue?: string };
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * News for the website.
 * - Firebase connected: the posts the client wrote in /admin (read from Firestore, refreshed about once a minute).
 * - Not connected yet: the sample posts, so the site always works.
 */
export async function getNewsPosts(): Promise<{ posts: NewsPost[]; fromCms: boolean; failed: boolean }> {
  if (!firebaseEnabled) return { posts: NEWS_POSTS, fromCms: false, failed: false };
  try {
    const { projectId, apiKey } = firebaseConfig;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${NEWS_COLLECTION}?pageSize=200&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { documents?: FsDoc[] };
    const posts: NewsPost[] = (json.documents ?? [])
      .map((d) => {
        const f = d.fields ?? {};
        const get = (k: string) => f[k]?.stringValue ?? '';
        const date = get('date');
        return {
          id: d.name.split('/').pop() as string,
          category: get('category'),
          dateTime: date,
          dateLabel: date ? dateLabel(date) : '',
          title: get('title'),
          summary: get('summary'),
          image: cleanImageUrl(get('image')) || undefined,
          body: get('body').split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean),
        };
      })
      .filter((p) => p.title && p.dateTime)
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
    return { posts, fromCms: true, failed: false };
  } catch {
    return { posts: [], fromCms: true, failed: true };
  }
}
