import Link from 'next/link';
import type { Metadata } from 'next';
import PageFrame from '@/components/layout/PageFrame';
import { NAV_ITEMS } from '@/lib/site';
import '@/styles/site.css';
import '@/styles/notfound.css';

export const metadata: Metadata = {
  title: 'Page not found | Averix Games',
  description: 'This page could not be found. Head back to Averix Games.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageFrame page="site">
      <section className="nf">
        <div className="nf-bg" aria-hidden="true">
          <i className="r1" />
          <i className="r2" />
        </div>
        <div className="nf-in">
          <span className="eyebrow rv">ERROR 404 · OFF THE MAP</span>
          <p className="code rv" aria-hidden="true">
            404
          </p>
          <h1 className="rv">This world doesn&apos;t exist yet.</h1>
          <p className="lead rv">
            The page you were looking for has moved, been renamed or never existed. Let&apos;s get you back to something real.
          </p>
          <div className="cta rv">
            <Link className="btn p" href="/">
              Back to home
            </Link>
            <Link className="btn s" href="/games">
              Explore our games
            </Link>
          </div>
          <nav className="nf-links rv" aria-label="Site pages">
            {NAV_ITEMS.filter((n) => n.href !== '/').map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageFrame>
  );
}
