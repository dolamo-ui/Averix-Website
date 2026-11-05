import { cloudinaryConfig, cloudinaryEnabled, getFirebase } from '@/lib/firebase';

const MAX_SIDE = 1800;
const MAX_INPUT_MB = 25;

/** Shrinks a picture in the browser (long side 1800px) so phone photos upload fast and pages stay light. Keeps PNG transparency when the result is small. */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  const toBlob = (type: string, q?: number) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));

  if (file.type === 'image/png') {
    ctx.drawImage(bmp, 0, 0, w, h);
    const png = await toBlob('image/png');
    if (png && png.size <= 2.5 * 1024 * 1024) return png;
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  const jpg = await toBlob('image/jpeg', 0.86);
  if (!jpg) throw new Error('encode');
  return jpg;
}

/**
 * Uploads a picture chosen in /admin (to Cloudinary when set up, otherwise Firebase Storage) and returns its public https link.
 * Throws an Error whose message is plain language, ready to show to the client.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WEBP picture.');
  if (file.size > MAX_INPUT_MB * 1024 * 1024) throw new Error(`That picture is too big. Please choose one under ${MAX_INPUT_MB} MB.`);
  let blob: Blob;
  try {
    blob = await shrink(file);
  } catch {
    throw new Error('That picture could not be read. Try a different one.');
  }
  if (cloudinaryEnabled) {
    try {
      const body = new FormData();
      body.append('file', blob, file.name);
      body.append('upload_preset', cloudinaryConfig.uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, { method: 'POST', body });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { secure_url?: string };
      if (!json.secure_url) throw new Error('no url');
      return json.secure_url;
    } catch {
      throw new Error('The upload did not work. Check your internet and try again. If it keeps failing, ask your developer to check the Cloudinary settings.');
    }
  }
  try {
    const { app } = await getFirebase();
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'picture';
    const r = ref(getStorage(app), `uploads/${Date.now()}-${base}.${ext}`);
    await uploadBytes(r, blob, { contentType: blob.type, cacheControl: 'public,max-age=31536000' });
    return await getDownloadURL(r);
  } catch {
    throw new Error('The upload did not work. Check your internet and try again. If it keeps failing, ask your developer to check Firebase Storage.');
  }
}
