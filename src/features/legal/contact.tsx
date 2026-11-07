import Link from 'next/link';
import { getSiteSettings } from '@/lib/siteSettings';

/** Contact line shared by the legal pages: uses the studio email once it is set in /admin > Settings. */
export async function ContactLine() {
  const { contactEmail, discordUrl } = await getSiteSettings();
  return contactEmail ? (
    <p>
      Email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, or use the{' '}
      <Link href="/partnerships#contact">enquiry form</Link>.
    </p>
  ) : (
    <p>
      Use the <Link href="/partnerships#contact">enquiry form</Link> on our Partnerships page, or message us on{' '}
      <a href={discordUrl} target="_blank" rel="noopener noreferrer">
        Discord
      </a>
      .
    </p>
  );
}
