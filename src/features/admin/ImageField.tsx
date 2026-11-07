'use client';

import { useState } from 'react';
import { cleanImageUrl } from '@/lib/imageUrl';
import { uploadsEnabled } from '@/lib/firebase';
import UploadButton from './UploadButton';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

/** Picture box: upload from the computer or phone (when Storage is set up), or paste a link. Shows a live preview so the admin can see right away if it works. */
export default function ImageField({ value, onChange }: Props) {
  const [broken, setBroken] = useState(false);
  const url = cleanImageUrl(value);
  return (
    <div className="imgfield">
      <label>
        {uploadsEnabled ? 'Picture' : 'Image link'}{' '}
        <small>
          {uploadsEnabled
            ? '(optional. Upload a picture, or paste a link that starts with https://)'
            : '(optional. Paste a link that starts with https:// and ends in .jpg, .png or .webp)'}
        </small>
        <input
          type="url"
          value={value}
          placeholder="https://example.com/picture.jpg"
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
        />
      </label>
      <div className="bt">
        <UploadButton
          onUploaded={(u) => {
            setBroken(false);
            onChange(u);
          }}
        />
        {value.trim() && (
          <button className="btn s danger" type="button" onClick={() => onChange('')}>
            Remove picture
          </button>
        )}
      </div>
      {value.trim() && !url && <small className="warn">The link must start with https://</small>}
      {url && !broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="imgprev" src={url} alt="Preview" onError={() => setBroken(true)} />
      )}
      {url && broken && <small className="warn">The picture could not load. Check the link opens as a picture in your browser.</small>}
    </div>
  );
}
