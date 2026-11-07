'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { getFirebase, MUSIC_COLLECTION, MUSIC_RELEASES_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl, cleanLinkUrl } from '@/lib/imageUrl';
import { ALBUM, RELEASES, RELEASE_TYPES, type Release } from '@/features/music/musicData';
import ImageField from './ImageField';

interface TrackRow {
  title: string;
  time: string;
  url: string;
}
interface AlbumForm {
  chip: string;
  title: string;
  subtitle: string;
  description: string;
  credits: string;
  cover: string;
  listenUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  appleUrl: string;
  tracks: TrackRow[];
}
interface ReleaseForm {
  id: string;
  title: string;
  artist: string;
  type: string;
  time: string;
  date: string;
  cover: string;
  url: string;
}

interface Props {
  setMsg: (m: string) => void;
}

const TIME = /^\d{1,2}:\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const blankRelease = (): ReleaseForm => ({ id: '', title: '', artist: 'Averix Studio', type: 'Single', time: '', date: today(), cover: '', url: '' });
const defaultAlbum = (): AlbumForm => ({
  ...ALBUM,
  tracks: ALBUM.tracks.map((t) => ({ title: t.title, time: t.time, url: t.url ?? '' })),
});

/** Music tab: the featured album (text, cover, tracklist, streaming links) and the Latest releases list. */
export default function AdminMusic({ setMsg }: Props) {
  const [view, setView] = useState<'album' | 'releases'>('album');
  const [album, setAlbum] = useState<AlbumForm>(defaultAlbum);
  const [albumSaved, setAlbumSaved] = useState(false);
  const [releases, setReleases] = useState<(Release & { date: string })[]>([]);
  const [form, setForm] = useState<ReleaseForm | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDoc(firestore.doc(db, MUSIC_COLLECTION, 'album'));
      if (snap.exists()) {
        const x = snap.data() as Record<string, unknown>;
        const s = (k: string) => String(x[k] ?? '');
        setAlbum({
          chip: s('chip') || ALBUM.chip,
          title: s('title') || ALBUM.title,
          subtitle: s('subtitle') || ALBUM.subtitle,
          description: s('description') || ALBUM.description,
          credits: s('credits') || ALBUM.credits,
          cover: s('cover'),
          listenUrl: s('listenUrl'),
          spotifyUrl: s('spotifyUrl'),
          youtubeUrl: s('youtubeUrl'),
          appleUrl: s('appleUrl'),
          tracks: Array.isArray(x.tracks)
            ? (x.tracks as Record<string, unknown>[]).map((t) => ({ title: String(t.title ?? ''), time: String(t.time ?? ''), url: String(t.url ?? '') }))
            : defaultAlbum().tracks,
        });
        setAlbumSaved(true);
      }
      const rs = await firestore.getDocs(firestore.collection(db, MUSIC_RELEASES_COLLECTION));
      setReleases(
        rs.docs
          .map((d) => {
            const r = d.data() as Record<string, unknown>;
            const s = (k: string) => String(r[k] ?? '');
            return { id: d.id, title: s('title'), artist: s('artist'), type: s('type') || 'Single', time: s('time'), cover: s('cover'), url: s('url'), date: s('date') };
          })
          .sort((a, b) => b.date.localeCompare(a.date)),
      );
    } catch {
      setMsg('Could not load the music. Check your Firestore rules (they need the "music" and "musicReleases" blocks) and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Album ----------
  const setA = (k: Exclude<keyof AlbumForm, 'tracks'>, v: string) => setAlbum((a) => ({ ...a, [k]: v }));
  const setTrack = (i: number, k: keyof TrackRow, v: string) =>
    setAlbum((a) => ({ ...a, tracks: a.tracks.map((t, j) => (j === i ? { ...t, [k]: v } : t)) }));
  const moveTrack = (i: number, d: -1 | 1) =>
    setAlbum((a) => {
      const j = i + d;
      if (j < 0 || j >= a.tracks.length) return a;
      const tracks = [...a.tracks];
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      return { ...a, tracks };
    });

  async function saveAlbum(e: FormEvent) {
    e.preventDefault();
    if (album.cover.trim() && !cleanImageUrl(album.cover)) return setMsg('The cover image link must start with https:// (or leave it empty).');
    for (const [k, label] of [['listenUrl', 'Listen Now'], ['spotifyUrl', 'Spotify'], ['youtubeUrl', 'YouTube'], ['appleUrl', 'Apple Music']] as const) {
      const v = album[k].trim();
      if (v && !cleanLinkUrl(v)) return setMsg(`The ${label} link must start with https:// (or leave it empty).`);
    }
    const tracks = album.tracks.filter((t) => t.title.trim() || t.time.trim() || t.url.trim());
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      if (!t.title.trim()) return setMsg(`Track ${i + 1} needs a title.`);
      if (!TIME.test(t.time.trim())) return setMsg(`Track ${i + 1}: write the length like 3:42.`);
      if (t.url.trim() && !cleanLinkUrl(t.url)) return setMsg(`Track ${i + 1}: the listen link must start with https://`);
    }
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, MUSIC_COLLECTION, 'album'), {
        chip: album.chip.trim(),
        title: album.title.trim(),
        subtitle: album.subtitle.trim(),
        description: album.description.trim(),
        credits: album.credits.trim(),
        cover: cleanImageUrl(album.cover),
        listenUrl: cleanLinkUrl(album.listenUrl),
        spotifyUrl: cleanLinkUrl(album.spotifyUrl),
        youtubeUrl: cleanLinkUrl(album.youtubeUrl),
        appleUrl: cleanLinkUrl(album.appleUrl),
        tracks: tracks.map((t) => ({ title: t.title.trim(), time: t.time.trim(), url: cleanLinkUrl(t.url) })),
      });
      setMsg('Saved. It will show on the Music page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "music" block yet.');
    }
    setBusy(false);
  }

  // ---------- Releases ----------
  const setR = (k: keyof ReleaseForm, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function saveRelease(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && releases.some((r) => r.id === id)) return setMsg('A release with this link name already exists. Change the link name.');
    if (form.time.trim() && !TIME.test(form.time.trim())) return setMsg('Write the length like 3:41.');
    if (form.cover.trim() && !cleanImageUrl(form.cover)) return setMsg('The cover image link must start with https:// (or leave it empty).');
    if (form.url.trim() && !cleanLinkUrl(form.url)) return setMsg('The listen link must start with https:// (or leave it empty).');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, MUSIC_RELEASES_COLLECTION, id), {
        title: form.title.trim(),
        artist: form.artist.trim(),
        type: form.type,
        time: form.time.trim(),
        date: form.date,
        cover: cleanImageUrl(form.cover),
        url: cleanLinkUrl(form.url),
      });
      setForm(null);
      setMsg('Saved. It will show on the Music page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "musicReleases" block yet.');
    }
    setBusy(false);
  }

  async function removeRelease(r: Release) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, MUSIC_RELEASES_COLLECTION, r.id));
      setMsg('Deleted.');
      await load();
    } catch {
      setMsg('Could not delete.');
    }
  }

  async function loadSamples() {
    setBusy(true);
    try {
      const { db, firestore } = await getFirebase();
      for (const r of RELEASES) {
        await firestore.setDoc(firestore.doc(db, MUSIC_RELEASES_COLLECTION, r.id), {
          title: r.title,
          artist: r.artist,
          type: r.type,
          time: r.time,
          date: today(),
          cover: '',
          url: '',
        });
      }
      setMsg('The 4 sample releases were added. Edit or delete them as you like.');
      await load();
    } catch {
      setMsg('Could not add the samples.');
    }
    setBusy(false);
  }

  const switchView = (v: 'album' | 'releases') => {
    setView(v);
    setForm(null);
    setMsg('');
  };

  const subtabs = (
    <div className="subtabs" role="tablist">
      <button type="button" role="tab" aria-selected={view === 'album'} onClick={() => switchView('album')}>Album</button>
      <button type="button" role="tab" aria-selected={view === 'releases'} onClick={() => switchView('releases')}>Latest releases</button>
    </div>
  );

  if (view === 'releases' && form) {
    return (
      <>
        {subtabs}
        <form className="box" onSubmit={saveRelease}>
          <h2>{isNew ? 'New release' : 'Edit release'}</h2>
          <label>
            Title
            <input
              value={form.title}
              maxLength={80}
              required
              onChange={(e) => {
                setR('title', e.target.value);
                if (isNew) setR('id', slugify(e.target.value));
              }}
            />
          </label>
          <label>
            Link name <small>(used internally. Cannot be changed later.)</small>
            <input value={form.id} disabled={!isNew} required onChange={(e) => setR('id', slugify(e.target.value))} />
          </label>
          <div className="row">
            <label>
              Artist
              <input value={form.artist} maxLength={80} required onChange={(e) => setR('artist', e.target.value)} />
            </label>
            <label>
              Type
              <select value={form.type} onChange={(e) => setR('type', e.target.value)}>
                {RELEASE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="row">
            <label>
              Length <small>(like 3:41)</small>
              <input value={form.time} placeholder="3:41" onChange={(e) => setR('time', e.target.value)} />
            </label>
            <label>
              Release date <small>(newest shows first)</small>
              <input type="date" value={form.date} required onChange={(e) => setR('date', e.target.value)} />
            </label>
          </div>
          <ImageField value={form.cover} onChange={(v) => setR('cover', v)} />
          <label>
            Listen link <small>(optional. Spotify, YouTube, SoundCloud... the play button opens it. Empty = “Audio previews unlock at release”.)</small>
            <input type="url" value={form.url} placeholder="https://..." onChange={(e) => setR('url', e.target.value)} />
          </label>
          <div className="bt">
            <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
            <button className="btn s" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      </>
    );
  }

  if (view === 'releases') {
    return (
      <>
        {subtabs}
        <div className="bar">
          <span className="muted">Shown under “New Sounds. New Worlds.” (up to 8, newest first)</span>
          <div>
            <button className="btn p" type="button" onClick={() => { setForm(blankRelease()); setIsNew(true); setMsg(''); window.scrollTo({ top: 0 }); }}>
              New release
            </button>
          </div>
        </div>
        {releases.length === 0 ? (
          <div className="box">
            <p>No releases yet. Once Firebase is connected, the Music page shows only the releases you add here.</p>
            <button className="btn s" type="button" onClick={loadSamples} disabled={busy}>Add the 4 sample releases</button>
          </div>
        ) : (
          <ul className="list">
            {releases.map((r) => (
              <li key={r.id}>
                <div>
                  <b>{r.title}</b>
                  <small>{r.type} · {r.artist} · {r.date}</small>
                </div>
                <div className="bt">
                  <button className="btn s" type="button" onClick={() => { setForm({ ...r, url: r.url ?? '' }); setIsNew(false); setMsg(''); window.scrollTo({ top: 0 }); }}>Edit</button>
                  <button className="btn s danger" type="button" onClick={() => removeRelease(r)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <>
      {subtabs}
      <form className="box" onSubmit={saveAlbum}>
        <h2>Featured album</h2>
        {!albumSaved && <p className="muted">Nothing saved yet. The boxes show what is on the site now; change anything and Publish.</p>}
        <div className="row">
          <label>
            Small label <small>(e.g. Game 01)</small>
            <input value={album.chip} maxLength={30} onChange={(e) => setA('chip', e.target.value)} />
          </label>
          <label>
            Album title
            <input value={album.title} maxLength={80} required onChange={(e) => setA('title', e.target.value)} />
          </label>
        </div>
        <label>
          Subtitle
          <input value={album.subtitle} maxLength={80} onChange={(e) => setA('subtitle', e.target.value)} />
        </label>
        <label>
          Description
          <textarea rows={3} maxLength={400} value={album.description} onChange={(e) => setA('description', e.target.value)} />
        </label>
        <label>
          Credits <small>(one line per credit)</small>
          <textarea rows={2} maxLength={200} value={album.credits} onChange={(e) => setA('credits', e.target.value)} />
        </label>
        <ImageField value={album.cover} onChange={(v) => setA('cover', v)} />
        <small className="muted">Cover image: square pictures look best. Empty keeps the built-in cover.</small>

        <div className="shots-adm">
          <span className="lbl">
            Tracklist <small>(numbers are added automatically. Listen link is optional.)</small>
          </span>
          {album.tracks.map((t, i) => (
            <div className="trackrow" key={i}>
              <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
              <input value={t.title} placeholder="Track title" aria-label={`Track ${i + 1} title`} onChange={(e) => setTrack(i, 'title', e.target.value)} />
              <input value={t.time} placeholder="3:42" aria-label={`Track ${i + 1} length`} className="tm" onChange={(e) => setTrack(i, 'time', e.target.value)} />
              <input type="url" value={t.url} placeholder="Listen link (optional)" aria-label={`Track ${i + 1} listen link`} className="tu" onChange={(e) => setTrack(i, 'url', e.target.value)} />
              <div className="tb">
                <button className="btn s" type="button" onClick={() => moveTrack(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button className="btn s" type="button" onClick={() => moveTrack(i, 1)} disabled={i === album.tracks.length - 1} aria-label="Move down">↓</button>
                <button className="btn s danger" type="button" onClick={() => setAlbum((a) => ({ ...a, tracks: a.tracks.filter((_, j) => j !== i) }))}>Remove</button>
              </div>
            </div>
          ))}
          <button className="btn s" type="button" onClick={() => setAlbum((a) => ({ ...a, tracks: [...a.tracks, { title: '', time: '', url: '' }] }))}>
            Add a track
          </button>
        </div>

        <label>
          Listen Now link <small>(optional. Empty = the button says streaming opens at release.)</small>
          <input type="url" value={album.listenUrl} placeholder="https://..." onChange={(e) => setA('listenUrl', e.target.value)} />
        </label>
        <div className="row3">
          <label>
            Spotify link
            <input type="url" value={album.spotifyUrl} placeholder="https://open.spotify.com/..." onChange={(e) => setA('spotifyUrl', e.target.value)} />
          </label>
          <label>
            YouTube link
            <input type="url" value={album.youtubeUrl} placeholder="https://youtube.com/..." onChange={(e) => setA('youtubeUrl', e.target.value)} />
          </label>
          <label>
            Apple Music link
            <input type="url" value={album.appleUrl} placeholder="https://music.apple.com/..." onChange={(e) => setA('appleUrl', e.target.value)} />
          </label>
        </div>
        <div className="bt">
          <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
        </div>
      </form>
    </>
  );
}
