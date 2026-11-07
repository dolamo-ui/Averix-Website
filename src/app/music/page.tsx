import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import SafeImg from '@/components/ui/SafeImg';
import '@/styles/music.css';
import Waveform from '@/features/music/Waveform';
import PlayButton from '@/features/music/PlayButton';
import { getMusic } from '@/features/music/getMusic';

// Re-check the admin for changes at most once a minute.
export const revalidate = 60;

const ICON_SPOTIFY = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M7 10c3.5-1 7-.7 10 1M7.8 13c3-.8 5.8-.5 8.2 1M8.6 16c2.4-.6 4.4-.4 6.4.7" />
  </svg>
);
const ICON_YOUTUBE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="6" width="18" height="12" rx="4" />
    <path d="m10.5 9.5 4 2.5-4 2.5z" />
  </svg>
);
const ICON_APPLE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </svg>
);

/** A streaming link when the client has added one, otherwise the "coming at release" toast button. */
function Stream({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {icon}
      {label}
    </a>
  ) : (
    <button type="button" data-msg={`${label} link coming at release.`}>
      {icon}
      {label}
    </button>
  );
}

export const metadata: Metadata = pageMeta({
  title: 'Music | Averix Games',
  description: "Averix Music: original soundtracks, sound design and creative collaborations, starting with The Awakening, the official game soundtrack.",
  path: '/music',
});

export default async function MusicPage() {
  const { album, releases } = await getMusic();
  return (
    <PageFrame page="music">
      {/* Caveat is only used on this page, so it is loaded here (React 19 hoists it into <head>). */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap"
        precedence="default"
      />

      <section className="mh">
        <div className="mh-img" aria-hidden="true">
          <SafeImg src="/assets/music-hero.jpg" />
        </div>
        <div className="mh-in">
          <span className="eyebrow rv">AVERIX MUSIC</span>
          <h1 className="rv">
            <span>Soundtracks.</span>
            <span>Stories.</span>
            <span className="o">Emotion.</span>
          </h1>
          <p className="lead rv">Original music, game soundtracks and creative collaborations — all in one place.</p>
          <div className="cta rv">
            <a className="btn p" href="#album">Explore Music&nbsp;&rarr;</a>
          </div>
        </div>
        <p className="script" aria-hidden="true">
          Music brings<br />every world<br />to life.
        </p>
      </section>

      <section className="al" id="album">
        <div className="al-g">
          <div className="cov rv">
            <SafeImg src={album.cover} alt={`${album.title}, cover art`} />
          </div>
          <div className="al-i rv">
            <span className="chip">{album.chip}</span>
            <h2>{album.title}</h2>
            <p className="sb">{album.subtitle}</p>
            <p className="ds">{album.description}</p>
            <p className="cr">
              {album.credits.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <div className="bt">
              {(() => {
                const play = (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 4v16l13-8z" />
                    </svg>
                    Listen Now
                  </>
                );
                return album.listenUrl ? (
                  <a className="btn p" href={album.listenUrl} target="_blank" rel="noopener noreferrer">
                    {play}
                  </a>
                ) : (
                  <button className="btn p" type="button" data-msg={`Streaming opens when ${album.title} is released.`}>
                    {play}
                  </button>
                );
              })()}
              <button className="btn s" type="button" data-msg="The full album page is coming soon.">View Album</button>
            </div>
          </div>
          <div className="tl rv">
            <h3>Album Tracklist</h3>
            {album.tracks.length ? (
              <ol>
                {album.tracks.map((t) => (
                  <li key={t.n}>
                    <span className="tn">{t.n}</span>
                    <span className="tt">{t.title}</span>
                    <time>{t.time}</time>
                    <PlayButton label={t.title} href={t.url} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="ds">The tracklist will be announced soon.</p>
            )}
            <div className="av">
              <span className="lb">Available on</span>
              <Stream href={album.spotifyUrl} label="Spotify" icon={ICON_SPOTIFY} />
              <Stream href={album.youtubeUrl} label="YouTube" icon={ICON_YOUTUBE} />
              <Stream href={album.appleUrl} label="Apple Music" icon={ICON_APPLE} />
            </div>
          </div>
        </div>
      </section>

      <section className="wy" id="ways">
        <div className="sh rv">
          <div>
            <span className="eyebrow">OUR MUSIC</span>
            <h2>Three ways to experience Averix Music</h2>
          </div>
          <a className="vl" href="#releases">View all music &rarr;</a>
        </div>
        <div className="wy-g">
          <article className="way rv">
            <div className="way-m">
              <SafeImg src="/assets/music-card1.jpg" loading="lazy" />
            </div>
            <div className="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 18V5l11-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="17" cy="16" r="3" />
              </svg>
            </div>
            <div className="way-b">
              <h3>Game Soundtracks &amp; Albums</h3>
              <p>Explore the music from our games, including level-based tracks, original compositions and full album releases.</p>
              <a className="gk" href="#album">Explore Albums &rarr;</a>
            </div>
          </article>
          <article className="way rv">
            <div className="way-m">
              <SafeImg src="/assets/music-card2.jpg" loading="lazy" />
            </div>
            <div className="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h2M7 8v8M11 4v16M15 8v8M19 10v4M21 12h0" />
              </svg>
            </div>
            <div className="way-b">
              <h3>Soundtracks and Instrumentals</h3>
              <p>In house produced instrumentals and immersive audio designed for Averix games and experiences.</p>
              <button className="gk" type="button" data-msg="The sound design showcase is coming soon.">View Sound Design &rarr;</button>
            </div>
          </article>
          <article className="way rv">
            <div className="way-m">
              <SafeImg src="/assets/music-card3.jpg" loading="lazy" />
            </div>
            <div className="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.4" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.3c2.9-.4 5.5 1.5 5.5 4.7" />
              </svg>
            </div>
            <div className="way-b">
              <h3>Music Releases &amp; Collaborations</h3>
              <p>Standalone tracks, beats and projects from our producer and partner artists.</p>
              <a className="gk" href="#releases">Discover Releases &rarr;</a>
            </div>
          </article>
        </div>
      </section>

      <section className="rl" id="releases">
        <div className="sh rv">
          <div>
            <span className="eyebrow">LATEST RELEASES</span>
            <h2>New Sounds. New Worlds.</h2>
          </div>
          <button className="vl" type="button" data-msg="The full release catalogue is coming soon.">View all releases &rarr;</button>
        </div>
        {releases.length === 0 && <p className="lead rv">New releases are on the way. Check back soon.</p>}
        <div className="rl-g">
          {releases.map((r) => (
            <article className="rel rv" key={r.id}>
              <div className="rel-i">
                {r.cover && <SafeImg src={r.cover} alt={`${r.title} cover art`} loading="lazy" />}
              </div>
              <div>
                <span className="chip">{r.type}</span>
                <b>{r.title}</b>
                <small>{r.artist}</small>
                <div className="rf">
                  <time>{r.time}</time>
                  <PlayButton label={r.title} href={r.url} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cb rv" id="collab">
        <div className="cb-img" aria-hidden="true">
          <SafeImg src="/assets/music-collab.jpg" loading="lazy" />
        </div>
        <Waveform />
        <div className="cb-in">
          <span className="eyebrow">COLLABORATIONS</span>
          <h2>More Artists. Bigger Sounds.</h2>
          <p>
            We work with talented artists and music groups to bring unique sounds to our games and creative projects. From features to full collaborations, we&apos;re always open to new talent.
          </p>
          <Link className="btn p" href="/partnerships#contact">Partner With Us&nbsp;&rarr;</Link>
        </div>
        <p className="script" aria-hidden="true">
          Creativity<br />has no limits.
        </p>
      </section>
    </PageFrame>
  );
}
