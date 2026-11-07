'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { getFirebase, IP_COLLECTION, IP_VAULT_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { GAMES } from '@/features/games/gamesData';
import { GAME_LINKS, GAME_SLUGS, LINKS_DOC, UNIVERSE, UNIVERSE_DOC, VAULT, type GameSlug, type Universe, type VaultItem } from '@/features/ip/ipData';
import ImageField from './ImageField';

type Msg = { setMsg: (m: string) => void };

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const gameName = (s: GameSlug) => GAMES.find((g) => g.slug === s)?.name ?? s;

/* ---------------------------------------------------------------- Featured universe */

function UniverseEditor({ setMsg }: Msg) {
  const [f, setF] = useState<Universe>(UNIVERSE);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { db, firestore } = await getFirebase();
        const snap = await firestore.getDoc(firestore.doc(db, IP_COLLECTION, UNIVERSE_DOC));
        if (!snap.exists()) return;
        const x = snap.data() as Record<string, unknown>;
        const s = (k: keyof Universe) => String(x[k] ?? '') || (UNIVERSE[k] as string);
        const game = String(x.game ?? '') as GameSlug;
        setF({
          chip: s('chip'), label: s('label'), title: s('title'), desc: s('desc'),
          game: GAME_SLUGS.includes(game) ? game : UNIVERSE.game,
          status: s('status'), genre: s('genre'), platforms: s('platforms'),
          note: String(x.note ?? ''), tag: s('tag'), img: String(x.img ?? ''),
        });
      } catch {
        setMsg('Could not load the featured universe. Check that your Firestore rules have the "ip" block and that you are allowed to edit.');
      }
    })();
  }, [setMsg]);

  const set = (k: keyof Universe, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (f.img.trim() && !cleanImageUrl(f.img)) return setMsg('The artwork link must start with https:// (or leave it empty).');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, IP_COLLECTION, UNIVERSE_DOC), {
        chip: f.chip.trim(), label: f.label.trim(), title: f.title.trim(), desc: f.desc.trim(), game: f.game,
        status: f.status.trim(), genre: f.genre.trim(), platforms: f.platforms.trim(), note: f.note.trim(),
        tag: f.tag.trim(), img: cleanImageUrl(f.img),
      });
      setMsg('Saved. The featured universe updates on the IP page within about a minute.');
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "ip" block yet.');
    }
    setBusy(false);
  }

  async function reset() {
    if (!window.confirm('Go back to the built-in featured universe text? Your edits here will be removed.')) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, IP_COLLECTION, UNIVERSE_DOC));
      setF(UNIVERSE);
      setMsg('Back to the built-in text.');
    } catch {
      setMsg('Could not reset.');
    }
  }

  return (
    <form className="box" onSubmit={save}>
      <h2>Featured universe — “The first world.”</h2>
      <small className="muted">The big card on the IP page. Leave a box empty to keep the built-in text.</small>
      <div className="row">
        <label>
          Label chip <small>(top of the card)</small>
          <input value={f.chip} maxLength={60} onChange={(e) => set('chip', e.target.value)} />
        </label>
        <label>
          Universe name line
          <input value={f.label} maxLength={80} onChange={(e) => set('label', e.target.value)} />
        </label>
      </div>
      <label>
        Headline
        <input value={f.title} maxLength={100} onChange={(e) => set('title', e.target.value)} />
      </label>
      <label>
        Description
        <textarea rows={5} maxLength={800} value={f.desc} onChange={(e) => set('desc', e.target.value)} />
      </label>
      <div className="row">
        <label>
          Origin game <small>(name and button link come from the Games tab)</small>
          <select value={f.game} onChange={(e) => set('game', e.target.value)}>
            {GAME_SLUGS.map((s) => (
              <option key={s} value={s}>{gameName(s)}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <input value={f.status} maxLength={40} list="uv-status" onChange={(e) => set('status', e.target.value)} />
          <datalist id="uv-status">
            <option value="Concept" />
            <option value="In production" />
            <option value="Revealed" />
          </datalist>
        </label>
      </div>
      <div className="row">
        <label>
          Genre
          <input value={f.genre} maxLength={60} onChange={(e) => set('genre', e.target.value)} />
        </label>
        <label>
          Platforms
          <input value={f.platforms} maxLength={80} onChange={(e) => set('platforms', e.target.value)} />
        </label>
      </div>
      <label>
        Small note <small>(shown under the details. Empty = not shown, so clear it when the real lore is in.)</small>
        <input value={f.note} maxLength={160} onChange={(e) => set('note', e.target.value)} />
      </label>
      <label>
        Artwork label <small>(small tag on the picture)</small>
        <input value={f.tag} maxLength={40} onChange={(e) => set('tag', e.target.value)} />
      </label>
      <ImageField value={f.img} onChange={(v) => set('img', v)} />
      <small className="muted">Artwork: a wide or square picture works best. Without one, the animated rings are shown.</small>
      <div className="bt">
        <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
        <button className="btn s" type="button" onClick={reset}>Use built-in text</button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- IP × Games */

function GamesLinkEditor({ setMsg }: Msg) {
  const [f, setF] = useState<Record<GameSlug, string>>(GAME_LINKS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { db, firestore } = await getFirebase();
        const snap = await firestore.getDoc(firestore.doc(db, IP_COLLECTION, LINKS_DOC));
        if (!snap.exists()) return;
        const x = snap.data() as Record<string, unknown>;
        setF({
          alpha: String(x.alpha ?? '') || GAME_LINKS.alpha,
          beta: String(x.beta ?? '') || GAME_LINKS.beta,
          gamma: String(x.gamma ?? '') || GAME_LINKS.gamma,
        });
      } catch {
        setMsg('Could not load. Check that your Firestore rules have the "ip" block and that you are allowed to edit.');
      }
    })();
  }, [setMsg]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, IP_COLLECTION, LINKS_DOC), {
        alpha: f.alpha.trim(), beta: f.beta.trim(), gamma: f.gamma.trim(),
      });
      setMsg('Saved. The IP × Games cards update within about a minute.');
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "ip" block yet.');
    }
    setBusy(false);
  }

  return (
    <form className="box" onSubmit={save}>
      <h2>IP × Games — “Where the IP lives.”</h2>
      <small className="muted">
        Each card on the IP page is connected to the Games tab: the game name, status and key art come from there, so change those in Games.
        Here you only write the line that explains how each game connects to the IP.
      </small>
      {GAME_SLUGS.map((s) => (
        <label key={s}>
          {gameName(s)} <small>(IP connection)</small>
          <textarea rows={2} maxLength={200} value={f[s]} onChange={(e) => setF((p) => ({ ...p, [s]: e.target.value }))} />
        </label>
      ))}
      <div className="bt">
        <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
        <button className="btn s" type="button" onClick={() => setF(GAME_LINKS)}>Use built-in text</button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- Concept Art Vault */

const blankTile = (order: number): VaultItem => ({ id: '', tag: '', msg: '', img: '', open: false, order });

function VaultEditor({ setMsg }: Msg) {
  const [rows, setRows] = useState<VaultItem[]>([]);
  const [form, setForm] = useState<VaultItem | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.collection(db, IP_VAULT_COLLECTION));
      const list = snap.docs.map((d) => {
        const x = d.data() as Record<string, unknown>;
        return { id: d.id, tag: String(x.tag ?? ''), msg: String(x.msg ?? ''), img: String(x.img ?? ''), open: x.open === true, order: Number(x.order ?? 999) };
      });
      list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      setRows(list);
    } catch {
      setMsg('Could not load the vault. Check that your Firestore rules have the "ipVault" block and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof VaultItem, v: string | number | boolean) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function write(t: VaultItem) {
    const { db, firestore } = await getFirebase();
    await firestore.setDoc(firestore.doc(db, IP_VAULT_COLLECTION, t.id), {
      tag: t.tag.trim(), msg: t.msg.trim(), img: cleanImageUrl(t.img), open: t.open, order: Number(t.order) || 1,
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && rows.some((r) => r.id === id)) return setMsg('A tile with this link name already exists. Change the label or the link name.');
    if (form.img.trim() && !cleanImageUrl(form.img)) return setMsg('The picture link must start with https:// (or leave it empty).');
    if (form.open && !cleanImageUrl(form.img)) return setMsg('To unlock a tile, add a picture first. Or untick “Unlocked”.');
    setBusy(true);
    setMsg('');
    try {
      await write(form);
      setForm(null);
      setMsg('Saved. It will show on the IP page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "ipVault" block yet.');
    }
    setBusy(false);
  }

  async function loadSamples() {
    setBusy(true);
    try {
      for (const t of VAULT) await write(t);
      setMsg('Added the 5 current tiles. Edit any of them to unlock it with a picture.');
      await load();
    } catch {
      setMsg('Could not add them. Check that the rules have the "ipVault" block.');
    }
    setBusy(false);
  }

  async function remove(r: VaultItem) {
    if (!window.confirm(`Delete “${r.tag}”? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, IP_VAULT_COLLECTION, r.id));
      setMsg('Deleted.');
      await load();
    } catch {
      setMsg('Could not delete.');
    }
  }

  if (form) {
    return (
      <form className="box" onSubmit={save}>
        <h2>{isNew ? 'New vault tile' : 'Edit vault tile'}</h2>
        <label>
          Tile label <small>(small tag on the tile, e.g. CONCEPT_06)</small>
          <input
            value={form.tag}
            maxLength={40}
            required
            onChange={(e) => {
              set('tag', e.target.value);
              if (isNew) set('id', slugify(e.target.value));
            }}
          />
        </label>
        <label>
          Link name <small>(used internally. Cannot be changed later.)</small>
          <input value={form.id} disabled={!isNew} required onChange={(e) => set('id', slugify(e.target.value))} />
        </label>
        <label>
          Position <small>(1 = first, and the first tile is shown biggest)</small>
          <input type="number" min={1} max={99} value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
        </label>
        <label className="chk">
          <input type="checkbox" checked={form.open} onChange={(e) => set('open', e.target.checked)} />
          Unlocked <small>(tick to show the artwork and let visitors open it full size. Untick to keep it locked.)</small>
        </label>
        {!form.open && (
          <label>
            Message when tapped while locked
            <input value={form.msg} maxLength={160} onChange={(e) => set('msg', e.target.value)} />
          </label>
        )}
        <ImageField value={form.img} onChange={(v) => set('img', v)} />
        <small className="muted">The picture can stay saved while the tile is locked, so you can prepare it and unlock it on reveal day.</small>
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
        <span className="muted">“Sketches before worlds.” Once you add a tile, the built-in locked tiles disappear.</span>
        <div>
          <button className="btn p" type="button" onClick={() => { setForm(blankTile(rows.length + 1)); setIsNew(true); setMsg(''); window.scrollTo({ top: 0 }); }}>
            New tile
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="box">
          <p>No tiles yet, so the IP page shows the 5 built-in locked tiles.</p>
          <div className="bt">
            <button className="btn s" type="button" onClick={loadSamples} disabled={busy}>Add the current 5 tiles</button>
          </div>
        </div>
      ) : (
        <ul className="list">
          {rows.map((r) => (
            <li key={r.id}>
              <div>
                <b>{r.order}. {r.tag}</b>
                <small>{r.open && r.img ? 'Unlocked' : r.open ? 'Unlocked, but no picture yet (shows locked)' : 'Locked'}{r.img && !r.open ? ' · picture ready' : ''}</small>
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

/* ---------------------------------------------------------------- IP tab */

/** IP tab: the featured universe, the IP × Games cards and the Concept Art Vault on the IP page. (Characters has its own tab.) */
export default function AdminIp({ setMsg }: Msg) {
  const [part, setPart] = useState<'universe' | 'games' | 'vault'>('universe');
  const go = (p: typeof part) => { setPart(p); setMsg(''); };
  return (
    <>
      <div className="bt" style={{ marginBottom: '1rem' }}>
        <button className={`btn ${part === 'universe' ? 'p' : 's'}`} type="button" onClick={() => go('universe')}>Featured universe</button>
        <button className={`btn ${part === 'games' ? 'p' : 's'}`} type="button" onClick={() => go('games')}>IP × Games</button>
        <button className={`btn ${part === 'vault' ? 'p' : 's'}`} type="button" onClick={() => go('vault')}>Concept art vault</button>
      </div>
      {part === 'universe' ? <UniverseEditor setMsg={setMsg} /> : part === 'games' ? <GamesLinkEditor setMsg={setMsg} /> : <VaultEditor setMsg={setMsg} />}
    </>
  );
}
