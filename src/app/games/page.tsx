import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import '@/styles/games.css';
import TiltEffect from '@/components/ui/TiltEffect';
import { getGamesWithAdmin } from '@/features/games/getGames';
import { PIPELINE, type Game } from '@/features/games/gamesData';

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
  description: "Original games and projects from Averix Games: Project Alpha, Project Beta and Project Gamma.",
  path: '/games',
});

export default async function GamesPage() {
  const all = await getGamesWithAdmin();
  const pick = (slug: Game['slug']) => all.find((g) => g.slug === slug) as Game;
  const alpha = pick('alpha');
  const beta = pick('beta');
  const gamma = pick('gamma');
  return (
    <PageFrame page="games" toastMs={2400}>
      <TiltEffect selector=".pj2 .art" />
      <section className="gh">
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
            <a className="btn p" href="#alpha">Explore the catalogue</a>
            <Link className="btn s" href="/community">Follow development</Link>
          </div>
        </div>
        <div className="idx rv" role="navigation" aria-label="Projects">
          <a href="#alpha">
            <em>01</em>
            <b>{alpha.name}</b>
            <small>{alpha.status}</small>
          </a>
          <a href="#beta">
            <em>02</em>
            <b>{beta.name}</b>
            <small>{beta.status}</small>
          </a>
          <a href="#gamma">
            <em>03</em>
            <b>{gamma.name}</b>
            <small>{gamma.status}</small>
          </a>
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
      <section className="stk">
        <article className="pj2 k-a" id="alpha" style={{ "--i": "0" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src={alpha.keyArt || "/assets/alpha.jpg"} alt={`${alpha.name} key art`} />
            <div className="tilt">
              <div className="ring r1" />
              <div className="ring r2" />
              <div className="ring r3" />
              <div className="beam" />
              <div className="core" />
              <span className="tagx">ASSET_01 · CLASSIFIED</span>
            </div>
          </div>
          <div className="inf">
            <div className="no" aria-hidden="true">01</div>
            <span className="chip live">{alpha.status}</span>
            <p className="meta">{tbd('Genre', alpha.genre)} <i>•</i> {tbd('Platform', alpha.platforms)}</p>
            <h2>
              <Link href="/games/alpha">{alpha.name}</Link>
            </h2>
            <p className="ds">{alpha.description}</p>
            <div className="bt">
              <Act url={alpha.links.waitlist} msg={alpha.linkMessages.waitlist} label="Join Waiting List" cls="p" />
              <Link className="btn s" href="/games/alpha">Overview</Link>
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <Meter g={alpha} />
              <small className="sn">{alpha.status.toUpperCase()}</small>
            </div>
          </div>
        </article>
        <article className="pj2 k-b" id="beta" style={{ "--i": "1" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src={beta.keyArt || "/assets/beta.jpg"} alt={`${beta.name} key art`} />
            <div className="tilt">
              <div className="blk k1" />
              <div className="blk k2" />
              <div className="blk k3" />
              <div className="blk k4" />
              <div className="scan" />
              <div className="xh" />
              <span className="tagx">PROTO_02 · BLOCKOUT</span>
            </div>
          </div>
          <div className="inf">
            <div className="no" aria-hidden="true">02</div>
            <span className="chip">{beta.status}</span>
            <p className="meta">{tbd('Genre', beta.genre)} <i>•</i> {tbd('Platform', beta.platforms)}</p>
            <h2>
              <Link href="/games/beta">{beta.name}</Link>
            </h2>
            <p className="ds">{beta.description}</p>
            <div className="bt">
              <Link className="btn p" href="/games/beta">View Concept</Link>
              <Act url={beta.links.play} msg={beta.linkMessages.play} label="Join Alpha" cls="s" />
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <Meter g={beta} />
              <small className="sn">{beta.status.toUpperCase()}</small>
            </div>
          </div>
        </article>
        <article className="pj2 k-g" id="gamma" style={{ "--i": "2" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src={gamma.keyArt || "/assets/gamma.jpg"} alt={`${gamma.name} key art`} />
            <div className="tilt">
              <div className="radar" />
              <div className="pulse p1" />
              <div className="pulse p2" />
              <div className="pulse p3" />
              <div className="dot" />
              <span className="tagx">SIGNAL_03 · INCOMING</span>
            </div>
          </div>
          <div className="inf">
            <div className="no" aria-hidden="true">03</div>
            <span className="chip">{gamma.status}</span>
            <p className="meta">{tbd('Genre', gamma.genre)} <i>•</i> {tbd('Platform', gamma.platforms)}</p>
            <h2>
              <Link href="/games/gamma">{gamma.name}</Link>
            </h2>
            <p className="ds">{gamma.description}</p>
            <div className="bt">
              <Act url={gamma.links.waitlist} msg={gamma.linkMessages.waitlist} label="Pre-Register" cls="p" />
              <Link className="btn s" href="/games/gamma#trailer">Trailer</Link>
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <Meter g={gamma} />
              <small className="sn">{gamma.status.toUpperCase()}</small>
            </div>
          </div>
        </article>
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
