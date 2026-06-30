import { useEffect, useRef, useState } from 'react'

interface Card { id: string; pairId: string; emoji: string }
interface Props { cards: Card[]; onComplete: () => void }

export default function FlipMatchStar({ cards, onComplete }: Props) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [lock, setLock] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!completedRef.current && matched.size === cards.length && cards.length > 0) {
      completedRef.current = true
      requestAnimationFrame(() => onComplete())
    }
  }, [matched, cards.length, onComplete])

  const click = (c: Card) => {
    if (lock || matched.has(c.id) || flipped.has(c.id)) return
    const nf = new Set(flipped); nf.add(c.id); setFlipped(nf)
    if (nf.size === 2) {
      setAttempts((a) => a + 1); setLock(true)
      const [a, b] = [...nf]
      const ca = cards.find((x) => x.id === a)!; const cb = cards.find((x) => x.id === b)!
      if (ca.pairId === cb.pairId) {
        setTimeout(() => {
          setMatched((m) => { const nm = new Set(m); nm.add(a); nm.add(b); return nm })
          setFlipped(new Set()); setLock(false)
        }, 400)
      } else {
        setTimeout(() => { setFlipped(new Set()); setLock(false) }, 800)
      }
    }
  }

  return (
    <div className="bg-white/80 rounded-lg p-2 shadow">
      <div className="grid grid-cols-3 gap-1.5">
        {cards.map((c) => {
          const up = flipped.has(c.id) || matched.has(c.id)
          return (
            <button key={c.id} onClick={() => click(c)} disabled={matched.has(c.id)} className="flip-card relative w-12 h-14 [perspective:600px]" aria-label="card">
              <div className="relative w-full h-full transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: up ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div className="absolute inset-0 rounded-md bg-slate-700 [backface-visibility:hidden] flex items-center justify-center text-white text-lg">?</div>
                <div className="absolute inset-0 rounded-md bg-white border border-slate-200 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-xl">{c.emoji}</div>
              </div>
            </button>
          )
        })}
      </div>
      <p className="text-[10px] text-slate-500 mt-1 text-center">尝试 {attempts}</p>
    </div>
  )
}
