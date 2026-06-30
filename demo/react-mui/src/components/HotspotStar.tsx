import { useState, useCallback } from 'react'
import { Box, Button } from '@mui/material'
import type { HotspotData } from '../data/levels'

interface Props {
  data: HotspotData
  onComplete: () => void
}

export default function HotspotStar({ data, onComplete }: Props) {
  const { regions, correctId } = data
  const [picked, setPicked] = useState<string | null>(null)
  const [shakingId, setShakingId] = useState<string | null>(null)

  const pick = useCallback((id: string) => {
    if (picked) return
    if (id === correctId) {
      setPicked(id)
      onComplete()
    } else {
      setShakingId(id)
      setTimeout(() => setShakingId(null), 350)
    }
  }, [picked, correctId, onComplete])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      {/* Top row: just up button */}
      <Button
        className={shakingId === 'u' ? 'animate-shake' : undefined}
        variant={picked === 'u' ? 'contained' : 'outlined'}
        color={picked === 'u' ? 'success' : shakingId === 'u' ? 'error' : 'primary'}
        onClick={() => pick('u')}
        disabled={!!picked}
        sx={{ minWidth: 44, width: 44, height: 44, p: 0, fontSize: 18 }}
      >
        ↑
      </Button>
      {/* Middle row: left, (empty), right */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Button
          className={shakingId === 'l' ? 'animate-shake' : undefined}
          variant={picked === 'l' ? 'contained' : 'outlined'}
          color={picked === 'l' ? 'success' : shakingId === 'l' ? 'error' : 'primary'}
          onClick={() => pick('l')}
          disabled={!!picked}
          sx={{ minWidth: 44, width: 44, height: 44, p: 0, fontSize: 18 }}
        >
          ←
        </Button>
        <Box sx={{ width: 44, height: 44 }} />
        <Button
          className={shakingId === 'r' ? 'animate-shake' : undefined}
          variant={picked === 'r' ? 'contained' : 'outlined'}
          color={picked === 'r' ? 'success' : shakingId === 'r' ? 'error' : 'primary'}
          onClick={() => pick('r')}
          disabled={!!picked}
          sx={{ minWidth: 44, width: 44, height: 44, p: 0, fontSize: 18 }}
        >
          →
        </Button>
      </Box>
      {/* Bottom row: just down button */}
      <Button
        className={shakingId === 'd' ? 'animate-shake' : undefined}
        variant={picked === 'd' ? 'contained' : 'outlined'}
        color={picked === 'd' ? 'success' : shakingId === 'd' ? 'error' : 'primary'}
        onClick={() => pick('d')}
        disabled={!!picked}
        sx={{ minWidth: 44, width: 44, height: 44, p: 0, fontSize: 18 }}
      >
        ↓
      </Button>
    </Box>
  )
}
