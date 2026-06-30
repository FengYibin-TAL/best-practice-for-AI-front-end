import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 140
const DURATION_MS = 2000
const COLORS = ['#fbbf24','#f87171','#34d399','#60a5fa','#a78bfa','#f472b6']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  angle: number
  spin: number
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
    }))

    const start = performance.now()
    let rafId: number

    const draw = (now: number) => {
      const elapsed = now - start
      if (elapsed > DURATION_MS) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const opacity = Math.max(0, 1 - elapsed / DURATION_MS)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08  // gravity
        p.angle += p.spin

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
