import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { FlipMatchData } from '../data/levels'

interface Props { data: FlipMatchData; onComplete: () => void }

export default function FlipMatchStar({ data, onComplete }: Props) {
  const { cards } = data
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [lock, setLock] = useState(false)

  const click = (c: { id: string; pairId: string; emoji: string }) => { const id = c.id
    if (lock || matched.has(id) || flipped.has(id)) return
    const nf = new Set(flipped); nf.add(id)
    setFlipped(nf)
    if (nf.size === 2) {
      setAttempts(a => a + 1)
      setLock(true)
      const [a, b] = [...nf]
      const ca = cards.find(x => x.id === a)!
      const cb = cards.find(x => x.id === b)!
      if (ca.pairId === cb.pairId) {
        setTimeout(() => {
          setMatched(m => {
            const nm = new Set(m); nm.add(a); nm.add(b)
            if (nm.size === cards.length) onComplete()
            return nm
          })
          setFlipped(new Set()); setLock(false)
        }, 400)
      } else {
        setTimeout(() => { setFlipped(new Set()); setLock(false) }, 800)
      }
    }
  }

  return (
    <Box sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2, p: 1, boxShadow: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
        {cards.map(c => {
          const up = flipped.has(c.id) || matched.has(c.id)
          return (
            <button
              key={c.id}
              className="flip-card"
              onClick={() => click(c)}
              disabled={matched.has(c.id)}
              style={{ position: 'relative', width: 48, height: 56, background: 'none', border: 'none', cursor: matched.has(c.id) ? 'default' : 'pointer', perspective: '600px', padding: 0 }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.3s', transformStyle: 'preserve-3d', transform: up ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: '#334155', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>?</div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: '#fff', border: '1px solid #e2e8f0', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.emoji}</div>
              </div>
            </button>
          )
        })}
      </Box>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, color: 'text.secondary' }}>尝试 {attempts}</Typography>
    </Box>
  )
}
