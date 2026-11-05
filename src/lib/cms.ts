import { firebaseConfig, firebaseEnabled } from '@/lib/firebase';

/** Minimal reader for Firestore's REST format, so the public pages can load admin content on the server without the Firebase SDK. */
interface FsValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
}
interface FsDoc {
  name: string;
  fields?: Record<string, FsValue>;
}

export type CmsDoc = { id: string } & Record<string, unknown>;

function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields ?? {});
  return undefined;
}

function decodeFields(f: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(f)) out[k] = decode(f[k]);
  return out;
}

const base = () => `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

/** All documents of a collection, or null when Firebase is off or the request fails (callers then use their built-in content). Refreshed about once a minute. */
export async function cmsList(collection: string): Promise<CmsDoc[] | null> {
  if (!firebaseEnabled) return null;
  try {
    const res = await fetch(`${base()}/${collection}?pageSize=300&key=${firebaseConfig.apiKey}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { documents?: FsDoc[] };
    return (json.documents ?? []).map((d) => ({ ...decodeFields(d.fields ?? {}), id: d.name.split('/').pop() as string }));
  } catch {
    return null;
  }
}

/** One document, or null when it does not exist, Firebase is off or the request fails. */
export async function cmsGet(collection: string, id: string): Promise<CmsDoc | null> {
  if (!firebaseEnabled) return null;
  try {
    const res = await fetch(`${base()}/${collection}/${id}?key=${firebaseConfig.apiKey}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const d = (await res.json()) as FsDoc;
    return { ...decodeFields(d.fields ?? {}), id };
  } catch {
    return null;
  }
}

export const asStr = (v: unknown) => (typeof v === 'string' ? v : '');
export const asNum = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
