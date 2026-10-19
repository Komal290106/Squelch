# Squelch: Dead Air FM

*A little radio, a forgotten town, and the signals that never found their way home.*

Squelch is an interactive character experience set in **Lowtide Hollow**, a forgotten town where a small, living radio continues broadcasting into the quiet. Tune through its frequencies, discover fragments of lost stories, and see what happens when a signal finally finds someone listening.

## Contents

- [Overview](#overview)
- [Features](#features)
- [The Experience](#the-experience)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Audio and Privacy](#audio-and-privacy)
- [Documentation](#documentation)
- [Credits](#credits)
- [License](#license)

## Overview

Squelch combines a pixel-art radio character, atmospheric visuals, and small interactive discoveries into a web experience inspired by vintage electronics and the feeling of finding an unexpected broadcast late at night.

The experience moves through a simple emotional arc:

**Silence → Curiosity → Discovery → Loneliness → Connection**

Rather than presenting a conventional portfolio, the website invites visitors to explore a fictional world through radio frequencies, short stories, and hidden interactions.

## Features

- **Interactive radio character** — Squelch has multiple expressions and moods.
- **Transmission intro** — A typewriter-style opening leads visitors into the experience.
- **Frequency dial** — Tune into the world and enter the main experience.
- **Story fragments** — Discover pieces of Squelch's world through recorded memories.
- **Frequency archive** — Explore interactive stations with small activities and discoveries.
- **Night log** — Read fragments from the quiet hours of Lowtide Hollow.
- **Secret frequency** — Discover a hidden transmission by completing the station interactions or finding the footer's hidden interaction.
- **Atmospheric visuals** — CRT-inspired textures, scanlines, subtle glitches, and pixel-art environments.
- **Sound controls** — Audio is optional, with sound disabled by default.
- **Responsive layout** — Designed to adapt to different screen sizes.
- **Reduced-motion support** — Motion effects are intended to respect the visitor's system preferences.

## The Experience

The website is designed to be explored rather than read from top to bottom.

1. **The Transmission** — Begin with a quiet screen and a message asking whether anyone is there.
2. **Tune In** — Interact with the radio dial or continue without tuning.
3. **Meet Squelch** — Enter Lowtide Hollow and meet the radio behind the broadcast.
4. **Explore the Stories** — Discover fragments of the town and its memories.
5. **Visit the Frequencies** — Try the interactive stations and uncover their small details.
6. **Find the Secret** — Complete all three stations or discover the hidden footer interaction to unlock AM 1717.

Some interactions reveal additional details, so take your time and explore.

## Built With

| Technology | Purpose |
|---|---|
| React 18 | UI and interactive components |
| Vite 5 | Development server and production builds |
| TypeScript | Type-safe application code |
| Tailwind CSS 3 | Utility-first styling |
| CSS animations | Character movement and atmospheric effects |
| Lucide React | Interface icons |

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd squelch-dead-air-fm
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in your terminal by Vite.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

If the project includes test and type-check scripts, run the commands defined in `package.json` before submitting changes.

## Project Structure

```text
squelch-dead-air-fm/
├── public/
│   └── assets/
│       ├── characters/      # Squelch's expressions
│       ├── backgrounds/     # Lowtide Hollow artwork
│       ├── scenes/          # Scene illustrations
│       ├── textures/        # CRT and visual textures
│       ├── audio/           # Radio sound effects
│       └── fonts/           # Locally hosted fonts and licenses
├── scripts/
│   └── generate_assets.py   # Procedural asset generator
├── src/
│   ├── components/          # UI and experience components
│   ├── hooks/               # Reusable React hooks
│   ├── data/                # Character, story, and station data
│   ├── utils/               # Shared utilities
│   └── ...
├── DESIGN_SYSTEM.md
├── ASSET_CREDITS.md
├── LICENSE.md
├── package.json
└── README.md
```

*The tree above describes the intended organization. Update it if the actual repository uses different filenames or folders.*

## Customization

Want to change the world, the character, or the visual style? Start here.

| File or directory | What it controls |
|---|---|
| `src/data/character.ts` | Character information and configuration |
| `src/data/story.ts` | Story fragments and narrative content |
| `src/data/stations.ts` | Frequency stations and their content |
| `public/assets/characters/` | Character sprites and expressions |
| `public/assets/backgrounds/` | Background artwork |
| `public/assets/audio/` | Radio ambience and sound effects |
| `public/assets/fonts/` | Locally hosted typefaces |
| `src/index.css` | Global styles and design tokens |
| `src/` | Interactive components and visual effects |

For the color palette, typography, visual principles, and effects, see the [Design System](DESIGN_SYSTEM.md).

If the asset-generation script is included and its dependencies are installed, regenerate the procedural assets with:

```bash
python3 scripts/generate_assets.py
```

Regenerating assets may overwrite existing generated files, so review the script before running it if you have manually edited those assets.

## Audio and Privacy

- Sound is disabled by default.
- Visitors can explore the experience without enabling audio.
- Messages entered into the interface are handled in the current React session; they are not sent to a server or saved persistently by the application as currently designed.

## Documentation

Use these documents to learn more about the project.

- **[Design System](DESIGN_SYSTEM.md)** — Color palette, typography, visual principles, and interface effects.
- **[Asset Credits](ASSET_CREDITS.md)** — Artwork, audio, fonts, and their respective attribution or licensing information.
- **[License](LICENSE.md)** — Licensing terms for the project code and notes on separately licensed assets.

## Credits

Squelch brings together pixel art, vintage radio aesthetics, small interactive stories, and atmospheric web design.

Third-party fonts and other external assets retain their respective licenses. See [Asset Credits](ASSET_CREDITS.md) for details.

## License

The project's code is licensed under the [MIT License](LICENSE.md), subject to the terms and exceptions described there. Third-party fonts and other assets may be governed by separate licenses.

---

*Somewhere on the dial, a little radio is still waiting for a reply.*