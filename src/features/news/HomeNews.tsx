import Link from 'next/link';
import SafeImg from '@/components/ui/SafeImg';
import SnapRow from '@/components/mobile/SnapRow';
import type { NewsPost } from './posts';

interface Props {
  posts: NewsPost[];
  /** true when the posts come from the admin (Firebase). false shows the built-in starter cards. */
  fromCms: boolean;
  failed: boolean;
}

const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();

/** "Fresh from the studio": the 3 newest posts from the admin, or the starter cards until Firebase is connected. */
export default function HomeNews({ posts, fromCms, failed }: Props) {
  if (!fromCms) {
    return (
      <SnapRow className="nw" label="Latest news">
          <article className="nc rv">
            <span className="pill">Studio</span>
            <time dateTime="2026-10-01">OCT 2026</time>
            <h3>Averix Games opens its doors</h3>
            <p>
              Meet the studio, the team and the long-term plan: original worlds, original IP and a community built around play.
            </p>
            <Link className="gk" href="/news#studio-opens">Read more →</Link>
          </article>
          <article className="nc rv">
            <span className="pill">Community</span>
            <time dateTime="2026-10-08">OCT 2026</time>
            <h3>The Averix Discord is open</h3>
            <p>Our home for updates, event check-ins, team finding and playtests. Come say hello and grab your roles.</p>
            <Link className="gk" href="/news#discord-open">Read more →</Link>
          </article>
          <article className="nc rv">
            <span className="pill">Development</span>
            <time dateTime="2026-10-14">OCT 2026</time>
            <h3>How we track every project</h3>
            <p>From Concept to Released, every Averix game carries a clear status so you always know where it stands.</p>
            <Link className="gk" href="/news#project-status">Read more →</Link>
          </article>
        </SnapRow>
    );
  }

  const latest = [...posts].sort((a, b) => b.dateTime.localeCompare(a.dateTime)).slice(0, 3);
  if (latest.length === 0) {
    return (
      <p className="note">
        {failed ? 'News is temporarily unavailable. Please check back soon.' : 'No news yet. Join the Discord to hear first.'}
      </p>
    );
  }
  return (
    <SnapRow className="nw" label="Latest news">
      {latest.map((p) => (
        <article className="nc rv" key={p.id}>
          {p.image && <SafeImg className="nimg" src={p.image} loading="lazy" />}
          <span className="pill">{p.category}</span>
          <time dateTime={p.dateTime}>{monthLabel(p.dateTime)}</time>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <Link className="gk" href={`/news#${p.id}`}>Read more →</Link>
        </article>
      ))}
    </SnapRow>
  );
}
