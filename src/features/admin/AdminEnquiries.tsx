'use client';

import { useCallback, useEffect, useState } from 'react';
import { ENQUIRIES_COLLECTION, getFirebase } from '@/lib/firebase';

interface Enquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  org: string;
  message: string;
  status: string;
  at: number;
}

const when = (ms: number) =>
  ms ? new Date(ms).toLocaleString('en-GB', { timeZone: 'Africa/Johannesburg', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

/** Inbox for messages sent through the Partnerships form. */
export default function AdminEnquiries({ setMsg, onCount }: { setMsg: (m: string) => void; onCount?: (n: number) => void }) {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new'>('all');

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDocs(firestore.query(firestore.collection(db, ENQUIRIES_COLLECTION), firestore.orderBy('createdAt', 'desc')));
      const list = snap.docs.map((d) => {
        const x = d.data() as Record<string, unknown>;
        const ts = x.createdAt as { toMillis?: () => number } | undefined;
        const s = (k: string) => String(x[k] ?? '');
        return { id: d.id, type: s('type'), name: s('name'), email: s('email'), org: s('org'), message: s('message'), status: s('status') || 'new', at: ts?.toMillis?.() ?? 0 };
      });
      setRows(list);
      onCount?.(list.filter((r) => r.status === 'new').length);
    } catch {
      setMsg('Could not load enquiries. Check your Firestore rules and that you are allowed to edit.');
    }
  }, [setMsg, onCount]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(r: Enquiry, status: 'new' | 'handled') {
    try {
      const { db, firestore } = await getFirebase();
      await firestore.updateDoc(firestore.doc(db, ENQUIRIES_COLLECTION, r.id), { status });
      await load();
    } catch {
      setMsg('Could not update the enquiry.');
    }
  }

  async function remove(r: Enquiry) {
    if (!window.confirm(`Delete the enquiry from ${r.name}? This cannot be undone.`)) return;
    try {
      const { db, firestore } = await getFirebase();
      await firestore.deleteDoc(firestore.doc(db, ENQUIRIES_COLLECTION, r.id));
      setMsg('Deleted.');
      await load();
    } catch {
      setMsg('Could not delete.');
    }
  }

  const shown = filter === 'new' ? rows.filter((r) => r.status === 'new') : rows;
  const newCount = rows.filter((r) => r.status === 'new').length;

  return (
    <>
      <div className="bar">
        <span className="muted">
          {rows.length} enquir{rows.length === 1 ? 'y' : 'ies'} · {newCount} new
        </span>
        <div>
          <button className={filter === 'all' ? 'btn p' : 'btn s'} type="button" onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'new' ? 'btn p' : 'btn s'} type="button" onClick={() => setFilter('new')}>New only</button>
        </div>
      </div>
      {shown.length === 0 ? (
        <div className="box"><p>{rows.length === 0 ? 'No enquiries yet. Messages sent through the Partnerships form will appear here.' : 'No new enquiries.'}</p></div>
      ) : (
        <ul className="list">
          {shown.map((r) => (
            <li key={r.id} className="enq">
              <div className="top" onClick={() => setOpen(open === r.id ? null : r.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setOpen(open === r.id ? null : r.id)}>
                <div>
                  <b>{r.name}{r.org ? ` · ${r.org}` : ''}</b>
                  <small>{r.type} · {when(r.at)}</small>
                </div>
                <span className={r.status === 'new' ? 'badge new' : 'badge'}>{r.status === 'new' ? 'NEW' : 'HANDLED'}</span>
              </div>
              {open === r.id && (
                <div className="body">
                  <p className="msgtext">{r.message}</p>
                  <p className="muted">Email: <a href={`mailto:${r.email}?subject=${encodeURIComponent('Re: Averix Games enquiry')}`}>{r.email}</a></p>
                  <div className="bt">
                    <a className="btn p" href={`mailto:${r.email}?subject=${encodeURIComponent('Re: Averix Games enquiry')}`}>Reply by email</a>
                    {r.status === 'new' ? (
                      <button className="btn s" type="button" onClick={() => setStatus(r, 'handled')}>Mark as handled</button>
                    ) : (
                      <button className="btn s" type="button" onClick={() => setStatus(r, 'new')}>Mark as new</button>
                    )}
                    <button className="btn s danger" type="button" onClick={() => remove(r)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
