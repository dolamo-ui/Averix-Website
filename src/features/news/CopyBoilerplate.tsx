'use client';

import { useToast } from '@/components/ui/Toast';

/** Copies the studio description (the #bp block above the button) to the clipboard. */
export default function CopyBoilerplate() {
  const toast = useToast();
  const copy = async () => {
    const text = document.getElementById('bp')?.textContent?.trim() ?? '';
    try {
      await navigator.clipboard.writeText(text);
      toast('Studio description copied.');
    } catch {
      toast('Copy failed. Select the text and copy it manually.');
    }
  };
  return (
    <button className="btn s" type="button" id="cp" onClick={copy}>
      Copy text
    </button>
  );
}
