'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/siteSettings';

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

/** Gives client components (footer, mobile menu, forms) the site settings the layout loaded from the admin. */
export function SiteProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
