# CURVA — 2-Minute Quickstart

**Goal**: Test peer-to-peer matchday experience with two instances.

## Setup (30 seconds)

```bash
# Terminal 1 (Instance A)
cd apps/curva
npm install && npm run dev

# Terminal 2 (Instance B) — wait for A to start first
cd apps/curva
npm run dev
```

Two Electron windows open. Ready to test.

---

## Test Flow (90 seconds)

### 1. Create Room (Instance A)
- Fill **"Open a curva"** form (Brazil vs Germany)
- Click **"Create room code"**
- **Copy the code** (CV-XXXXXX)

### 2. Join Room (Instance B)
- Paste code in **"Join a curva"**
- Click **"Enter the stand"**
- Both show **"2 in the curva"** ✅

### 3. Test Pulse
- **Instance A**: Press **GOAL**
- **Instance B**: Energy bar jumps up 🎯
- **Instance B**: Press **ROAR**
- **Instance A**: Energy responds

### 4. Test Chants
- **Both**: Click **"OLÉ OLÉ"** within 45 seconds
- **Both**: See **"ERUPTION"** banner 🎉

### 5. Test Seals
- **Instance A**: Fill prediction form → **"Seal prediction"**
- **Instance B**: Your seal appears in their list
- **Instance B**: Seal different prediction
- **Instance A**: Sees it instantly

### 6. Copy Capsule
- Left sidebar → **"Match Capsule"**
- Click **"Copy key"** → 64-char Hypercore key
- This is the portable, append-only log of your session

---

## What Just Happened?

✅ Hyperswarm P2P discovery (no server)  
✅ Real-time events over direct peer connections  
✅ Immutable predictions on Hypercore  
✅ Append-only match capsule  
✅ Zero infrastructure — pure Pears stack  

**Full testing guide**: See [TESTING.md](./TESTING.md)

---

**Built with**: React · TypeScript · Electron · Hyperswarm · Corestore · Hypercore
