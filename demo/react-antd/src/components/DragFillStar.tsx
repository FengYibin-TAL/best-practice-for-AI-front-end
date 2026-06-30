import { useEffect, useRef, useState } from 'react'
import type { DragFillData } from '../data/levels'

interface Pos { x: number; y: number }
interface Props { data: DragFillData; onComplete: () => void }

export default function DragFillStar({ data, onComplete }: Props) {
  const { pieces, slots } = data
  const boxRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const initPos = (i: number): Pos => ({ x: 15 + i * (70 / Math.max(1, pieces.length - 1)), y: 82 })
  const [positions, setPositions] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(pieces.map((p, i) => [p.id, initPos(i)]))
  )
  const [placed, setPlaced] = useState<Set<string>>(new Set())
  const [dragId, setDragId] = useState<string | null>(null)
  const dragOffset = useRef<Pos>({ x: 0, y: 0 })
  const dragIdRef = useRef<string | null>(null)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const toPct = (cx: number, cy: number): Pos => {
    const r = boxRef.current!.getBoundingClientRect()
    return { x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.height) * 100 }
  }
  const slotOf = (pid: string) => slots.find(s => s.id === pieces.find(p => p.id === pid)!.slotId)!

  const onDown = (e: React.PointerEvent, pid: string) => {
    if (placed.has(pid)) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const cur = positions[pid]
    const p = toPct(e.clientX, e.clientY)
    dragOffset.current = { x: p.x - cur.x, y: p.y - cur.y }
    dragIdRef.current = pid
    setDragId(pid)
  }
  const onMove = (e: React.PointerEvent) => {
    const pid = dragIdRef.current
    if (!pid) return
    const p = toPct(e.clientX, e.clientY)
    const off = dragOffset.current
    setPositions(prev => ({ ...prev, [pid]: { x: p.x - off.x, y: p.y - off.y } }))
  }
  const onUp = () => {
    const pid = dragIdRef.current
    if (!pid) return
    dragIdRef.current = null
    setDragId(null)
    const cur = positions[pid]
    const slot = slotOf(pid)
    const inSlot = cur.x >= slot.x && cur.x <= slot.x + slot.w && cur.y >= slot.y && cur.y <= slot.y + slot.h
    const occupied = [...placed].some(id => slotOf(id).id === slot.id)
    if (inSlot && !occupied) {
      setPositions(prev => ({ ...prev, [pid]: { x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 } }))
      setPlaced(prev => {
        const n = new Set(prev); n.add(pid)
        if (n.size === pieces.length) onComplete()
        return n
      })
    } else {
      const start = { ...positions[pid] }
      const target = initPos(pieces.findIndex(p => p.id === pid))
      const t0 = performance.now(); const dur = 300
      const animate = (t: number) => {
        const k = Math.min(1, (t - t0) / dur)
        const e2 = 1 - Math.pow(1 - k, 3)
        setPositions(prev => ({ ...prev, [pid]: { x: start.x + (target.x - start.x) * e2, y: start.y + (target.y - start.y) * e2 } }))
        if (k < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', width: '100%', height: '100%', touchAction: 'none' }}
      onPointerMove={onMove} onPointerUp={onUp}>
      {slots.map(s => (
        <div key={s.id} className="drag-slot" style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
          border: '2px dashed rgba(100,116,139,0.6)', borderRadius: 8, background: 'rgba(241,245,249,0.4)',
          boxSizing: 'border-box',
        }} />
      ))}
      {pieces.filter(p => placed.has(p.id)).map(p => {
        const s = slotOf(p.id)
        return (
          <div key={p.id} style={{
            position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            left: `${s.x + s.w / 2}%`, top: `${s.y + s.h / 2}%`, transform: 'translate(-50%,-50%)',
          }}>{p.emoji}</div>
        )
      })}
      {pieces.filter(p => !placed.has(p.id)).map(p => (
        <div key={p.id} className="drag-piece"
          onPointerDown={e => onDown(e, p.id)}
          style={{
            position: 'absolute', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', fontSize: 20,
            userSelect: 'none', cursor: dragId === p.id ? 'grabbing' : 'grab',
            left: `${positions[p.id].x}%`, top: `${positions[p.id].y}%`, transform: 'translate(-50%,-50%)',
            zIndex: dragId === p.id ? 10 : 1,
          }}
        >{p.emoji}</div>
      ))}
    </div>
  )
}
