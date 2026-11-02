export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/events', label: 'Events' },
  { href: '/ip', label: 'IP' },
  { href: '/about', label: 'About' },
  { href: '/community', label: 'Community' },
  { href: '/news', label: 'News' },
  { href: '/music', label: 'Music' },
  { href: '/partnerships', label: 'Partnerships' },
] as const;

export const DISCORD_URL = 'https://discord.gg/bwHavmJuf';

/**
 * Public address of the site. Used for the sitemap, robots.txt and social-share (Open Graph) links.
 * When the final domain is live, set NEXT_PUBLIC_SITE_URL in your host's environment
 * (e.g. https://www.averixgames.com) or change the fallback below.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://averixgame.netlify.app').replace(/\/$/, '');

/**
 * OPTIONAL automation hook. Paste a Make (or Zapier) webhook URL into NEXT_PUBLIC_ENQUIRY_WEBHOOK_URL and every new
 * enquiry is also sent there, so Make can email the admin and add a row to a Google Sheet. Empty = off.
 */
export const ENQUIRY_WEBHOOK_URL = process.env.NEXT_PUBLIC_ENQUIRY_WEBHOOK_URL || '';

/** Studio contact address. Leave empty until the client supplies one: the legal pages then point to the enquiry form. */
export const CONTACT_EMAIL = '';

export const SOCIALS = [
  { label: 'Discord', href: DISCORD_URL },
  { label: 'X / Twitter', href: 'https://x.com/averixgames' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@avxgames' },
  { label: 'Instagram', href: 'https://www.instagram.com/avxgame?stkn=am12azMyd24xaG90' },
] as const;
