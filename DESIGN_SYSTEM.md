# Design system

## Palette (tokens in `tailwind.config.js` and `:root` in `src/index.css`)

| Token | Hex | Use |
| --- | --- | --- |
| void | `#0A0D18` | Page background |
| console | `#141A2E` | Panels, buttons |
| bakelite / violet | `#5B4B8A` / `#7A68A8` | Squelch's body, borders, dial housing |
| teal / teal-shadow | `#3F8F8B` / `#2A5F5C` | Speaker grille, "connected" state, panel accents |
| cream | `#E8DFC8` | Main text, dial face |
| phosphor | `#7CFFB2` | Live-signal readouts, success |
| amber | `#FFB347` | ON AIR lamp, discoveries, emotional beats |
| signal (red) | `#FF3B3B` | The opening transmission, interference, wrong answers |
| muted | `#9AA3C4` | Secondary text |

Rule of thumb: mostly dark; red for static, teal/green for signal, amber only when something matters.

## Type

- **Pixelify Sans**: headings (sentence case)
- **Silkscreen**: small system labels and buttons
- **VT323**: terminal text, frequency readouts, Squelch's spoken lines
- **Space Mono**: body copy (15px, line-height 1.7)

## Effects (all respect `prefers-reduced-motion`)

`TypewriterText` + `.cursor`, `.fx-scanlines`, `.fx-noise`, `.fx-vignette`, `.anim-tear` (signal tear), `.fx-bands`, `.anim-bob`, `.anim-lamp`, `.site-on` (CRT power-on reveal), weather overlays in `effects.css`.

## Components

`TerminalPanel` (framed panel with corner brackets), `SignalIndicator` (5-bar meter), `AudioControls` (mute toggle), `SquelchCharacter` (mood-driven sprite, optional poke interaction).
