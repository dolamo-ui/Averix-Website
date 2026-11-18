import { HOME_COLLECTION } from '@/lib/firebase';
import { asStr, cmsGet } from '@/lib/cms';
import { cleanImageUrl } from '@/lib/imageUrl';
import { cleanCardLink, UNIVERSE_DEFAULTS, type UniverseCard } from './universesData';

/**
 * The "Our Universes" cards on the home page: what the client wrote in /admin > Universes,
 * over the built-in text. A card the client has not saved (or any card while Firebase is off) keeps the built-in text.
 * Empty title, status or description keep the built-in text; an empty button hides the button; an empty link makes the card not clickable.
 */
export async function getUniverses(): Promise<UniverseCard[]> {
  const docs = await Promise.all(UNIVERSE_DEFAULTS.map((d) => cmsGet(HOME_COLLECTION, d.id)));
  return UNIVERSE_DEFAULTS.map((def, i) => {
    const d = docs[i];
    if (!d) return def;
    return {
      id: def.id,
      status: asStr(d.status).trim() || def.status,
      title: asStr(d.title).trim() || def.title,
      desc: asStr(d.desc).trim() || def.desc,
      img: cleanImageUrl(asStr(d.img)),
      link: cleanCardLink(asStr(d.link)),
      button: asStr(d.button).trim(),
    };
  });
}
