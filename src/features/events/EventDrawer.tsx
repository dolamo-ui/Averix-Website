'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useToast } from '@/components/ui/Toast';
import { fmt, statusLabel, statusOf, when, type SampleEvent } from './sampleEvents';

const TABS = ['Overview', 'Rules', 'Stream & Discord', 'Register'] as const;
export const artStyle = (e: SampleEvent) =>
  ({ '--x': e.art[0], '--y': e.art[1], '--a': e.art[2] }) as CSSProperties;

const Info = ({ k, v }: { k: string; v: string }) => (
  <div><dt>{k}</dt><dd>{v}</dd></div>
);

const stepsFor = (hasTicket: boolean): Array<[string, string, boolean]> => [
  ['Select event', 'You are here.', true],
  ['View event information', 'Check the format, rules, fee and times.', true],
  hasTicket
    ? ['Buy a ticket', 'Tap the ticket button. You will be taken to our ticketing partner to pay safely.', true]
    : ['Register or buy a ticket', "Handled by an external ticketing provider, so Averix doesn't build its own payment system. Not connected yet.", false],
  ['Receive confirmation', 'Sent by the ticketing provider.', false],
  ['Join the Averix Discord or event community', 'Get match updates and meet your opponents.', false],
  ['Access the tournament', 'Brackets, check-ins and results run on a specialist tournament platform.', false],
];

interface Props {
  event: SampleEvent | null;
  /** timestamp used to decide live / upcoming / completed */
  now: number;
  onClose: () => void;
}

/** Slide-in event details panel with an overlay, tabs and a focus trap. */
export default function EventDrawer({ event, now, onClose }: Props) {
  const toast = useToast();
  const [tab, setTab] = useState(0);
  const panel = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const shown = useRef<SampleEvent | null>(null);
  if (event) shown.current = event; // keep the content while the panel slides out
  const e = shown.current;
  const open = event !== null;
  const status = e ? statusOf(e, now) : 'up';

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    setTab(0);
    document.body.classList.add('open', 'lock');
    const t = setTimeout(() => closeBtn.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('open', 'lock');
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open, event?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') return onClose();
      if (ev.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const copyLink = async () => {
    if (!e) return;
    const url = `${window.location.href.split('#')[0]}#${e.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied', 1800);
    } catch {
      toast('Could not copy the link', 1800);
    }
  };

  return (
    <>
      <div id="ov" onClick={onClose} />
      <aside ref={panel} id="dr" role="dialog" aria-modal="true" aria-labelledby="drt" aria-hidden={!open}>
        <div className="dh">
          <div className="ea" id="dha" style={e ? artStyle(e) : undefined} />
          <button ref={closeBtn} className="x" id="dx" aria-label="Close event details" onClick={onClose}>✕</button>
          <div className="row">
            <span className="tg" id="dty">{e ? `${e.type.toUpperCase()}${e.sample ? ' · SAMPLE' : ''}` : ''}</span>
            <span className={e ? `stt ${statusOf(e, now)}` : 'stt'} id="dst">{e ? statusLabel(e, now) : ''}</span>
          </div>
          <h2 id="drt">{e?.name}</h2>
          <p id="dg">{e ? `${e.game} · ${when(e)}` : ''}</p>
        </div>
        <div className="tabs" role="tablist" id="tabs">
          {TABS.map((label, i) => (
            <button key={label} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{label}</button>
          ))}
        </div>
        {e && (
          <>
            <div className="pn" id="p0" hidden={tab !== 0}>
              <dl className="ig">
                <Info k="GAME" v={e.game} />
                <Info k="DATE & START" v={when(e)} />
                <Info k="ENTRY FEE" v={e.sample ? `${e.entry} (sample)` : e.entry} />
                <Info k="PRIZE POOL" v={e.sample ? `${e.prize} (sample)` : e.prize} />
                <Info k="PARTICIPANTS" v={e.slots} />
                <Info k="FORMAT" v={e.format} />
                <Info k="REGISTRATION" v={e.reg} />
                <Info k="DEADLINE" v={e.deadline} />
              </dl>
              <h4>PLATFORM REQUIREMENTS</h4>
              <ul><li>{e.platform}</li></ul>
            </div>
            <div className="pn" id="p1" hidden={tab !== 1}>
              <h4>EVENT RULES</h4>
              <p>Full rules are published before registration opens. Each event will cover:</p>
              <ul>
                <li>Eligibility and team or player limits</li>
                <li>Match format, scoring and tie-breaks</li>
                <li>Check-in times and what happens if a team is late</li>
                <li>Fair play and conduct</li>
                <li>How prizes are paid out</li>
              </ul>
            </div>
            <div className="pn" id="p2" hidden={tab !== 2}>
              <h4>COMMUNITY</h4>
              <ul><li>Averix Discord: link to be added once the server is live</li></ul>
              <h4>STREAM</h4>
              <ul><li>Livestream details (Twitch or YouTube) will be added here for events that are broadcast</li></ul>
              <p style={{ marginTop: '1.4rem' }}><Link className="go" href="/#community">JOIN THE COMMUNITY</Link></p>
            </div>
            <div className="pn" id="p3" hidden={tab !== 3}>
              <h4>HOW REGISTRATION WILL WORK</h4>
              <ol className="stp" style={{ listStyle: 'none' }}>
                {stepsFor(Boolean(e.ticketUrl)).map(([title, text, now_], i) => (
                  <li key={title} className={now_ ? 'now' : undefined} data-n={i + 1}>
                    <b>{title}</b><span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
        <div className="df">
          {e?.ticketUrl && status !== 'past' ? (
            <a className="btn p" href={e.ticketUrl} target="_blank" rel="noopener noreferrer">
              {/computicket/i.test(e.ticketUrl) ? 'Buy ticket on Computicket' : 'Get tickets'}
            </a>
          ) : (
            <button className="btn p" disabled>{status === 'past' ? 'Event completed' : 'Registration not open yet'}</button>
          )}
          <button className="btn s" id="sh" onClick={copyLink}>Copy link</button>
          <small>
            {e?.ticketUrl
              ? 'Tickets are sold on our ticketing partner\'s website. No payment is taken on this page.'
              : 'No payment or sign-up is collected on this page.'}
          </small>
        </div>
      </aside>
    </>
  );
}

