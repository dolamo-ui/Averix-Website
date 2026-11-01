/** True when the visitor asked their OS/browser for reduced motion. Browser only. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on touch-first devices (no hover / fine pointer). Browser only. */
export const isCoarsePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches;
