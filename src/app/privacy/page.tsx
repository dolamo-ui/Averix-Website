import Link from 'next/link';
import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/features/legal/LegalPage';
import { ContactLine } from '@/features/legal/contact';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy | Averix Games',
  description: 'How Averix Games handles information when you visit our website, send an enquiry or follow us on social channels.',
  path: '/privacy',
});

const SECTIONS: LegalSection[] = [
  {
    id: 'who',
    title: 'Who we are',
    body: (
      <p>
        This website is run by Averix Games (&quot;Averix&quot;, &quot;we&quot;, &quot;us&quot;), an independent game studio. This policy explains what
        information we handle when you use this website and related pages, and the choices you have.
      </p>
    ),
  },
  {
    id: 'collect',
    title: 'What we collect',
    body: (
      <>
        <p>We keep this to a minimum. The site has no user accounts, no sign-up and no payments.</p>
        <ul>
          <li>
            <b>What you send us.</b> If you use the enquiry form on the <Link href="/partnerships#contact">Partnerships</Link> page, or contact us
            by email or on Discord, we receive the details you choose to share, such as your name, email address, organisation and message. Enquiries sent through the form are stored in our secure database so we can read and reply to them.
          </li>
          <li>
            <b>Technical data.</b> Like most websites, our hosting provider automatically records basic technical information when a page is
            requested, such as IP address, browser type, device type and the pages visited. We use it to keep the site secure and working.
          </li>
        </ul>
        <p>We do not knowingly collect sensitive personal information, and we ask that you do not send it to us.</p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    body: (
      <ul>
        <li>To reply to your enquiry and talk about partnerships, press or collaborations.</li>
        <li>To run, secure and improve the website.</li>
        <li>To meet legal obligations and protect our rights.</li>
      </ul>
    ),
  },
  {
    id: 'third',
    title: 'Third-party services',
    body: (
      <>
        <p>Some parts of the site rely on other companies, which may process limited data under their own policies:</p>
        <ul>
          <li>
            <b>Hosting.</b> Our hosting provider delivers the site and keeps server logs.
          </li>
          <li>
            <b>Database.</b> Google Firebase stores the news and events we publish and the enquiries you send us. Only authorised Averix team members can read enquiries.
          </li>
          <li>
            <b>Google Fonts.</b> The site loads its typefaces from Google, which means your browser contacts Google&apos;s servers and your IP
            address is shared with them.
          </li>
          <li>
            <b>Video.</b> When a game trailer is added to a page, it may be played from a video provider such as YouTube (using its privacy-enhanced
            mode). That provider may set its own cookies when you press play.
          </li>
          <li>
            <b>Social and community links.</b> Links to Discord, X, TikTok and Instagram take you to those platforms. Their own privacy policies
            apply once you leave our site.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and tracking',
    body: (
      <p>
        We do not use advertising cookies or analytics trackers on this site. If that changes, for example if we add analytics to understand
        how the site is used, we will update this policy and, where required, ask for your consent first.
      </p>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing your information',
    body: (
      <p>
        We do not sell your personal information. We only share it with service providers who help us run the site or handle email, or when the
        law requires it.
      </p>
    ),
  },
  {
    id: 'keep',
    title: 'How long we keep it',
    body: (
      <p>
        We keep enquiries only as long as needed to respond and to keep a reasonable record of the conversation, and we delete them on request. Server logs are kept by our
        hosting provider for a short period under its own retention rules.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to ask what personal information we hold about you, to correct it, to delete it, or
          to object to how we use it. To make a request, contact us using the details below and we will respond as soon as we reasonably can.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        Games are for everyone, but this website is not designed to collect personal information from children. If you believe a child has sent
        us personal information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We take reasonable steps to protect the information we handle. No website or message can be guaranteed completely secure, so please
        avoid sending anything highly confidential.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>We may update this policy as the studio and the site grow. The date at the top shows when it was last changed.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>Questions about this policy or your information?</p>
        <ContactLine />
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      intro="Plain-language answers about what we collect, why, and what you can do about it."
      updated="31 October 2026"
      sections={SECTIONS}
      sibling={{ href: '/terms', label: 'Read the Terms & Conditions' }}
    />
  );
}
