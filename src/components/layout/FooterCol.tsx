'use client';

import { useEffect, useState, type ReactNode } from 'react';

/** Footer column: plain on desktop, tap-to-expand accordion on phones (keeps the page short). */
export default function FooterCol({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  const [phone, setPhone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div id={id} className={`fcol${phone && open ? ' open' : ''}`} data-phone={phone}>
      {phone ? (
        <h4>
          <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {title}
            <i aria-hidden="true" />
          </button>
        </h4>
      ) : (
        <h4>{title}</h4>
      )}
      <div className="fbody">{children}</div>
    </div>
  );
}
