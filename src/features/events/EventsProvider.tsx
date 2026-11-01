'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SampleEvent } from './sampleEvents';

interface Value {
  /** Events from the admin, or null to show the built-in samples. */
  cms: SampleEvent[] | null;
  failed: boolean;
}

const Ctx = createContext<Value>({ cms: null, failed: false });
export const useEventsSource = () => useContext(Ctx);

export function EventsProvider({ cms, failed, children }: Value & { children: ReactNode }) {
  return <Ctx.Provider value={{ cms, failed }}>{children}</Ctx.Provider>;
}

/** Small note under the event list: explains sample data, or the ticketing rules for real events. */
export function EventsNote() {
  const { cms, failed } = useEventsSource();
  if (failed) return <p className="nt">Events are temporarily unavailable. Please check back soon or follow us on Discord.</p>;
  if (cms === null)
    return (
      <p className="nt">
        Events, dates, fees and prizes on this page are sample data. Registration, payment and tournament brackets are not connected yet. They will run through an external ticketing provider and tournament platform.
      </p>
    );
  return (
    <p className="nt">
      All times are South African Standard Time (SAST). Tickets are sold by our ticketing partner, so payment happens on their website, not here.
    </p>
  );
}
