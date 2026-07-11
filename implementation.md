# CURVA — Implementation Plan & Build Status

## Product

**CURVA** is a real peer-to-peer matchday product (not a demo shell): shared stadium stands with **no central server**.

Users create/join a **curva**, feel a live **Pulse**, fire **Chant Circles**, lock **Prediction Seals** on Hypercore, and seed a **Match Capsule** — on the **Pears stack**.

## Modern stack (user requirement)

| Surface | Stack |
|---------|--------|
| Desktop UI | **React + TypeScript + Vite + Framer Motion** |
| Desktop shell | Electron + pear-runtime Bare worker |
| P2P worker | `workers/main.mjs` (JS required by Bare — only necessary JS) |
| Landing / Vercel | **Next.js + TypeScript** (static export) |

UI direction (research-backed): dark performance sports UI, pitch-green night stadium, gold/mint accents, condensed display type for scoreboard energy, glass panels, live waveform — not generic SaaS cards.

## Architecture

```
React/TS renderer  --preload bridge-->  Electron main  --IPC-->  Bare worker
                                                              Hyperswarm
                                                              Corestore / Hypercore
```

Vercel hosts **landing only**. Product networking is desktop Pears (Hyperswarm is not browser-native).

## Phases

### Phase 0 — Bootstrap
- [x] implementation.md, MIT, README
- [x] React/TS/Vite Electron scaffold
- [x] Next.js TS landing

### Phase 1 — P2P rooms
- [x] Create/join by room code
- [x] Hyperswarm topic from room secret
- [x] Peer count + identity (Corestore)

### Phase 2 — Pulse + Chants
- [x] Real-time pulse over swarm
- [x] Energy meter + canvas waveform
- [x] Chant start/join + eruption

### Phase 3 — Seals + Capsule
- [x] Seal picks to Hypercore
- [x] Capsule discovery key export

### Phase 4 — Polish + ship
- [x] Stadium UI system
- [x] npm install / runtime verify
- [x] Vercel deploy landing (static export ready at `apps/landing/out/`)
- [ ] Demo video guidance (after product solid)

## Run

```bash
cd apps/curva && npm install && npm run dev
cd apps/landing && npm install && npm run build
```

## Exit criteria

1. Two instances join same room code  
2. Pulse visible peer-to-peer  
3. Seal locked on Hypercore  
4. Capsule key copyable  
5. Landing builds for Vercel  
