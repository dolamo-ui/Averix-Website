import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import '@/styles/games.css';
import TiltEffect from '@/components/ui/TiltEffect';

export const metadata: Metadata = pageMeta({
  title: 'Games | Averix Games',
  description: "Original games and projects from Averix Games: Project Alpha, Project Beta and Project Gamma.",
  path: '/games',
});

export default function GamesPage() {
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
            <b>Project Alpha</b>
            <small>In Development</small>
          </a>
          <a href="#beta">
            <em>02</em>
            <b>Project Beta</b>
            <small>Prototype</small>
          </a>
          <a href="#gamma">
            <em>03</em>
            <b>Project Gamma</b>
            <small>Coming Soon</small>
          </a>
        </div>
      </section>
      <section className="pp">
        <span className="eyebrow rv">THE PIPELINE</span>
        <h2 className="rv">Where every project stands.</h2>
        <ol className="trk rv">
          <li>
            <i />
            <b>Concept</b>
          </li>
          <li className="has">
            <i />
            <b>Prototype</b>
            <u>Project Beta</u>
          </li>
          <li className="has">
            <i />
            <b>In Development</b>
            <u>Project Alpha</u>
          </li>
          <li>
            <i />
            <b>Early Access</b>
          </li>
          <li className="has">
            <i />
            <b>Coming Soon</b>
            <u>Project Gamma</u>
          </li>
          <li>
            <i />
            <b>Released</b>
          </li>
        </ol>
      </section>
      <section className="stk">
        <article className="pj2 k-a" id="alpha" style={{ "--i": "0" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src="/assets/alpha.jpg" alt="Project Alpha key art" />
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
            <span className="chip live">In Development</span>
            <p className="meta">
              Genre TBD
              {' '}
              <i>•</i>
              {' '}
              Platform TBD
            </p>
            <h2>
              <Link href="/games/alpha">Project Alpha</Link>
            </h2>
            <p className="ds">
              Upcoming original title currently in active development. Official concept art, lore, and screenshots coming soon.
            </p>
            <div className="bt">
              <button className="btn p" data-msg="Wishlist opens when Project Alpha has a store page.">Wishlist</button>
              <Link className="btn s" href="/games/alpha">Overview</Link>
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <div className="mt" aria-label="Stage 3 of 6: In Development">
                <span className="on" />
                <span className="on" />
                <span className="on" />
                <span />
                <span />
                <span />
              </div>
              <small className="sn">IN DEVELOPMENT</small>
            </div>
          </div>
        </article>
        <article className="pj2 k-b" id="beta" style={{ "--i": "1" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src="/assets/beta.jpg" alt="Project Beta key art" />
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
            <span className="chip">Prototype</span>
            <p className="meta">
              Genre TBD
              {' '}
              <i>•</i>
              {' '}
              Platform TBD
            </p>
            <h2>
              <Link href="/games/beta">Project Beta</Link>
            </h2>
            <p className="ds">Early experimental prototype exploring new mechanics and interactive gameplay loops. Details to be announced.</p>
            <div className="bt">
              <Link className="btn p" href="/games/beta">View Concept</Link>
              <button className="btn s" data-msg="Alpha test sign-up is not open yet.">Join Alpha</button>
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <div className="mt" aria-label="Stage 2 of 6: Prototype">
                <span className="on" />
                <span className="on" />
                <span />
                <span />
                <span />
                <span />
              </div>
              <small className="sn">PROTOTYPE</small>
            </div>
          </div>
        </article>
        <article className="pj2 k-g" id="gamma" style={{ "--i": "2" } as CSSProperties}>
          <div className="art">
            <SafeImg className="ph" src="/assets/gamma.jpg" alt="Project Gamma key art" />
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
            <span className="chip">Coming Soon</span>
            <p className="meta">
              Genre TBD
              {' '}
              <i>•</i>
              {' '}
              Platform TBD
            </p>
            <h2>
              <Link href="/games/gamma">Project Gamma</Link>
            </h2>
            <p className="ds">
              Upcoming studio release. Further announcements regarding gameplay trailers and release dates will be published soon.
            </p>
            <div className="bt">
              <button className="btn p" data-msg="Pre-registration is not open yet.">Pre-Register</button>
              <Link className="btn s" href="/games/gamma#trailer">Trailer</Link>
            </div>
            <div className="st">
              <small>PIPELINE</small>
              <div className="mt" aria-label="Stage 5 of 6: Coming Soon">
                <span className="on" />
                <span className="on" />
                <span className="on" />
                <span className="on" />
                <span className="on" />
                <span />
              </div>
              <small className="sn">COMING SOON</small>
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
