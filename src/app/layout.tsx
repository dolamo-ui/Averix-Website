import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/mobile.css';
import { SITE_URL } from '@/lib/site';
import { DEFAULT_OG } from '@/lib/seo';
import { getSiteSettings } from '@/lib/siteSettings';
import { SiteProvider } from '@/components/layout/SiteProvider';

const TITLE = 'Averix Games | We build worlds';
const DESCRIPTION =
  'Averix Games is an emerging game studio creating original worlds, bold gaming experiences and communities built around play.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: '/assets/logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'Averix Games',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: 'Averix Games: we build worlds' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#05060a',
};

const FONTS =
  'https://fonts.googleapis.com/css2?family=Tomorrow:wght@400;500;600;700;800&family=Rajdhani:wght@600;700&family=Poppins:wght@400&display=swap';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body>
        <SiteProvider value={settings}>{children}</SiteProvider>
      </body>
    </html>
  );
}
