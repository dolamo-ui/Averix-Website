import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import '@/styles/news.css';
import NewsFeed from '@/features/news/NewsFeed';
import CopyBoilerplate from '@/features/news/CopyBoilerplate';
import { getNewsPosts } from '@/features/news/getNews';

// Re-check the CMS for new posts at most once a minute.
export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: 'News | Averix Games',
  description: "News and updates from Averix Games: studio announcements, development updates, community events and press resources.",
  path: '/news',
});

export default async function NewsPage() {
  const { posts, fromCms, failed } = await getNewsPosts();
  return (
    <PageFrame page="news" toastMs={3200}>
      <section className="ph" id="top">
        <i className="sl" aria-hidden="true" />
        <i className="sl b" aria-hidden="true" />
        <span className="eyebrow rv">NEWS &amp; UPDATES</span>
        <h1 className="rv">
          <span>Inside</span>
          <span className="o">Averix.</span>
        </h1>
        <p className="lead rv">Studio announcements, development updates and community news, all in one place.</p>
        <div className="cta rv">
          <a className="btn p" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">Get updates on Discord</a>
          <a className="btn s" href="#press">Press kit</a>
        </div>
      </section>
      <section className="sec" id="latest">
        <div className="sh rv">
          <span className="eyebrow">FEATURED</span>
          <h2>Latest from the studio.</h2>
        </div>
        <article className="feat rv" id="studio-opens" data-cat="Studio">
          <div className="fa" aria-hidden="true" />
          <div className="ft">
            <div className="meta">
              <span className="pill">Studio</span>
              <time dateTime="2026-10-01">1 Oct 2026</time>
            </div>
            <h2>Averix Games opens its doors</h2>
            <p>
              Averix Games is an independent studio at the start of its journey. Instead of building everything around a single title, we are laying the foundations of a studio: the people, the process and the creative universe that many games can grow from.
            </p>
            <p>
              Our first projects are in the concept stage. We will share each one openly as it moves from idea to prototype to release, starting with this website and the community growing around it.
            </p>
            <div className="cta" style={{ marginTop: ".6rem" }}>
              <Link className="btn p" href="/about">About the studio</Link>
              <Link className="btn s" href="/community">Join the community</Link>
            </div>
          </div>
        </article>
      </section>
      <section className="sec alt" id="feed">
        <div className="sh rv">
          <span className="eyebrow">ALL UPDATES</span>
          <h2>Every update, in order.</h2>
        </div>
        <NewsFeed posts={posts} />
        {failed && <p className="note">Updates are temporarily unavailable. Please check back soon or follow us on Discord.</p>}
        {fromCms && !failed && posts.length === 0 && <p className="note">No updates yet. Follow us on Discord for the latest.</p>}
        {!fromCms && (
          <p className="note">
            Sample posts. Replace with real announcements as they happen. Event dates match the sample schedule on the Community and Events pages.
          </p>
        )}
      </section>
      <section className="sec" id="press">
        <div className="sh rv">
          <span className="eyebrow">PRESS &amp; MEDIA</span>
          <h2>Writing about Averix?</h2>
          <p>
            Everything you need to describe the studio accurately. Press kit with screenshots and trailers will be added as projects are revealed.
          </p>
        </div>
        <div className="pk">
          <div className="card rv">
            <span className="pill">Studio boilerplate</span>
            <h3>About Averix Games</h3>
            <div className="bp" id="bp">
              Averix Games is an emerging independent game studio creating original worlds, bold gaming experiences and communities built around play. The studio is building original games and intellectual property, and shares every project openly as it moves from concept to release.
            </div>
            <CopyBoilerplate />
          </div>
          <div className="card rv">
            <span className="pill">Brand assets</span>
            <h3>Logo &amp; colours</h3>
            <div className="lg">
              <img src="/assets/logo.png" alt="Averix Games logo" width="120" height="107" />
            </div>
            <div className="sw">
              <span>
                <i style={{ background: "#05060a" }} />
                #05060A
              </span>
              <span>
                <i style={{ background: "#00e5ff" }} />
                #00E5FF
              </span>
              <span>
                <i style={{ background: "#7b34ff" }} />
                #7B34FF
              </span>
              <span>
                <i style={{ background: "#f2f4fa" }} />
                #F2F4FA
              </span>
            </div>
            <div className="fol">
              <a className="btn p" href="assets/logo.png" download="averix-games-logo.png">Download logo</a>
              <Link className="btn s" href="/partnerships#contact">Media enquiries</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="sec alt" id="follow">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">STAY IN THE LOOP</span>
            <h2>Never miss an update.</h2>
            <p>News lands on Discord first, then on our social channels.</p>
          </div>
          <div className="rv">
            <details open>
              <summary>Where do updates appear first?</summary>
              <p>Announcements go out in the #announcements channel on Discord, then on X, TikTok and Instagram.</p>
            </details>
            <details>
              <summary>How often will you post?</summary>
              <p>Whenever there is something real to share: project milestones, events, playtests and studio news.</p>
            </details>
            <details>
              <summary>Can I send you news or a story idea?</summary>
              <p>Yes. Use the media enquiry form on the Partnerships page and choose Press &amp; media.</p>
            </details>
            <div className="cta">
              <a className="btn p" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">Discord</a>
              <a className="btn s" href="https://x.com/averixgames" target="_blank" rel="noopener noreferrer">X / Twitter</a>
              <a className="btn s" href="https://www.tiktok.com/@avxgames" target="_blank" rel="noopener noreferrer">TikTok</a>
              <a className="btn s" href="https://www.instagram.com/avxgame?stkn=am12azMyd24xaG90" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </section>
      <section className="end rv">
        <div>
          <h2>Be here for the first drop.</h2>
          <p>Join the Averix community and hear it from the team before anyone else.</p>
          <div className="cta">
            <a className="btn p" href="https://discord.gg/bwHavmJuf" target="_blank" rel="noopener noreferrer">Join the Discord</a>
            <Link className="btn s" href="/events">See events</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
