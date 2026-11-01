import Link from 'next/link';
import { CONTACT_EMAIL, DISCORD_URL } from '@/lib/site';

/** Contact line shared by the legal pages: uses the studio email once it is set in src/lib/site.ts. */
export function ContactLine() {
  return CONTACT_EMAIL ? (
    <p>
      Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or use the{' '}
      <Link href="/partnerships#contact">enquiry form</Link>.
    </p>
  ) : (
    <p>
      Use the <Link href="/partnerships#contact">enquiry form</Link> on our Partnerships page, or message us on{' '}
      <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
        Discord
      </a>
      .
    </p>
  );
}
