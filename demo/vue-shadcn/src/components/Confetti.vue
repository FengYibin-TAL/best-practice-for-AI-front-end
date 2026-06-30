<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{ run: number }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0

watch(() => props.run, (val) => {
  if (val === 0) return
  const canvas = canvasRef.value!
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
  cancelAnimationFrame(raf)
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
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none" style="z-index: 60" />
</template>
