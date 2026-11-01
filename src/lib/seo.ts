import type { Metadata } from 'next';

/** Default social-share image (1200x630) in public/og/. Game pages use their own: public/og/<slug>.png */
export const DEFAULT_OG = '/og/default.png';

interface PageMetaInput {
  title: string;
  description: string;
  /** Path of the page, e.g. "/games". Used for the canonical link and the share URL. */
  path: string;
  image?: string;
  noindex?: boolean;
}

/** One place that builds title, description, canonical link, Open Graph and Twitter card for a page. */
export function pageMeta({ title, description, path, image = DEFAULT_OG, noindex }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'Averix Games',
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
