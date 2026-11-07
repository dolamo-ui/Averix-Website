import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import { getSiteSettings } from '@/lib/siteSettings';
import '@/styles/about.css';
import AboutEffects from '@/features/about/AboutEffects';
import SafeImg from '@/components/ui/SafeImg';
import { getTeam } from '@/features/about/getTeam';
import { initialsOf } from '@/features/about/teamData';

// Re-check the admin (team, links) at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'About | Averix Games',
  description: "About Averix Games: our story, mission and vision, studio philosophy, long-term ambitions and the team building original games, IP and a community.",
  path: '/about',
});

export default async function AboutPage() {
  const site = await getSiteSettings();
  const team = await getTeam();
  return (
    <PageFrame page="about">
      <AboutEffects />
      <section className="ph ah" id="top">
        <i className="sl" aria-hidden="true" />
        <i className="sl b" aria-hidden="true" />
        <div>
          <span className="eyebrow rv">ABOUT AVERIX</span>
          <h1 className="rv">
            <span>Built for</span>
            <span>the long</span>
            <span className="o">game.</span>
          </h1>
          <p className="lead rv">
            Averix Games is an independent studio building original worlds, intellectual property and a community around play, with the patience to do it properly.
          </p>
          <ul className="jump rv" aria-label="On this page">
            <li>
              <a href="#story">
                <b>01</b>
                Story
              </a>
            </li>
            <li>
              <a href="#mission">
                <b>02</b>
                Mission
              </a>
            </li>
            <li>
              <a href="#philosophy">
                <b>03</b>
                Philosophy
              </a>
            </li>
            <li>
              <a href="#create">
                <b>04</b>
                What we make
              </a>
            </li>
            <li>
              <a href="#roadmap">
                <b>05</b>
                Roadmap
              </a>
            </li>
            <li>
              <a href="#team">
                <b>06</b>
                Team
              </a>
            </li>
          </ul>
        </div>
        <div className="em rv" id="em" aria-hidden="true">
          <i className="c a" />
          <i className="c b" />
          <i className="c c2" />
          <i className="c d" />
          <span className="t a">Studio file / 001</span>
          <span className="t b">Emerging</span>
          <span className="t c2">Games · IP · Community</span>
          <span className="t d">Online first</span>
          <span className="glow" />
          <span className="ring" />
          <span className="ring r2" />
          <img className="mark" src="/assets/logo.png" alt="" width="260" height="232" />
          <span className="scan" />
        </div>
      </section>
      <div className="tickr" aria-hidden="true">
        <div>
          <span>Imagination</span>
          <span>Craft</span>
          <span>Community</span>
          <span>Games</span>
          <span>Original IP</span>
          <span>Online events</span>
          <span>Imagination</span>
          <span>Craft</span>
          <span>Community</span>
          <span>Games</span>
          <span>Original IP</span>
          <span>Online events</span>
        </div>
      </div>
      <section className="sec" id="idea">
        <span className="eyebrow rv">THE BIG IDEA</span>
        <h2 className="big rv">Not simply a team making games.</h2>
        <p className="lead rv" style={{ maxWidth: "56ch" }}>
          We are building a gaming company, original intellectual properties and a community around them. Every game is one chapter of something larger.
        </p>
        <nav className="pl rv" aria-label="What Averix builds">
          <Link href="/games">
            <small>01</small>
            <b>Games</b>
            <p>Original titles, each treated as a proper product.</p>
          </Link>
          <Link href="/ip">
            <small>02</small>
            <b>IP</b>
            <p>Characters, worlds and stories that live beyond the screen.</p>
          </Link>
          <Link href="/community">
            <small>03</small>
            <b>Community</b>
            <p>Players who belong before they have played a single level.</p>
          </Link>
        </nav>
      </section>
      <section className="sec alt" id="story">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">01 · OUR STORY</span>
            <h2>One studio. Many chapters.</h2>
          </div>
          <div className="story rv">
            <p>
              Averix Games is an independent studio at the start of its journey. Instead of building everything around a single title, we are laying the foundations of a studio: the people, the process and the creative universe that many games can grow from.
            </p>
            <p>
              Every project we start is one chapter in a bigger story, and we share its progress openly as it moves from concept to release. Players, partners and fellow creators can follow along from the very first day.
            </p>
            <p>
              We are early, and that is the point. The decisions we make now, about how we build, who we build with and what we stand for, shape the studio Averix becomes.
            </p>
            <div className="pq">
              <b>A long-term studio, not a one-project operation.</b>
            </div>
          </div>
        </div>
      </section>
      <section className="sec" id="mission">
        <div className="sh rv">
          <span className="eyebrow">02 · MISSION &amp; VISION</span>
          <h2>Why we build. Where we're headed.</h2>
        </div>
        <div className="mv">
          <article className="mvc rv">
            <div className="mvi" data-l="M">
              <small>MISSION</small>
              <h3>What we do</h3>
              <p>
                To create original games and worlds that give players a reason to connect, through bold ideas, careful craft and a community that grows alongside us.
              </p>
            </div>
          </article>
          <article className="mvc v rv">
            <div className="mvi" data-l="V">
              <small>VISION</small>
              <h3>Where we go</h3>
              <p>
                To grow into a lasting game studio whose worlds, characters and stories are loved by players across platforms and generations.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="sec alt" id="philosophy">
        <div className="sh rv">
          <span className="eyebrow">03 · STUDIO PHILOSOPHY</span>
          <h2>Three things guide everything.</h2>
        </div>
        <ol className="ph-l rv">
          <li>
            <span className="n">01</span>
            <h3>Imagination</h3>
            <p>We start with original ideas: new worlds, characters and stories, not copies of what already exists.</p>
          </li>
          <li>
            <span className="n">02</span>
            <h3>Craft</h3>
            <p>Good ideas deserve patience. We build carefully, test openly and finish what we start.</p>
          </li>
          <li>
            <span className="n">03</span>
            <h3>Community</h3>
            <p>Players are not an audience at the end of the process. They are part of it from the first update.</p>
          </li>
        </ol>
      </section>
      <section className="sec" id="create">
        <div className="sh rv">
          <span className="eyebrow">04 · WHAT WE CREATE</span>
          <h2>More than a single game.</h2>
          <p>Four things, built together, so each one makes the others stronger.</p>
        </div>
        <div className="cr">
          <article className="card rv">
            <span className="n" aria-hidden="true">01</span>
            <h3>Games</h3>
            <p>Original games, each with its own page, story and development journey.</p>
            <Link className="gk" href="/games">Explore games →</Link>
          </article>
          <article className="card rv">
            <span className="n" aria-hidden="true">02</span>
            <h3>Original IP</h3>
            <p>Characters, worlds, stories and music designed to live beyond the screen.</p>
            <Link className="gk" href="/ip">See the IP →</Link>
          </article>
          <article className="card rv">
            <span className="n" aria-hidden="true">03</span>
            <h3>Online events</h3>
            <p>Tournaments and competitions, starting online to build a competitive community.</p>
            <Link className="gk" href="/events">View events →</Link>
          </article>
          <article className="card rv">
            <span className="n" aria-hidden="true">04</span>
            <h3>Community</h3>
            <p>A place to belong, with Discord, community nights, playtests and dev updates.</p>
            <Link className="gk" href="/community">Join in →</Link>
          </article>
        </div>
        <div className="ladder">
          <div className="rv">
            <span className="eyebrow">OUR APPROACH TO GAMES</span>
            <h3>Honest about every stage.</h3>
            <p>
              Every game is shown at its real stage and shared as it moves forward. You will always know where a project stands.
            </p>
          </div>
          <ol className="lad rv" aria-label="Development stages">
            <li style={{ "--k": "0" } as CSSProperties}>
              <span>Concept</span>
            </li>
            <li style={{ "--k": "1" } as CSSProperties}>
              <span>Prototype</span>
            </li>
            <li style={{ "--k": "2" } as CSSProperties}>
              <span>In Development</span>
            </li>
            <li style={{ "--k": "3" } as CSSProperties}>
              <span>Early Access</span>
            </li>
            <li style={{ "--k": "4" } as CSSProperties}>
              <span>Coming Soon</span>
            </li>
            <li style={{ "--k": "5" } as CSSProperties}>
              <span>Released</span>
            </li>
          </ol>
        </div>
      </section>
      <section className="sec alt" id="roadmap">
        <div className="sh rv">
          <span className="eyebrow">05 · LONG-TERM AMBITIONS</span>
          <h2>The road ahead.</h2>
          <p>Built for where Averix is going, not only where it is today.</p>
        </div>
        <ol className="rm rv">
          <li className="now">
            <small>NOW</small>
            <h3>Foundation</h3>
            <p>Building the studio: the team, the process and our first projects.</p>
          </li>
          <li>
            <small>NEXT</small>
            <h3>Community &amp; events</h3>
            <p>Discord, community nights and online tournaments that bring players together.</p>
          </li>
          <li>
            <small>THEN</small>
            <h3>IP &amp; partners</h3>
            <p>Characters, worlds and stories that travel further, with partners who help them get there.</p>
          </li>
          <li>
            <small>BEYOND</small>
            <h3>Established studio</h3>
            <p>Multiple game universes, tournament series and an international reach.</p>
          </li>
        </ol>
      </section>
      <section className="sec" id="team">
        <div className="sh rv">
          <span className="eyebrow">06 · THE TEAM</span>
          <h2>Meet the squad.</h2>
          <p>The people responsible for building Averix. Pick a player.</p>
        </div>
        <div className="rost">
          {team.map((m, i) => (
            <article className="slot rv" key={m.id}>
              <div className="sbar">
                <span>
                  Slot
                  {' '}
                  <b>{String(i + 1).padStart(2, '0')}</b>
                </span>
                <span>{m.dept}</span>
              </div>
              <div className="av">
                {m.photo && <SafeImg className="tp" src={m.photo} alt={m.name} loading="lazy" />}
                <i aria-hidden="true">{initialsOf(m.name)}</i>
              </div>
              <div className="sin">
                <h3>{m.name}</h3>
                <span className="rl">{m.role}</span>
                <p>{m.blurb}</p>
              </div>
            </article>
          ))}
          <article className="slot open rv">
            <div className="sbar">
              <span>
                Slot
                {' '}
                <b>{String(team.length + 1).padStart(2, '0')}</b>
              </span>
              <span>Open</span>
            </div>
            <div className="av">
              <i aria-hidden="true">+</i>
            </div>
            <div className="sin">
              <h3>Player two?</h3>
              <p>As Averix grows, so does the roster. No current vacancies? Join our talent network.</p>
              <a className="btn s" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Join the talent network</a>
            </div>
          </article>
        </div>
      </section>
      <section className="end ab rv">
        <div>
          <h2>Play the long game with us.</h2>
          <p>Follow the journey, join the community or talk to us about working together.</p>
          <div className="cta">
            <Link className="btn p" href="/community">Join the community</Link>
            <Link className="btn s" href="/partnerships">Partner with us</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
