/**
 * Small round play button.
 * With `href` (a link set in /admin) it opens that link in a new tab; without one, PageFrame turns the `data-msg` click into a toast.
 */
export default function PlayButton({ label, href, msg = 'Audio previews unlock at release.' }: { label: string; href?: string; msg?: string }) {
  const icon = (
    <svg viewBox="0 0 24 24">
      <path d="M6 3v18l15-9z" />
    </svg>
  );
  if (href) {
    return (
      <a className="pl" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Play ${label}`}>
        {icon}
      </a>
    );
  }
  return (
    <button className="pl" type="button" data-msg={msg} aria-label={`Play ${label}`}>
      {icon}
    </button>
  );
}
