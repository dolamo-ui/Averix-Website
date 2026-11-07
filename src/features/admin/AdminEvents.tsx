'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { EVENTS_COLLECTION, getFirebase } from '@/lib/firebase';
import { cleanImageUrl } from '@/lib/imageUrl';
import ImageField from './ImageField';

const TYPES = ['Tournament', 'Community', 'Showcase'] as const;
const REG = ['Open', 'Opens soon', 'Not open yet', 'Sold out', 'Closed'] as const;
const SAST_MS = 2 * 36e5; // South Africa is UTC+2 all year

interface Row {
  id: string;
  name: string;
  type: string;
  game: string;
  date: string; // yyyy-mm-dd (SAST)
  time: string; // hh:mm (SAST)
  hours: string;
  entry: string;
  prize: string;
  slots: string;
  format: string;
  reg: string;
  deadline: string;
  platform: string;
  ticketUrl: string;
  image: string;
}

const blank = (): Row => ({
  id: '', name: '', type: 'Tournament', game: '', date: '', time: '19:00', hours: '3', entry: 'Free', prize: 'No prize',
  slots: '', format: 'Online', reg: 'Open', deadline: '', platform: '', ticketUrl: '', image: '',
});
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

/** Date + time typed in South African time -> milliseconds. Works the same wherever the admin is. */
const toMs = (date: string, time: string) => {
  const [y, m, d] = date.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return Date.UTC(y, m - 1, d, h, min) - SAST_MS;
};
const fromMs = (ms: number) => {
  const iso = new Date(ms + SAST_MS).toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
};

interface Props {
  setMsg: (m: string) => void;
}

/** Add, edit and delete events. Shown inside the admin when the Events tab is open. */
export default function AdminEvents({ setMsg }: Props) {
  const [rows, setRows] = useState<(Row & { start: number })[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.collection(db, EVENTS_COLLECTION));
      const list = snap.docs.map((d) => {
        const x = d.data() as Record<string, unknown>;
        const start = Number(x.start);
        const { date, time } = Number.isFinite(start) ? fromMs(start) : { date: '', time: '' };
        const s = (k: string) => String(x[k] ?? '');
        return {
          id: d.id, start, date, time, name: s('name'), type: s('type') || 'Tournament', game: s('game'), hours: s('hours') || '3',
          entry: s('entry'), prize: s('prize'), slots: s('slots'), format: s('format'), reg: s('reg'), deadline: s('deadline'),
          platform: s('platform'), ticketUrl: s('ticketUrl'), image: s('image'),
        };
      });
      list.sort((a, b) => b.start - a.start);
      setRows(list);
    } catch {
      setMsg('Could not load events. Check your Firestore rules and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof Row, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const id = form.id.trim();
    if (!/^[a-z0-9-]+$/.test(id)) return setMsg('The link name can only use lowercase letters, numbers and dashes.');
    if (isNew && rows.some((r) => r.id === id)) return setMsg('An event with this link name already exists. Change the link name.');
    const url = form.ticketUrl.trim();
    if (url && !/^https:\/\//i.test(url)) return setMsg('The ticket link must start with https:// (copy it from the Computicket event page).');
    const image = form.image.trim();
    if (image && !cleanImageUrl(image)) return setMsg('The image link must start with https:// (or leave it empty).');
    const hours = Number(form.hours);
    if (!Number.isFinite(hours) || hours <= 0) return setMsg('Duration must be a number of hours, like 3.');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, EVENTS_COLLECTION, id), {
        name: form.name.trim(),
        type: form.type,
        game: form.game.trim(),
        start: toMs(form.date, form.time),
        hours,
        entry: form.entry.trim(),
        prize: form.prize.trim(),
        slots: form.slots.trim(),
        format: form.format.trim(),
        reg: form.reg,
        deadline: form.deadline.trim(),
        platform: form.platform.trim(),
        ticketUrl: url,
        image: cleanImageUrl(image),
      });
      setForm(null);
      setMsg('Saved. It will show on the Events page within about a minute.');
      await load();
    } catch {
      setMsg('Could not save. You may not have permission to edit.');
    }
    setBusy(false);
  }

  async function remove(r: Row) {
    if (!window.confirm(`Delete "${r.name}"? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, EVENTS_COLLECTION, r.id));
      setMsg('Deleted.');
      await load();
    } catch {
      setMsg('Could not delete.');
    }
  }

  if (form) {
    return (
      <form className="box" onSubmit={save}>
        <h2>{isNew ? 'New event' : 'Edit event'}</h2>
        <label>
          Event name
          <input
            value={form.name}
            required
            maxLength={80}
            onChange={(e) => {
              set('name', e.target.value);
              if (isNew) set('id', slugify(e.target.value));
            }}
          />
        </label>
        <label>
          Link name <small>(web address part, e.g. events#averix-cup-2. Cannot be changed later.)</small>
          <input value={form.id} disabled={!isNew} required onChange={(e) => set('id', slugify(e.target.value))} />
        </label>
        <div className="row">
          <label>
            Type
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Game / topic
            <input value={form.game} placeholder="e.g. FPS title" onChange={(e) => set('game', e.target.value)} />
          </label>
        </div>
        <div className="row3">
          <label>
            Date
            <input type="date" value={form.date} required onChange={(e) => set('date', e.target.value)} />
          </label>
          <label>
            Start time <small>(South African time)</small>
            <input type="time" value={form.time} required onChange={(e) => set('time', e.target.value)} />
          </label>
          <label>
            Length <small>(hours)</small>
            <input type="number" min="0.5" step="0.5" value={form.hours} required onChange={(e) => set('hours', e.target.value)} />
          </label>
        </div>
        <div className="row3">
          <label>
            Entry fee
            <input value={form.entry} placeholder="Free or R50" onChange={(e) => set('entry', e.target.value)} />
          </label>
          <label>
            Prize
            <input value={form.prize} placeholder="R5,000 or No prize" onChange={(e) => set('prize', e.target.value)} />
          </label>
          <label>
            Participants
            <input value={form.slots} placeholder="32 teams" onChange={(e) => set('slots', e.target.value)} />
          </label>
        </div>
        <div className="row">
          <label>
            Format
            <input value={form.format} placeholder="Online · Single elimination" onChange={(e) => set('format', e.target.value)} />
          </label>
          <label>
            Platform
            <input value={form.platform} placeholder="PC and console" onChange={(e) => set('platform', e.target.value)} />
          </label>
        </div>
        <div className="row">
          <label>
            Ticket status
            <select value={form.reg} onChange={(e) => set('reg', e.target.value)}>
              {REG.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>
            Deadline <small>(optional)</small>
            <input value={form.deadline} placeholder="48 hours before start" onChange={(e) => set('deadline', e.target.value)} />
          </label>
        </div>
        <label>
          Ticket link <small>(Computicket page for this event. Leave empty if there is no ticket page yet.)</small>
          <input type="url" value={form.ticketUrl} placeholder="https://www.computicket.com/..." onChange={(e) => set('ticketUrl', e.target.value)} />
        </label>
        <ImageField value={form.image} onChange={(v) => set('image', v)} />
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
    <>
      <div className="bar">
        <span className="muted">{rows.length} event{rows.length === 1 ? '' : 's'}</span>
        <button className="btn p" type="button" onClick={() => { setForm(blank()); setIsNew(true); setMsg(''); }}>
          New event
        </button>
      </div>
      {rows.length === 0 ? (
        <div className="box">
          <p>No events yet. Click “New event” to add your first one.</p>
        </div>
      ) : (
        <ul className="list">
          {rows.map((r) => (
            <li key={r.id}>
              <div>
                <b>{r.name}</b>
                <small>
                  {r.type} · {r.date} {r.time} · {r.ticketUrl ? 'Tickets linked' : 'No ticket link'}
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
  );
}
