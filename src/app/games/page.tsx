import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import '@/styles/games.css';
import TiltEffect from '@/components/ui/TiltEffect';
import { getGamesWithAdmin } from '@/features/games/getGames';
import GameFilter from '@/features/games/GameFilter';
import { FILTERS, PIPELINE, statusId, type Game } from '@/features/games/gamesData';

// Re-check the admin (status, texts, links) at most once a minute.
export const revalidate = 60;

const tbd = (label: string, v: string) => (/to be announced|^tbd$/i.test(v.trim()) ? `${label} TBD` : v);

/** A real link when the client set one in /admin > Games, otherwise the "coming soon" toast button. */
function Act({ url, msg, label, cls }: { url: string | null; msg: string; label: string; cls: string }) {
  return url ? (
    <a className={`btn ${cls}`} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
  ) : (
    <button className={`btn ${cls}`} data-msg={msg}>{label}</button>
  );
}

function Meter({ g }: { g: Game }) {
  return (
    <div className="mt" aria-label={`Stage ${g.stage} of ${PIPELINE.length}: ${g.status}`}>
      {PIPELINE.map((step, i) => (
        <span key={step} className={i < g.stage ? 'on' : undefined} />
      ))}
    </div>
  );
}

export const metadata: Metadata = pageMeta({
  title: 'Games | Averix Games',
  description: "Original games and projects from Averix Games, from games in development to released titles.",
  path: '/games',
});

const BUILT_IN = ['alpha'];
const VARIANT: Record<string, string> = { alpha: 'k-a' };
const FALLBACK_ART: Record<string, string> = { alpha: '/assets/alpha.jpg' };

/** Main button: depends on the status (built-in games keep their original wording). */
function primary(g: Game): { url: string | null; msg: string; label: string } {
  if (g.status === 'Released') return { url: g.links.download || g.links.play, msg: g.linkMessages.download, label: g.links.download ? 'Download' : 'Play Now' };
  if (g.status === 'Early Access') return { url: g.links.play || g.links.download, msg: g.linkMessages.play, label: 'Play Early Access' };
  return { url: g.links.waitlist, msg: g.linkMessages.waitlist, label: 'Join Waiting List' };
}

function Art({ g }: { g: Game }) {
  return (
    <div className="art">
      <SafeImg className="ph" src={g.keyArt || FALLBACK_ART[g.slug] || '/assets/universe-bg.jpg'} alt={`${g.name} key art`} />
      {g.slug === 'alpha' && (
        <div className="tilt">
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" /><div className="beam" /><div className="core" />
          <span className="tagx">ASSET_01 · CLASSIFIED</span>
        </div>
      )}
      {!BUILT_IN.includes(g.slug) && (
        <div className="tilt">
          <span className="tagx">{`GAME_${g.no} · ${g.status.toUpperCase()}`}</span>
        </div>
      )}
    </div>
  );
}

function Card({ g, i }: { g: Game; i: number }) {
  const main = primary(g);
  const style = { '--i': String(i), ...(BUILT_IN.includes(g.slug) ? {} : { '--c': g.accent }) } as CSSProperties;
  return (
    <article className={`pj2 ${VARIANT[g.slug] ?? ''}`} id={g.slug} data-st={statusId(g.status)} style={style}>
      <Art g={g} />
      <div className="inf">
        <div className="no" aria-hidden="true">{g.no}</div>
        <span className={`chip${g.status === 'In Development' ? ' live' : ''}`}>{g.status}</span>
        <p className="meta">{tbd('Genre', g.genre)} <i>•</i> {tbd('Platform', g.platforms)}</p>
        <h2>
          <Link href={`/games/${g.slug}`}>{g.name}</Link>
        </h2>
        <p className="ds">{g.description}</p>
        <div className="bt">
          <Act url={main.url} msg={main.msg} label={main.label} cls="p" />
          <Link className="btn s" href={`/games/${g.slug}`}>Overview</Link>
        </div>
        <div className="st">
          <small>PIPELINE</small>
          <Meter g={g} />
          <small className="sn">{g.status.toUpperCase()}</small>
        </div>
      </div>
    </article>
  );
}

export default async function GamesPage() {
  const all = await getGamesWithAdmin();
  const tabs = [
    ...FILTERS.map((f) => ({ id: statusId(f), label: f, count: all.filter((g) => statusId(g.status) === statusId(f)).length })),
    { id: 'all', label: 'All', count: all.length },
  ];
  return (
    <PageFrame page="games" toastMs={2400}>
      <TiltEffect selector=".pj2 .art" />
      <section className="gh">
        <div className="gh-img" aria-hidden="true">
          <SafeImg src="/assets/games-hero.jpg" alt="" width={736} height={1308} fetchPriority="high" decoding="async" />
        </div>
        <div className="gh-in">
          <span className="eyebrow rv">STUDIO CATALOGUE</span>
          <h1 className="rv">
            <span>Our Games</span>
            <span className="o">&amp; Projects</span>
          </h1>
          <p className="lead rv">
            We build original worlds, deep intellectual property, and high-impact gaming experiences designed to live far beyond the screen.
          </p>
          <div className="cta rv">
            <a className="btn p" href="#games">Explore the catalogue</a>
            <Link className="btn s" href="/community">Follow development</Link>
          </div>
        </div>
        <div className="idx rv" role="navigation" aria-label="Projects">
          {all.map((g) => (
            <a key={g.slug} href={`#${g.slug}`}>
              <em>{g.no}</em>
              <b>{g.name}</b>
              <small>{g.status}</small>
            </a>
          ))}
        </div>
      </section>
      <section className="pp">
        <span className="eyebrow rv">THE PIPELINE</span>
        <h2 className="rv">Where every project stands.</h2>
        <ol className="trk rv">
          {PIPELINE.map((step, i) => {
            const here = all.filter((g) => g.stage === i + 1);
            return (
              <li key={step} className={here.length ? 'has' : undefined}>
                <i />
                <b>{step}</b>
                {here.map((g) => (
                  <u key={g.slug}>{g.name}</u>
                ))}
              </li>
            );
          })}
        </ol>
      </section>
      <section className="stk" id="games">
        <GameFilter tabs={tabs} initial={statusId('In Development')}>
          {all.map((g, i) => (
            <Card key={g.slug} g={g} i={i} />
          ))}
        </GameFilter>
      </section>
      <section className="fin rv">
        <div>
          <h2>Be there when the first world opens.</h2>
          <p>Follow the journey, test early builds and help shape what Averix makes next.</p>
        </div>
        <Link className="btn p" href="/community">Join the community</Link>
      </section>
    </PageFrame>
  );
}
