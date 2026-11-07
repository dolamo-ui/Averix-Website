import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import '@/styles/ip.css';
import TiltEffect from '@/components/ui/TiltEffect';
import CharacterProfiles from '@/features/ip/CharacterProfiles';
import { getCharacters } from '@/features/ip/getCharacters';
import { getGameLinks, getUniverse, getVault } from '@/features/ip/getIpContent';
import { getGamesWithAdmin } from '@/features/games/getGames';
import VaultGrid from '@/features/ip/VaultGrid';

// Re-check the admin for new characters at most once a minute.
export const revalidate = 60;
import { LicenseReveal } from '@/features/ip/IpEffects';

export const metadata: Metadata = pageMeta({
  title: 'IP | Averix Games',
  description: "Averix Games intellectual property: original characters, worlds, stories and brands built to live beyond the screen, plus licensing and partnership opportunities.",
  path: '/ip',
});

export default async function IpPage() {
  const [{ characters, sample }, universe, vault, links, games] = await Promise.all([
    getCharacters(),
    getUniverse(),
    getVault(),
    getGameLinks(),
    getGamesWithAdmin(),
  ]);
  const origin = games.find((g) => g.slug === universe.game) ?? games[0];
  return (
    <PageFrame page="ip">
      <TiltEffect selector=".uv .art" />
      <LicenseReveal />
      <section className="gh">
        <div className="gh-in">
          <span className="eyebrow rv">AVERIX INTELLECTUAL PROPERTY</span>
          <h1 className="rv">
            <span>Worlds That Live</span>
            <span className="o" aria-label="Beyond The Screen">
              <span className="w" aria-hidden="true">
                <i style={{ "--i": "0" } as CSSProperties}>B</i>
                <i style={{ "--i": "1" } as CSSProperties}>e</i>
                <i style={{ "--i": "2" } as CSSProperties}>y</i>
                <i style={{ "--i": "3" } as CSSProperties}>o</i>
                <i style={{ "--i": "4" } as CSSProperties}>n</i>
                <i style={{ "--i": "5" } as CSSProperties}>d</i>
              </span>
              {' '}
              <span className="w" aria-hidden="true">
                <i style={{ "--i": "6" } as CSSProperties}>T</i>
                <i style={{ "--i": "7" } as CSSProperties}>h</i>
                <i style={{ "--i": "8" } as CSSProperties}>e</i>
              </span>
              {' '}
              <span className="w" aria-hidden="true">
                <i style={{ "--i": "9" } as CSSProperties}>S</i>
                <i style={{ "--i": "10" } as CSSProperties}>c</i>
                <i style={{ "--i": "11" } as CSSProperties}>r</i>
                <i style={{ "--i": "12" } as CSSProperties}>e</i>
                <i style={{ "--i": "13" } as CSSProperties}>e</i>
                <i style={{ "--i": "14" } as CSSProperties}>n</i>
              </span>
            </span>
          </h1>
          <p className="lead rv">
            Averix is building original characters, worlds and stories: intellectual property designed to grow far beyond any single game.
          </p>
          <div className="cta rv">
            <a className="btn p" href="#universe">Explore the universe</a>
            <a className="btn s" href="#license">License with Averix</a>
          </div>
        </div>
        <nav className="idx rv" aria-label="On this page">
          <a href="#codex">
            <em>01</em>
            <b>IP Codex</b>
            <small>Four pillars of IP</small>
          </a>
          <a href="#universe">
            <em>02</em>
            <b>First Universe</b>
            <small>Featured world</small>
          </a>
          <a href="#characters">
            <em>03</em>
            <b>Characters</b>
            <small>Profiles &amp; reveals</small>
          </a>
          <a href="#license">
            <em>04</em>
            <b>Work With Averix</b>
            <small>Licensing &amp; partners</small>
          </a>
        </nav>
      </section>
      <section className="sec" id="codex">
        <div className="shd rv">
          <span className="eyebrow">THE IP CODEX</span>
          <h2 className="big">More than a single game.</h2>
          <p className="sub">
            Everything Averix creates sits in one connected universe: characters, worlds, stories, music and brands that can travel across games, media and partners.
          </p>
        </div>
        <div className="cxg rv">
          <a className="cx" href="#characters">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            <em>01</em>
            <b>Characters</b>
            <p>Heroes, rivals and faces of the Averix worlds.</p>
            <span className="stat">In concept</span>
          </a>
          <a className="cx" href="#universe">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
            </svg>
            <em>02</em>
            <b>Worlds</b>
            <p>Original universes and settings built to be explored.</p>
            <span className="stat">Universe 01 · {universe.status}</span>
          </a>
          <a className="cx" href="#universe">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" />
              <path d="M4 21.5V4.5" />
            </svg>
            <em>03</em>
            <b>Stories</b>
            <p>Lore and narratives that connect every release.</p>
            <span className="stat">Classified</span>
          </a>
          <a className="cx" href="#gallery">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18V5l11-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="17" cy="16" r="3" />
            </svg>
            <em>04</em>
            <b>Music</b>
            <p>Original soundtracks and sound identity.</p>
            <span className="stat">Planned</span>
          </a>
        </div>
      </section>
      <section className="sec" id="universe">
        <div className="shd rv">
          <span className="eyebrow">FEATURED UNIVERSE</span>
          <h2 className="big">The first world.</h2>
        </div>
        <article className="uv rv">
          <div className={`art${universe.img ? ' has-img' : ''}`}>
            {universe.img && <SafeImg src={universe.img} alt="" />}
            <div className="tilt">
              <div className="ring r1" />
              <div className="ring r2" />
              <div className="ring r3" />
              <div className="beam" />
              <div className="core" />
            </div>
            <span className="tagx">{universe.tag}</span>
          </div>
          <div className="inf">
            <span className="chip live">{universe.chip}</span>
            <span className="tl">{universe.label}</span>
            <h2>{universe.title}</h2>
            <p className="ds">{universe.desc}</p>
            <dl className="fx">
              <div>
                <dt>Origin game</dt>
                <dd>{origin.name}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{universe.status}</dd>
              </div>
              <div>
                <dt>Genre</dt>
                <dd>{universe.genre}</dd>
              </div>
              <div>
                <dt>Platforms</dt>
                <dd>{universe.platforms}</dd>
              </div>
            </dl>
            {universe.note && <p className="note">{universe.note}</p>}
            <div className="bt">
              <Link className="btn p" href={`/games/${origin.slug}`}>See {origin.name}</Link>
            </div>
          </div>
        </article>
      </section>
      <section className="sec" id="characters">
        <div className="shd rv">
          <span className="eyebrow">CHARACTER PROFILES</span>
          <h2 className="big">Meet the faces of Averix.</h2>
          <p className="sub">
            Each character gets a full profile: artwork, backstory, concept art and the game they belong to. Unrevealed profiles stay locked until Averix announces them.
          </p>
        </div>
        <CharacterProfiles characters={characters} sample={sample} />
      </section>
      <section className="sec" id="gallery">
        <div className="shd rv">
          <span className="eyebrow">CONCEPT ART VAULT</span>
          <h2 className="big">Sketches before worlds.</h2>
          <p className="sub">Early artwork, key frames and music teasers will unlock here as Averix reveals them.</p>
        </div>
        <VaultGrid items={vault} />
      </section>
      <section className="sec" id="in-games">
        <div className="shd rv">
          <span className="eyebrow">IP × GAMES</span>
          <h2 className="big">Where the IP lives.</h2>
          <p className="sub">
            Each Averix project is a doorway into the wider universe. The IP connects the games; the games bring the IP to life.
          </p>
        </div>
        <div className="lkg rv">
          {games.map((g) => (
            <Link key={g.slug} className="gc" href={`/games/${g.slug}`}>
              <div className="gca" role="img" aria-label={`${g.name} key art`}>
                <SafeImg src={g.keyArt || `/assets/${g.slug}.jpg`} alt="" />
                <span className="sh" />
              </div>
              <div>
                <span className={`chip${[3, 4, 6].includes(g.stage) ? ' live' : ''}`}>{g.status}</span>
                <b>{g.name}</b>
                <p>{links[g.slug]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="sec" id="license">
        <div className="lcs" aria-hidden="true">
          <span className="slash s1" />
          <span className="slash s2" />
          <span className="acc a1" />
          <span className="acc a2" />
        </div>
        <div className="shd rv">
          <span className="eyebrow">WORK WITH AVERIX</span>
          <h2 className="big">Build on Averix IP.</h2>
          <p className="sub">
            As Averix IP grows, selected properties will be open to licensing and commercial partnerships. Here is where we expect to collaborate.
          </p>
        </div>
        <div className="lcg rv">
          <div className="lc">
            <em>01</em>
            <b>IP Licensing</b>
            <p>Use selected Averix characters, worlds and brands in your own products.</p>
          </div>
          <div className="lc">
            <em>02</em>
            <b>Merchandise</b>
            <p>Apparel, collectibles and physical products built on Averix IP.</p>
          </div>
          <div className="lc">
            <em>03</em>
            <b>Brand Collaborations</b>
            <p>Co-branded campaigns, crossovers and activations.</p>
          </div>
          <div className="lc">
            <em>04</em>
            <b>Publishing</b>
            <p>Take Averix games and stories to new audiences and platforms.</p>
          </div>
          <div className="lc">
            <em>05</em>
            <b>Distribution</b>
            <p>Help place Averix products in new regions and channels.</p>
          </div>
          <div className="lc">
            <em>06</em>
            <b>Sponsorships</b>
            <p>Back Averix events, tournaments and community activity.</p>
          </div>
          <div className="lc">
            <em>07</em>
            <b>Co-Development</b>
            <p>Build new projects alongside the studio.</p>
          </div>
          <div className="lc">
            <em>08</em>
            <b>Media Partnerships</b>
            <p>Video, streaming and editorial collaborations.</p>
          </div>
          <div className="lc">
            <em>09</em>
            <b>Strategic Partnerships</b>
            <p>Long-term relationships that grow with the studio.</p>
          </div>
        </div>
        <div className="lic2 rv">
          <div>
            <h3>Every licence is tailored.</h3>
          </div>
          <div>
            <p className="sub">
              Averix does not publish fixed licensing prices. Terms are shaped by the details of each partnership, including:
            </p>
            <div className="tm">
              <span>Territory</span>
              <span>Duration</span>
              <span>Exclusivity</span>
              <span>Product type</span>
              <span>Number of products</span>
              <span>Audience</span>
              <span>Commercial use</span>
              <span>Distribution</span>
              <span>Revenue generated</span>
            </div>
            <div className="bt">
              <Link className="btn p" href="/partnerships">Explore partnerships</Link>
              <button className="btn s" type="button" data-msg="The licensing enquiry form is coming soon. Contact details to be confirmed.">Licensing enquiry</button>
            </div>
          </div>
        </div>
      </section>
      <section className="fin rv">
        <div className="fc">
          <h2>Follow the universe as it grows.</h2>
          <p>New characters, worlds and reveals land first in the Averix community and news.</p>
          <div className="bt">
            <Link className="btn p" href="/community">Join the community</Link>
            <Link className="btn s" href="/news">Latest news</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
