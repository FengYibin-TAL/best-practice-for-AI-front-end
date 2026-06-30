import { useState } from 'react'

const ARROW: Record<string, string> = { up: '↑', down: '↓', left: '←', right: '→' }

interface Props {
  regions: { id: string; dir: 'up' | 'down' | 'left' | 'right' }[]
  correctId: string
  onComplete: () => void
}

export default function HotspotStar({ regions, correctId, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [wrong, setWrong] = useState<string | null>(null)

  const pick = (id: string) => {
    if (picked) return
    if (id === correctId) {
      setPicked(id)
      onComplete()
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 400)
    }
  }

  return (
    <div className="bg-white/80 rounded-lg p-2 shadow">
      <div className="grid grid-cols-2 gap-1.5">
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => pick(r.id)}
            disabled={!!picked}
            className={`w-11 h-11 rounded-md border-2 text-xl flex items-center justify-center transition ${
              picked === r.id
                ? 'bg-green-500 border-green-600 text-white'
                : wrong === r.id
                ? 'bg-red-400 border-red-500 text-white animate-shake'
                : 'bg-white border-slate-300 hover:border-slate-500'
            }`}
          >{ARROW[r.dir]}</button>
        ))}
      </div>
    </div>
  )
}
