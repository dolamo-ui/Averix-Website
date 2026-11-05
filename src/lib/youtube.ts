/**
 * Gets the YouTube video id from any normal YouTube link
 * (watch?v=..., youtu.be/..., /shorts/..., /embed/..., /live/...) or from a bare 11-character id.
 * Returns '' when it is not a YouTube link.
 */
export function youtubeId(input: string | undefined | null): string {
  const v = (input ?? '').trim();
  if (!v) return '';
  const ID = /^[\w-]{11}$/;
  if (ID.test(v)) return v;
  try {
    const u = new URL(v);
    const host = u.hostname.replace(/^(www|m)\./, '');
    let id: string | null | undefined = '';
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else id = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1];
    }
    return id && ID.test(id) ? id : '';
  } catch {
    return '';
  }
}
