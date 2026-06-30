import { Button } from 'antd'

interface Props {
  current: number   // 0-based index
  total: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

export default function PageNav({ current, total, canPrev, canNext, onPrev, onNext }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 20,
      }}
    >
      <Button
        onClick={onPrev}
        disabled={!canPrev}
        style={{ fontWeight: 600 }}
      >
        ← 上一页
      </Button>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i === current ? '#1677ff' : '#cbd5e1',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      <Button
        type="primary"
        onClick={onNext}
        disabled={!canNext}
        style={{ fontWeight: 600 }}
      >
        下一页 →
      </Button>
    </div>
  )
}
