'use client';

import { useRef, useState } from 'react';
import { uploadsEnabled } from '@/lib/firebase';
import { uploadImage } from '@/lib/uploadImage';

interface Props {
  onUploaded: (url: string) => void;
  /** Called with a plain-language message when something goes wrong. */
  onError?: (msg: string) => void;
  label?: string;
}

/** "Upload a picture" button: pick a photo from the computer or phone, it is shrunk and stored, and its link is handed back. Hidden until Storage is set up. */
export default function UploadButton({ onUploaded, onError, label = 'Upload a picture' }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!uploadsEnabled) return null;

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onUploaded(await uploadImage(file));
    } catch (e) {
      const m = e instanceof Error ? e.message : 'The upload did not work.';
      setErr(m);
      onError?.(m);
    }
    setBusy(false);
    if (input.current) input.current.value = '';
  }

  return (
    <span className="upl">
      <button className="btn s" type="button" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? 'Uploading…' : label}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {err && <small className="warn">{err}</small>}
    </span>
  );
}
