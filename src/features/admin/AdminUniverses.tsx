'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getFirebase, HOME_COLLECTION } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import { cleanCardLink, UNIVERSE_DEFAULTS, type UniverseCard } from '@/features/home/universesData';
import ImageField from './ImageField';

type Msg = { setMsg: (m: string) => void };

const NAMES = ['Card 1 (big card on the left)', 'Card 2 (top right)', 'Card 3 (bottom right)'];

/** Edits the three "Our Universes" cards on the home page: status, title, description, picture and link. */
export default function AdminUniverses({ setMsg }: Msg) {
  const [cards, setCards] = useState<UniverseCard[]>(UNIVERSE_DEFAULTS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { db, firestore } = await getFirebase();
        const snaps = await Promise.all(UNIVERSE_DEFAULTS.map((d) => firestore.getDoc(firestore.doc(db, HOME_COLLECTION, d.id))));
        setCards(
          UNIVERSE_DEFAULTS.map((def, i) => {
            if (!snaps[i].exists()) return def;
            const x = snaps[i].data() as Record<string, unknown>;
            const s = (k: string) => String(x[k] ?? '');
            return {
              id: def.id,
              status: s('status') || def.status,
              title: s('title') || def.title,
              desc: s('desc') || def.desc,
              img: s('img'),
              link: s('link'),
              button: s('button'),
            };
          }),
        );
      } catch {
        setMsg('Could not load the universes. Check that your Firestore rules have the "home" block and that you are allowed to edit.');
      }
    })();
  }, [setMsg]);

  const set = (i: number, k: keyof UniverseCard, v: string) => setCards((c) => c.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  async function save(e: FormEvent) {
    e.preventDefault();
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      if (c.img.trim() && !cleanImageUrl(c.img)) return setMsg(`Card ${i + 1}: the picture link must start with https:// (or leave it empty).`);
      if (c.link.trim() && !cleanCardLink(c.link)) return setMsg(`Card ${i + 1}: the link must be a page like /games or a full link starting with https://`);
    }
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      for (const c of cards) {
        await firestore.setDoc(firestore.doc(db, HOME_COLLECTION, c.id), {
          status: c.status.trim(),
          title: c.title.trim(),
          desc: c.desc.trim(),
          img: cleanImageUrl(c.img),
          link: cleanCardLink(c.link),
          button: c.button.trim(),
        });
      }
      setMsg('Saved. The Our Universes cards update on the home page within about a minute.');
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "home" block yet.');
    }
    setBusy(false);
  }

  async function reset() {
    if (!window.confirm('Go back to the built-in cards? Your edits here will be removed.')) return;
    try {
      const { db, firestore } = await getFirebase();
      for (const d of UNIVERSE_DEFAULTS) await firestore.deleteDoc(firestore.doc(db, HOME_COLLECTION, d.id));
      setCards(UNIVERSE_DEFAULTS);
      setMsg('Back to the built-in cards.');
    } catch {
      setMsg('Could not reset.');
    }
  }

  return (
    <form className="box" onSubmit={save}>
      <h2>Home page · Our Universes</h2>
      <small className="muted">
        The three cards under “Built to be played. Designed to be remembered.” Change the status, title and text whenever a project is ready to be revealed.
      </small>
      {cards.map((c, i) => (
        <fieldset key={c.id} className="box">
          <legend>{NAMES[i]}</legend>
          <div className="row">
            <label>
              Status label <small>(e.g. CONCEPT · DETAILS SOON, PROTOTYPE, IN DEVELOPMENT)</small>
              <input value={c.status} maxLength={60} list="uni-status" onChange={(e) => set(i, 'status', e.target.value)} />
            </label>
            <label>
              Title
              <input value={c.title} maxLength={80} onChange={(e) => set(i, 'title', e.target.value)} />
            </label>
          </div>
          <label>
            Description
            <textarea rows={3} maxLength={300} value={c.desc} onChange={(e) => set(i, 'desc', e.target.value)} />
          </label>
          <div className="row">
            <label>
              Card link <small>(a page like /games or /ip, or a full https:// link. Empty = card is not clickable)</small>
              <input value={c.link} maxLength={300} placeholder="/games" onChange={(e) => set(i, 'link', e.target.value)} />
            </label>
            <label>
              Button text <small>(empty = no button)</small>
              <input value={c.button} maxLength={40} placeholder="Discover project" onChange={(e) => set(i, 'button', e.target.value)} />
            </label>
          </div>
          <ImageField value={c.img} onChange={(v) => set(i, 'img', v)} />
        </fieldset>
      ))}
      <datalist id="uni-status">
        <option value="CONCEPT · DETAILS SOON" />
        <option value="PROTOTYPE" />
        <option value="IN DEVELOPMENT" />
        <option value="EARLY ACCESS" />
        <option value="COMING SOON" />
        <option value="RELEASED" />
      </datalist>
      <small className="muted">Pictures: a wide image works best. Without one, the built-in artwork is shown. If a card has not been saved before, it shows the built-in text.</small>
      <div className="bt">
        <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button>
        <button className="btn s" type="button" onClick={reset}>Use built-in cards</button>
      </div>
    </form>
  );
}
