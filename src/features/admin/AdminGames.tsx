'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { GAMES_COLLECTION, getFirebase } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { youtubeId } from '@/lib/youtube';
import { GAMES, PIPELINE } from '@/features/games/gamesData';
import ImageField from './ImageField';
import UploadButton from './UploadButton';

/** Everything the client can set per game. Empty text keeps the built-in text of that game. */
interface Saved {
  status: string;
  tagline: string;
  description: string;
  genre: string;
  platforms: string;
  release: string;
  gameplay: string;
  story: string;
  keyArt: string;
  trailerUrl: string;
  screenshots: string[];
  waitlistUrl: string;
  downloadUrl: string;
  playUrl: string;
}
interface Form extends Saved {
  slug: string;
  name: string;
}

interface Props {
  setMsg: (m: string) => void;
}

/** Edit each game's status, texts, key art, trailer (YouTube link), screenshots (image links) and waiting list / download / play links. */
export default function AdminGames({ setMsg }: Props) {
  const [saved, setSaved] = useState<Record<string, Saved>>({});
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.collection(db, GAMES_COLLECTION));
      const out: Record<string, Saved> = {};
      snap.docs.forEach((d) => {
        const x = d.data() as Record<string, unknown>;
        const s = (k: string) => String(x[k] ?? '');
        out[d.id] = {
          status: s('status'),
          tagline: s('tagline'),
          description: s('description'),
          genre: s('genre'),
          platforms: s('platforms'),
          release: s('release'),
          gameplay: s('gameplay'),
          story: s('story'),
          keyArt: s('keyArt'),
          trailerUrl: s('trailerUrl'),
          screenshots: Array.isArray(x.screenshots) ? x.screenshots.map(String) : [],
          waitlistUrl: s('waitlistUrl'),
          downloadUrl: s('downloadUrl'),
          playUrl: s('playUrl'),
        };
      });
      setSaved(out);
    } catch {
      setMsg('Could not load the games. Check your Firestore rules (they need the "games" block) and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const edit = (slug: string) => {
    const g = GAMES.find((x) => x.slug === slug);
    if (!g) return;
    const s = saved[slug];
    // Empty boxes show the built-in text, so the client edits what is on the site now.
    setForm({
      slug,
      name: g.name,
      status: s?.status || g.status,
      tagline: s?.tagline || g.tagline,
      description: s?.description || g.description,
      genre: s?.genre || g.genre,
      platforms: s?.platforms || g.platforms,
      release: s?.release || g.release,
      gameplay: s?.gameplay || g.gameplay,
      story: s?.story || g.story,
      keyArt: s?.keyArt ?? '',
      trailerUrl: s?.trailerUrl ?? '',
      screenshots: s?.screenshots?.length ? s.screenshots : [''],
      waitlistUrl: s?.waitlistUrl ?? '',
      downloadUrl: s?.downloadUrl ?? '',
      playUrl: s?.playUrl ?? '',
    });
    setMsg('');
    window.scrollTo({ top: 0 });
  };

  const setShot = (i: number, v: string) =>
    setForm((f) => (f ? { ...f, screenshots: f.screenshots.map((x, j) => (j === i ? v : x)) } : f));
  const set = (k: keyof Form, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const trailer = form.trailerUrl.trim();
    if (trailer && !youtubeId(trailer)) return setMsg('The trailer link must be a YouTube link, for example https://www.youtube.com/watch?v=...');
    const shots = form.screenshots.map((s) => s.trim()).filter(Boolean);
    const badShot = shots.findIndex((s) => !cleanImageUrl(s));
    if (badShot !== -1) return setMsg(`Screenshot ${badShot + 1} must be a link that starts with https://`);
    if (form.keyArt.trim() && !cleanImageUrl(form.keyArt)) return setMsg('The key art link must start with https://');
    for (const [k, label] of [['waitlistUrl', 'waiting list'], ['downloadUrl', 'download'], ['playUrl', 'play']] as const) {
      const v = form[k].trim();
      if (v && !cleanImageUrl(v)) return setMsg(`The ${label} link must start with https://`);
    }
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, GAMES_COLLECTION, form.slug), {
        status: form.status,
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        genre: form.genre.trim(),
        platforms: form.platforms.trim(),
        release: form.release.trim(),
        gameplay: form.gameplay.trim(),
        story: form.story.trim(),
        keyArt: cleanImageUrl(form.keyArt),
        trailerUrl: trailer,
        screenshots: shots.map((s) => cleanImageUrl(s)),
        waitlistUrl: cleanImageUrl(form.waitlistUrl),
        downloadUrl: cleanImageUrl(form.downloadUrl),
        playUrl: cleanImageUrl(form.playUrl),
      });
      setForm(null);
      setMsg('Saved. It will show on the Games pages within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "games" block yet.');
    }
    setBusy(false);
  }

  if (form) {
    const vid = youtubeId(form.trailerUrl);
    return (
      <form className="box" onSubmit={save}>
        <h2>{form.name}</h2>

        <div className="row">
          <label>
            Stage
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              {PIPELINE.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Release <small>(e.g. Q3 2027, or “To be announced”)</small>
            <input value={form.release} maxLength={60} onChange={(e) => set('release', e.target.value)} />
          </label>
        </div>
        <label>
          Tagline <small>(one short line under the title)</small>
          <input value={form.tagline} maxLength={120} onChange={(e) => set('tagline', e.target.value)} />
        </label>
        <div className="row">
          <label>
            Genre
            <input value={form.genre} maxLength={60} onChange={(e) => set('genre', e.target.value)} />
          </label>
          <label>
            Platforms
            <input value={form.platforms} maxLength={80} onChange={(e) => set('platforms', e.target.value)} />
          </label>
        </div>
        <label>
          Description <small>(shown on the Games page and at the top of the game page)</small>
          <textarea rows={3} maxLength={400} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </label>
        <label>
          Gameplay
          <textarea rows={4} maxLength={1200} value={form.gameplay} onChange={(e) => set('gameplay', e.target.value)} />
        </label>
        <label>
          Story
          <textarea rows={4} maxLength={1200} value={form.story} onChange={(e) => set('story', e.target.value)} />
        </label>

        <ImageField value={form.keyArt} onChange={(v) => set('keyArt', v)} />
        <small className="muted">Key art: the big picture for this game. Wide pictures look best. Empty keeps the built-in artwork.</small>

        <label>
          Trailer video <small>(paste the YouTube link. Leave empty to show “Trailer coming soon”.)</small>
          <input type="url" value={form.trailerUrl} placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => set('trailerUrl', e.target.value)} />
          {form.trailerUrl.trim() && !vid && <small className="warn">This does not look like a YouTube link.</small>}
          {vid && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="imgprev" src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt="Trailer preview" />
          )}
        </label>

        <div className="shots-adm">
          <span className="lbl">
            Screenshots <small>(one picture link in each box. Leave empty to show “Coming soon”.)</small>
          </span>
          {form.screenshots.map((s, i) => {
            const url = cleanImageUrl(s);
            return (
              <div className="shotrow" key={i}>
                <input
                  type="url"
                  value={s}
                  placeholder="https://example.com/screenshot.jpg"
                  aria-label={`Screenshot ${i + 1} link`}
                  onChange={(e) => setShot(i, e.target.value)}
                />
                <span className="shotbt">
                  <UploadButton label="Upload" onUploaded={(u) => setShot(i, u)} />
                </span>
                <button
                  className="btn s danger"
                  type="button"
                  onClick={() => setForm({ ...form, screenshots: form.screenshots.length > 1 ? form.screenshots.filter((_, j) => j !== i) : [''] })}
                >
                  Remove
                </button>
                {s.trim() && !url && <small className="warn">Must start with https://</small>}
                {url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="imgprev" src={url} alt={`Screenshot ${i + 1} preview`} />
                )}
              </div>
            );
          })}
          <button className="btn s" type="button" onClick={() => setForm({ ...form, screenshots: [...form.screenshots, ''] })}>
            Add another screenshot
          </button>
        </div>

        <label>
          Waiting list link <small>(optional. A sign-up form or page. When empty, the button shows “The waiting list opens soon”.)</small>
          <input type="url" value={form.waitlistUrl} placeholder="https://..." onChange={(e) => set('waitlistUrl', e.target.value)} />
        </label>
        <div className="row">
          <label>
            Download link <small>(optional. Store or download page)</small>
            <input type="url" value={form.downloadUrl} placeholder="https://..." onChange={(e) => set('downloadUrl', e.target.value)} />
          </label>
          <label>
            Play / test sign-up link <small>(optional)</small>
            <input type="url" value={form.playUrl} placeholder="https://..." onChange={(e) => set('playUrl', e.target.value)} />
          </label>
        </div>

        <div className="bt">
          <button className="btn p" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Publish'}
          </button>
          <button className="btn s" type="button" onClick={() => setForm(null)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <ul className="list">
      {GAMES.map((g) => {
        const s = saved[g.slug];
        return (
          <li key={g.slug}>
            <div>
              <b>{g.name}</b>
              <small>
                {s?.status || g.status} · {s?.trailerUrl ? 'Trailer added' : 'No trailer'} · {s?.screenshots?.length ?? 0} screenshot{(s?.screenshots?.length ?? 0) === 1 ? '' : 's'}
              </small>
            </div>
            <div className="bt">
              <button className="btn s" type="button" onClick={() => edit(g.slug)}>
                Edit
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
