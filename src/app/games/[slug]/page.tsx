import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import { pageMeta } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/lib/siteSettings';
import { GAMES, PIPELINE, getGame, type Game } from '@/features/games/gamesData';
import { getGamesWithAdmin } from '@/features/games/getGames';
import { getTeam } from '@/features/about/getTeam';
import { initialsOf } from '@/features/about/teamData';
import '@/styles/site.css';
import '@/styles/game.css';

export const dynamicParams = false;

// Re-check the admin (trailer, screenshots, waiting list link) at most once a minute.
export const revalidate = 60;

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGame(slug);
  if (!g) return {};
  return pageMeta({
    title: `${g.name} | Averix Games`,
    description: `${g.name} (${g.status}) from Averix Games. ${g.description}`,
    path: `/games/${g.slug}`,
    image: `/og/${g.slug}.png`,
  });
}

function Action({ game, kind, variant }: { game: Game; kind: 'waitlist' | 'download' | 'play'; variant: 'p' | 's' }) {
  const label = { waitlist: 'Join Waiting List', download: 'Download', play: game.slug === 'beta' ? 'Join Alpha' : game.slug === 'gamma' ? 'Pre-Register' : 'Play' }[kind];
  const url = game.links[kind];
  if (url) {
    return (
      <a className={`btn ${variant}`} href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <button type="button" className={`btn ${variant}`} data-msg={game.linkMessages[kind]}>
      {label}
    </button>
  );
}

function Trailer({ game }: { game: Game }) {
  const t = game.trailer;
  if (t?.kind === 'youtube') {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${t.id}`}
        title={`${game.name} trailer`}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (t?.kind === 'mp4') {
    return <video src={t.src} poster={t.poster} controls playsInline preload="metadata" />;
  }
  return (
    <div className="ph">
      <span className="play" aria-hidden="true" />
      <b>Trailer coming soon</b>
      <small>The first look at {game.name} will be published here.</small>
    </div>
  );
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSiteSettings();
  const team = await getTeam();
  const all = await getGamesWithAdmin();
  const game = all.find((g) => g.slug === slug);
  if (!game) notFound();

  const others = all.filter((g) => g.slug !== game.slug);
  const heroStyle: CSSProperties | undefined = game.keyArt
    ? { backgroundImage: `linear-gradient(90deg,rgba(5,6,10,.94) 0%,rgba(5,6,10,.55) 55%,rgba(5,6,10,.25) 100%),url(${game.keyArt})` }
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: `${SITE_URL}/games/${game.slug}`,
    publisher: { '@type': 'Organization', name: 'Averix Games', url: SITE_URL },
  };

  return (
    <PageFrame page="site" toastMs={2400}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="gd" style={{ '--c': game.accent } as CSSProperties}>
        <section className="gd-hero">
          <div className={`gd-bg${game.keyArt ? ' art' : ''}`} style={heroStyle} aria-hidden="true" />
          <div className="gd-motif" aria-hidden="true">
            <i className="r1" />
            <i className="r2" />
            <i className="r3" />
            <b>{game.no}</b>
          </div>
          <div className="gd-hero-in">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/games">Games</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{game.name}</span>
            </nav>
            <span className="chip live">{game.status}</span>
            {game.logo ? (
              <h1 className="logo">
                <img src={game.logo} alt={game.name} />
              </h1>
            ) : (
              <h1>{game.name}</h1>
            )}
            <p className="lead">{game.tagline}</p>
            <div className="cta">
              <Action game={game} kind={game.primaryAction} variant="p" />
              <a className="btn s" href="#trailer">Watch trailer</a>
            </div>
          </div>
          <dl className="facts">
            <div>
              <dt>Status</dt>
              <dd>{game.status}</dd>
            </div>
            <div>
              <dt>Genre</dt>
              <dd>{game.genre}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{game.platforms}</dd>
            </div>
            <div>
              <dt>Release</dt>
              <dd>{game.release}</dd>
            </div>
          </dl>
        </section>

        <section className="gd-sec" id="trailer">
          <span className="eyebrow rv">TRAILER</span>
          <h2 className="rv">Watch {game.name}</h2>
          <div className="trailer rv">
            <Trailer game={game} />
          </div>
        </section>

        <section className="gd-sec" id="about">
          <span className="eyebrow rv">ABOUT THE GAME</span>
          <div className="two">
            <div className="rv">
              <h2>What is {game.name}?</h2>
              <p className="big">{game.description}</p>
            </div>
            <div className="card rv">
              <h3>Gameplay</h3>
              <p>{game.gameplay}</p>
            </div>
          </div>
        </section>

        <section className="gd-sec" id="screenshots">
          <span className="eyebrow rv">SCREENSHOTS</span>
          <h2 className="rv">A look inside</h2>
          <div className="shots">
            {game.screenshots.length > 0
              ? game.screenshots.map((src, i) => (
                  <figure key={src} className="shot rv">
                    <SafeImg src={src} alt={`${game.name} screenshot ${i + 1}`} loading="lazy" />
                  </figure>
                ))
              : [1, 2, 3].map((n) => (
                  <figure key={n} className="shot empty rv">
                    <span>SCREENSHOT 0{n}</span>
                    <small>Coming soon</small>
                  </figure>
                ))}
          </div>
        </section>

        <section className="gd-sec" id="story">
          <span className="eyebrow rv">DEVELOPMENT STORY</span>
          <div className="two">
            <div className="rv">
              <h2>How it&apos;s coming together</h2>
              <p className="big">{game.story}</p>
            </div>
            <div className="card rv">
              <h3>Pipeline</h3>
              <ol className="pipe" aria-label={`Stage ${game.stage} of ${PIPELINE.length}: ${game.status}`}>
                {PIPELINE.map((step, i) => (
                  <li key={step} className={i + 1 < game.stage ? 'done' : i + 1 === game.stage ? 'now' : undefined}>
                    <i aria-hidden="true" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="gd-sec" id="team">
          <span className="eyebrow rv">THE TEAM</span>
          <h2 className="rv">The studio behind it</h2>
          <ul className="team">
            {team.map((m) => (
              <li key={m.id} className="rv">
                <i aria-hidden="true">{initialsOf(m.name)}</i>
                <b>{m.name}</b>
                <span>{m.role}</span>
              </li>
            ))}
          </ul>
          <p className="more rv">
            <Link href="/about#team">Meet the whole squad</Link>
          </p>
        </section>

        <section className="gd-sec" id="follow">
          <div className="follow rv">
            <div>
              <span className="eyebrow">FOLLOW {game.name.toUpperCase()}</span>
              <h2>Be there from the start.</h2>
              <p>Updates, trailers and early builds go to the community first.</p>
            </div>
            <div className="acts">
              <div className="bt">
                <Action game={game} kind="waitlist" variant="p" />
                <Action game={game} kind="download" variant="s" />
                {game.primaryAction === 'play' && <Action game={game} kind="play" variant="s" />}
              </div>
              <ul className="soc" aria-label="Averix Games social channels">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="gd-sec" id="more">
          <span className="eyebrow rv">MORE FROM AVERIX</span>
          <div className="oth">
            {others.map((o) => (
              <Link key={o.slug} className="rv" href={`/games/${o.slug}`} style={{ '--c': o.accent } as CSSProperties}>
                <em>{o.no}</em>
                <b>{o.name}</b>
                <small>{o.status}</small>
              </Link>
            ))}
            <Link className="rv all" href="/games">
              <b>All games</b>
              <small>Back to the catalogue</small>
            </Link>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
