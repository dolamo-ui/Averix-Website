/** Small round play button. PageFrame turns `data-msg` clicks into a toast. */
export default function PlayButton({ label, msg = 'Audio previews unlock at release.' }: { label: string; msg?: string }) {
  return (
    <button className="pl" type="button" data-msg={msg} aria-label={`Play ${label}`}>
      <svg viewBox="0 0 24 24">
        <path d="M6 3v18l15-9z" />
      </svg>
    </button>
  );
}
