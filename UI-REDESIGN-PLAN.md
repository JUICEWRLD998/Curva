# CURVA — UI/UX Redesign Plan
**Version 2.0 Design System & Experience Overhaul**

## Executive Summary

After experiencing the current MVP, we need to elevate CURVA from functional to **visceral**. The current UI is serviceable but doesn't match the raw energy of a stadium curva. We're building a P2P matchday experience — it should feel like being in the stands, not a Zoom call.

---

## Current State Analysis (What Works / What Doesn't)

### ✅ What Works
- **Dark stadium aesthetic** — pitch green night concept is solid
- **Glass morphism** — backdrop blur + subtle borders feel premium
- **Condensed type hierarchy** — scoreboard energy is right
- **Gradient gold/mint accents** — brand colors feel energetic
- **Functional layout** — Information architecture is logical

### ❌ Critical Issues

#### 1. **Visual Hierarchy is Weak**
- Everything feels the same weight
- No clear focal point on the Stand view
- Actions (GOAL, ROAR) don't command attention
- Sidebar panels compete with the main action

#### 2. **Lacks Emotional Impact**
- Buttons feel corporate, not stadium
- No sense of **scale** or **drama**
- Pulse reactions are small text chips — should be BIG, visceral
- Chant eruption is a green rectangle — should EXPLODE

#### 3. **Interaction Feedback is Minimal**
- Button presses feel flat
- No haptic/visual response to pulse events
- Energy bar is passive — should PULSE
- No celebration when peers join

#### 4. **Spatial Density Issues**
- **Stand view**: Cramped 3-column layout feels claustrophobic
- **Lobby**: Hero text vs forms compete for attention
- Waveform canvas is tiny (120px) — should be MASSIVE
- Scoreboard is small — this is the match, make it HUGE

#### 5. **Motion Design is Missing**
- No entrance animations
- No anticipation/easing on interactions
- Chant circles don't build tension
- Pulse feed just... appears

---

## Design Principles (2.0)

### 1. **Stadium-First Mentality**
> "If a real curva saw this screen, would they recognize it as their home?"

- **Scale matters**: Actions should feel monumental
- **Sound + Motion**: Every interaction has weight
- **Crowd dynamics**: Visualize collective energy, not individuals
- **Theatrical lighting**: Spotlights, floodlights, shadow play

### 2. **Hierarchy of Energy**
```
MAIN ACTION (Pulse buttons, Scoreboard) > Live crowd state > Background info
```

### 3. **Progressive Disclosure**
- **Lobby**: Inspire → Guide → Act
- **Stand**: Spectate → React → Coordinate

### 4. **Emotional Feedback Loops**
- Button press → Haptic → Visual burst → Peer response → Collective reaction
- Every action creates **ripples** across the network

---

## Redesign Roadmap

---

## Phase 1: Visual Foundation (Core Improvements)

### 1.1 Color System Refinement

**Current**: RGB values scattered across CSS  
**New**: Semantic + contextual tokens

```css
/* Semantic Tokens */
--energy-low: #3dff9a (mint)
--energy-mid: #f5c518 (gold)  
--energy-high: #ff5d6c (rose)

/* Contextual States */
--action-idle: rgba(245, 197, 24, 0.14)
--action-hover: rgba(245, 197, 24, 0.32)
--action-active: radial-gradient(circle, gold, mint)
--action-pressed: glow + scale

/* Depth Layers */
--layer-pitch: #030705 (deepest)
--layer-stand: rgba(10, 28, 20, 0.72) (mid)
--layer-floodlight: rgba(245, 197, 24, 0.08) (atmospheric)
--layer-spotlight: rgba(255, 255, 255, 0.95) (highlight)
```

### 1.2 Typography System

**Current**: Mix of Syne, Barlow Condensed, IBM Plex  
**Refined**: Clear hierarchy

```
DISPLAY (Scoreboard, Hero): Syne 900 — massive, dramatic
DATA (Stats, Counters): Barlow Condensed 700 — compact, readable  
UI (Labels, Buttons): Inter Variable 500-700 — clean, modern
BODY (Descriptions): Inter Variable 400 — legible, warm
```

**Scales**:
- Hero: 64-96px (responsive)
- Scoreboard: 48-72px
- Section Headers: 24-32px
- Actions: 18-24px (all caps, tracked)
- Body: 14-16px
- Meta: 11-13px

### 1.3 Spacing & Layout Grid

**Current**: Arbitrary padding (12px, 14px, 18px, 22px)  
**New**: 8px base unit system

```
4px  - micro (icon spacing)
8px  - tight (inline gaps)
12px - compact (form fields)
16px - base (card padding)
24px - comfortable (section spacing)
32px - loose (major divisions)
48px - dramatic (hero spacing)
64px - stadium (screen sections)
```

---

## Phase 2: Layout Restructuring

### 2.1 Lobby Redesign

**Current Layout**:
```
[      Hero Text      ] [ Forms ]
```

**New Layout**:
```
┌──────────────────────────────────────┐
│  Full-width Hero (centered, scaled) │
├──────────────────────────────────────┤
│  [Profile] [Create Room] [Join Room]│  ← Horizontal cards
└──────────────────────────────────────┘
```

**Changes**:
- **Hero**: Center-aligned, bigger type (96px), single column
- **Forms**: Horizontal flow cards instead of vertical stack
- **Pitch visualization**: BIGGER — 400px height, animated field lines
- **Feature grid**: Remove — fold into single tagline
- **CTA hierarchy**: Create > Join > Profile (visual weight)

### 2.2 Stand Redesign

**Current Layout** (cramped 3-col):
```
[ Peers ] [  Main  ] [ Seals ]
```

**New Layout** (centered main, floating sides):
```
┌────────────────────────────────────────┐
│         Scoreboard (HUGE)              │
├────────────────────────────────────────┤
│  ┌───────────────────────────────┐    │
│  │   PULSE WAVEFORM (500px)      │    │
│  ├───────────────────────────────┤    │
│  │  [GOAL][SAVE][FOUL][CARD]     │    │  ← Main action
│  │       [★ ROAR ★]              │    │
│  ├───────────────────────────────┤    │
│  │   Chant Grid (3x2)            │    │
│  └───────────────────────────────┘    │
│                                        │
│  Floating Sidebar Toggles:            │
│  [👥 2]  [🔒 Seals]  [📦 Capsule]     │
└────────────────────────────────────────┘
```

**Changes**:
- **Scoreboard**: 72px type, full-width, gradient bg
- **Waveform**: 500px tall — DOMINATES the screen
- **Action buttons**: Larger (120px wide), icon + label
- **Sidebars**: Collapsible overlays (not always visible)
- **Energy meter**: Circular gauge around ROAR button
- **Pulse feed**: Floating toast-style events (top-right)

---

## Phase 3: Component Redesign

### 3.1 Action Buttons (Pulse Reactions)

**Current**: Small rectangles with text  
**New**: Stadium button system

```tsx
<PulseButton>
  ┌─────────────────┐
  │   🥅 GOAL       │  ← Icon + Label
  │   ▓▓▓▓▓ 100%    │  ← Energy cost bar
  └─────────────────┘
  
  States:
  - Idle: Subtle pulse animation
  - Hover: Glow expands, lift 4px
  - Press: Scale to 0.94, chromatic aberration flash
  - Cooldown: Dim + progress ring
</PulseButton>
```

**Styling**:
```css
.pulse-btn {
  width: 140px;
  height: 140px;
  border-radius: 24px;
  border: 2px solid var(--line-strong);
  background: 
    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent),
    linear-gradient(165deg, var(--glass), var(--pitch-700));
  box-shadow: 
    0 8px 24px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.1);
  
  /* Hover */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 16px 48px var(--action-hover),
      0 0 60px rgba(245, 197, 24, 0.3);
  }
  
  /* Active */
  &:active {
    transform: scale(0.94);
    animation: chromatic-flash 0.15s;
  }
}

@keyframes chromatic-flash {
  0%, 100% { filter: none; }
  50% { filter: 
    drop-shadow(2px 0 0 #ff0000)
    drop-shadow(-2px 0 0 #00ffff); 
  }
}
```

**Special: ROAR Button**

```tsx
<RoarButton>
  ┌──────────────────────┐
  │                      │
  │    ⚡ ROAR ⚡         │  ← 200px diameter circle
  │                      │
  │   [circular gauge]   │  ← Energy ring
  └──────────────────────┘
  
  - 2x larger than others
  - Circular with rotating energy ring
  - Gold → Mint gradient on press
  - Screen shake on tap
</RoarButton>
```

### 3.2 Waveform Visualization

**Current**: 120px canvas, basic line  
**New**: 500px tall, multi-layer visualization

**Layers**:
1. **Background grid**: Animated stadium field lines
2. **Historical wave**: Faint mint trail (last 60s)
3. **Live wave**: Bold gold oscillating line (real-time)
4. **Peak markers**: Pulse events as vertical spikes
5. **Crowd indicator**: Silhouette shadows at bottom

**Animations**:
- **Idle**: Gentle ambient pulse (0.5 amplitude)
- **Goal event**: SPIKE to 100%, shake, decay over 3s
- **Chant eruption**: Synchronized waves across all peers

### 3.3 Chant Circles

**Current**: 3-col grid, basic buttons  
**New**: Dynamic tension system

```tsx
<ChantCard state={live ? 'active' : 'idle'}>
  ┌───────────────────────┐
  │  OLÉ OLÉ             │
  │  ●●●○○○  3/6         │  ← Progress dots
  │  [────45s────]        │  ← Countdown timer
  └───────────────────────┘
  
  States:
  - Idle: Dim, subtle pulse
  - Active (you): Gold glow + border
  - Building: Peers joining → dots fill → tension rises
  - Eruption: Flash to full mint, confetti burst
</ChantCard>
```

**Eruption Celebration**:
```css
.eruption-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, rgba(61,255,154,0.4), transparent);
  animation: erupt 2s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

@keyframes erupt {
  0% { opacity: 0; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.4); }
}
```

### 3.4 Scoreboard

**Current**: Small, inline text  
**New**: Stadium display panel

```tsx
<Scoreboard>
  ┌──────────────────────────────────────┐
  │  BRAZIL        3:2        GERMANY    │  ← 72px condensed
  │  ████████████   ·   ███████████      │  ← Possession bars
  │  [PREMATCH] [LIVE] [FULLTIME]        │  ← Phase selector
  └──────────────────────────────────────┘
  
  - Full-width glass panel
  - Team names: All-caps, wide-tracked
  - Scores: Glowing gold numerals
  - Live indicator: Pulsing dot
</Scoreboard>
```

### 3.5 Peer List & Sidebars

**Current**: Always-visible 230px sidebar  
**New**: Floating overlay panels

```tsx
<FloatingPanel trigger="👥 2">
  [Slide in from left]
  ┌──────────────────────┐
  │  In the Stand        │
  │  ────────────────    │
  │  🟡 You              │
  │  🔵 Fan-A3F2         │
  │  🟢 Diego            │
  └──────────────────────┘
</FloatingPanel>

<FloatingPanel trigger="🔒 Seals">
  [Slide in from right]
  ┌──────────────────────┐
  │  Prediction Seals    │
  │  ────────────────    │
  │  [Seal form]         │
  │  [Sealed list]       │
  └──────────────────────┘
</FloatingPanel>
```

**Benefits**:
- **More screen space** for main action
- **On-demand** information (toggle open/close)
- **Mobile-friendly** (no cramped 3-col)

---

## Phase 4: Motion & Interaction Design

### 4.1 Micro-interactions

| Interaction | Before | After |
|-------------|--------|-------|
| Button hover | Slight shadow | Lift 4px + glow + scale 1.02 |
| Button press | Scale 0.98 | Scale 0.94 + chromatic flash + haptic |
| Pulse sent | Toast appears | Screen pulse + sound + peer ripple |
| Peer joins | Name added to list | Celebration toast + confetti |
| Chant eruption | Green box | Full-screen flash + screen shake |
| Energy change | Bar width transition | Ring pulse + color shift |

### 4.2 Entrance Animations

**Lobby Load**:
```
1. Fade in background (0.3s)
2. Hero text slides up (0.5s, elastic)
3. Cards cascade in (0.1s stagger)
```

**Stand Load**:
```
1. Scoreboard drops down (0.4s, bounce)
2. Waveform draws in (0.6s, elastic)
3. Action buttons pop in (0.1s stagger, scale)
4. Sidebars slide in (0.5s, smooth)
```

### 4.3 Real-time Feedback

**When YOU send a pulse**:
```
1. Button: chromatic flash + scale
2. Waveform: immediate spike
3. Screen: subtle shake (2px, 0.1s)
4. Sound: stadium roar sample
5. Toast: "You fired GOAL" (2s)
```

**When PEER sends a pulse**:
```
1. Waveform: spike with peer color
2. Peer avatar: brief glow
3. Toast: "Diego fired SAVE" (top-right, 3s)
4. Energy meter: smooth increment
```

---

## Phase 5: Responsive & Accessibility

### 5.1 Breakpoints

```css
--mobile: 320-767px    → Single column, floating buttons
--tablet: 768-1023px   → 2-column Stand, larger touch targets
--desktop: 1024-1439px → Optimal 3-column (if sidebars open)
--xl: 1440px+          → Max-width 1600px, centered
```

### 5.2 Mobile Optimizations

- **Lobby**: Stack all forms vertically
- **Stand**: Full-screen waveform, bottom action bar
- **Buttons**: Min 48px touch targets
- **Sidebars**: Full-screen overlays (drawer pattern)
- **Scoreboard**: Collapsible to show just scores

### 5.3 Accessibility

- **Keyboard nav**: Tab order, Enter/Space activation
- **Screen readers**: Aria labels on all interactions
- **Reduced motion**: Disable animations if `prefers-reduced-motion`
- **Color contrast**: WCAG AA compliance (4.5:1 minimum)
- **Focus indicators**: 2px gold outline on all focusable elements

---

## Phase 6: Animation Specs (Framer Motion)

### 6.1 Spring Configs

```tsx
const springConfigs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  snappy: { type: 'spring', stiffness: 300, damping: 20 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
}
```

### 6.2 Key Animations

**Button Press**:
```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.94 }}
  transition={springConfigs.snappy}
/>
```

**Pulse Event**:
```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 1.2, opacity: 0 }}
  transition={springConfigs.bouncy}
/>
```

**Eruption Flash**:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1.2 }}
  exit={{ opacity: 0, scale: 1.4 }}
  transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
/>
```

---

## Implementation Phases

### Week 1: Foundation
- [ ] Refactor color tokens (CSS variables)
- [ ] Typography system (Inter Variable + Syne)
- [ ] Spacing utilities (8px grid)
- [ ] Component structure (separate Pulse, Chant, etc.)

### Week 2: Layout
- [ ] Lobby horizontal cards
- [ ] Stand centered main + floating sides
- [ ] Scoreboard full-width redesign
- [ ] Responsive breakpoints

### Week 3: Components
- [ ] Pulse buttons (icons, animations)
- [ ] ROAR button (circular, gauge)
- [ ] Chant cards (progress, timer)
- [ ] Waveform visualization upgrade

### Week 4: Motion
- [ ] Framer Motion setup
- [ ] Entrance animations
- [ ] Micro-interactions
- [ ] Eruption celebration

### Week 5: Polish
- [ ] Sound effects integration
- [ ] Haptic feedback (if available)
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Success Metrics

**Qualitative**:
- ✅ First reaction: "Whoa, this feels like a stadium"
- ✅ Pulse button press feels **satisfying**
- ✅ Chant eruption is **explosive**
- ✅ Scoreboard commands **attention**

**Quantitative**:
- ✅ Interaction time: <100ms perceived latency
- ✅ Animation FPS: Consistent 60fps
- ✅ Accessibility: WCAG AA compliant
- ✅ Mobile: All interactions 48px+ touch targets

---

## Design References

### Visual Inspiration
- **EA FC 25 UI**: Bold type, stadium atmosphere, data viz
- **Sorare**: Card design, premium glassmorphism
- **Formula 1 Live Timing**: Real-time data, tension building
- **Apple Watch Activity Rings**: Circular progress, celebration

### Motion Inspiration
- **Stripe Homepage**: Smooth, purposeful motion
- **Linear App**: Snappy micro-interactions
- **Figma Multiplayer**: Peer presence indicators
- **Discord**: Notification toasts, member joins

---

## Open Questions for Review

1. **Waveform Height**: 400px or 500px? (mobile constraint)
2. **Sidebar Strategy**: Always floating, or toggle between docked/floating?
3. **Sound Effects**: Real stadium samples or synthetic FX?
4. **ROAR Button Placement**: Center (hero) or inline with others?
5. **Chant Countdown**: Always visible or only when active?
6. **Dark Mode Only?**: Or add light stadium mode (noon match)?

---

## Next Steps

1. **Review this plan** with stakeholders (you!)
2. **Prioritize features** (MVP vs nice-to-have)
3. **Create design mockups** (Figma/Sketch)
4. **Build component library** (Storybook)
5. **Implement iteratively** (feature branch per phase)

---

**Let's make CURVA feel like THE STANDS.** 🏟️⚡

