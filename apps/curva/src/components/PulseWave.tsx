import { useEffect, useRef } from 'react'

interface Props {
  energy: number
  bump?: number
}

export function PulseWave({ energy, bump = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveRef = useRef<number[]>(new Array(72).fill(0.05))

  useEffect(() => {
    const e = Math.min(1, energy / 100)
    waveRef.current.push(e * 0.85 + Math.random() * 0.1 + bump * 0.15)
    if (waveRef.current.length > 72) waveRef.current.shift()
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

      // pitch grid
      ctx.strokeStyle = 'rgba(142,164,151,0.12)'
      ctx.lineWidth = 1
      for (let i = 1; i < 4; i++) {
        const y = (h / 4) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const pts = waveRef.current
      // decay slightly each frame for life
      for (let i = 0; i < pts.length; i++) pts[i] *= 0.992

      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        const x = (i / (pts.length - 1)) * w
        const y = h * 0.72 - pts[i] * (h * 0.58)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#f5c518'
      ctx.lineWidth = 2.4
      ctx.stroke()

      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(245,197,24,0.28)')
      grad.addColorStop(0.55, 'rgba(61,255,154,0.08)')
      grad.addColorStop(1, 'rgba(245,197,24,0)')
      ctx.fillStyle = grad
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="wave" />
}
