import { useEffect, useRef, useState } from 'react'

interface Piece { id: string; emoji: string; slotId: string }
interface Slot { id: string; x: number; y: number; w: number; h: number }
interface Props { pieces: Piece[]; slots: Slot[]; onComplete: () => void }
interface Pos { x: number; y: number }

export default function DragFillStar({ pieces, slots, onComplete }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const initPos = (i: number): Pos => ({ x: 15 + i * (70 / Math.max(1, pieces.length - 1)), y: 82 })
  const [positions, setPositions] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(pieces.map((p, i) => [p.id, initPos(i)]))
  )
  const [placed, setPlaced] = useState<Set<string>>(new Set())
  const [dragId, setDragId] = useState<string | null>(null)
  const dragOffset = useRef<Pos>({ x: 0, y: 0 })

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const toPct = (cx: number, cy: number): Pos => {
    const r = boxRef.current!.getBoundingClientRect()
    return { x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.height) * 100 }
  }
  const slotOf = (pid: string) => slots.find((s) => s.id === pieces.find((p) => p.id === pid)!.slotId)!

  const onDown = (e: React.PointerEvent, pid: string) => {
    if (placed.has(pid)) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const cur = positions[pid]
    const p = toPct(e.clientX, e.clientY)
    dragOffset.current = { x: p.x - cur.x, y: p.y - cur.y }
    setDragId(pid)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragId) return
    const p = toPct(e.clientX, e.clientY)
    const off = dragOffset.current
    setPositions((prev) => ({ ...prev, [dragId]: { x: p.x - off.x, y: p.y - off.y } }))
  }
  const onUp = () => {
    if (!dragId) return
    const pid = dragId
    setDragId(null)
    const cur = positions[pid]
    const slot = slotOf(pid)
    const inSlot = cur.x >= slot.x && cur.x <= slot.x + slot.w && cur.y >= slot.y && cur.y <= slot.y + slot.h
    const occupied = [...placed].some((id) => slotOf(id).id === slot.id)
    if (inSlot && !occupied) {
      setPositions((prev) => ({ ...prev, [pid]: { x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 } }))
      setPlaced((prev) => {
        const n = new Set(prev)
        n.add(pid)
        if (n.size === pieces.length) onComplete()
        return n
      })
    } else {
      const start = { ...positions[pid] }
      const target = initPos(pieces.findIndex((p) => p.id === pid))
      const t0 = performance.now()
      const dur = 300
      const animate = (t: number) => {
        const k = Math.min(1, (t - t0) / dur)
        const e2 = 1 - Math.pow(1 - k, 3)
        setPositions((prev) => ({ ...prev, [pid]: { x: start.x + (target.x - start.x) * e2, y: start.y + (target.y - start.y) * e2 } }))
        if (k < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full h-full" style={{ touchAction: 'none' }} onPointerMove={onMove} onPointerUp={onUp}>
      {slots.map((s) => (
        <div key={s.id} className="drag-slot absolute border-2 border-dashed border-slate-500/60 rounded-md bg-slate-100/40"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%` }} />
      ))}
      {pieces.filter((p) => placed.has(p.id)).map((p) => {
        const s = slotOf(p.id)
        return (
          <div key={p.id} className="absolute flex items-center justify-center text-lg"
            style={{ left: `${s.x + s.w / 2}%`, top: `${s.y + s.h / 2}%`, transform: 'translate(-50%,-50%)' }}>{p.emoji}</div>
        )
      })}
      {pieces.filter((p) => !placed.has(p.id)).map((p) => (
        <div key={p.id} onPointerDown={(e) => onDown(e, p.id)}
          className={`drag-piece absolute w-9 h-9 flex items-center justify-center rounded-md bg-white shadow text-lg select-none ${dragId === p.id ? 'cursor-grabbing scale-110' : 'cursor-grab'}`}
          style={{ left: `${positions[p.id].x}%`, top: `${positions[p.id].y}%`, transform: 'translate(-50%,-50%)' }}>
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
