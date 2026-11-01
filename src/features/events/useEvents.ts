'use client';

import { useEffect, useState } from 'react';
import { useEventsSource } from './EventsProvider';
import { buildSampleEvents, type SampleEvent } from './sampleEvents';

/**
 * The events to show: the ones from the admin when Firebase is connected, otherwise sample events built relative to "now".
 * Empty until the browser mounts, so server and client markup match.
 */
export function useEvents(): { events: SampleEvent[]; base: number | null } {
  const { cms } = useEventsSource();
  const [state, setState] = useState<{ events: SampleEvent[]; base: number | null }>({ events: [], base: null });
  useEffect(() => {
    const base = Date.now();
    setState({
      events: cms ?? buildSampleEvents(base).map((e) => ({ ...e, sample: true })),
      base,
    });
  }, [cms]);
  return state;
}
