# Averix Games – Next.js + React + TypeScript

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
npm run typecheck
```

## Structure

```
public/assets/          images, videos, logo (same files as the HTML site)
src/app/                one folder per page (page.tsx) + layout.tsx + globals.css
  page.tsx              Home      /games  /events  /ip  /about  /music
  community/ news/ partnerships/
src/styles/<page>.css   each page's original CSS, scoped under .pg-<page>
src/components/layout/  PageFrame (header, footer, toast, reveal), SiteHeader, SiteFooter
src/components/ui/      SafeImg, Toast, TiltEffect
src/features/<page>/    interactive parts: data + client components
src/hooks/              useReveal, useTilt, useNow
```

## Where to edit content

| What | File |
| --- | --- |
| Events list (Events page) | `src/features/events/sampleEvents.ts` |
| Community schedule | `src/features/community/schedule.ts` |
| News posts | `src/features/news/posts.ts` |
| Music tracklist and releases | `src/features/music/musicData.ts` |
| IP characters | `src/features/ip/characters.ts` |
| Partnership email address | `CONTACT_EMAIL` in `src/features/partnerships/EnquiryForm.tsx` |
| Nav links | `src/lib/site.ts` |

Page text (hero copy, About, Games...) is plain JSX inside each `src/app/<page>/page.tsx`.

## Notes

- `three` is pinned to 0.128.0 (same version as the original) so the hero scene looks identical.
- Links to `game-alpha/beta/gamma.html` pointed at pages that were not in the zip; they now go to `/games#alpha`, `#beta`, `#gamma`. Add real routes later (e.g. `src/app/games/alpha/page.tsx`).
- The About page team cards show initials (TN, LM, BP, FS, SM) instead of photos, as the client requested. Edit the letters in `src/app/about/page.tsx`.
- The footer is the newest version (from games.html) on every page; older pages had slightly different footers.
- Music page (`/music`) is linked from the footer only, same as music.html (it is not one of the 8 header nav items; add `{ href: '/music', label: 'Music' }` to `src/lib/site.ts` if the client wants it there). Its images `music-hero.jpg`, `music-album.jpg`, `music-card1-3.jpg`, `music-rel1-4.jpg` and `music-collab.jpg` were not in the zip; gradient placeholders show until you add them to `public/assets/`. The Caveat font for its handwritten text is loaded inside `src/app/music/page.tsx`.

## Mobile layer (phones, 900px and below)

- `src/styles/mobile.css` holds all phone styling. Every rule is prefixed `body .mx` (PageFrame adds `mx` to each page root) so it outranks the per-page CSS.
- `src/components/mobile/MobileLayer.tsx`: bottom tab bar, full-screen menu sheet, scroll progress, tap ripple, data-saver mode (skips big videos on slow networks or Data Saver).
- `src/components/mobile/SnapRow.tsx`: wraps a card grid; swipeable with dots on phones, unchanged on desktop. Used for home Games and News cards.
- `src/components/layout/FooterCol.tsx`: footer columns become an accordion on phones.
- Home has a phone-only "What brings you here?" launcher (`#start`, class `mx-quick`).
- To change the menu descriptions or tab items, edit `SHEET_LINKS` and `TABS` in `MobileLayer.tsx`.

## Before launch
- News and Events (with Computicket ticket links) are editable at /admin through Firebase: see `FIREBASE-SETUP.md`.
- Set `CONTACT_EMAIL` and `SITE_URL` (or env `NEXT_PUBLIC_SITE_URL`) in `src/lib/site.ts`.
- Fill in game details, trailers, screenshots and logos in `src/features/games/gamesData.ts`.
- Replace `public/assets/alpha.jpg`, `beta.jpg`, `gamma.jpg` (reference art from other studios' games) with Averix's own art.
- Have the Privacy Policy and Terms (`src/app/privacy`, `src/app/terms`) reviewed by a legal adviser.
- Social-share images live in `public/og/` (regenerate when branding changes).
