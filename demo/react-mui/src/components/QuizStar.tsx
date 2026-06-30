import { useState, useCallback } from 'react'
import { Box, Typography, Button } from '@mui/material'
import type { QuizData } from '../data/levels'

interface Props {
  data: QuizData
  onComplete: () => void
}

export default function QuizStar({ data, onComplete }: Props) {
  const { question, options } = data
  const [picked, setPicked] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [shakingId, setShakingId] = useState<string | null>(null)

  const choose = useCallback((optId: string, correct: boolean) => {
    if (answered) return
    if (correct) {
      setPicked(optId)
      setAnswered(true)
      onComplete()
    } else {
      setShakingId(optId)
      setTimeout(() => {
        setPicked(null)
        setShakingId(null)
      }, 350)
    }
  }, [answered, onComplete])

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 2,
        p: 1.5,
        width: 200,
        maxWidth: '100%',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary', textAlign: 'center' }}>
        {question}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {options.map((opt) => (
          <Button
            key={opt.id}
            className={shakingId === opt.id ? 'animate-shake' : undefined}
            variant={answered && opt.correct ? 'contained' : 'outlined'}
            color={answered && opt.correct ? 'success' : shakingId === opt.id ? 'error' : 'primary'}
            onClick={() => choose(opt.id, opt.correct)}
            disabled={answered}
            size="small"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            {opt.text}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
