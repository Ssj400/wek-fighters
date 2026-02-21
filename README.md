# Wek Fighters — 2D Turn-Based Boxing (Phaser + TypeScript)

A compact, playable 1v1 turn-based boxing prototype built with Phaser 3 and TypeScript. Each character has distinct mechanics and playstyles — the project showcases modular game architecture, scene management, audio integration, and a Capacitor-based Android target.

---

## Key Highlights

- Polished, turn-based combat system with character classes and unique abilities.
- Structured game state using Phaser scenes and TypeScript classes for maintainability.
- Audio system with music and SFX, visual feedback and simple UI controls.
- Build tooling with Vite and TypeScript; mobile packaging via Capacitor (android/).

---


## Project Structure (selected)

```
src/
├── classes/      # Fighter classes and game logic
├── common/       # Shared helpers: sounds, UI helpers, constants
├── scenes/       # Phaser scenes (Menu, Loading, CharacterSelect, Fight)
├── logic/        # Turn resolution and CPU logic
├── managers/     # Game manager and state orchestration
├── utils/        # Small utilities (criticals, sleep, etc.)
└── main.ts       # Game entry / Phaser config
android/          # Capacitor Android project for mobile builds
```

---

## Tech Stack

- Phaser 3
- TypeScript
- Vite (dev server & build)
- Capacitor (Android packaging)

---

## Run locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview   # preview the production build
```

Deploy (if configured):

```bash
npm run deploy
```

---

## Notes for maintainers

- The game is intentionally modular: add new `Fighter` subclasses in `src/classes` and register them in `src/common/fighters.ts`.
- Audio assets and other media live under `public/assets` and are loaded by the loading scenes.
- For mobile builds, follow Capacitor docs; the `android/` directory contains the Android project scaffold.

---

## Author

José Garrillo — developer and designer of this prototype. See repository history for implementation details.

## License

This project is available under the terms in the `LICENSE` file.
