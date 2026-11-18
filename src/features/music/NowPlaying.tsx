'use client';

import { useEffect, useState } from 'react';

interface Playing {
  src: string;
  title: string;
  href: string;
}

/** Mini player (bottom corner). Opens when a play button with a YouTube / YouTube Music link is clicked. */
export default function NowPlaying() {
  const [p, setP] = useState<Playing | null>(null);
  useEffect(() => {
    const on = (e: Event) => setP((e as CustomEvent<Playing>).detail);
    window.addEventListener('averix:play', on);
    return () => window.removeEventListener('averix:play', on);
  }, []);
  if (!p) return null;
  return (
    <div className="np" role="region" aria-label="Now playing">
      <div className="np-h">
        <span>
          Now playing: <b>{p.title}</b>
        </span>
        <a href={p.href} target="_blank" rel="noopener noreferrer">
          Open in YouTube
        </a>
        <button type="button" onClick={() => setP(null)} aria-label="Close player">
          ×
        </button>
      </div>
      <iframe key={p.src} src={p.src} title={`Playing ${p.title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
    </div>
  );
}
