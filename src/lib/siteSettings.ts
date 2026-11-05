import { SETTINGS_COLLECTION } from '@/lib/firebase';
import { asStr, cmsGet } from '@/lib/cms';
import { cleanLinkUrl } from '@/lib/imageUrl';
import { CONTACT_EMAIL, DISCORD_URL, SOCIALS } from '@/lib/site';

export interface SiteSettings {
  discordUrl: string;
  contactEmail: string;
  socials: { label: string; href: string }[];
}

/** Built-in values (src/lib/site.ts), used until the client saves their own in /admin > Settings. */
export const DEFAULT_SETTINGS: SiteSettings = {
  discordUrl: DISCORD_URL,
  contactEmail: CONTACT_EMAIL,
  socials: SOCIALS.map((s) => ({ label: s.label, href: s.href })),
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Site-wide links and contact email: what the client set in /admin > Settings, over the built-in defaults (an empty box keeps the default). */
export async function getSiteSettings(): Promise<SiteSettings> {
  const d = await cmsGet(SETTINGS_COLLECTION, 'site');
  if (!d) return DEFAULT_SETTINGS;
  const discordUrl = cleanLinkUrl(asStr(d.discordUrl)) || DEFAULT_SETTINGS.discordUrl;
  const email = asStr(d.contactEmail).trim();
  const pick = (key: string, i: number) => cleanLinkUrl(asStr(d[key])) || DEFAULT_SETTINGS.socials[i].href;
  return {
    discordUrl,
    contactEmail: EMAIL.test(email) ? email : DEFAULT_SETTINGS.contactEmail,
    socials: [
      { label: 'Discord', href: discordUrl },
      { label: 'X / Twitter', href: pick('xUrl', 1) },
      { label: 'TikTok', href: pick('tiktokUrl', 2) },
      { label: 'Instagram', href: pick('instagramUrl', 3) },
    ],
  };
}
