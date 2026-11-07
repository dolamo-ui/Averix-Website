import { TEAM_COLLECTION } from '@/lib/firebase';
import { asNum, asStr, cmsList } from '@/lib/cms';
import { cleanImageUrl } from '@/lib/imageUrl';
import { TEAM, type Member } from './teamData';

/** The team from /admin > Team (in the order set there). Falls back to the built-in team when Firebase is off, fails or has no members yet. */
export async function getTeam(): Promise<Member[]> {
  const docs = await cmsList(TEAM_COLLECTION);
  if (!docs) return TEAM;
  const members = docs
    .filter((d) => asStr(d.name))
    .sort((a, b) => asNum(a.order, 999) - asNum(b.order, 999) || a.id.localeCompare(b.id))
    .map<Member>((d) => ({
      id: d.id,
      name: asStr(d.name),
      role: asStr(d.role),
      dept: asStr(d.dept),
      blurb: asStr(d.blurb),
      photo: cleanImageUrl(asStr(d.photo)) || undefined,
    }));
  return members.length ? members : TEAM;
}
