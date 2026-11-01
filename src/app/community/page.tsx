import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import { DATA_URIS } from '@/features/community/dataUris';
import '@/styles/community.css';
import NextEventLink from '@/features/community/NextEventLink';
import LevelDeck from '@/features/community/LevelDeck';
import Schedule from '@/features/community/Schedule';
import { getEvents } from '@/features/events/getEvents';
import { communityEvents } from '@/features/community/fromEvents';

// Re-check the admin for new or changed events at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'Community | Averix Games',
  description: "Join the Averix Games community: Discord, X, TikTok and Instagram, community events, playtests and tournaments.",
  path: '/community',
});

export default async function CommunityPage() {
  const { cms, failed } = await getEvents();
  const { events, sample } = communityEvents(cms);
  return (
    <PageFrame page="community">
      <section className="hero" id="top">
        <video className="hv" src="/assets/community-bg.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <i className="sl" aria-hidden="true" />
        <i className="sl b" aria-hidden="true" />
        <div className="hc">
          <span className="eyebrow rv">AVERIX COMMUNITY</span>
          <h1 className="rv">
            <span>Your squad</span>
            <span className="o">is waiting.</span>
          </h1>
          <p className="lead rv">
            Players, creators and the Averix team in one place. Find teammates, enter tournaments and help shape what we build next.
          </p>
          <div className="cta rv">
            <a className="btn p" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">Join the Discord</a>
            <a className="btn s" href="#path">How to start</a>
          </div>
        </div>
        <div className="dock rv">
          <NextEventLink events={events} />
          <div className="soc" aria-label="Averix social links">
            <a className="ic" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <i style={{ "--m": DATA_URIS[0] } as CSSProperties} />
            </a>
            <a className="ic" href="https://x.com/averixgames" target="_blank" rel="noopener noreferrer" aria-label="X">
              <i style={{ "--m": DATA_URIS[1] } as CSSProperties} />
            </a>
            <a className="ic" href="https://www.tiktok.com/@avxgames" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <i style={{ "--m": DATA_URIS[2] } as CSSProperties} />
            </a>
            <a className="ic" href="https://www.instagram.com/avxgame?stkn=am12azMyd24xaG90" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i style={{ "--m": DATA_URIS[3] } as CSSProperties} />
            </a>
          </div>
        </div>
      </section>
      <section className="sec" id="comms">
        <div className="sh rv">
          <span className="eyebrow">COMMS</span>
          <h2>Pick your channel.</h2>
        </div>
        <div className="bento">
          <a className="bx dc rv" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">
            <span className="ic">
              <i style={{ "--m": DATA_URIS[4] } as CSSProperties} />
            </span>
            <div className="tx">
              <small>Primary hub</small>
              <h3>Discord</h3>
              <p>Where the community lives: updates, event check-ins, team finding and playtests.</p>
            </div>
            <ul className="ch">
              <li>
                #welcome
                <span>Say hello</span>
              </li>
              <li>
                #announcements
                <span>News first</span>
              </li>
              <li>
                #tournaments
                <span>Check-in</span>
              </li>
              <li>
                #playtests
                <span>Early builds</span>
              </li>
            </ul>
            <span className="go">ENTER THE SERVER →</span>
          </a>
          <a className="bx rv" href="https://x.com/averixgames" target="_blank" rel="noopener noreferrer">
            <span className="ic">
              <i style={{ "--m": DATA_URIS[5] } as CSSProperties} />
            </span>
            <div className="tx">
              <small>@averixgames</small>
              <h3>X / Twitter</h3>
              <p>Announcements and quick updates.</p>
            </div>
            <span className="go">FOLLOW →</span>
          </a>
          <a className="bx rv" href="https://www.tiktok.com/@avxgames" target="_blank" rel="noopener noreferrer">
            <span className="ic">
              <i style={{ "--m": DATA_URIS[6] } as CSSProperties} />
            </span>
            <div className="tx">
              <small>@avxgames</small>
              <h3>TikTok</h3>
              <p>Clips, behind the scenes and dev moments.</p>
            </div>
            <span className="go">WATCH →</span>
          </a>
          <a className="bx rv" href="https://www.instagram.com/avxgame?stkn=am12azMyd24xaG90" target="_blank" rel="noopener noreferrer">
            <span className="ic">
              <i style={{ "--m": DATA_URIS[7] } as CSSProperties} />
            </span>
            <div className="tx">
              <small>@avxgame</small>
              <h3>Instagram</h3>
              <p>Artwork, reveals and studio life.</p>
            </div>
            <span className="go">FOLLOW →</span>
          </a>
        </div>
        <p className="note">Channel list is a preview. Final Discord channels to be confirmed by Averix.</p>
      </section>
      <section className="sec alt" id="path">
        <div className="sh rv">
          <span className="eyebrow">PROGRESSION</span>
          <h2>Level up with Averix.</h2>
          <p>New here? Start at level one and go at your own pace. Swipe or drag to move through the levels.</p>
        </div>
        <LevelDeck />
      </section>
      <section className="sec" id="sched">
        <div className="sh rv">
          <span className="eyebrow">MATCH SCHEDULE</span>
          <h2>Next up.</h2>
        </div>
        {events.length > 0 ? (
          <Schedule events={events} />
        ) : (
          <p className="note">
            {failed ? 'The schedule is temporarily unavailable. Please check back soon.' : 'No events scheduled yet. Join the Discord to hear first.'}
          </p>
        )}
        <p className="note">
          {sample ? 'Sample schedule. ' : 'Times are South African time (SAST). '}Full details and sign-up are on the Events page.
        </p>
      </section>
      <section className="sec alt" id="rules">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">RULES OF ENGAGEMENT</span>
            <h2>Keep it fun for everyone.</h2>
            <p>Applies on Discord and at every Averix event.</p>
          </div>
          <ol className="rl rv">
            <li>
              <span className="n">01</span>
              <div>
                <b>Be respectful</b>
                No harassment, hate speech or personal attacks.
              </div>
            </li>
            <li>
              <span className="n">02</span>
              <div>
                <b>Play fair</b>
                No cheating, exploits or account sharing in events.
              </div>
            </li>
            <li>
              <span className="n">03</span>
              <div>
                <b>Keep it safe</b>
                No sharing personal information or unsafe links.
              </div>
            </li>
            <li>
              <span className="n">04</span>
              <div>
                <b>Stay on topic</b>
                Use the right channel and avoid spam or self-promotion.
              </div>
            </li>
          </ol>
        </div>
      </section>
      <section className="sec" id="faq">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">INTEL</span>
            <h2>Questions, answered.</h2>
          </div>
          <div className="rv">
            <details>
              <summary>Is the community free to join?</summary>
              <p>
                Yes. Our Discord and social accounts are free. Some events have a small entry fee, which is always shown before you register.
              </p>
            </details>
            <details>
              <summary>How do I get event updates?</summary>
              <p>Join the Discord and follow us on X. Event details, check-in times and results are posted there first.</p>
            </details>
            <details>
              <summary>Can I help test the games?</summary>
              <p>Yes. Playtests are announced on Discord. Join the server and watch the announcements channel.</p>
            </details>
            <details>
              <summary>Who do I contact for something private?</summary>
              <p>Send a direct message to a moderator on Discord, or use the Partnerships page for business enquiries.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="end rv">
        <div>
          <h2>Your slot is open.</h2>
          <p>Join the Averix community before the first world drops.</p>
          <div className="cta">
            <a className="btn p" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">Join the Discord</a>
            <Link className="btn s" href="/events">See events</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
