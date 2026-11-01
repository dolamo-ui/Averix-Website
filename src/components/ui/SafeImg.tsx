'use client';

import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

/**
 * An <img> that removes itself if the file is missing, so the CSS placeholder
 * behind it shows instead of a broken-image icon.
 */
export default function SafeImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    // The error may have fired before React hydrated this element.
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} alt="" {...props} onError={() => setFailed(true)} />;
}
