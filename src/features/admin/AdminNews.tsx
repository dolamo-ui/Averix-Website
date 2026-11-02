'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { firebaseEnabled, getFirebase, NEWS_COLLECTION } from '@/lib/firebase';
import { NEWS_POSTS } from '@/features/news/posts';
import AdminEvents from './AdminEvents';
import AdminEnquiries from './AdminEnquiries';

const CATEGORIES = ['Studio', 'Development', 'Community', 'Events'] as const;

interface Row {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  body: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const blank = (): Row => ({ id: '', title: '', category: 'Studio', date: today(), summary: '', body: '' });
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

/** Private news manager: sign in, then add, edit or delete News posts. Needs the Firebase values from .env.local. */
export default function AdminNews() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'news' | 'events' | 'enquiries'>('news');
  const [newEnq, setNewEnq] = useState(0);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.query(firestore.collection(db, NEWS_COLLECTION), firestore.orderBy('date', 'desc')));
      setRows(snap.docs.map((d) => ({ ...(d.data() as Omit<Row, 'id'>), id: d.id })));
    } catch {
      setMsg('Could not load posts. Check your Firestore rules and that you are allowed to edit.');
    }
  }, []);

  useEffect(() => {
    if (!firebaseEnabled) {
      setUser(null);
      return;
    }
    let off = () => {};
    getFirebase().then(async ({ auth }) => {
      const { onAuthStateChanged } = await import('firebase/auth');
      off = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) load();
      });
    });
    return () => off();
  }, [load]);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const { auth } = await getFirebase();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch {
      setMsg('Sign-in failed. Check your email and password.');
    }
    setBusy(false);
  }

  async function signOut() {
    const { auth } = await getFirebase();
    const { signOut: out } = await import('firebase/auth');
    await out(auth);
    setRows([]);
    setForm(null);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && rows.some((r) => r.id === id)) return setMsg('A post with this link name already exists. Change the link name.');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      const { id: _omit, ...data } = form;
      await firestore.setDoc(firestore.doc(db, NEWS_COLLECTION, id), data);
      setForm(null);
      setMsg('Saved. It will show on the News page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit.');
    }
    setBusy(false);
  }

  async function remove(r: Row) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, NEWS_COLLECTION, r.id));
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
      for (const p of NEWS_POSTS) {
        await firestore.setDoc(firestore.doc(db, NEWS_COLLECTION, p.id), {
          title: p.title,
          category: p.category,
          date: p.dateTime,
          summary: p.summary,
          body: p.body.join('\n\n'),
        });
      }
      setMsg('The 6 sample posts were added. Edit or delete them as you like.');
      await load();
    } catch {
      setMsg('Could not add the samples.');
    }
    setBusy(false);
  }

  const set = (k: keyof Row, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <section className="adm">
      <span className="eyebrow">PRIVATE</span>
      <h1>Admin</h1>

      {!firebaseEnabled && (
        <p className="warn">Firebase is not connected yet. Follow FIREBASE-SETUP.md to add the four Firebase values, then reload this page.</p>
      )}

      {firebaseEnabled && user === undefined && <p className="muted">Loading…</p>}

      {firebaseEnabled && user === null && (
        <form className="box" onSubmit={signIn}>
          <h2>Sign in</h2>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          <button className="btn p" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      )}

      {user && (
        <>
          <div className="bar">
            <span className="muted">Signed in as {user.email}</span>
            <div>
              {tab === 'news' && !form && (
                <button className="btn p" type="button" onClick={() => { setForm(blank()); setIsNew(true); setMsg(''); }}>
                  New post
                </button>
              )}
              <button className="btn s" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          </div>

          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'news'} onClick={() => { setTab('news'); setMsg(''); }}>News</button>
            <button type="button" role="tab" aria-selected={tab === 'events'} onClick={() => { setTab('events'); setForm(null); setMsg(''); }}>Events</button>
            <button type="button" role="tab" aria-selected={tab === 'enquiries'} onClick={() => { setTab('enquiries'); setForm(null); setMsg(''); }}>Enquiries{newEnq > 0 ? ` (${newEnq})` : ''}</button>
          </div>

          {tab === 'events' ? (
            <AdminEvents setMsg={setMsg} />
          ) : tab === 'enquiries' ? (
            <AdminEnquiries setMsg={setMsg} onCount={setNewEnq} />
          ) : form ? (
            <form className="box" onSubmit={save}>
              <h2>{isNew ? 'New post' : 'Edit post'}</h2>
              <label>
                Title
                <input
                  value={form.title}
                  maxLength={90}
                  required
                  onChange={(e) => {
                    set('title', e.target.value);
                    if (isNew) set('id', slugify(e.target.value));
                  }}
                />
              </label>
              <label>
                Link name <small>(web address part, e.g. news#my-update. Cannot be changed later.)</small>
                <input value={form.id} disabled={!isNew} required onChange={(e) => set('id', slugify(e.target.value))} />
              </label>
              <div className="row">
                <label>
                  Category
                  <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Date
                  <input type="date" value={form.date} required onChange={(e) => set('date', e.target.value)} />
                </label>
              </div>
              <label>
                Short summary <small>(1–2 sentences, shown on the card)</small>
                <textarea rows={3} maxLength={220} value={form.summary} required onChange={(e) => set('summary', e.target.value)} />
              </label>
              <label>
                Full update <small>(leave a blank line between paragraphs)</small>
                <textarea rows={9} value={form.body} required onChange={(e) => set('body', e.target.value)} />
              </label>
              <div className="bt">
                <button className="btn p" type="submit" disabled={busy}>
                  {busy ? 'Saving…' : 'Publish'}
                </button>
                <button className="btn s" type="button" onClick={() => setForm(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {rows.length === 0 ? (
                <div className="box">
                  <p>No posts yet.</p>
                  <button className="btn s" type="button" onClick={loadSamples} disabled={busy}>
                    Add the 6 sample posts
                  </button>
                </div>
              ) : (
                <ul className="list">
                  {rows.map((r) => (
                    <li key={r.id}>
                      <div>
                        <b>{r.title}</b>
                        <small>
                          {r.category} · {r.date}
                        </small>
                      </div>
                      <div className="bt">
                        <button className="btn s" type="button" onClick={() => { setForm(r); setIsNew(false); setMsg(''); window.scrollTo({ top: 0 }); }}>
                          Edit
                        </button>
                        <button className="btn s danger" type="button" onClick={() => remove(r)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}

      {msg && (
        <p className="msg" role="status">
          {msg}
        </p>
      )}
    </section>
  );
}
