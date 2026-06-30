import { useEffect, useRef } from 'react'

export default function Confetti({ run }: { run: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (run === 0) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const W = (canvas.width = window.innerWidth)
    const H = (canvas.height = window.innerHeight)
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const parts = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.3,
    }))
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
      if (t - t0 < 2000) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, H)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run])
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-[60]" />
}
