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
    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
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
    // Horizontal lines
    ctx.strokeStyle = 'rgba(142,164,151,0.08)'
    ctx.lineWidth = 1
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Vertical lines
    ctx.strokeStyle = 'rgba(142,164,151,0.06)'
    for (let i = 1; i < 8; i++) {
      const x = (w / 8) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    // Center line (50% energy)
    ctx.strokeStyle = 'rgba(245,197,24,0.15)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(0, h * 0.5)
    ctx.lineTo(w, h * 0.5)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawHistoricalTrail = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const pts = historyRef.current
    
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * w
      const y = h * 0.75 - pts[i] * (h * 0.65)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = 'rgba(142,164,151,0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  const drawLiveWave = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const pts = waveRef.current
    
    // Decay slightly each frame for natural feel
    for (let i = 0; i < pts.length; i++) pts[i] *= 0.992

    // Draw wave line with glow
    ctx.shadowBlur = 12
    ctx.shadowColor = '#f5c518'
    
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * w
      const y = h * 0.75 - pts[i] * (h * 0.65)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    
    // Dynamic color based on average energy
    const avgEnergy = pts.reduce((a, b) => a + b, 0) / pts.length
    let strokeColor = '#3dff9a' // mint (low)
    if (avgEnergy > 0.6) strokeColor = '#ff5d6c' // rose (high)
    else if (avgEnergy > 0.3) strokeColor = '#f5c518' // gold (medium)
    
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.shadowBlur = 0

    // Fill gradient
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    
    if (avgEnergy > 0.6) {
      grad.addColorStop(0, 'rgba(255,93,108,0.35)')
      grad.addColorStop(0.5, 'rgba(245,197,24,0.15)')
      grad.addColorStop(1, 'rgba(61,255,154,0.05)')
    } else if (avgEnergy > 0.3) {
      grad.addColorStop(0, 'rgba(245,197,24,0.32)')
      grad.addColorStop(0.5, 'rgba(61,255,154,0.12)')
      grad.addColorStop(1, 'rgba(245,197,24,0.03)')
    } else {
      grad.addColorStop(0, 'rgba(61,255,154,0.28)')
      grad.addColorStop(0.6, 'rgba(245,197,24,0.08)')
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
      
      // Draw marker circle
      ctx.fillStyle = `rgba(255,93,108,${opacity * 0.8})`
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw vertical line
      ctx.strokeStyle = `rgba(255,93,108,${opacity * 0.3})`
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, h)
      ctx.stroke()
      ctx.setLineDash([])
    })
  }

  return <canvas ref={canvasRef} className="wave" aria-label="Energy waveform visualization" />
}
