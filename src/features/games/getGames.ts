import { firebaseConfig, firebaseEnabled, GAMES_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { youtubeId } from '@/lib/youtube';
import { GAMES, PIPELINE, blankGame, type Game } from './gamesData';

interface FsValue {
  stringValue?: string;
  integerValue?: string;
  arrayValue?: { values?: FsValue[] };
}
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}
type Fields = Record<string, FsValue>;

function merge(g: Game, f: Fields): Game {
  const id = youtubeId(f.trailerUrl?.stringValue);
  const shots = (f.screenshots?.arrayValue?.values ?? []).map((v) => cleanImageUrl(v.stringValue)).filter(Boolean);
  const t = (k: string) => (f[k]?.stringValue ?? '').trim();
  const status = PIPELINE.find((p) => p === t('status'));
  return {
    ...g,
    name: t('name') || g.name,
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
      waitlist: cleanImageUrl(t('waitlistUrl')) || g.links.waitlist,
      download: cleanImageUrl(t('downloadUrl')) || g.links.download,
      play: cleanImageUrl(t('playUrl')) || g.links.play,
    },
  };
}

/**
 * The built-in games plus any games the client added in /admin (Games tab), with admin edits laid on top
 * (status, texts, key art, trailer, screenshots, links). If Firebase is off or fails, the built-in games are used.
 */
export async function getGamesWithAdmin(): Promise<Game[]> {
  if (!firebaseEnabled) return GAMES;
  try {
    const { projectId, apiKey } = firebaseConfig;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${GAMES_COLLECTION}?pageSize=100&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { documents?: FsDoc[] };
    const docs = (json.documents ?? []).map((d) => ({ slug: d.name.split('/').pop() as string, f: d.fields ?? {} }));
    const bySlug = new Map(docs.map((d) => [d.slug, d.f]));

    const builtIn = GAMES.map((g) => {
      const f = bySlug.get(g.slug);
      return f ? merge(g, f) : g;
    });
    const added = docs
      .filter((d) => !GAMES.some((g) => g.slug === d.slug) && d.f.name?.stringValue)
      .sort((a, b) => Number(a.f.createdAt?.integerValue ?? 0) - Number(b.f.createdAt?.integerValue ?? 0))
      .map((d, i) => merge(blankGame(d.slug, d.f.name?.stringValue ?? d.slug, GAMES.length + i + 1), d.f));
    return [...builtIn, ...added];
  } catch {
    return GAMES;
  }
}
