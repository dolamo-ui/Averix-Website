'use client';

import { useEffect, useState } from 'react';
import { NEWS_CATEGORIES, type NewsPost } from './posts';

type Category = (typeof NEWS_CATEGORIES)[number];

/** Category chips + the list of update cards. Links like /news#studio-opens open that update. */
export default function NewsFeed({ posts }: { posts: NewsPost[] }) {
  const [filter, setFilter] = useState<Category>('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!posts.some((p) => p.id === id)) return;
      setFilter('All');
      setOpenIds((prev) => new Set(prev).add(id));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [posts]);

  const setOpen = (id: string, open: boolean) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <>
      <div className="chips rv" role="group" aria-label="Filter updates by category">
        {NEWS_CATEGORIES.map((cat) => (
          <button key={cat} type="button" aria-pressed={filter === cat} onClick={() => setFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="pg">
        {posts.map((post) => (
          <article
            key={post.id}
            className="card pc rv"
            id={post.id}
            hidden={filter !== 'All' && post.category !== filter}
          >
            <div className="meta">
              <span className="pill">{post.category}</span>
              <time dateTime={post.dateTime}>{post.dateLabel}</time>
            </div>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <details open={openIds.has(post.id)} onToggle={(e) => setOpen(post.id, e.currentTarget.open)}>
              <summary>Read update</summary>
              <div className="bd">
                {post.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
