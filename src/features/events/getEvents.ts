import { firebaseConfig, firebaseEnabled, EVENTS_COLLECTION } from '@/lib/firebase';
import type { SampleEvent } from './sampleEvents';

type FsValue = { stringValue?: string; integerValue?: string; doubleValue?: number };
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

/** Gives every event card its own artwork angle, picked from the event id so it never changes. */
function artFor(id: string): [string, string, string] {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return [`${15 + (h % 70)}%`, `${15 + ((h >> 5) % 60)}%`, `${110 + ((h >> 9) % 110)}deg`];
}

/**
 * Events written in /admin (read from Firestore, refreshed about once a minute).
 * Returns `cms: null` when Firebase is not connected, so the page shows the built-in sample events instead.
 */
export async function getEvents(): Promise<{ cms: SampleEvent[] | null; failed: boolean }> {
  if (!firebaseEnabled) return { cms: null, failed: false };
  try {
    const { projectId, apiKey } = firebaseConfig;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${EVENTS_COLLECTION}?pageSize=300&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { documents?: FsDoc[] };
    const events: SampleEvent[] = [];
    for (const d of json.documents ?? []) {
      const f = d.fields ?? {};
      const str = (k: string) => f[k]?.stringValue ?? '';
      const num = (k: string) => Number(f[k]?.integerValue ?? f[k]?.doubleValue ?? NaN);
      const id = d.name.split('/').pop() as string;
      const start = num('start');
      if (!str('name') || !Number.isFinite(start)) continue;
      const type = str('type');
      events.push({
        id,
        name: str('name'),
        type: type === 'Community' || type === 'Showcase' ? type : 'Tournament',
        game: str('game'),
        start,
        hours: Number.isFinite(num('hours')) ? num('hours') : 2,
        entry: str('entry') || 'Free',
        prize: str('prize') || 'No prize',
        slots: str('slots'),
        format: str('format'),
        reg: str('reg') || 'Opens soon',
        deadline: str('deadline'),
        platform: str('platform'),
        art: artFor(id),
        ticketUrl: /^https:\/\//.test(str('ticketUrl')) ? str('ticketUrl') : undefined,
      });
    }
    return { cms: events, failed: false };
  } catch {
    return { cms: [], failed: true };
  }
}
