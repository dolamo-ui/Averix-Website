import { firebaseConfig, firebaseEnabled, MUSIC_COLLECTION, MUSIC_RELEASES_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl, cleanLinkUrl } from '@/lib/imageUrl';
import { ALBUM, padTrack, RELEASES, type Album, type Release, type Track } from './musicData';

interface FsValue {
  stringValue?: string;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
}
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

const base = () => `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const str = (f: Record<string, FsValue>, k: string) => f[k]?.stringValue ?? '';

/**
 * Music page content.
 * - Firebase off or failing: the built-in album and releases, so the page always works.
 * - Album: anything the client saved in /admin > Music > Album replaces the built-in text (an empty text box keeps the built-in text).
 * - Releases: once Firebase is connected, only the releases added in /admin are shown (newest first).
 */
export async function getMusic(): Promise<{ album: Album; releases: Release[]; fromCms: boolean }> {
  if (!firebaseEnabled) return { album: ALBUM, releases: RELEASES, fromCms: false };
  const key = `key=${firebaseConfig.apiKey}`;
  let album = ALBUM;
  let releases: Release[] = RELEASES;
  let fromCms = false;

  try {
    const res = await fetch(`${base()}/${MUSIC_COLLECTION}/album?${key}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const f = ((await res.json()) as FsDoc).fields ?? {};
      const tracks: Track[] | null = f.tracks
        ? (f.tracks.arrayValue?.values ?? [])
            .map((v) => v.mapValue?.fields ?? {})
            .map((t) => ({ title: str(t, 'title'), time: str(t, 'time'), url: cleanLinkUrl(str(t, 'url')) || undefined }))
            .filter((t) => t.title)
            .map((t, i) => ({ n: padTrack(i), ...t }))
        : null;
      album = {
        chip: str(f, 'chip') || ALBUM.chip,
        title: str(f, 'title') || ALBUM.title,
        subtitle: str(f, 'subtitle') || ALBUM.subtitle,
        description: str(f, 'description') || ALBUM.description,
        credits: str(f, 'credits') || ALBUM.credits,
        cover: cleanImageUrl(str(f, 'cover')) || ALBUM.cover,
        listenUrl: cleanLinkUrl(str(f, 'listenUrl')),
        spotifyUrl: cleanLinkUrl(str(f, 'spotifyUrl')),
        youtubeUrl: cleanLinkUrl(str(f, 'youtubeUrl')),
        appleUrl: cleanLinkUrl(str(f, 'appleUrl')),
        tracks: tracks ?? ALBUM.tracks,
      };
      fromCms = true;
    }
  } catch {
    /* keep the built-in album */
  }

  try {
    const res = await fetch(`${base()}/${MUSIC_RELEASES_COLLECTION}?pageSize=100&${key}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = (await res.json()) as { documents?: FsDoc[] };
      releases = (json.documents ?? [])
        .map((d) => {
          const f = d.fields ?? {};
          return {
            id: d.name.split('/').pop() as string,
            title: str(f, 'title'),
            artist: str(f, 'artist'),
            time: str(f, 'time'),
            type: str(f, 'type') || 'Single',
            cover: cleanImageUrl(str(f, 'cover')),
            url: cleanLinkUrl(str(f, 'url')) || undefined,
            date: str(f, 'date'),
          };
        })
        .filter((r) => r.title)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 8)
        .map(({ date: _d, ...r }) => r);
      fromCms = true;
    }
  } catch {
    /* keep the built-in releases */
  }

  return { album, releases, fromCms };
}
