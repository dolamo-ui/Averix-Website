'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { getFirebase, TEAM_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { TEAM } from '@/features/about/teamData';
import ImageField from './ImageField';

interface Row {
  id: string;
  name: string;
  role: string;
  dept: string;
  blurb: string;
  photo: string;
  order: number;
}

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

/** Team tab: the people shown on the About page and at the bottom of every game page. */
export default function AdminTeam({ setMsg }: { setMsg: (m: string) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.collection(db, TEAM_COLLECTION));
      const list = snap.docs.map((d) => {
        const x = d.data() as Record<string, unknown>;
        const s = (k: string) => String(x[k] ?? '');
        return { id: d.id, name: s('name'), role: s('role'), dept: s('dept'), blurb: s('blurb'), photo: s('photo'), order: Number(x.order ?? 999) };
      });
      list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      setRows(list);
    } catch {
      setMsg('Could not load the team. Check your Firestore rules (they need the "team" block) and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof Row, v: string | number) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && rows.some((r) => r.id === id)) return setMsg('A team member with this link name already exists. Change the link name.');
    if (form.photo.trim() && !cleanImageUrl(form.photo)) return setMsg('The photo link must start with https:// (or leave it empty).');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, TEAM_COLLECTION, id), {
        name: form.name.trim(),
        role: form.role.trim(),
        dept: form.dept.trim(),
        blurb: form.blurb.trim(),
        photo: cleanImageUrl(form.photo),
        order: Number(form.order) || 1,
      });
      setForm(null);
      setMsg('Saved. It will show on the About page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "team" block yet.');
    }
    setBusy(false);
  }

  async function remove(r: Row) {
    if (!window.confirm(`Remove ${r.name} from the team? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, TEAM_COLLECTION, r.id));
      setMsg('Removed.');
      await load();
    } catch {
      setMsg('Could not remove.');
    }
  }

  async function loadSamples() {
    setBusy(true);
    try {
      const { db, firestore } = await getFirebase();
      for (let i = 0; i < TEAM.length; i++) {
        const m = TEAM[i];
        await firestore.setDoc(firestore.doc(db, TEAM_COLLECTION, m.id), { name: m.name, role: m.role, dept: m.dept, blurb: m.blurb, photo: '', order: i + 1 });
      }
      setMsg('The current 5 team members were added. Edit, reorder or remove them as you like.');
      await load();
    } catch {
      setMsg('Could not add the team.');
    }
    setBusy(false);
  }

  if (form) {
    return (
      <form className="box" onSubmit={save}>
        <h2>{isNew ? 'New team member' : 'Edit team member'}</h2>
        <label>
          Name
          <input
            value={form.name}
            maxLength={80}
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
        <label>
          Role / job title
          <input value={form.role} maxLength={120} required onChange={(e) => set('role', e.target.value)} />
        </label>
        <div className="row">
          <label>
            Department label <small>(small tag on the card, e.g. Development)</small>
            <input value={form.dept} maxLength={40} onChange={(e) => set('dept', e.target.value)} />
          </label>
          <label>
            Position <small>(1 = first on the page)</small>
            <input type="number" min={1} max={99} value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </label>
        </div>
        <label>
          Short description
          <textarea rows={3} maxLength={200} value={form.blurb} onChange={(e) => set('blurb', e.target.value)} />
        </label>
        <ImageField value={form.photo} onChange={(v) => set('photo', v)} />
        <small className="muted">Photo: optional. Without one, the card shows the person&apos;s initials.</small>
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
        <span className="muted">Shown on the About page and on every game page</span>
        <div>
          <button
            className="btn p"
            type="button"
            onClick={() => { setForm({ id: '', name: '', role: '', dept: '', blurb: '', photo: '', order: rows.length + 1 }); setIsNew(true); setMsg(''); window.scrollTo({ top: 0 }); }}
          >
            New team member
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="box">
          <p>No team members saved yet, so the site shows the built-in team. Load them here to start editing.</p>
          <button className="btn s" type="button" onClick={loadSamples} disabled={busy}>Add the current 5 team members</button>
        </div>
      ) : (
        <ul className="list">
          {rows.map((r) => (
            <li key={r.id}>
              <div>
                <b>{r.order}. {r.name}</b>
                <small>{r.role}</small>
              </div>
              <div className="bt">
                <button className="btn s" type="button" onClick={() => { setForm(r); setIsNew(false); setMsg(''); window.scrollTo({ top: 0 }); }}>Edit</button>
                <button className="btn s danger" type="button" onClick={() => remove(r)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
