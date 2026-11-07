import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import PageFrame from '@/components/layout/PageFrame';
import { getSiteSettings } from '@/lib/siteSettings';
import '@/styles/partnerships.css';
import EnquiryForm from '@/features/partnerships/EnquiryForm';

export const metadata: Metadata = pageMeta({
  title: 'Partnerships | Averix Games',
  description: "Partner with Averix Games: publishing and distribution, sponsorships and brand collaborations, co-development, and IP licensing.",
  path: '/partnerships',
});

export default async function PartnershipsPage() {
  const site = await getSiteSettings();
  return (
    <PageFrame page="partnerships" toastMs={3200}>
      <section className="ph" id="top">
        <i className="sl" aria-hidden="true" />
        <i className="sl b" aria-hidden="true" />
        <span className="eyebrow rv">PARTNERSHIPS</span>
        <h1 className="rv">
          <span>Let's build</span>
          <span className="o">together.</span>
        </h1>
        <p className="lead rv">
          We're open to meaningful conversations with publishers, sponsors, brands and creative partners who share our ambition for the future of gaming.
        </p>
        <div className="cta rv">
          <a className="btn p" href="#contact">Start a conversation</a>
          <a className="btn s" href="#types">Ways to partner</a>
        </div>
      </section>
      <section className="sec" id="why">
        <div className="sh rv">
          <span className="eyebrow">WHY AVERIX</span>
          <h2>A studio worth building with.</h2>
          <p>We are early, which means partners help shape what Averix becomes.</p>
        </div>
        <div className="why">
          <article className="card rv">
            <span className="pill">Original IP</span>
            <h3>Our own worlds</h3>
            <p>
              We create original games, characters and stories, so partnerships are built on something that belongs to the studio.
            </p>
          </article>
          <article className="card rv">
            <span className="pill">Community</span>
            <h3>Players from day one</h3>
            <p>Discord, tournaments, community nights and playtests give partners a real, engaged audience to work with.</p>
          </article>
          <article className="card rv">
            <span className="pill">Independent</span>
            <h3>Direct conversations</h3>
            <p>You talk to the people making the games and the decisions, not to layers of process.</p>
          </article>
        </div>
      </section>
      <section className="sec alt" id="types">
        <div className="sh rv">
          <span className="eyebrow">WAYS TO PARTNER</span>
          <h2>Four ways to work with us.</h2>
          <p>Pick the one that fits, or tell us about something different.</p>
        </div>
        <div className="tys">
          <article className="card ty rv">
            <span className="n" aria-hidden="true">01</span>
            <h3>Publishing &amp; Distribution</h3>
            <p className="tg">Bringing Averix games to more players.</p>
            <dl>
              <dt>What Averix brings</dt>
              <dd>Original games built in-house, with a community already forming around them.</dd>
              <dt>Who we look for</dt>
              <dd>Publishers and platforms with a long-term view, and reach into new regions and storefronts.</dd>
            </dl>
          </article>
          <article className="card ty rv">
            <span className="n" aria-hidden="true">02</span>
            <h3>Sponsorships &amp; Brand Collaborations</h3>
            <p className="tg">Events and community activities.</p>
            <dl>
              <dt>What Averix brings</dt>
              <dd>Tournaments, community nights and playtests, plus a direct line to engaged players.</dd>
              <dt>Who we look for</dt>
              <dd>Brands that want to show up authentically: prizes, event partnerships, collaborations and content.</dd>
            </dl>
          </article>
          <article className="card ty rv">
            <span className="n" aria-hidden="true">03</span>
            <h3>Co-Development</h3>
            <p className="tg">Building projects together.</p>
            <dl>
              <dt>What Averix brings</dt>
              <dd>Game design, development, art and audio capability, with a clear creative direction.</dd>
              <dt>Who we look for</dt>
              <dd>Studios, technical partners and creators who want shared ownership and clear roles.</dd>
            </dl>
          </article>
          <article className="card ty rv">
            <span className="n" aria-hidden="true">04</span>
            <h3>IP &amp; Licensing</h3>
            <p className="tg">Selected Averix-owned properties.</p>
            <dl>
              <dt>What Averix brings</dt>
              <dd>Original characters, worlds and stories designed to live beyond the screen.</dd>
              <dt>Who we look for</dt>
              <dd>Partners in publishing, merchandise, animation and other media who respect the IP.</dd>
            </dl>
          </article>
        </div>
      </section>
      <section className="sec" id="who">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">WHO WE WANT TO HEAR FROM</span>
            <h2>If you share the ambition.</h2>
          </div>
          <div className="rv">
            <ul className="who">
              <li>Publishers</li>
              <li>Platforms &amp; storefronts</li>
              <li>Brands &amp; sponsors</li>
              <li>Tournament organisers</li>
              <li>Game studios</li>
              <li>Technical partners</li>
              <li>Creators &amp; media</li>
            </ul>
            <p style={{ marginTop: "1.4rem" }}>
              If your work touches games, players or community and you see a fit with Averix, we would like to hear from you.
            </p>
          </div>
        </div>
      </section>
      <section className="sec alt" id="process">
        <div className="sh rv">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>From hello to kick-off.</h2>
        </div>
        <ol className="stp rv">
          <li>
            <b>Reach out</b>
            <p>Tell us who you are and what you have in mind using the form below.</p>
          </li>
          <li>
            <b>Intro conversation</b>
            <p>We talk through goals, timing and what each side brings.</p>
          </li>
          <li>
            <b>Shape the proposal</b>
            <p>Scope, roles and expectations are agreed in writing.</p>
          </li>
          <li>
            <b>Build together</b>
            <p>We kick off and share progress openly with the community where it makes sense.</p>
          </li>
        </ol>
      </section>
      <section className="sec" id="contact">
        <div className="ct">
          <div className="rv">
            <div className="sh">
              <span className="eyebrow">START A CONVERSATION</span>
              <h2>
                Ready to be
                {' '}
                <span className="o">player two?</span>
              </h2>
              <p>Tell us what you have in mind and you will be talking to the people making the games.</p>
            </div>
            <ol className="perks">
              <li>
                <b>01</b>
                <div>
                  <h3>Talk to the makers</h3>
                  <p>You talk to the people making the games and the decisions, not to layers of process.</p>
                </div>
              </li>
              <li>
                <b>02</b>
                <div>
                  <h3>Shape the studio</h3>
                  <p>We are early, which means partners help shape what Averix becomes.</p>
                </div>
              </li>
              <li>
                <b>03</b>
                <div>
                  <h3>Reach real players</h3>
                  <p>Discord, tournaments, community nights and playtests give partners an engaged audience to work with.</p>
                </div>
              </li>
            </ol>
            <div className="alt-c">
              <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">
                Message us on Discord
                {' '}
                <span>→</span>
              </a>
              <a href={site.socials[1].href} target="_blank" rel="noopener noreferrer">
                X / Twitter
                {' '}
                <span>→</span>
              </a>
              <a href={site.socials[3].href} target="_blank" rel="noopener noreferrer">
                Instagram
                {' '}
                <span>→</span>
              </a>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
      <section className="sec alt" id="faq">
        <div className="two">
          <div className="sh rv">
            <span className="eyebrow">INTEL</span>
            <h2>Good to know.</h2>
          </div>
          <div className="rv">
            <details>
              <summary>What stage is Averix at?</summary>
              <p>
                We are an emerging studio. Our first projects are at the concept stage, so partnerships today are early and can shape the studio's direction.
              </p>
            </details>
            <details>
              <summary>Can I pitch a project or idea?</summary>
              <p>
                Yes. Use the form, choose the closest enquiry type and tell us about the project, the team and what you are looking for.
              </p>
            </details>
            <details>
              <summary>Do you work with other studios and freelancers?</summary>
              <p>We are open to co-development and creative collaboration. Tell us what you do and where you see a fit.</p>
            </details>
            <details>
              <summary>I am a journalist or creator. Where do I start?</summary>
              <p>Choose Press &amp; media in the form. The studio description and logo are on the News page.</p>
            </details>
            <details>
              <summary>Is there somewhere else to reach you?</summary>
              <p>Yes. The community Discord and our social channels are open for direct messages.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="end rv">
        <div>
          <h2>Let's talk.</h2>
          <p>Early partners help shape the studio. Start the conversation today.</p>
          <div className="cta">
            <a className="btn p" href="#contact">Send an enquiry</a>
            <Link className="btn s" href="/news">Read the news</Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
