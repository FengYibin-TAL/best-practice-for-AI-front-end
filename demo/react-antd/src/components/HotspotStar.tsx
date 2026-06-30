import { useState } from 'react'
import { Button } from 'antd'
import type { HotspotData } from '../data/levels'

interface Props {
  data: HotspotData
  onComplete: () => void
}

export default function HotspotStar({ data, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const pick = (id: string) => {
    if (picked) return
    if (id === data.correctId) {
      setPicked(id)
      onComplete()
    } else {
      setShakeId(id)
      setTimeout(() => setShakeId(null), 350)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 220 }}>
      {data.regions.map(r => (
        <div
          key={r.id}
          className={shakeId === r.id ? 'animate-shake' : undefined}
          style={{ display: 'inline-block' }}
        >
          <Button
            type={picked === r.id ? 'primary' : 'default'}
            danger={shakeId === r.id}
            onClick={() => pick(r.id)}
            disabled={!!picked && picked !== r.id}
            style={{ width: 48, height: 48, fontWeight: 700, fontSize: 18, padding: 0 }}
          >
            {r.label}
          </Button>
        </div>
      ))}
    </div>
  )
}
