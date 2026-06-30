<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Piece { id: string; emoji: string; slotId: string }
interface Slot { id: string; x: number; y: number; w: number; h: number }
interface Pos { x: number; y: number }

const props = defineProps<{ pieces: Piece[]; slots: Slot[] }>()
const emit = defineEmits<{ complete: [] }>()

const boxRef = ref<HTMLDivElement | null>(null)
let rafId = 0

const initPos = (i: number): Pos => ({ x: 15 + i * (70 / Math.max(1, props.pieces.length - 1)), y: 82 })

const positions = ref<Record<string, Pos>>(
  Object.fromEntries(props.pieces.map((p, i) => [p.id, initPos(i)]))
)
const placed = ref(new Set<string>())
const dragId = ref<string | null>(null)
const dragOffset = ref<Pos>({ x: 0, y: 0 })

onUnmounted(() => cancelAnimationFrame(rafId))

function toPct(cx: number, cy: number): Pos {
  const r = boxRef.value!.getBoundingClientRect()
  return { x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.height) * 100 }
}

function slotOf(pid: string): Slot {
  const piece = props.pieces.find((p) => p.id === pid)!
  return props.slots.find((s) => s.id === piece.slotId)!
}

function onDown(e: PointerEvent, pid: string) {
  if (placed.value.has(pid)) return
  e.preventDefault()
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  const cur = positions.value[pid]
  const p = toPct(e.clientX, e.clientY)
  dragOffset.value = { x: p.x - cur.x, y: p.y - cur.y }
  dragId.value = pid
}

function onMove(e: PointerEvent) {
  if (!dragId.value) return
  const p = toPct(e.clientX, e.clientY)
  const off = dragOffset.value
  positions.value = { ...positions.value, [dragId.value]: { x: p.x - off.x, y: p.y - off.y } }
}

function onUp() {
  if (!dragId.value) return
  const pid = dragId.value
  dragId.value = null
  const cur = positions.value[pid]
  const slot = slotOf(pid)
  const inSlot = cur.x >= slot.x && cur.x <= slot.x + slot.w && cur.y >= slot.y && cur.y <= slot.y + slot.h
  const occupied = [...placed.value].some((id) => slotOf(id).id === slot.id)
  if (inSlot && !occupied) {
    positions.value = { ...positions.value, [pid]: { x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 } }
    placed.value = new Set(placed.value).add(pid)
    if (placed.value.size === props.pieces.length) emit('complete')
  } else {
    const start = { ...positions.value[pid] }
    const target = initPos(props.pieces.findIndex((p) => p.id === pid))
    const t0 = performance.now()
    const dur = 300
    const animate = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      const e2 = 1 - Math.pow(1 - k, 3)
      positions.value = { ...positions.value, [pid]: { x: start.x + (target.x - start.x) * e2, y: start.y + (target.y - start.y) * e2 } }
      if (k < 1) rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
  }
}

function isPlaced(pid: string) { return placed.value.has(pid) }
</script>

<template>
  <div
    ref="boxRef"
    class="relative w-full h-full"
    style="touch-action: none"
    @pointermove="onMove"
    @pointerup="onUp"
  >
    <div
      v-for="s in slots"
      :key="s.id"
      class="drag-slot absolute border-2 border-dashed border-slate-500/60 rounded-md bg-slate-100/40"
      :style="{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%` }"
    />
    <!-- placed pieces fixed in slot center -->
    <div
      v-for="p in pieces.filter(p => isPlaced(p.id))"
      :key="`placed-${p.id}`"
      class="absolute flex items-center justify-center text-lg"
      :style="{ left: `${slotOf(p.id).x + slotOf(p.id).w / 2}%`, top: `${slotOf(p.id).y + slotOf(p.id).h / 2}%`, transform: 'translate(-50%,-50%)' }"
    >{{ p.emoji }}</div>
    <!-- draggable pieces -->
    <div
      v-for="p in pieces.filter(p => !isPlaced(p.id))"
      :key="p.id"
      class="drag-piece absolute w-9 h-9 flex items-center justify-center rounded-md bg-white shadow text-lg select-none"
      :class="dragId === p.id ? 'cursor-grabbing scale-110' : 'cursor-grab'"
      :style="{ left: `${positions[p.id].x}%`, top: `${positions[p.id].y}%`, transform: 'translate(-50%,-50%)' }"
      @pointerdown="(e) => onDown(e, p.id)"
    >{{ p.emoji }}</div>
  </div>
</template>
