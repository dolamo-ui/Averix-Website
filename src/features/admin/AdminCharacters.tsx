'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CHARACTERS_COLLECTION, getFirebase } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import ImageField from './ImageField';

interface Row {
  id: string;
  name: string;
  role: string;
  color: string;
  open: boolean;
  origin: string;
  universe: string;
  game: string;
  desc: string;
  backstory: string;
  media: string;
  img: string;
  order: number;
}

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const blank = (order: number): Row => ({ id: '', name: '', role: '', color: '#00e5ff', open: true, origin: 'Averix Game', universe: '', game: '', desc: '', backstory: '', media: '', img: '', order });

/** Characters tab: the IP page character grid. Revealed characters open a full profile; the rest show as "Classified". */
export default function AdminCharacters({ setMsg }: { setMsg: (m: string) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.collection(db, CHARACTERS_COLLECTION));
      const list = snap.docs.map((d) => {
        const x = d.data() as Record<string, unknown>;
        const s = (k: string) => String(x[k] ?? '');
        return {
          id: d.id, name: s('name'), role: s('role'), color: s('color') || '#00e5ff', open: x.open === true,
          origin: s('origin'), universe: s('universe'), game: s('game'), desc: s('desc'), backstory: s('backstory'),
          media: s('media'), img: s('img'), order: Number(x.order ?? 999),
        };
      });
      list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      setRows(list);
    } catch {
      setMsg('Could not load the characters. Check your Firestore rules (they need the "characters" block) and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof Row, v: string | number | boolean) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && rows.some((r) => r.id === id)) return setMsg('A character with this link name already exists. Change the link name.');
    if (form.img.trim() && !cleanImageUrl(form.img)) return setMsg('The artwork link must start with https:// (or leave it empty).');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, CHARACTERS_COLLECTION, id), {
        name: form.name.trim(),
        role: form.role.trim(),
        color: form.color,
        open: form.open,
        origin: form.origin.trim(),
        universe: form.universe.trim(),
        game: form.game.trim(),
        desc: form.desc.trim(),
        backstory: form.backstory.trim(),
        media: form.media.trim(),
        img: cleanImageUrl(form.img),
        order: Number(form.order) || 1,
      });
      setForm(null);
      setMsg('Saved. It will show on the IP page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "characters" block yet.');
    }
    setBusy(false);
  }

  async function remove(r: Row) {
    if (!window.confirm(`Delete "${r.name}"? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, CHARACTERS_COLLECTION, r.id));
      setMsg('Deleted.');
      await load();
    } catch {
      setMsg('Could not delete.');
    }
  }

  if (form) {
    return (
      <form className="box" onSubmit={save}>
        <h2>{isNew ? 'New character' : 'Edit character'}</h2>
        <label>
          Name <small>(for an unrevealed character, use “Redacted”)</small>
          <input
            value={form.name}
            maxLength={60}
            required
            onChange={(e) => {
              set('name', e.target.value);
              if (isNew) set('id', slugify(e.target.value));
            }}
          />
        </label>
        <label>
          Link name <small>(used internally. Cannot be changed later.)</small>
          <input value={form.id} disabled={!isNew} required onChange={(e) => set('id', slugify(e.target.value))} />
        </label>
        <div className="row3">
          <label>
            Role
            <input value={form.role} maxLength={60} required onChange={(e) => set('role', e.target.value)} />
          </label>
          <label>
            Colour
            <input type="color" value={form.color} onChange={(e) => set('color', e.target.value)} />
          </label>
          <label>
            Position <small>(1 = first)</small>
            <input type="number" min={1} max={99} value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </label>
        </div>
        <label className="chk">
          <input type="checkbox" checked={form.open} onChange={(e) => set('open', e.target.checked)} />
          Revealed <small>(tick to show the full profile. Untick to show it as locked / “Classified”.)</small>
        </label>
        {form.open && (
          <>
            <div className="row">
              <label>
                Origin
                <input value={form.origin} maxLength={80} onChange={(e) => set('origin', e.target.value)} />
              </label>
              <label>
                Universe
                <input value={form.universe} maxLength={80} onChange={(e) => set('universe', e.target.value)} />
              </label>
            </div>
            <label>
              Relevant game <small>(e.g. Project Alpha. Links to that game&apos;s page.)</small>
              <input value={form.game} maxLength={60} onChange={(e) => set('game', e.target.value)} />
            </label>
            <label>
              Description
              <textarea rows={3} maxLength={600} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
            </label>
            <label>
              Backstory
              <textarea rows={5} maxLength={2000} value={form.backstory} onChange={(e) => set('backstory', e.target.value)} />
            </label>
            <label>
              Artwork &amp; media labels <small>(one per line, e.g. Concept art)</small>
              <textarea rows={3} maxLength={300} value={form.media} onChange={(e) => set('media', e.target.value)} />
            </label>
          </>
        )}
        <ImageField value={form.img} onChange={(v) => set('img', v)} />
        <small className="muted">Artwork: a tall portrait works best. Without one, a silhouette is shown.</small>
        <div className="bt">
          <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
          <button className="btn s" type="button" onClick={() => setForm(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="bar">
        <span className="muted">Shown on the IP page. Once you add one, the placeholder characters disappear.</span>
        <div>
          <button className="btn p" type="button" onClick={() => { setForm(blank(rows.length + 1)); setIsNew(true); setMsg(''); window.scrollTo({ top: 0 }); }}>
            New character
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="box"><p>No characters yet, so the IP page shows the built-in placeholders.</p></div>
      ) : (
        <ul className="list">
          {rows.map((r) => (
            <li key={r.id}>
              <div>
                <b>{r.order}. {r.name}</b>
                <small>{r.role} · {r.open ? 'Revealed' : 'Locked'}</small>
              </div>
              <div className="bt">
                <button className="btn s" type="button" onClick={() => { setForm(r); setIsNew(false); setMsg(''); window.scrollTo({ top: 0 }); }}>Edit</button>
                <button className="btn s danger" type="button" onClick={() => remove(r)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
