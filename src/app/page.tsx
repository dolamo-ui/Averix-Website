import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import { getSiteSettings } from '@/lib/siteSettings';
import { DATA_URIS } from '@/features/home/dataUris';
import '@/styles/home.css';
import Hero from '@/features/home/Hero';
import SnapRow from '@/components/mobile/SnapRow';
import HomeNews from '@/features/news/HomeNews';
import { getNewsPosts } from '@/features/news/getNews';
import HomeEffects from '@/features/home/HomeEffects';
import HomeEvents from '@/features/events/HomeEvents';
import { getEvents } from '@/features/events/getEvents';

// Re-check the admin for new or changed events at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'Averix Games | We build worlds',
  description: "Averix Games is an emerging game studio creating original worlds, bold gaming experiences and communities built around play.",
  path: '/',
});

export default async function HomePage() {
  const site = await getSiteSettings();
  const [{ cms, failed }, { posts: newsPosts, fromCms: newsFromCms, failed: newsFailed }] = await Promise.all([getEvents(), getNewsPosts()]);
  return (
    <PageFrame page="home" scrollPad={70} reveal={false} before={
        <div className="intro" id="intro" aria-hidden="true">
          <span className="slash s1" />
          <span className="slash s2" />
          <img src="/assets/intro-logo.svg" alt="" />
        </div>
      }>
      <HomeEffects />
      <Hero />
      <section id="start" className="mx-quick" aria-labelledby="start-h">
        <span className="eyebrow rv">START HERE</span>
        <h2 id="start-h" className="rv">What brings you here?</h2>
        <div className="mx-q-grid">
          <Link className="mx-q rv" href="/games">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h4M8 10v4M15 12h.01M18 10h.01" /><path d="M17.3 5H6.7a4 4 0 0 0-4 3.6C2.6 9.4 2 14.5 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.4-1.4A2 2 0 0 1 9.8 16h4.4a2 2 0 0 1 1.4.6L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.6-6.6-.7-7.3A4 4 0 0 0 17.3 5z" /></svg>
            <b>See our games</b>
            <small>Every project and how far along it is</small>
          </Link>
          <Link className="mx-q rv" href="/events">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="2" /><path d="M8 2.5v4M16 2.5v4M3 10h18" /></svg>
            <b>Play an event</b>
            <small>Tournaments and community nights</small>
          </Link>
          <Link className="mx-q rv" href="/community">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>
            <b>Join the squad</b>
            <small>Discord, socials and playtests</small>
          </Link>
          <Link className="mx-q rv" href="/about">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            <b>Meet the studio</b>
            <small>Who we are and where we are heading</small>
          </Link>
          <Link className="mx-q wide rv" href="/partnerships#contact">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h8M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" /></svg>
            <span>
              <b>Partner with us</b>
              <small>Publishers, sponsors and brands: start a conversation</small>
            </span>
          </Link>
        </div>
      </section>
      <section id="games">
        <div className="gh">
          <div>
            <span className="eyebrow rv">OUR UNIVERSES</span>
            <h2 className="rv">Built to be played. Designed to be remembered.</h2>
          </div>
          <p className="rv">
            Every great game begins with an idea. We're exploring new worlds, mechanics and experiences that bring players together.
          </p>
        </div>
        <SnapRow className="gg" label="Averix projects">
          <article className="pj big rv" data-href="/games" style={{ cursor: "pointer" }}>
            <div className="art a1" />
            <span className="st">CONCEPT · DETAILS SOON</span>
            <h3>Untitled Game 01</h3>
            <p>
              A new world in the making. Title, key art, genre and platforms will be revealed here as the project takes shape.
            </p>
            <Link className="d" href="/games">Discover project</Link>
          </article>
          <article className="pj rv" data-href="/games" style={{ cursor: "pointer" }}>
            <div className="art a2" />
            <span className="st">CONCEPT · DETAILS SOON</span>
            <h3>Untitled Game 02</h3>
            <p>
              Room for the next big idea. Prototypes, gameplay and development stories will be shared here when they're ready.
            </p>
          </article>
          <article className="pj rv" data-href="/games" style={{ cursor: "pointer" }}>
            <div className="art a3" />
            <span className="st">CONCEPT · DETAILS SOON</span>
            <h3>Original World 01</h3>
            <p>
              Characters, worlds and stories designed to live beyond the screen. Original Averix IP will be introduced here.
            </p>
          </article>
        </SnapRow>
        <div className="gn rv">
          <p>
            Averix is more than a single game. We're building original games, worlds and characters, and every project will carry a clear development status as it grows.
          </p>
          <ul className="gl" aria-label="Development status labels">
            <li>Concept</li>
            <li>Prototype</li>
            <li>In Development</li>
            <li>Early Access</li>
            <li>Coming Soon</li>
            <li>Released</li>
          </ul>
          <Link className="gk" href="/community">Follow the journey →</Link>
        </div>
      </section>
      <section id="about">
        <span className="eyebrow rv">ABOUT AVERIX</span>
        <h2 className="rv">Built for the long game.</h2>
        <p className="rv">
          Averix Games is the studio behind the games: an independent team building original worlds, intellectual property and a community around play, with the patience to do it properly.
        </p>
        <div style={{ marginTop: "4rem" }}>
          <div className="ab-s rv">
            <h3>01 · OUR STORY</h3>
            <div>
              <p>
                Averix Games is an independent studio at the start of its journey. Instead of building everything around a single title, we are laying the foundations of a studio: the people, the process and the creative universe that many games can grow from.
              </p>
              <p>
                Every project we start is one chapter in a bigger story, and we share its progress openly as it moves from concept to release.
              </p>
            </div>
          </div>
          <div className="ab-s rv">
            <h3>02 · MISSION &amp; VISION</h3>
            <div className="ab-2">
              <div className="ab-c">
                <h4>Mission</h4>
                <p>
                  To create original games and worlds that give players a reason to connect, through bold ideas, careful craft and a community that grows alongside us.
                </p>
              </div>
              <div className="ab-c">
                <h4>Vision</h4>
                <p>
                  To grow into a lasting game studio whose worlds, characters and stories are loved by players across platforms and generations.
                </p>
              </div>
            </div>
          </div>
          <div className="ab-s rv">
            <h3>03 · THE TEAM</h3>
            <div className="ab-t">
              <div>
                <i aria-hidden="true">FS</i>
                <b>Francis Tinashe Sakala</b>
                <small>Graphics Designer</small>
              </div>
              <div>
                <i aria-hidden="true">SM</i>
                <b>Shane Motsapole</b>
                <small>Community &amp; Audience Lead</small>
              </div>
              <div>
                <i aria-hidden="true">TN</i>
                <b>Tshepiso Nkhodi</b>
                <small>Managing Director</small>
              </div>
              <div>
                <i aria-hidden="true">BP</i>
                <b>Bokamoso Pitso</b>
                <small>Game Developer &amp; Sound Engineer</small>
              </div>
              <div>
                <i aria-hidden="true">LM</i>
                <b>Linnah Msiza</b>
                <small>Business Development Executive &amp; Technical Team Coordinator</small>
              </div>
            </div>
          </div>
        </div>
        <p className="ab-q rv">A long-term studio, not a one-project operation.</p>
        <div className="cta rv" style={{ marginTop: "2.2rem" }}>
          <Link className="btn p" href="/community">Meet the community</Link>
          <Link className="btn s" href="/partnerships">Partner with us</Link>
        </div>
      </section>
      <section id="events">
        <div className="big" aria-hidden="true">GG</div>
        <span className="eyebrow rv">PLAY TOGETHER</span>
        <h2 className="rv">The next match starts here.</h2>
        <p className="rv" style={{ marginTop: "1.5rem" }}>Competitive experiences, community events and new opportunities for players to come together.</p>
        <HomeEvents cms={cms} failed={failed} />
        <div style={{ marginTop: "2rem" }}>
          <Link className="btn p" href="/events">Explore events</Link>
        </div>
      </section>
      <section id="community">
        <div className="cvid" aria-hidden="true">
          <video id="cv2" src="/assets/community-bg2.mp4" poster="/assets/community-poster2.jpg" autoPlay muted loop playsInline preload="metadata" />
        </div>
        <span className="eyebrow rv">JOIN THE COMMUNITY</span>
        <h2 className="rv">The world is better when we play together.</h2>
        <p className="rv">Follow the journey, discover what's happening and become part of the community growing around Averix Games.</p>
        <ul className="gl rv" aria-label="What the community offers">
          <li>Tournaments</li>
          <li>Community nights</li>
          <li>Playtests &amp; early builds</li>
          <li>Dev updates</li>
          <li>Talk to the team</li>
        </ul>
        <a className="btn p rv" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Join the Discord</a>
        <div className="soc rv">
          <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">
            <i className="si" style={{ "--m": DATA_URIS[0] } as CSSProperties} />
            DISCORD
          </a>
          <a href={site.socials[1].href} target="_blank" rel="noopener noreferrer">
            <i className="si" style={{ "--m": DATA_URIS[1] } as CSSProperties} />
            X / TWITTER
          </a>
          <a href={site.socials[2].href} target="_blank" rel="noopener noreferrer">
            <i className="si" style={{ "--m": DATA_URIS[2] } as CSSProperties} />
            TIKTOK
          </a>
          <a href={site.socials[3].href} target="_blank" rel="noopener noreferrer">
            <i className="si" style={{ "--m": DATA_URIS[3] } as CSSProperties} />
            INSTAGRAM
          </a>
        </div>
      </section>
      <section id="news">
        <div className="gh">
          <div>
            <span className="eyebrow rv">LATEST NEWS</span>
            <h2 className="rv">Fresh from the studio.</h2>
          </div>
          <p className="rv">Studio announcements, development updates and community news as Averix Games takes shape.</p>
        </div>
        <HomeNews posts={newsPosts} fromCms={newsFromCms} failed={newsFailed} />
        <div style={{ marginTop: "2rem" }}>
          <Link className="btn p" href="/news">All news &amp; updates</Link>
        </div>
      </section>
      <section id="partners">
        <span className="eyebrow rv">PARTNERSHIPS</span>
        <h2 className="rv">Let's build something extraordinary.</h2>
        <p className="rv" style={{ marginTop: "1.5rem" }}>
          We're open to meaningful conversations with publishers, sponsors, brands and creative partners who share our ambition for the future of gaming.
        </p>
        <ul className="pl">
          <li className="rv">
            Publishing
            &amp;
            Distribution
            <span>Bringing Averix games to more players</span>
          </li>
          <li className="rv">
            Sponsorships
            &amp;
            Brand Collaborations
            <span>Events and community activities</span>
          </li>
          <li className="rv">
            Co-Development
            <span>Building projects together</span>
          </li>
          <li className="rv">
            Intellectual Property
            &amp;
            Licensing
            <span>Selected Averix-owned properties</span>
          </li>
        </ul>
        <Link className="btn" href="/partnerships#contact">Start a conversation</Link>
        <Link className="gk" href="/partnerships" style={{ marginLeft: "1.6rem", color: "var(--vi)" }}>See how we partner →</Link>
      </section>
      <section id="final">
        <div className="cvid" aria-hidden="true">
          <video src="/assets/final-bg.mp4" poster="/assets/final-poster.jpg" autoPlay muted loop playsInline preload="metadata" />
        </div>
        <h2 className="rv">This is only the beginning.</h2>
        <p className="rv">
          Follow the journey as Averix Games builds new worlds, new experiences and a community around the future of play.
        </p>
        <a className="btn p rv" href="#hero">Discover Averix</a>
      </section>
    </PageFrame>
  );
}
