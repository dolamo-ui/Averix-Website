'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Wraps a card grid. On desktop it renders exactly like before (the page CSS grid).
 * On phones it becomes a swipeable, snapping row with dots and a swipe hint.
 */
export default function SnapRow({ className, children, label }: { className: string; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [idx, setIdx] = useState(0);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setCount(el.children.length);
    let raf = 0;
    const pick = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const kids = Array.from(el.children) as HTMLElement[];
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) return setIdx(kids.length - 1);
      let best = 0;
      let dist = Infinity;
      kids.forEach((k, i) => {
        const r = k.getBoundingClientRect();
        const d = Math.abs(r.left - box.left - parseFloat(getComputedStyle(el).paddingLeft || '0'));
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setIdx(best);
    };
    const onScroll = () => {
      if (el.scrollLeft > 12) setMoved(true);
      if (!raf) raf = requestAnimationFrame(pick);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    const kid = el?.children[i] as HTMLElement | undefined;
    if (!el || !kid) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft || '0');
    el.scrollTo({ left: kid.offsetLeft - el.offsetLeft - pad, behavior: 'smooth' });
  };

  return (
    <>
      <div ref={ref} className={`${className} mx-snap`} role="group" aria-label={label}>
        {children}
      </div>
      <div className="mx-dots" aria-hidden={count < 2}>
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" aria-label={`Show card ${i + 1} of ${count}`} aria-current={idx === i} onClick={() => go(i)} />
        ))}
      </div>
      <div className="mx-swipe" data-gone={moved}>Swipe to see more</div>
    </>
  );
}
