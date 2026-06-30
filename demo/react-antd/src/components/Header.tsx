import { Button, Typography } from 'antd'

interface Props {
  levelId: number
  score: number
  total: number
  onHelp: () => void
}

export default function Header({ levelId, score, total, onHelp }: Props) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 896,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        Epic Labs · 第 {levelId} 关
      </Typography.Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Typography.Text type="secondary">
          进度 {score}/{total}
        </Typography.Text>
        <Button
          className="help-btn"
          aria-label="帮助"
          type="text"
          onClick={onHelp}
          style={{ fontSize: 18, padding: '0 8px' }}
        >
          ❓
        </Button>
      </div>
    </div>
  )
}
