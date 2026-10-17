# Squelch · Dead Air FM

An interactive fictional-character portfolio for the haX.baby "Baby's First Website" hackathon.
A dark, CRT-flavoured radio transmission from the forgotten town of **Lowtide Hollow**, starring **Squelch**, a tiny living radio that keeps broadcasting after everyone has gone.

Stack: React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · CSS animations · lucide-react.

## Run it

1. **Extract** the ZIP (right-click → Extract All, or `unzip squelch-dead-air-fm.zip`).
2. **Open in VS Code:** `cd squelch-dead-air-fm && code .` (or File → Open Folder).
3. **Node.js:** 18.18+ recommended (20 LTS or newer is best).
4. **Install:** `npm install`
5. **Develop:** `npm run dev` and open the URL it prints (usually http://localhost:5173).
6. **Build:** `npm run build`, then `npm run preview` to try the production build.
7. **Checks:** `npm run typecheck` and `npm test` (jsdom smoke tests for the intro, all three stations and the secret frequency).

## How the experience flows

1. Black screen → red "Is anyone there?" types out → three status lines → the dial fades in.
2. Click the dial (or choose *Continue without tuning*). The dial turns, the screen tears, the signal shifts red → amber → teal, and the site powers on.
3. Scroll: hero → station record → story (4 tapes) → frequency archive (3 stations) → night log → AM 1717 → footer.
4. Log all three stations (hear 3 lost objects, repair the beacon in order, hear all three weather forecasts) and **AM 1717** unlocks. Backup trick: tap the tiny lamp in the footer 5 times.
5. Messages to Squelch live only in React state. Nothing is stored or sent anywhere.

Sound is off by default. Use the *Sound* button (top bar or intro) to enable it. The site works fully without audio.

## Where to change things

| What | Where |
| --- | --- |
| Character copy, tagline, record card | `src/data/character.ts` |
| Story scenes, night log entries, the recording | `src/data/story.ts` |
| Stations, lost objects, repair order, weather text | `src/data/stations.ts` |
| Squelch sprites (6 moods) | `public/assets/characters/squelch-<mood>.svg` (same file names = drop-in swap) |
| Backgrounds / story scenes | `public/assets/backgrounds/` |
| Sounds | `public/assets/audio/` (names are mapped in `src/lib/audio.ts`) |
| Fonts | `public/assets/fonts/` + `@font-face` in `src/index.css` + `tailwind.config.js` |
| Colours | `tailwind.config.js` and the `:root` variables in `src/index.css` |
| Effects (scanlines, grain, glitch) | `src/styles/effects.css`, `src/styles/animations.css` |
| Shared state | `src/hooks/useRadioState.ts` |

`python3 scripts/generate_assets.py` regenerates every sprite, scene, texture and sound (original, procedural). Edit it to restyle assets, or just overwrite the files.

See `DESIGN_SYSTEM.md` for tokens and `ASSET_CREDITS.md` for licences.
