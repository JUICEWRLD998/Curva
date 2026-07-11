import { useEffect, useRef, useState } from 'react'

interface Props {
  energy: number
  bump?: number
}

interface PeakMarker {
  id: number
  value: number
  time: number
  x: number
}

export function PulseWave({ energy, bump = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveRef = useRef<number[]>(new Array(120).fill(0.05))
  const historyRef = useRef<number[]>(new Array(120).fill(0.05))
  const peaksRef = useRef<PeakMarker[]>([])
  const [peaks, setPeaks] = useState<PeakMarker[]>([])

  useEffect(() => {
    const e = Math.min(1, energy / 100)
    const newValue = e * 0.85 + Math.random() * 0.1 + bump * 0.15
    
    waveRef.current.push(newValue)
    if (waveRef.current.length > 120) {
      const oldest = waveRef.current.shift()
      historyRef.current.push(oldest || 0.05)
      if (historyRef.current.length > 120) historyRef.current.shift()
    }

    // Detect peaks (values above 0.7)
    if (newValue > 0.7) {
      const newPeak: PeakMarker = {
        id: Date.now(),
        value: newValue,
        time: Date.now(),
        x: 1
      }
      peaksRef.current.push(newPeak)
      setPeaks([...peaksRef.current])
    }

    // Remove old peaks (older than 10 seconds)
    const now = Date.now()
    peaksRef.current = peaksRef.current.filter(p => now - p.time < 10000)
  }, [energy, bump])

  useEffect(() => {
    let raf = 0
    let lastTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS
    
    const draw = (currentTime: number) => {
      // Throttle to target FPS for consistent performance
      const elapsed = currentTime - lastTime
      
      if (elapsed < frameInterval) {
        raf = requestAnimationFrame(draw)
        return
      }
      
      lastTime = currentTime - (elapsed % frameInterval)
      
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { 
        alpha: false, // Optimization: no alpha channel needed
        desynchronized: true // Optimization: allow desync for better performance
      })
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Layer 1: Grid Background
      drawGrid(ctx, w, h)

      // Layer 2: Historical Trail (faded)
      drawHistoricalTrail(ctx, w, h)

      // Layer 3: Live Waveform
      drawLiveWave(ctx, w, h)

      // Layer 4: Peak Markers
      drawPeakMarkers(ctx, w, h)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [peaks])

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Animated field lines (horizontal)
    const time = Date.now() / 2000 // Slower animation
    const offset = (time % 1) * 20
    
    ctx.strokeStyle = 'rgba(142,164,151,0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      const y = (h / 6) * i + offset
      const alpha = Math.sin(time + i * 0.5) * 0.05 + 0.08
      ctx.strokeStyle = `rgba(142,164,151,${alpha})`
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Vertical lines (stadium pillars)
    for (let i = 1; i < 10; i++) {
      const x = (w / 10) * i
      const alpha = 0.06 + Math.sin(time * 0.5 + i * 0.3) * 0.02
      ctx.strokeStyle = `rgba(142,164,151,${alpha})`
      ctx.lineWidth = i % 2 === 0 ? 1.5 : 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    // Center circle (like center field)
    ctx.strokeStyle = 'rgba(245,197,24,0.12)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.75, h * 0.15, 0, Math.PI * 2)
    ctx.stroke()

    // 50% energy reference line
    ctx.strokeStyle = 'rgba(245,197,24,0.18)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(0, h * 0.5)
    ctx.lineTo(w, h * 0.5)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Crowd silhouettes at bottom
    drawCrowdSilhouettes(ctx, w, h)
  }

  const drawCrowdSilhouettes = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const crowdY = h * 0.88
    const crowdHeight = h * 0.12
    const time = Date.now() / 3000
    
    // Background crowd shadows
    for (let i = 0; i < 30; i++) {
      const x = (i / 29) * w
      const heightVariation = Math.sin(time + i * 0.5) * 0.3 + 0.7
      const fanHeight = crowdHeight * heightVariation
      const alpha = 0.08 + Math.sin(time + i) * 0.02
      
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
      ctx.fillRect(x - 3, crowdY + (crowdHeight - fanHeight), 6, fanHeight)
    }
  }

  const drawHistoricalTrail = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const pts = historyRef.current
    
    // Draw historical trail with gradient
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * w
      const y = h * 0.75 - pts[i] * (h * 0.65)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    
    // Faint mint trail
    ctx.strokeStyle = 'rgba(61,255,154,0.35)'
    ctx.lineWidth = 2
    ctx.shadowBlur = 8
    ctx.shadowColor = 'rgba(61,255,154,0.3)'
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  const drawLiveWave = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const pts = waveRef.current
    
    // Decay slightly each frame for natural feel
    for (let i = 0; i < pts.length; i++) pts[i] *= 0.992

    // Dynamic color based on average energy
    const avgEnergy = pts.reduce((a, b) => a + b, 0) / pts.length
    let strokeColor = '#3dff9a' // mint (low)
    let glowColor = 'rgba(61,255,154,0.6)'
    if (avgEnergy > 0.6) {
      strokeColor = '#ff5d6c' // rose (high)
      glowColor = 'rgba(255,93,108,0.6)'
    } else if (avgEnergy > 0.3) {
      strokeColor = '#f5c518' // gold (medium)
      glowColor = 'rgba(245,197,24,0.6)'
    }
    
    // Draw wave line with BOLD dramatic glow
    ctx.shadowBlur = 20
    ctx.shadowColor = glowColor
    
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * w
      const y = h * 0.75 - pts[i] * (h * 0.65)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 4 // Bolder line
    ctx.stroke()
    
    // Second glow layer for extra intensity
    ctx.shadowBlur = 40
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.shadowBlur = 0

    // Fill gradient under wave
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    
    if (avgEnergy > 0.6) {
      grad.addColorStop(0, 'rgba(255,93,108,0.4)')
      grad.addColorStop(0.4, 'rgba(245,197,24,0.2)')
      grad.addColorStop(1, 'rgba(61,255,154,0.05)')
    } else if (avgEnergy > 0.3) {
      grad.addColorStop(0, 'rgba(245,197,24,0.38)')
      grad.addColorStop(0.5, 'rgba(61,255,154,0.15)')
      grad.addColorStop(1, 'rgba(245,197,24,0.03)')
    } else {
      grad.addColorStop(0, 'rgba(61,255,154,0.35)')
      grad.addColorStop(0.6, 'rgba(245,197,24,0.1)')
      grad.addColorStop(1, 'rgba(61,255,154,0.02)')
    }
    
    ctx.fillStyle = grad
    ctx.fill()
  }

  const drawPeakMarkers = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const now = Date.now()
    
    peaksRef.current.forEach((peak) => {
      const age = now - peak.time
      const opacity = Math.max(0, 1 - age / 10000) // Fade over 10s
      
      // Update x position (move left as new data comes in)
      peak.x = Math.max(0, peak.x - 1 / 120)
      
      const x = peak.x * w
      const y = h * 0.75 - peak.value * (h * 0.65)
      
      // Draw glowing marker circle
      ctx.shadowBlur = 15
      ctx.shadowColor = `rgba(255,93,108,${opacity * 0.8})`
      ctx.fillStyle = `rgba(255,93,108,${opacity * 0.9})`
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Draw pulsing ring around marker
      const pulseSize = 6 + Math.sin(now / 200 + peak.id) * 2
      ctx.strokeStyle = `rgba(255,93,108,${opacity * 0.4})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
      ctx.stroke()
      
      // Draw vertical spike line
      ctx.strokeStyle = `rgba(255,93,108,${opacity * 0.4})`
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, h * 0.88) // Stop at crowd level
      ctx.stroke()
      ctx.setLineDash([])
      
      // Draw impact burst at top
      const burstRadius = 12 * opacity
      ctx.strokeStyle = `rgba(255,93,108,${opacity * 0.3})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, burstRadius, 0, Math.PI * 2)
      ctx.stroke()
    })
  }

  return <canvas ref={canvasRef} className="wave" aria-label="Energy waveform visualization" />
}
