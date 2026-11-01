import Link from 'next/link';
import { fmt, statusOf, when, type SampleEvent } from './sampleEvents';

interface Props {
  /** Events from the admin, or null to show the built-in sample cards. */
  cms: SampleEvent[] | null;
  failed: boolean;
}

/** The "next match" cards on the home page: the next two events from the admin, or sample cards until Firebase is connected. */
export default function HomeEvents({ cms, failed }: Props) {
  if (cms === null) {
    return (
      <>
        <div className="ev rv">
          <div>
            <small>SAMPLE EVENT</small>
            <h3>Averix Cup #1</h3>
          </div>
          <dl>
            <div>
              <dt>GAME</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>DATE &amp; TIME</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>ENTRY FEE</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>PRIZE POOL</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>FORMAT</dt>
              <dd>Online</dd>
            </div>
            <div>
              <dt>REGISTRATION</dt>
              <dd>Not open yet</dd>
            </div>
          </dl>
          <button className="btn s" disabled>Registration opens soon</button>
        </div>
        <div className="ev rv">
          <div>
            <small>SAMPLE EVENT 2</small>
            <h3>Community Night</h3>
          </div>
          <dl>
            <div>
              <dt>GAME</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>DATE &amp; TIME</dt>
              <dd>To be announced</dd>
            </div>
            <div>
              <dt>ENTRY FEE</dt>
              <dd>Free (sample)</dd>
            </div>
            <div>
              <dt>PRIZE POOL</dt>
              <dd>Giveaways (sample)</dd>
            </div>
            <div>
              <dt>FORMAT</dt>
              <dd>Online · Casual</dd>
            </div>
            <div>
              <dt>REGISTRATION</dt>
              <dd>Not open yet</dd>
            </div>
          </dl>
          <button className="btn s" disabled>Registration opens soon</button>
        </div>
        <p className="note">This listing shows the information an event will carry. No event, date, fee or prize is real.</p>
      </>
    );
  }

  const now = Date.now();
  const next = cms
    .filter((e) => statusOf(e, now) !== 'past')
    .sort((a, b) => a.start - b.start)
    .slice(0, 2);

  if (next.length === 0) {
    return (
      <p className="note">
        {failed
          ? 'Events are temporarily unavailable. Please check back soon or follow us on Discord.'
          : 'New events will be announced soon. Join the Discord to hear first.'}
      </p>
    );
  }

  return (
    <>
      {next.map((e) => (
        <div className="ev rv" key={e.id}>
          <div>
            <small>{e.type.toUpperCase()}{statusOf(e, now) === 'live' ? ' · LIVE NOW' : ''}</small>
            <h3>{e.name}</h3>
          </div>
          <dl>
            <div>
              <dt>GAME</dt>
              <dd>{e.game || 'To be announced'}</dd>
            </div>
            <div>
              <dt>DATE &amp; TIME</dt>
              <dd>{when(e)}</dd>
            </div>
            <div>
              <dt>ENTRY FEE</dt>
              <dd>{e.entry}</dd>
            </div>
            <div>
              <dt>PRIZE POOL</dt>
              <dd>{e.prize}</dd>
            </div>
            <div>
              <dt>FORMAT</dt>
              <dd>{e.format || 'Online'}</dd>
            </div>
            <div>
              <dt>REGISTRATION</dt>
              <dd>{e.ticketUrl ? 'Tickets on sale' : e.reg}</dd>
            </div>
          </dl>
          {e.ticketUrl ? (
            <a className="btn p" href={e.ticketUrl} target="_blank" rel="noopener noreferrer">
              {/computicket/i.test(e.ticketUrl) ? 'Buy ticket on Computicket' : 'Get tickets'}
            </a>
          ) : (
            <Link className="btn s" href={`/events#${e.id}`}>View event details</Link>
          )}
        </div>
      ))}
      <p className="note">
        Times are South African time (SAST), starting {fmt(next[0].start, { day: 'numeric', month: 'long' })}. Tickets are sold by our ticketing partner, so payment happens on their website.
      </p>
    </>
  );
}
