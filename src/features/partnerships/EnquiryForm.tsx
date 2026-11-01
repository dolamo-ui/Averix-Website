'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useToast } from '@/components/ui/Toast';
import { CONTACT_EMAIL } from '@/lib/site'; // set the studio email in src/lib/site.ts


const PATHS = [
  { value: 'Publishing & Distribution', label: 'Publishing & Distribution' },
  { value: 'Sponsorships & Brand Collaborations', label: 'Sponsorships & Brands' },
  { value: 'Co-Development', label: 'Co-Development' },
  { value: 'IP & Licensing', label: 'IP & Licensing' },
  { value: 'Press & media', label: 'Press & media' },
  { value: 'Something else', label: 'Something else' },
];

export default function EnquiryForm() {
  const toast = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // The progress meter fills as each required step is completed.
  const steps = [!!type, name.trim().length > 0, email.trim().length > 0 && emailValid, message.trim().length > 0];
  const done = steps.filter(Boolean).length;
  const ready = done === 4;
  const progressLabel = `${done}/4 · ${ready ? 'Ready to send' : done === 0 ? 'Pick a path to start' : 'Keep going'}`;

  const onEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(e.target.validity.valid);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.current?.checkValidity()) {
      form.current?.reportValidity();
      setStatus('Please complete the required fields.');
      return;
    }
    const subject = `Averix Games enquiry: ${type}`;
    const text = `Name: ${name}\nEmail: ${email}\nOrganisation: ${org || '-'}\nType: ${type}\n\n${message}`;
    if (CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      setStatus('Your email app should open with the enquiry ready to send.');
      return;
    }
    let copied = false;
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${text}`);
      copied = true;
    } catch {
      /* clipboard unavailable */
    }
    setStatus(
      (copied ? 'Email enquiries are not switched on yet, so your message was copied. ' : 'Email enquiries are not switched on yet. ') +
        'Please send it to us on Discord and we will pick it up there.',
    );
    toast(copied ? 'Enquiry copied. Send it on Discord.' : 'Please send your enquiry on Discord.');
  };

  return (
    <div className="pfw rv">
      <form id="pf" ref={form} noValidate onSubmit={onSubmit}>
        <div className="pf-top">
          <span className="live">Open to partners</span>
          <span>Partner application</span>
        </div>
        <div className={ready ? 'xp done' : 'xp'} aria-hidden="true">
          {steps.map((on, i) => (
            <i key={i} className={on ? 'on' : undefined} />
          ))}
          <b id="xpt">{progressLabel}</b>
        </div>
        <fieldset>
          <legend><em>01</em>Choose your path *</legend>
          <div className="tiles">
            {PATHS.map((p, i) => (
              <label className="tile" key={p.value}>
                <input type="radio" name="type" value={p.value} required checked={type === p.value} onChange={() => setType(p.value)} />
                <span className="tb"><i>{String(i + 1).padStart(2, '0')}</i>{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend><em>02</em>Who are we talking to?</legend>
          <div className="pf-g">
            <div className="fd">
              <label htmlFor="n">Your name *</label>
              <input id="n" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="fd">
              <label htmlFor="em">Email *</label>
              <input id="em" name="email" type="email" autoComplete="email" required value={email} onChange={onEmail} />
            </div>
            <div className="fd w">
              <label htmlFor="o">Organisation</label>
              <input id="o" name="org" autoComplete="organization" placeholder="Studio, brand or company" value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend><em>03</em>What do you have in mind? *</legend>
          <label className="sr" htmlFor="m">Message</label>
          <textarea
            id="m"
            name="message"
            required
            placeholder="Who you are, what you have in mind and any timing we should know about."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </fieldset>
        <div className="fa2">
          <button className={ready ? 'btn p rdy' : 'btn p'} type="submit">Send enquiry →</button>
          <p id="st" role="status" aria-live="polite">{status}</p>
        </div>
      </form>
    </div>
  );
}
