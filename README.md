# curvax

**Peer-to-peer matchday stands** for the Tether Developers Cup — **Pears track**.

The stadium curvax is where fans become one organism. Online, fans are isolated tabs. **curvax** recreates that body with **no central server**: live crowd **Pulse**, **Chant Circles**, **Prediction Seals** on Hypercore, and seedable **Match Capsules**.

## Why this is not “another chat app”

| Interaction | What it is |
|-------------|------------|
| Pulse | Lightweight reaction events (GOAL/SAVE/ROAR) → shared energy meter |
| Chants | Time-windowed group chants that **erupt** when peers align |
| Seals | Append-only prediction commitments on Hypercore |
| Capsule | Portable append-only memory of the night |

## Stack

| Layer | Tech |
|-------|------|
| Product UI | **React + TypeScript + Vite + Framer Motion** |
| Desktop shell | **Electron** + **pear-runtime** (Bare worker) |
| P2P | **Hyperswarm · Corestore · Hypercore · hypercore-crypto** |
| Landing (Vercel) | **Next.js + TypeScript** |

> **Note:** Plain JavaScript is used only where required: Electron main/preload (CJS bridge) and the Bare worker (`workers/main.mjs`) — Bare runs ESM JS, not the React TS bundle.

## Repository layout

```
apps/curvax/     → desktop product (run this for the real app)
apps/landing/   → Next.js static site for Vercel
implementation.md
README.md
LICENSE
```

## Quick start (judges)

### Requirements

- Node.js **22.17+** (project tested on Node 24)
- npm 10+
- Windows / macOS / Linux

### Run the product

```bash
cd apps/curvax
npm install
npm run dev
```

This starts Vite + Electron and boots the Pear Bare worker (Hyperswarm).

**Two-peer test (same machine):**

1. Start instance A: `npm run dev`
2. Open a second terminal, same folder: `npm run dev` again (second Electron window)
3. On A: set teams → **Create room code** → copy `CV-…`
4. On B: **Join** with that code
5. Press **GOAL** / **ROAR** — energy should move on both; try a chant on both windows

### Production UI build

```bash
cd apps/curvax
npm run build
npm start
```

### Landing (Vercel)

```bash
cd apps/landing
npm install
npm run build
```

Deploy `apps/landing` on Vercel (framework: Next.js, output export / static).

Root directory: `apps/landing`

## Outside services

- Google Fonts (UI typography only)
- Public Hyperswarm DHT (Pears networking — no app server)

No cloud AI. No central API for room state.

## License

MIT

