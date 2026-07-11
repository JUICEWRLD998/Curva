let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return ctx
}

/** Short stadium-like hit for reactions / eruptions */
export function playHit(kind: 'soft' | 'hard' = 'soft') {
  try {
    const audio = getCtx()
    const o = audio.createOscillator()
    const g = audio.createGain()
    o.type = kind === 'hard' ? 'sawtooth' : 'triangle'
    o.frequency.value = kind === 'hard' ? 140 : 190
    g.gain.value = 0.0001
    o.connect(g)
    g.connect(audio.destination)
    const t = audio.currentTime
    g.gain.exponentialRampToValueAtTime(kind === 'hard' ? 0.09 : 0.06, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
    o.frequency.exponentialRampToValueAtTime(70, t + 0.28)
    o.start(t)
    o.stop(t + 0.35)
  } catch {
    // ignore autoplay restrictions
  }
}
