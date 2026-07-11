# CURVA — Testing Guide

This guide walks you through testing the complete peer-to-peer matchday experience.

## Prerequisites

- Node.js **22.17+** (tested on Node 24)
- npm 10+
- Two terminal windows (to run two instances on the same machine)

## Quick Start: Two-Peer Test

### Step 1: Start Instance A (First Peer)

Open your first terminal:

```bash
cd apps/curva
npm install   # if not already done
npm run dev
```

Wait for:
- `VITE v6.x ready in XXXXms`
- `➜ Local: http://localhost:5173/`
- Electron window opens

### Step 2: Start Instance B (Second Peer)

Open a **second terminal** (keep Instance A running):

```bash
cd apps/curva
npm run dev
```

A **second** Electron window will open. You now have two independent peers.

---

## The Full Experience

### Phase 1: Setup Your Identity

**On Both Instances:**

1. The app opens to the **Lobby** screen
2. Scroll to **"Your kit"** section
3. Customize:
   - **Display name**: Change from default (e.g., "Fan-XXXX") to your name
   - **Color**: Pick your fan color
4. Click **"Save kit"**

> Your identity is saved to a local Hypercore. It persists across sessions.

---

### Phase 2: Create a Room (Instance A)

**On Instance A only:**

1. Scroll to **"Open a curva"** section
2. Set match details:
   - **Home**: Brazil
   - **Away**: Germany
   - **Fixture label**: World Cup Final 2026
3. Click **"Create room code"**

**Result:**
- Room code appears (format: `CV-XXXXXX`)
- You're now in the **Stand** view
- Top bar shows: `Brazil vs Germany` · `CV-XXXXXX`
- Peer count: **"1 in the curva"** (just you)

**✅ Copy the room code** — you'll need it for Instance B

---

### Phase 3: Join the Room (Instance B)

**On Instance B:**

1. In the **Lobby**, scroll to **"Join a curva"**
2. Paste the room code from Instance A (e.g., `CV-XXXXXX`)
3. Click **"Enter the stand"**

**Result:**
- Instance B joins the same room
- Both instances now show: **"2 in the curva"**
- You can see each other in the **"The stand"** sidebar (left panel)
- Each peer shows their name and color dot

**🎉 P2P connection established via Hyperswarm!**

---

### Phase 4: Test Real-Time Pulse

The **Crowd Pulse** shows collective energy from all peers.

**Try this:**

1. **On Instance A**: Press the **GOAL** button (big button in center)
2. **Watch Instance B**: The energy bar should jump up immediately
3. **On Instance B**: Press **ROAR** a few times
4. **Watch Instance A**: Energy meter responds in real-time

**How it works:**
- Each pulse event is broadcast over Hyperswarm
- Energy = sum of recent pulse intensities (last 12 seconds)
- Pulses decay over time (30-second window)
- Audio feedback plays on button press

**Observe:**
- Energy meter updates on both instances
- Pulse feed shows recent events with peer names/colors
- Live waveform animates with energy level

---

### Phase 5: Start a Chant Circle

Chants require **peer alignment** to erupt.

**Test eruption flow:**

1. **On Instance A**: Click **"OLÉ OLÉ"** in the Chant Circles section
2. **Watch both instances**: 
   - Chant shows "1 voices" underneath
   - Timer: 45-second window to join
3. **On Instance B**: Click **"OLÉ OLÉ"** (same chant)
4. **Watch for eruption**:
   - When ≥40% of peers join → **"ERUPTION"** banner appears
   - With 2 peers, threshold is 2 — both joined = eruption!

**Try different scenarios:**
- Start different chants on each instance (no eruption)
- Both join "DEFENSE" within 45 seconds (eruption!)
- Wait >45 seconds — chant expires, start fresh

**Chants catalog:**
- OLÉ OLÉ
- DEFENSE
- LET'S GO
- SIUUU
- GLORY
- BELIEVE

---

### Phase 6: Lock a Prediction Seal

Seals are **append-only commitments** stored on your local Hypercore.

**On Instance A:**

1. Scroll to **"Prediction Seals"** (right sidebar)
2. Fill the form:
   - **Winner**: Home / Away / Draw
   - **Home score**: 2
   - **Away score**: 1
   - **First scorer**: Neymar (optional)
3. Click **"Seal prediction"**

**Result:**
- Your seal appears in the list below
- Shows: your name, color, and prediction details
- **Broadcast to Instance B** — they see your seal instantly

**On Instance B:**
- Seal a different prediction (e.g., Away, 1-3)
- Instance A sees it appear in their list

**Key concept:**
- Once sealed, predictions are **immutable** (written to Hypercore)
- One seal per peer per curva (can't change after sealing)
- Seals survive app restarts (stored in `curva-data/`)

---

### Phase 7: Change Match Phase

Control the match timeline.

**On Instance A:**

1. Top bar shows phase pills: **Prematch** · **Live** · **Full time**
2. Click **"Live"** — match is now active
3. **Watch Instance B**: Phase updates automatically

**On Instance B:**
- Click **"Full time"** — match ends
- Instance A updates immediately
- After full time, sealing is **disabled** (predictions locked)

**Phase sync:**
- Any peer can change phase
- All peers sync the new phase via Hyperswarm
- History is logged to the Match Capsule

---

### Phase 8: Export the Match Capsule

The **Match Capsule** is an append-only log of the entire session.

**On either instance:**

1. Left sidebar → **"Match Capsule"** section
2. Shows:
   - Hypercore discovery key (64-char hex)
   - Event count (e.g., "237 events")
3. Click **"Copy key"**

**What's in the capsule:**
- Every pulse event
- Every chant start/join
- Every sealed prediction
- Phase changes
- Room join events

**Capsule persistence:**
- Stored locally: `apps/curva/curva-data/capsule-CV-XXXXXX/`
- Hypercore format — can be re-seeded, shared, verified
- **Portable memory** of the match night

**Try this:**
- Keep the key
- Close both apps
- Restart and join the same room code
- Capsule key is the same — it's the same immutable log

---

## Advanced Testing

### Test Room Isolation

1. Instance A creates room `CV-ABC123`
2. Instance B creates a **different** room `CV-XYZ789`
3. Both are in separate rooms — no pulse/chant sharing
4. Instance C can join either room code

### Test Identity Persistence

1. Customize your name and color
2. Close the app completely
3. Restart `npm run dev`
4. Identity is restored from Hypercore storage

### Test Pulse Decay

1. Press **GOAL** 5 times rapidly (energy spikes to ~100)
2. Stop pressing — watch energy decay
3. After 12 seconds, old pulses are filtered out
4. Energy meter drops back to 0

### Test Chant Expiration

1. Start "SIUUU" chant on Instance A
2. Wait **45+ seconds** without Instance B joining
3. Chant disappears from the active list
4. Start it again — fresh timer, new instance ID

### Test Seal Constraint

1. Seal a prediction on Instance A
2. Try to seal again → **Error toast**: "You already sealed a prediction for this curva"
3. Only one seal per peer per room

---

## Production Build Test

Test the production bundle:

```bash
cd apps/curva
npm run build      # Creates dist/
npm start          # Runs Electron with production bundle
```

Verify:
- App loads from `dist/index.html` (not Vite dev server)
- All features work identically
- No dev server console output

---

## Troubleshooting

### "No peers found"

- Both instances must use the **exact same room code**
- Room codes are case-sensitive
- Check if firewall is blocking Hyperswarm DHT (UDP port discovery)

### "Worker not ready"

- Bare worker failed to start
- Check terminal for `[curva-worker]` error logs
- Ensure `pear-runtime` is installed: `npm install`

### Energy meter stuck at 0

- Try pressing **GOAL** or **ROAR** multiple times
- Check if pulses appear in the feed below the meter
- Verify peer connection (peer count > 1)

### Chants don't erupt

- Both peers must click the **same chant** (e.g., both click "OLÉ OLÉ")
- Must join within 45-second window
- Eruption threshold: 40% of peers (min 2 with 2 peers total)

### Instance B won't join

- Verify room code is copied exactly (no spaces)
- Check if Instance A is still running (don't close it)
- Try restarting both instances

---

## What You've Tested

✅ **P2P Discovery**: Hyperswarm topic-based room joining  
✅ **Identity**: Persistent Corestore identity across sessions  
✅ **Real-time Sync**: Pulse events over Hyperswarm connections  
✅ **Crowd Dynamics**: Chant eruptions with peer alignment  
✅ **Immutable Storage**: Predictions sealed to Hypercore  
✅ **Append-only Log**: Match capsule with portable discovery key  
✅ **Phase Sync**: Match state broadcast to all peers  
✅ **Zero Infrastructure**: No central server, no cloud API — pure P2P  

---

## Next Steps

- Test with 3+ peers (open more instances or run on different machines)
- Copy a capsule key and explore the Hypercore data structure
- Deploy the landing page to Vercel
- Record a demo video showing the two-peer flow

**Questions? Issues? Check:**
- Terminal output for Bare worker logs
- Browser DevTools console (React warnings)
- `apps/curva/curva-data/` for local storage files

---

**Enjoy the roar.** 🏟️
