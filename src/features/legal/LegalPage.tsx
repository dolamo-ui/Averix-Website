import Link from 'next/link';
import type { ReactNode } from 'react';
import PageFrame from '@/components/layout/PageFrame';
import '@/styles/site.css';
import '@/styles/legal.css';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  /** The other legal page, linked at the bottom. */
  sibling: { href: string; label: string };
}

export default function LegalPage({ eyebrow, title, intro, updated, sections, sibling }: LegalPageProps) {
  return (
    <PageFrame page="site">
      <div className="lg">
        <div className="lg-head">
          <span className="eyebrow rv">{eyebrow}</span>
          <h1 className="rv">{title}</h1>
          <p className="lead rv">{intro}</p>
          <p className="upd rv">Last updated: {updated}</p>
        </div>
        <div className="lg-wrap">
          <nav className="lg-toc" aria-label="On this page">
            <b>On this page</b>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="lg-body">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2>
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
            <p className="lg-end">
              <Link href={sibling.href}>{sibling.label}</Link>
              <Link href="/">Back to home</Link>
            </p>
          </article>
        </div>
      </div>
    </PageFrame>
  );
}
