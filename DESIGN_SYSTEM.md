# Design System - Squelch: Dead Air FM

This document describes the visual language, design tokens, typography, effects, and reusable interface components used throughout Squelch: Dead Air FM.

The design combines a vintage radio interface, pixel-art aesthetics, CRT-inspired effects, and a dark, atmospheric colour palette.

## Colour Palette

The colour tokens are defined in `tailwind.config.js` and the `:root` section of `src/index.css`.

| Token | Hex | Purpose |
|---|---|---|
| `void` | `#0A0D18` | Primary page background |
| `console` | `#141A2E` | Panels, buttons, and interface surfaces |
| `bakelite` | `#5B4B8A` | Squelch's body and radio housing |
| `violet` | `#7A68A8` | Character details, borders, and dial housing accents |
| `teal` | `#3F8F8B` | Speaker grille, connected states, and interface accents |
| `teal-shadow` | `#2A5F5C` | Darker teal details and shadows |
| `cream` | `#E8DFC8` | Primary text and dial face |
| `phosphor` | `#7CFFB2` | Live-signal readouts and successful interactions |
| `amber` | `#FFB347` | ON AIR indicators, discoveries, and emotional highlights |
| `signal` | `#FF3B3B` | Opening transmission, interference, and incorrect answers |
| `muted` | `#9AA3C4` | Secondary text and subdued interface elements |

### Colour Principles

- **Dark first:** `void` and `console` establish the atmosphere and provide contrast for interface elements.
- **Red means interference:** Reserve `signal` for transmission effects, glitches, and incorrect answers.
- **Teal and green mean connection:** Use `teal`, `teal-shadow`, and `phosphor` for interface accents and signal feedback.
- **Amber means something matters:** Use `amber` sparingly for discoveries, important indicators, and emotional moments.
- **Violet defines Squelch:** Use `bakelite` and `violet` to establish the character's visual identity.

The interface should remain predominantly dark, with brighter colours used intentionally rather than decoratively.

## Typography

Four locally bundled typefaces establish the visual hierarchy.

| Font | Intended use | Characteristics |
|---|---|---|
| **Pixelify Sans** | Headings | Pixel-inspired display typography, generally in sentence case |
| **Silkscreen** | Small system labels and buttons | Compact, pixel-styled interface text |
| **VT323** | Terminal text, frequency readouts, and Squelch's spoken lines | Retro terminal and radio-display styling |
| **Space Mono** | Body copy | Monospaced text for readable supporting content |

### Body Text

Space Mono is the primary typeface for body copy, with a target size of `15px` and a line-height of `1.7`.

Typography should distinguish narrative content from technical interface elements without making the experience feel like a conventional dashboard.

## Visual Effects and Animation

The interface uses layered effects to evoke analogue radio equipment, CRT displays, signal interference, and a powered-on console.

| Effect or class | Purpose |
|---|---|
| `TypewriterText` | Reveals text progressively, like a transmission being received |
| `.cursor` | Provides a cursor treatment for typewriter-style text |
| `.fx-scanlines` | Adds horizontal CRT scanlines |
| `.fx-noise` | Adds visual noise and analogue interference |
| `.fx-vignette` | Darkens the edges of the display |
| `.anim-tear` | Creates a signal-tear or glitch effect |
| `.fx-bands` | Adds signal-band visual effects |
| `.anim-bob` | Animates subtle floating or bobbing movement |
| `.anim-lamp` | Animates the pilot lamp |
| `.site-on` | Provides the CRT-style power-on reveal |
| Weather overlays | Adds atmospheric weather effects, defined in `effects.css` |

### Motion and Accessibility

All motion effects must respect the user's `prefers-reduced-motion` setting.

When reduced motion is requested, avoid unnecessary movement and disruptive transitions while preserving the content and essential functionality of the experience.

## Reusable Components

The following components provide the recurring interface patterns used throughout the project.

### `TerminalPanel`

A framed interface panel with corner brackets, reinforcing the appearance of a vintage terminal or radio console.

### `SignalIndicator`

A five-bar meter used to represent signal strength visually.

### `AudioControls`

The interface for controlling audio playback, including the mute toggle.

### `SquelchCharacter`

The pixel-art character component. It supports mood-driven sprite variations and an optional poke interaction.

## Design Principles

The design system follows five guiding principles:

1. **Atmosphere over decoration:** Every visual effect should support the feeling of receiving a mysterious radio transmission.
2. **Consistent visual language:** Reuse the defined colours, fonts, effects, and component patterns across the interface.
3. **Meaningful colour:** Red, teal, green, and amber communicate different kinds of feedback rather than serving as arbitrary accents.
4. **Readable interfaces:** Retro styling should not come at the expense of legibility or usable controls.
5. **Accessible motion:** Respect reduced-motion preferences while preserving the experience's essential interactions.

Together, these decisions create a cohesive visual identity for Squelch: Dead Air FM, balancing retro radio nostalgia with an interactive, character-driven experience.