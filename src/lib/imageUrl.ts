/**
 * Cleans an image link typed in the admin.
 * - Accepts only https:// links (anything else returns '').
 * - Turns a Google Drive "share" link into a direct image link.
 */
export function cleanImageUrl(input: string | undefined | null): string {
  const v = (input ?? '').trim();
  if (!/^https:\/\//i.test(v)) return '';
  const drive = v.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i) || v.match(/drive\.google\.com\/open\?(?:.*&)?id=([^&#]+)/i);
  if (drive) return `https://drive.google.com/uc?export=view&id=${drive[1]}`;
  return v;
}

/** Cleans a normal web link typed in the admin (music, streaming, waiting list...). Only https:// is accepted; anything else returns ''. */
export function cleanLinkUrl(input: string | undefined | null): string {
  const v = (input ?? '').trim();
  return /^https:\/\/[^\s]+$/i.test(v) ? v : '';
}
