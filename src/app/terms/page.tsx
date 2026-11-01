import Link from 'next/link';
import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/features/legal/LegalPage';
import { ContactLine } from '@/features/legal/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Terms & Conditions | Averix Games',
  description: 'The terms for using the Averix Games website, including intellectual property, community links and event information.',
  path: '/terms',
});

const SECTIONS: LegalSection[] = [
  {
    id: 'accepting',
    title: 'Using this website',
    body: (
      <p>
        By visiting or using this website you agree to these Terms &amp; Conditions. If you do not agree, please do not use the site. The site is
        operated by Averix Games (&quot;Averix&quot;, &quot;we&quot;, &quot;us&quot;). How we handle personal information is explained in our{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <>
        <p>
          The Averix name, logo, game titles, characters, worlds, artwork, music, text and design on this site belong to Averix Games or are used
          with permission. All rights are reserved.
        </p>
        <p>
          You may view the site and share its pages and links for personal, non-commercial use. You may not copy, modify, distribute or reuse our
          content for commercial purposes without written permission. To talk about licensing, see our <Link href="/ip">IP page</Link> or{' '}
          <Link href="/partnerships">Partnerships</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'conduct',
    title: 'Acceptable use',
    body: (
      <>
        <p>When using the site you agree not to:</p>
        <ul>
          <li>break the law or infringe anyone else&apos;s rights;</li>
          <li>try to disrupt, overload or gain unauthorised access to the site or its systems;</li>
          <li>send spam, malware or misleading messages through our forms or channels;</li>
          <li>scrape or copy the site in bulk without our permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'info',
    title: 'Games, events and announcements',
    body: (
      <p>
        Information about our games, release stages, events, dates, entry fees and prizes is shared in good faith and may change as projects
        develop. Nothing on this site is a promise of a release date, feature or price. Registration, tickets and tournament rules, where they
        apply, will be published separately and may be run through an external provider whose own terms will apply.
      </p>
    ),
  },
  {
    id: 'submissions',
    title: 'Enquiries and feedback',
    body: (
      <p>
        If you send us an enquiry, idea or feedback, you confirm that you have the right to share it. We may use feedback to improve our games and
        services without owing you payment, but we will not publish your personal details without asking.
      </p>
    ),
  },
  {
    id: 'links',
    title: 'Third-party links and community spaces',
    body: (
      <p>
        We link to services we do not control, including Discord, X, TikTok and Instagram. We are not responsible for their content or practices.
        Community spaces have their own rules, and we may remove content or members that break them.
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and changes',
    body: (
      <p>
        We try to keep the site running smoothly, but we cannot promise it will always be available or free of errors. We may update, suspend or
        remove parts of the site at any time.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Disclaimer and liability',
    body: (
      <p>
        The site and its content are provided &quot;as is&quot;. To the fullest extent permitted by law, Averix is not liable for any loss or damage
        arising from your use of, or inability to use, the site. Nothing in these terms limits any right or liability that cannot be limited by law.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Governing law',
    body: <p>These terms are governed by the laws of the country in which Averix Games is established, and any disputes will be handled by the courts there.</p>,
  },
  {
    id: 'updates',
    title: 'Changes to these terms',
    body: <p>We may update these terms from time to time. The date at the top shows the latest version. Continuing to use the site means you accept the updated terms.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>Questions about these terms?</p>
        <ContactLine />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Terms & Conditions"
      intro="The ground rules for using the Averix Games website."
      updated="31 October 2026"
      sections={SECTIONS}
      sibling={{ href: '/privacy', label: 'Read the Privacy Policy' }}
    />
  );
}
