import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import '@/styles/events.css';
import NextUpCountdown from '@/features/events/NextUpCountdown';
import TournamentCarousel from '@/features/events/TournamentCarousel';
import EventExplorer from '@/features/events/EventExplorer';
import { EventsProvider, EventsNote } from '@/features/events/EventsProvider';
import { getEvents } from '@/features/events/getEvents';

// Re-check the admin for new or changed events at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'Events | Averix Games',
  description: "Online tournaments, community nights and showcases from Averix Games.",
  path: '/events',
});

export default async function EventsPage() {
  const { cms, failed } = await getEvents();
  return (
    <PageFrame page="events">
      <EventsProvider cms={cms} failed={failed}>
      <section className="eh">
        <img src="/assets/events-hero.jpg" alt="A squad of fantasy warriors charging up temple steps toward a glowing gate" width="1200" height="549" fetchPriority="high" />
        <div className="wrap">
          <div>
            <span className="eyebrow">AVERIX EVENTS · ONLINE FIRST</span>
            <h1>
              The next match
              {' '}
              <span>starts here.</span>
            </h1>
            <p className="lead">
              Online tournaments, community nights and showcases. Pick your event, check the details and get ready to play together.
            </p>
            <div className="cta">
              <a className="btn p" href="#grid">See what's coming</a>
              <Link className="btn s" href="/community">Join the community</Link>
            </div>
          </div>
          <NextUpCountdown />
        </div>
      </section>
      <section className="jt" aria-label="Join the big tournaments">
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="jg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00e5ff" />
              <stop offset="1" stopColor="#7b34ff" />
            </linearGradient>
            <path id="jstar" fill="url(#jg)" d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z" />
          </defs>
        </svg>
        <TournamentCarousel />
        <div className="jt-s" aria-hidden="true">
          <div>
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Gaming Spaning</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Action - Packed</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
            <b>Mind - Bending</b>
            <img className="st4" src="/assets/logo.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>
      <EventExplorer />
      <EventsNote />
      <section className="hb">
        <div>
          <span className="eyebrow">HOST OR SPONSOR</span>
          <h2>Got an event in mind?</h2>
          <p>Brands, creators and communities can partner with Averix to run tournaments and showcases.</p>
        </div>
        <Link className="btn p" href="/partnerships">Partner with us</Link>
      </section>
      </EventsProvider>
    </PageFrame>
  );
}
