# CURVAX — Testing Guide

This guide walks you through testing the complete peer-to-peer matchday experience.

## Prerequisites

- Node.js **22.17+** (tested on Node 24)
- npm 10+
- Two terminal windows (to run two instances on the same machine)

## Quick Start: Two-Peer Test

### Step 1: Start Instance A (First Peer)

Open your first terminal:

```bash
cd apps/curvax
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

1. Scroll to **"Open a curvax"** section
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

1. In the **Lobby**, scroll to **"Join a curvax"**
2. Paste the room code from Instance A (e.g., `CV-XXXXXX`)
3. Click **"Enter the stand"**

**Result:**
- Instance B joins the same room
- Both instances now show: **"2 in the curvax"**
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
- One seal per peer per curvax (can't change after sealing)
- Seals survive app restarts (stored in `curvax-data/`)

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
- Stored locally: `apps/curvax/curvax-data/capsule-CV-XXXXXX/`
- Hypercore format — can be re-seeded, shared, verified
- **Portable memory** of the match night

**Try this:**
- Keep the key
- Close both apps
- Restart and join the same room code
- Capsule key is the same — it's the same immutable log

---

## Advanced Testing

### Test Accessibility Features (NEW - Week 5 Polish)

**Keyboard Navigation:**
1. Press `Tab` key to navigate through interactive elements
2. Verify focus indicators (gold outline) appear on all buttons
3. Test button activation:
   - On any button, press `Enter` or `Space` to activate
   - Should work on: Pulse buttons, ROAR, Chant cards, Phase pills
4. Use `Tab` + `Shift+Tab` to navigate backwards
5. Try keyboard-only flow:
   - Navigate to Create Room form
   - Fill fields with keyboard
   - Submit with `Enter`
   - Navigate Stand view entirely with keyboard

**Screen Reader Support:**
1. Enable screen reader (Windows: Narrator, Mac: VoiceOver)
2. Navigate through app - verify all elements are announced
3. Check ARIA labels on buttons describe their purpose
4. Verify live regions announce:
   - Energy level changes
   - Toast notifications
   - Possession bar updates

**Skip to Main Content:**
1. On app load, press `Tab` once
2. "Skip to main content" link should appear at top
3. Press `Enter` - should jump directly to main content

**Reduced Motion:**
1. Enable reduced motion in OS settings:
   - Windows: Settings → Accessibility → Visual effects → Animation effects OFF
   - Mac: System Preferences → Accessibility → Display → Reduce motion ON
2. Reload app
3. Verify animations are minimal/instant (no spinning, sliding, scaling)

**Focus Management:**
1. Open floating sidebar (click "👥 X Fans")
2. Verify focus moves into sidebar
3. Press `Esc` or click close - focus returns to trigger button

**Color Contrast:**
1. Verify all text is readable on backgrounds
2. Gold/Mint/Rose colors should be vibrant but not strain eyes
3. Glass panels should have sufficient contrast

---

### Test Performance (NEW - Week 5 Polish)

**60fps Animations:**
1. Open browser DevTools → Performance tab
2. Start recording
3. Press GOAL button multiple times rapidly
4. Stop recording
5. Verify frame rate stays at 60fps (green line at top)
6. Check for no red frames (dropped frames)

**Waveform Performance:**
1. Let waveform run for 2+ minutes
2. Monitor CPU usage (should stay reasonable)
3. Verify smooth animation with no stuttering
4. On lower-end devices, should still maintain smooth motion

**Smooth Scrolling:**
1. On Lobby view, scroll up and down
2. Should feel smooth, not janky
3. On mobile/touch devices, test touch scrolling

**Button Responsiveness:**
1. Press any button - visual feedback should be instant (<100ms)
2. No lag between click and animation
3. Haptic feedback (on mobile) should be immediate

**Energy Bar Transitions:**
1. Fire multiple pulses rapidly
2. Energy bar should animate smoothly, not jump
3. Color transitions (mint → gold → rose) should be gradual

**Canvas Rendering:**
1. Open DevTools → Rendering
2. Enable "Paint flashing"
3. Verify waveform canvas doesn't cause excessive repaints
4. Only canvas area should flash, not entire page

---

### Test Haptic Feedback (Mobile/Supported Devices)

**If testing on mobile device or device with vibration:**

1. Press **GOAL** button (intensity 5) - should feel strong vibration
2. Press **SAVE** button (intensity 3) - should feel medium vibration
3. Press **FOUL** button (intensity 2) - should feel light vibration
4. Press **ROAR** button - should feel heavy vibration
5. Trigger chant eruption - should feel heavy vibration

**Vibration Patterns:**
- Light: Short 10ms buzz
- Medium: 20ms buzz
- Heavy: 30ms strong buzz

---

### Test Sound Effects (NEW - Week 5 Polish)

**Pulse Sounds:**
1. Press **GOAL** - should hear explosive celebration sound with crowd roar
2. Press **SAVE** - should hear quick whistle swoosh
3. Press **FOUL** or **CARD** - should hear warning whistle (2 blasts)
4. Press **ROAR** - should hear massive crowd explosion with rumble

**UI Sounds:**
1. Click any form button - subtle click sound
2. Change phase pill - click sound
3. Open sidebar - click sound
4. Submit seal - click sound

**Chant Eruption Sound:**
1. Trigger chant eruption (both peers join)
2. Should hear ascending celebration tones + explosion
3. Sound should match visual eruption overlay

**Audio Fallback:**
1. Test in browser with autoplay blocked
2. Sounds should gracefully fail (no errors)
3. App should remain functional

---

### Test Responsive Design

**Desktop (1440px+):**
1. Verify max-width centering
2. All components should have breathing room
3. Waveform should be large and dominant

**Laptop (1024px-1439px):**
1. Layout should scale appropriately
2. Buttons remain comfortable to click
3. No horizontal scrolling

**Tablet (768px-1023px):**
1. Pulse grid becomes 2 columns
2. Chant grid becomes 2 columns
3. Touch targets are minimum 48px
4. Sidebars become full overlays

**Mobile (320px-767px):**
1. Everything stacks vertically
2. Waveform adjusts height (280-400px)
3. Buttons are large enough for thumbs (48px+)
4. Scoreboard remains readable
5. Forms are easy to fill on small screen
6. Sidebar triggers become full-width buttons

**Test Breakpoint Transitions:**
1. Slowly resize browser window
2. Layout should adapt smoothly at breakpoints
3. No awkward middle states
4. Text should remain readable at all sizes

---

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
cd apps/curvax
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
- Check terminal for `[curvax-worker]` error logs
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
- `apps/curvax/curvax-data/` for local storage files

---

**Enjoy the roar.** 🏟️

---

## Deployment Guide

### CURVAX Desktop App (Electron)

**The CURVAX app is a desktop application that runs locally** using Electron. It is NOT deployed to a web server. Users download and run it on their machine.

**Distribution Options:**

1. **Development Mode** (current):
   ```bash
   cd apps/curvax
   npm run dev
   ```
   - Runs Vite dev server + Electron
   - Hot reload for development
   - Not for end users

2. **Production Build** (for testing):
   ```bash
   cd apps/curvax
   npm run build    # Build React app to dist/
   npm start        # Run Electron with production bundle
   ```
   - Uses optimized production bundle
   - No dev server
   - Test before packaging

3. **Packaged Executable** (for distribution):
   To distribute to users, you need to package the Electron app into a native executable:

   **Recommended: electron-builder**
   ```bash
   npm install --save-dev electron-builder
   ```

   Add to `package.json`:
   ```json
   {
     "build": {
       "appId": "com.curvax.app",
       "productName": "CURVAX",
       "directories": {
         "output": "release"
       },
       "files": [
         "dist/**/*",
         "electron/**/*",
         "workers/**/*"
       ],
       "win": {
         "target": "nsis"
       },
       "mac": {
         "target": "dmg"
       },
       "linux": {
         "target": "AppImage"
       }
     }
   }
   ```

   Add script:
   ```json
   "scripts": {
     "package": "npm run build && electron-builder"
   }
   ```

   Package:
   ```bash
   npm run package
   ```

   Output: `release/` folder with installers for your platform

4. **Distribution Channels**:
   - GitHub Releases (upload installers)
   - Direct download from landing page
   - Microsoft Store (Windows)
   - Mac App Store (macOS, requires Apple Developer account)
   - Snapcraft (Linux)

**Important Notes:**
- CURVAX is P2P - no backend server to deploy
- Users connect directly via Hyperswarm DHT
- Each installation stores data locally in `curvax-data/`

---

### Landing Page (Next.js Static Site)

**The landing page IS deployed to the web** to promote and explain the app.

**Deployment to Vercel** (Recommended):

1. **Prerequisites**:
   - GitHub account with this repo pushed
   - Vercel account (free tier works)

2. **Vercel Dashboard**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/landing`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next` (auto-detected)
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every push to `main` branch auto-deploys
   - Pull requests get preview deployments
   - Custom domain: Add in Vercel project settings

4. **Alternative: Static Export**:
   Update `apps/landing/next.config.ts`:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true
     }
   }
   ```

   Build:
   ```bash
   cd apps/landing
   npm run build
   ```

   Deploy `out/` folder to:
   - Netlify
   - GitHub Pages
   - Cloudflare Pages
   - Any static host

5. **Environment Variables** (if needed):
   - Add in Vercel dashboard → Settings → Environment Variables
   - Example: `NEXT_PUBLIC_APP_DOWNLOAD_URL`

**Landing Page URL Example**:
- Vercel: `https://curvax.vercel.app`
- Custom: `https://curvax.football` (configure in Vercel)

**Content for Landing**:
- Hero: "Peer-to-peer matchday stands"
- Features: Pulse, Chants, Seals, Capsules
- Download button → GitHub Releases page
- Tech showcase: Hyperswarm, Hypercore, P2P

---

## Testing Checklist Summary

Before considering CURVA production-ready, verify:

### Core Functionality
- [ ] Two peers can discover and connect via room code
- [ ] Pulse events sync in real-time
- [ ] Energy meter updates on both instances
- [ ] Chants erupt when peers align
- [ ] Seals are immutable and persist
- [ ] Capsule key can be copied and is consistent
- [ ] Phase changes sync across peers

### UI/UX (Week 5 Polish)
- [ ] All sounds play correctly
- [ ] Haptic feedback works (on supported devices)
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Skip to main content link works
- [ ] Screen readers announce content
- [ ] Reduced motion is respected

### Performance
- [ ] Animations run at 60fps
- [ ] No frame drops during interactions
- [ ] Waveform runs smoothly for extended periods
- [ ] CPU/memory usage is reasonable
- [ ] App remains responsive under load

### Responsive
- [ ] Works on desktop (1440px+)
- [ ] Works on laptop (1024-1439px)
- [ ] Works on tablet (768-1023px)
- [ ] Works on mobile (320-767px)
- [ ] All touch targets minimum 48px on mobile

### Production Build
- [ ] `npm run build` succeeds without errors
- [ ] `npm start` runs production bundle
- [ ] All features work in production mode
- [ ] No dev warnings in console

### Cross-Platform
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux (optional)

### Edge Cases
- [ ] Peer disconnects gracefully
- [ ] Invalid room code shows error
- [ ] Expired chants are cleaned up
- [ ] Can't seal twice in same room
- [ ] Room isolation works correctly

---

## Where is Everything?

**Local Development**:
- CURVAX app: Runs at `http://localhost:5173` (Vite) → Electron window
- Landing: Runs at `http://localhost:3000` (Next.js dev server)

**Production**:
- CURVAX app: Packaged as native executable (Windows .exe, Mac .dmg, Linux AppImage)
- Landing: Deployed to Vercel at your custom domain

**Data Storage**:
- User data: `apps/curvax/curvax-data/identity/` (Hypercore)
- Match capsules: `apps/curvax/curvax-data/capsule-CV-XXXXXX/` (per room)
- Electron cache: OS-specific app data directory

**Network**:
- P2P connections: Hyperswarm DHT (public BitTorrent DHT nodes)
- No central server
- No telemetry or tracking

---

**Ready to roar?** Follow the guide above to test every aspect of CURVAX! 🏟️⚡
