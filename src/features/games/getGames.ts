import { firebaseConfig, firebaseEnabled, GAMES_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { youtubeId } from '@/lib/youtube';
import { GAMES, PIPELINE, type Game } from './gamesData';

interface FsValue {
  stringValue?: string;
  arrayValue?: { values?: FsValue[] };
}
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

/**
 * The games with anything the client set in /admin (Games tab) laid on top of the built-in details:
 * status, texts, key art, trailer (YouTube link), screenshots (image links) and the waiting list / download / play links.
 * Anything left empty in the admin keeps the built-in "coming soon" content. If Firebase is off or fails, the built-in games are used.
 */
export async function getGamesWithAdmin(): Promise<Game[]> {
  if (!firebaseEnabled) return GAMES;
  try {
    const { projectId, apiKey } = firebaseConfig;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${GAMES_COLLECTION}?pageSize=20&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { documents?: FsDoc[] };
    const bySlug = new Map<string, Record<string, FsValue>>();
    for (const d of json.documents ?? []) bySlug.set(d.name.split('/').pop() as string, d.fields ?? {});

    return GAMES.map((g) => {
      const f = bySlug.get(g.slug);
      if (!f) return g;
      const id = youtubeId(f.trailerUrl?.stringValue);
      const shots = (f.screenshots?.arrayValue?.values ?? []).map((v) => cleanImageUrl(v.stringValue)).filter(Boolean);
      const waitlist = cleanImageUrl(f.waitlistUrl?.stringValue); // same https-only check
      const t = (k: string) => (f[k]?.stringValue ?? '').trim();
      const status = PIPELINE.find((p) => p === t('status'));
      return {
        ...g,
        status: status ?? g.status,
        stage: status ? PIPELINE.indexOf(status) + 1 : g.stage,
        tagline: t('tagline') || g.tagline,
        description: t('description') || g.description,
        genre: t('genre') || g.genre,
        platforms: t('platforms') || g.platforms,
        release: t('release') || g.release,
        gameplay: t('gameplay') || g.gameplay,
        story: t('story') || g.story,
        keyArt: cleanImageUrl(t('keyArt')) || g.keyArt,
        trailer: id ? { kind: 'youtube' as const, id } : g.trailer,
        screenshots: shots.length ? shots : g.screenshots,
        links: {
          waitlist: waitlist || g.links.waitlist,
          download: cleanImageUrl(t('downloadUrl')) || g.links.download,
          play: cleanImageUrl(t('playUrl')) || g.links.play,
        },
      };
    });
  } catch {
    return GAMES;
  }
}
