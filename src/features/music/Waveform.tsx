import type { CSSProperties } from 'react';

const BARS = Array.from({ length: 48 }, (_, i) => ({
  h: Math.round(30 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 70),
  d: (i * 0.07).toFixed(2),
}));

/** Decorative animated bars for the collaborations banner. */
export default function Waveform() {
  return (
    <div className="cb-wave" id="wave" aria-hidden="true">
      {BARS.map((b, i) => (
        <i key={i} style={{ '--h': b.h, '--d': b.d } as CSSProperties} />
      ))}
    </div>
  );
}
