'use client';

import { useTilt } from '@/hooks/useTilt';

/** Drop-in: enables the pointer tilt on every element matching `selector`. */
export default function TiltEffect({ selector }: { selector: string }) {
  useTilt(selector);
  return null;
}
