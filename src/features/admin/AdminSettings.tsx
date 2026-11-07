'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { getFirebase, SETTINGS_COLLECTION } from '@/lib/firebase';
import { cleanLinkUrl } from '@/lib/imageUrl';
import { DEFAULT_SETTINGS } from '@/lib/siteSettings';

interface Form {
  discordUrl: string;
  contactEmail: string;
  xUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaults = (): Form => ({
  discordUrl: DEFAULT_SETTINGS.discordUrl,
  contactEmail: DEFAULT_SETTINGS.contactEmail,
  xUrl: DEFAULT_SETTINGS.socials[1].href,
  tiktokUrl: DEFAULT_SETTINGS.socials[2].href,
  instagramUrl: DEFAULT_SETTINGS.socials[3].href,
});

/** Site-wide settings: Discord link, studio email and social links used across the whole site. */
export default function AdminSettings({ setMsg }: { setMsg: (m: string) => void }) {
  const [form, setForm] = useState<Form>(defaults);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { db, firestore } = await getFirebase();
      const snap = await firestore.getDoc(firestore.doc(db, SETTINGS_COLLECTION, 'site'));
      if (snap.exists()) {
        const x = snap.data() as Record<string, unknown>;
        const d = defaults();
        const s = (k: keyof Form) => String(x[k] ?? '') || d[k];
        setForm({ discordUrl: s('discordUrl'), contactEmail: String(x.contactEmail ?? ''), xUrl: s('xUrl'), tiktokUrl: s('tiktokUrl'), instagramUrl: s('instagramUrl') });
      }
    } catch {
      setMsg('Could not load the settings. Check your Firestore rules (they need the "settings" block) and that you are allowed to edit.');
    }
  }, [setMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    for (const [k, label] of [['discordUrl', 'Discord'], ['xUrl', 'X / Twitter'], ['tiktokUrl', 'TikTok'], ['instagramUrl', 'Instagram']] as const) {
      const v = form[k].trim();
      if (v && !cleanLinkUrl(v)) return setMsg(`The ${label} link must start with https://`);
    }
    const email = form.contactEmail.trim();
    if (email && !EMAIL.test(email)) return setMsg('The studio email does not look right. Example: hello@averixgames.com');
    setBusy(true);
    setMsg('');
    try {
      const { db, firestore } = await getFirebase();
      await firestore.setDoc(firestore.doc(db, SETTINGS_COLLECTION, 'site'), {
        discordUrl: cleanLinkUrl(form.discordUrl),
        contactEmail: email,
        xUrl: cleanLinkUrl(form.xUrl),
        tiktokUrl: cleanLinkUrl(form.tiktokUrl),
        instagramUrl: cleanLinkUrl(form.instagramUrl),
      });
      setMsg('Saved. The links update across the site within about a minute.');
    } catch {
      setMsg('Could not save. You may not have permission to edit, or the rules do not have the "settings" block yet.');
    }
    setBusy(false);
  }

  return (
    <form className="box" onSubmit={save}>
      <h2>Site settings</h2>
      <p className="muted">These are used everywhere on the site: header menu, footer, Community, Home, News, Partnerships, game pages and the legal pages.</p>
      <label>
        Studio email <small>(optional. When set, the contact form falls back to email and the Privacy and Terms pages show it.)</small>
        <input type="email" value={form.contactEmail} placeholder="hello@yourstudio.com" onChange={(e) => set('contactEmail', e.target.value)} />
      </label>
      <label>
        Discord invite link
        <input type="url" value={form.discordUrl} placeholder="https://discord.gg/..." onChange={(e) => set('discordUrl', e.target.value)} />
      </label>
      <label>
        X / Twitter link
        <input type="url" value={form.xUrl} placeholder="https://x.com/..." onChange={(e) => set('xUrl', e.target.value)} />
      </label>
      <label>
        TikTok link
        <input type="url" value={form.tiktokUrl} placeholder="https://www.tiktok.com/@..." onChange={(e) => set('tiktokUrl', e.target.value)} />
      </label>
      <label>
        Instagram link
        <input type="url" value={form.instagramUrl} placeholder="https://www.instagram.com/..." onChange={(e) => set('instagramUrl', e.target.value)} />
      </label>
      <p className="muted">Leaving a link empty keeps the current one.</p>
      <div className="bt">
        <button className="btn p" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
    </form>
  );
}
