'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import SafeImg from '@/components/ui/SafeImg';
import type { Character } from './characters';

const gameHref = (g?: string) => {
  const m = g?.match(/alpha|beta|gamma/i);
  return m ? `/games/${m[0].toLowerCase()}` : '/games';
};

const pad = (n: number) => String(n).padStart(2, '0');
const cssVar = (color: string) => ({ '--c': color }) as CSSProperties;

function Silhouette({ color, id }: { color: string; id: string }) {
  const grad = `sg${id}`;
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".9" />
          <stop offset="1" stopColor="#7b34ff" stopOpacity=".5" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="80" fill="none" stroke={color} strokeDasharray="4 9" opacity=".6" />
      <circle cx="150" cy="150" r="50" fill={`url(#${grad})`} />
      <path d="M38 400C38 292 90 238 150 238s112 54 112 162z" fill={`url(#${grad})`} />
    </svg>
  );
}

function Portrait({ c, id }: { c: Character; id: string }) {
  return (
    <div className="pt">
      {c.img && (
        <SafeImg src={c.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <Silhouette color={c.color} id={id} />
      {!c.open && <span className="stamp">CLASSIFIED</span>}
    </div>
  );
}

function ProfileBody({ c, index, sample }: { c: Character; index: number; sample: boolean }) {
  if (!c.open) {
    return (
      <>
        <span className="chip" style={cssVar(c.color)}>Profile {pad(index + 1)} · Locked</span>
        <h3 id="dn">Profile locked</h3>
        <p>This character has not been revealed yet. New characters are announced first through the Averix news and community channels.</p>
        <div className="bt">
          <Link className="btn p" href="/community">Join the community</Link>
          <Link className="btn s" href="/news">Latest news</Link>
        </div>
      </>
    );
  }
  return (
    <>
      <span className="chip" style={cssVar(c.color)}>Profile {pad(index + 1)} · {c.role}</span>
      <h3 id="dn">{c.name}</h3>
      <dl className="fx">
        <div><dt>Origin</dt><dd>{c.origin || '—'}</dd></div>
        <div><dt>Role</dt><dd>{c.role}</dd></div>
        <div><dt>Universe</dt><dd>{c.universe || '—'}</dd></div>
        <div><dt>Relevant game</dt><dd>{c.game || '—'}</dd></div>
      </dl>
      {c.desc && <div><h4>Description</h4><p>{c.desc}</p></div>}
      {c.backstory && <div><h4>Backstory</h4><p>{c.backstory}</p></div>}
      {!!c.media?.length && (
        <div>
          <h4>Artwork &amp; media</h4>
          <div className="md">{c.media.map((m) => <span key={m}>{m}{sample && <><br />locked</>}</span>)}</div>
        </div>
      )}
      {sample && <p className="note">Placeholder profile. Content to be replaced with final Averix IP.</p>}
      <div className="bt">
        <Link className="btn p" href={gameHref(c.game)}>Relevant game</Link>
        <Link className="btn s" href="/community">Follow reveals</Link>
      </div>
    </>
  );
}

/** Character grid plus the modal profile dialog. */
export default function CharacterProfiles({ characters, sample }: { characters: Character[]; sample: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    if (selected !== null && !dlg.open) dlg.showModal();
    document.body.classList.toggle('lock', selected !== null);
  }, [selected]);

  // Never leave the page scroll-locked if we navigate away with the dialog open.
  useEffect(() => () => document.body.classList.remove('lock'), []);

  const c = selected !== null ? characters[selected] : null;

  return (
    <>
      <div className="chg rv" id="chg">
        {characters.map((ch, i) => (
          <button
            key={i}
            type="button"
            className={ch.open ? 'chr' : 'chr lk'}
            style={cssVar(ch.color)}
            aria-label={ch.open ? `Open profile: ${ch.name}` : `Locked profile ${pad(i + 1)}`}
            onClick={() => setSelected(i)}
          >
            <Portrait c={ch} id={String(i)} />
            <div className="tx">
              <small>Profile {pad(i + 1)} · {ch.open ? (sample ? 'Placeholder' : 'Revealed') : 'Locked'}</small>
              <b>{ch.name}</b>
              <span className="rl">{ch.role}</span>
            </div>
          </button>
        ))}
      </div>
      <dialog
        id="dlg"
        ref={dialog}
        aria-labelledby="dn"
        onClose={() => setSelected(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        {c && selected !== null && (
          <>
            <div className="dg" style={cssVar(c.color)}>
              <Portrait c={c} id={`d${selected}`} />
              <div className="in"><ProfileBody c={c} index={selected} sample={sample} /></div>
            </div>
            <button className="x" type="button" aria-label="Close profile" onClick={() => dialog.current?.close()}>CLOSE</button>
          </>
        )}
      </dialog>
    </>
  );
}
