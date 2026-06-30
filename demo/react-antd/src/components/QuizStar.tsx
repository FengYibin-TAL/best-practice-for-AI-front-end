import { useState } from 'react'
import { Button, Typography } from 'antd'
import type { QuizData } from '../data/levels'

interface Props {
  data: QuizData
  onComplete: () => void
}

export default function QuizStar({ data, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const choose = (id: string, correct: boolean) => {
    if (answered) return
    if (correct) {
      setPicked(id)
      setAnswered(true)
      onComplete()
    } else {
      setPicked(id)
      setShakeId(id)
      setTimeout(() => {
        setPicked(null)
        setShakeId(null)
      }, 350)
    }
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: '10px 14px',
        width: 200,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      <Typography.Text style={{ fontWeight: 500, fontSize: 13 }}>
        {data.question}
      </Typography.Text>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.options.map(o => (
          <div
            key={o.id}
            className={shakeId === o.id ? 'animate-shake' : undefined}
          >
            <Button
              block
              type={answered && o.correct ? 'primary' : picked === o.id ? 'default' : 'default'}
              danger={shakeId === o.id}
              onClick={() => choose(o.id, o.correct)}
              disabled={answered}
              style={{ fontSize: 12, height: 32 }}
            >
              {o.text}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
