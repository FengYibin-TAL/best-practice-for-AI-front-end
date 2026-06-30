import { useState, useRef, useEffect } from 'react'
import type { FlipMatchData, FlipCard } from '../data/levels'

interface Props {
  data: FlipMatchData
  onComplete: () => void
}

export default function FlipMatchStar({ data, onComplete }: Props) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const lockedRef = useRef(false)
  const completedRef = useRef(false)

  const click = (card: FlipCard) => {
    if (lockedRef.current) return
    if (matched.has(card.id)) return
    if (flipped.has(card.id)) return

    const newFlipped = new Set(flipped).add(card.id)

    // Find partner: same groupId, not already flipped, not this card
    const flippedCards = data.cards.filter(c => newFlipped.has(c.id))
    const unmatched = flippedCards.filter(c => !matched.has(c.id))

    setFlipped(newFlipped)

    if (unmatched.length === 2) {
      // Check pair
      if (unmatched[0].groupId === unmatched[1].groupId) {
        // Match!
        const newMatched = new Set(matched)
        unmatched.forEach(c => newMatched.add(c.id))
        setMatched(newMatched)
        setFlipped(new Set())
      } else {
        // Mismatch: lock briefly then flip back
        lockedRef.current = true
        setTimeout(() => {
          setFlipped(new Set())
          lockedRef.current = false
        }, 900)
      }
    }
  }

  useEffect(() => {
    if (!completedRef.current && matched.size === data.cards.length) {
      completedRef.current = true
      onComplete()
    }
  }, [matched, data.cards.length, onComplete])

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 200 }}>
      {data.cards.map(c => {
        const isFlipped = flipped.has(c.id) || matched.has(c.id)
        const isMatched = matched.has(c.id)
        return (
          <button
            key={c.id}
            className="flip-card"
            onClick={() => click(c)}
            disabled={isMatched}
            style={{
              position: 'relative',
              width: 48,
              height: 56,
              background: 'none',
              border: 'none',
              cursor: isMatched ? 'default' : 'pointer',
              perspective: '600px',
              padding: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.3s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front (back of card) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 6,
                  background: isMatched ? '#86efac' : '#334155',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 18,
                }}
              >
                ?
              </div>
              {/* Back (face of card) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 6,
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                {c.emoji}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
