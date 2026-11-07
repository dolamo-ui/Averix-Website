import { CHARACTERS_COLLECTION } from '@/lib/firebase';
import { asNum, asStr, cmsList } from '@/lib/cms';
import { cleanImageUrl } from '@/lib/imageUrl';
import { CHARACTERS, type Character } from './characters';

const COLOR = /^#[0-9a-fA-F]{6}$/;

/**
 * Characters from /admin > Characters (in the order set there).
 * `sample` is true while the built-in placeholder characters are showing (Firebase off, failing, or no character added yet).
 */
export async function getCharacters(): Promise<{ characters: Character[]; sample: boolean }> {
  const docs = await cmsList(CHARACTERS_COLLECTION);
  if (!docs) return { characters: CHARACTERS, sample: true };
  const list = docs
    .filter((d) => asStr(d.name))
    .sort((a, b) => asNum(a.order, 999) - asNum(b.order, 999) || a.id.localeCompare(b.id))
    .map<Character>((d) => {
      const color = asStr(d.color);
      return {
        name: asStr(d.name),
        role: asStr(d.role) || 'Character',
        color: COLOR.test(color) ? color : '#00e5ff',
        open: d.open === true,
        origin: asStr(d.origin) || undefined,
        universe: asStr(d.universe) || undefined,
        game: asStr(d.game) || undefined,
        desc: asStr(d.desc) || undefined,
        backstory: asStr(d.backstory) || undefined,
        media: asStr(d.media).split('\n').map((m) => m.trim()).filter(Boolean),
        img: cleanImageUrl(asStr(d.img)) || undefined,
      };
    });
  return list.length ? { characters: list, sample: false } : { characters: CHARACTERS, sample: true };
}
