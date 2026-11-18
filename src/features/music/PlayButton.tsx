'use client';

import { youtubeEmbed } from '@/lib/youtube';

const ICON = (
  <svg viewBox="0 0 24 24">
    <path d="M6 3v18l15-9z" />
  </svg>
);

/**
 * Small round play button.
 * - YouTube / YouTube Music link (set in /admin): plays in the player on this page.
 * - Any other https link (Spotify, SoundCloud...): opens in a new tab.
 * - No link: PageFrame turns the `data-msg` click into a toast.
 */
export default function PlayButton({ label, href, msg = 'Audio previews unlock at release.' }: { label: string; href?: string; msg?: string }) {
  const src = href ? youtubeEmbed(href) : '';
  if (href && src) {
    return (
      <button
        className="pl"
        type="button"
        aria-label={`Play ${label}`}
        onClick={() => window.dispatchEvent(new CustomEvent('averix:play', { detail: { src, title: label, href } }))}
      >
        {ICON}
      </button>
    );
  }
  if (href) {
    return (
      <a className="pl" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Play ${label}`}>
        {ICON}
      </a>
    );
  }
  return (
    <button className="pl" type="button" data-msg={msg} aria-label={`Play ${label}`}>
      {ICON}
    </button>
  );
}
