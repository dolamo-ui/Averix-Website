import { IP_COLLECTION, IP_VAULT_COLLECTION } from '@/lib/firebase';
import { asNum, asStr, cmsGet, cmsList } from '@/lib/cms';
import { cleanImageUrl } from '@/lib/imageUrl';
import { GAME_LINKS, GAME_SLUGS, LINKS_DOC, UNIVERSE, UNIVERSE_DOC, VAULT, type GameSlug, type Universe, type VaultItem } from './ipData';

/** Featured universe from /admin > IP. Anything left empty there keeps the built-in text (except the side note, where empty means "hide it"). */
export async function getUniverse(): Promise<Universe> {
  const d = await cmsGet(IP_COLLECTION, UNIVERSE_DOC);
  if (!d) return UNIVERSE;
  const t = (k: keyof Universe) => asStr(d[k]).trim() || (UNIVERSE[k] as string);
  const game = asStr(d.game) as GameSlug;
  return {
    chip: t('chip'),
    label: t('label'),
    title: t('title'),
    desc: t('desc'),
    game: GAME_SLUGS.includes(game) ? game : UNIVERSE.game,
    status: t('status'),
    genre: t('genre'),
    platforms: t('platforms'),
    note: asStr(d.note).trim(),
    tag: t('tag'),
    img: cleanImageUrl(asStr(d.img)),
  };
}

/** The IP blurb for each game card in IP × Games. */
export async function getGameLinks(): Promise<Record<GameSlug, string>> {
  const d = await cmsGet(IP_COLLECTION, LINKS_DOC);
  if (!d) return GAME_LINKS;
  return {
    alpha: asStr(d.alpha).trim() || GAME_LINKS.alpha,
    beta: asStr(d.beta).trim() || GAME_LINKS.beta,
    gamma: asStr(d.gamma).trim() || GAME_LINKS.gamma,
  };
}

/** Concept Art Vault tiles, in the order set in the admin. Built-in locked tiles show until one is added there. */
export async function getVault(): Promise<VaultItem[]> {
  const docs = await cmsList(IP_VAULT_COLLECTION);
  if (!docs) return VAULT;
  const list = docs
    .filter((d) => asStr(d.tag))
    .sort((a, b) => asNum(a.order, 999) - asNum(b.order, 999) || a.id.localeCompare(b.id))
    .map<VaultItem>((d) => ({
      id: d.id,
      tag: asStr(d.tag),
      msg: asStr(d.msg) || 'This artwork is still locked.',
      img: cleanImageUrl(asStr(d.img)),
      open: d.open === true,
      order: asNum(d.order, 999),
    }));
  return list.length ? list : VAULT;
}
