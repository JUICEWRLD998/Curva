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

/** GOAL - Explosive celebration sound with crowd roar simulation */
export function playGoal() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    
    // Layer 1: Deep impact bass
    const bass = audio.createOscillator()
    const bassGain = audio.createGain()
    bass.type = 'sine'
    bass.frequency.value = 80
    bassGain.gain.setValueAtTime(0.15, t)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
    bass.connect(bassGain)
    bassGain.connect(audio.destination)
    bass.start(t)
    bass.stop(t + 0.6)
    
    // Layer 2: Bright explosion
    const explosion = audio.createOscillator()
    const expGain = audio.createGain()
    explosion.type = 'sawtooth'
    explosion.frequency.setValueAtTime(800, t)
    explosion.frequency.exponentialRampToValueAtTime(100, t + 0.3)
    expGain.gain.setValueAtTime(0.12, t)
    expGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    explosion.connect(expGain)
    expGain.connect(audio.destination)
    explosion.start(t)
    explosion.stop(t + 0.4)
    
    // Layer 3: Crowd roar (noise burst)
    const bufferSize = audio.sampleRate * 1.2
    const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audio.sampleRate * 0.4))
    }
    const noise = audio.createBufferSource()
    const noiseFilter = audio.createBiquadFilter()
    const noiseGain = audio.createGain()
    noise.buffer = buffer
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 600
    noiseFilter.Q.value = 2
    noiseGain.gain.setValueAtTime(0.08, t)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(audio.destination)
    noise.start(t)
  } catch {
    // Fallback to basic sound
    playHit('hard')
  }
}

/** SAVE - Quick whistle-like swoosh */
export function playSave() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    
    // Swoosh upward pitch
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, t)
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.15)
    gain.gain.setValueAtTime(0.08, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.2)
  } catch {
    playHit('soft')
  }
}

/** FOUL/CARD - Warning whistle */
export function playFoul() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    
    // Sharp whistle blasts
    for (let i = 0; i < 2; i++) {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = 'sine'
      osc.frequency.value = 1200
      const startTime = t + i * 0.12
      gain.gain.setValueAtTime(0.06, startTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08)
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.08)
    }
  } catch {
    playHit('soft')
  }
}

/** ROAR - Massive crowd explosion with rumble */
export function playRoar() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    
    // Deep rumble bass
    const rumble = audio.createOscillator()
    const rumbleGain = audio.createGain()
    rumble.type = 'sawtooth'
    rumble.frequency.setValueAtTime(60, t)
    rumble.frequency.exponentialRampToValueAtTime(40, t + 0.8)
    rumbleGain.gain.setValueAtTime(0.12, t)
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
    rumble.connect(rumbleGain)
    rumbleGain.connect(audio.destination)
    rumble.start(t)
    rumble.stop(t + 0.8)
    
    // Metallic ring
    const ring = audio.createOscillator()
    const ringGain = audio.createGain()
    ring.type = 'triangle'
    ring.frequency.setValueAtTime(300, t)
    ring.frequency.exponentialRampToValueAtTime(150, t + 0.5)
    ringGain.gain.setValueAtTime(0.08, t)
    ringGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
    ring.connect(ringGain)
    ringGain.connect(audio.destination)
    ring.start(t)
    ring.stop(t + 0.6)
    
    // Massive noise burst (crowd simulation)
    const bufferSize = audio.sampleRate * 1.5
    const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audio.sampleRate * 0.5))
    }
    const noise = audio.createBufferSource()
    const noiseFilter = audio.createBiquadFilter()
    const noiseGain = audio.createGain()
    noise.buffer = buffer
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 800
    noiseGain.gain.setValueAtTime(0.14, t)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(audio.destination)
    noise.start(t)
  } catch {
    playHit('hard')
  }
}

/** CHANT ERUPTION - Celebratory burst with ascending tones */
export function playEruption() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    
    // Ascending celebration tones
    const frequencies = [200, 250, 300, 400, 500]
    frequencies.forEach((freq, i) => {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const startTime = t + i * 0.08
      gain.gain.setValueAtTime(0.06, startTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3)
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
    
    // Final explosion
    const explosion = audio.createOscillator()
    const expGain = audio.createGain()
    explosion.type = 'sawtooth'
    explosion.frequency.setValueAtTime(600, t + 0.4)
    explosion.frequency.exponentialRampToValueAtTime(120, t + 0.7)
    expGain.gain.setValueAtTime(0.1, t + 0.4)
    expGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
    explosion.connect(expGain)
    expGain.connect(audio.destination)
    explosion.start(t + 0.4)
    explosion.stop(t + 0.8)
  } catch {
    playHit('hard')
  }
}

/** UI Click - Subtle confirmation */
export function playClick() {
  try {
    const audio = getCtx()
    const t = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.value = 800
    gain.gain.setValueAtTime(0.03, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.05)
  } catch {
    // Silent fail
  }
}
