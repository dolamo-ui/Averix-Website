import { statusOf, type SampleEvent } from '@/features/events/sampleEvents';
import { COMMUNITY_EVENTS, type CommunityEvent } from './scheduleData';

/**
 * Turns the events written in /admin into the community schedule (upcoming and live events, soonest first).
 * With Firebase not connected (cms === null) it returns the built-in sample schedule.
 */
export function communityEvents(cms: SampleEvent[] | null): { events: CommunityEvent[]; sample: boolean } {
  if (cms === null) return { events: COMMUNITY_EVENTS, sample: true };
  const now = Date.now();
  const events = cms
    .filter((e) => statusOf(e, now) !== 'past')
    .sort((a, b) => a.start - b.start)
    .slice(0, 6)
    .map<CommunityEvent>((e) => ({
      id: e.id,
      ticketUrl: e.ticketUrl,
      title: e.name,
      at: new Date(e.start).toISOString(),
      kind: e.type,
      blurb: [e.slots, e.entry && (/^free$/i.test(e.entry) ? 'Free to join' : `${e.entry} entry`), e.prize && !/^no prize$/i.test(e.prize) ? e.prize : '']
        .filter(Boolean)
        .join(' · ') || e.format || 'Details on the Events page.',
    }));
  return { events, sample: false };
}
