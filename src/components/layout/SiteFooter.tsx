import Link from 'next/link';
import FooterCol from './FooterCol';
import { useSite } from './SiteProvider';

/** Shared footer. Links with href="#" are placeholders (PageFrame stops them jumping to the top). */
export default function SiteFooter() {
  const site = useSite();
  return (
    <footer>
      <p className="fw" aria-hidden="true">WE BUILD WORLDS.</p>
      <div className="fg">
        <div>
          <Link className="brand" href="/">
            <img src="/assets/logo.png" alt="" width="44" height="39" />
            AVERIX GAMES
          </Link>
          <p style={{ marginTop: "1rem", fontSize: ".85rem" }}>
            An emerging game studio building original worlds, intellectual property and a community around play. Imagination, craft and community guide everything we make.
          </p>
          <p style={{ marginTop: ".8rem", fontSize: ".75rem", letterSpacing: ".2em", color: "var(--cy)" }}>INDEPENDENT GAME STUDIO · BUILDING WHAT'S NEXT</p>
        </div>
        <FooterCol title="EXPLORE">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/games">Games</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/ip">IP</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/community">Community</Link>
            </li>
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <Link href="/music">Music</Link>
            </li>
            <li>
              <Link href="/partnerships">Partnerships</Link>
            </li>
          </ul></FooterCol>
        <FooterCol title="THE STUDIO">
          <ul>
            <li>
              <Link href="/about#philosophy">Imagination</Link>
            </li>
            <li>
              <Link href="/about#philosophy">Craft</Link>
            </li>
            <li>
              <Link href="/about#philosophy">Community</Link>
            </li>
            <li>Careers: talent network coming soon</li>
          </ul></FooterCol>
        <FooterCol title="COMMUNITY">
          <ul>
            <li>
              <a href={site.discordUrl} target="_blank" rel="noopener noreferrer">Discord</a>
            </li>
            <li>
              <a href={site.socials[1].href} target="_blank" rel="noopener noreferrer">X / Twitter</a>
            </li>
            <li>
              <a href={site.socials[2].href} target="_blank" rel="noopener noreferrer">TikTok</a>
            </li>
            <li>
              <a href={site.socials[3].href} target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
          </ul></FooterCol>
        <FooterCol title="WORK WITH US" id="contact">
          <ul>
            <li>
              <Link href="/partnerships#types">Publishing &amp; Distribution</Link>
            </li>
            <li>
              <Link href="/partnerships#types">Sponsorships &amp; Brands</Link>
            </li>
            <li>
              <Link href="/partnerships#types">Co-Development</Link>
            </li>
            <li>
              <Link href="/partnerships#types">IP &amp; Licensing</Link>
            </li>
            <li>
              <Link href="/partnerships#contact">Send an enquiry</Link>
            </li>
          </ul></FooterCol>
      </div>
      <div className="fb2">
        <span>
          ©
          {' '}
          <span suppressHydrationWarning>{new Date().getFullYear()}</span>
          {' '}
          Averix Games. All rights reserved.
        </span>
        <span className="fl">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </span>
      </div>
    </footer>
  );
}
