import { useEffect } from 'react'
import { Button, Typography } from 'antd'

// ─── Modal types ─────────────────────────────────────────────────────────────

export interface PageCompleteModal {
  kind: 'page-complete'
  levelId: number
  score: number
  total: number
}

export interface FinalModal {
  kind: 'final'
  score: number
  badgeUnlocked: boolean
}

export interface HelpModal {
  kind: 'help'
}

export type ModalDef = PageCompleteModal | FinalModal | HelpModal

interface Props {
  stack: ModalDef[]
  onClose: (modal: ModalDef) => void
  onNextLevel?: () => void
  onRestart?: () => void
}

function ModalContent({
  modal,
  onClose,
  onNextLevel,
  onRestart,
}: {
  modal: ModalDef
  onClose: () => void
  onNextLevel?: () => void
  onRestart?: () => void
}) {
  if (modal.kind === 'page-complete') {
    return (
      <>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <Typography.Title level={4} style={{ margin: 0 }}>
          第 {modal.levelId} 关完成！
        </Typography.Title>
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
          得分 {modal.score} / {modal.total}
        </Typography.Text>
        <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={onClose}>关闭</Button>
          <Button type="primary" onClick={() => { onClose(); onNextLevel?.() }}>
            下一关
          </Button>
        </div>
      </>
    )
  }

  if (modal.kind === 'final') {
    return (
      <>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
        <Typography.Title level={4} style={{ margin: 0 }}>
          全部完成
        </Typography.Title>
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
          总分 {modal.score}
        </Typography.Text>
        {modal.badgeUnlocked && (
          <div
            style={{
              marginTop: 12,
              padding: '6px 16px',
              background: 'linear-gradient(90deg,#fbbf24,#f59e0b)',
              borderRadius: 20,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              display: 'inline-block',
            }}
          >
            🏅 徽章已解锁！
          </div>
        )}
        <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button onClick={() => { onClose(); onRestart?.() }}>重新开始</Button>
        </div>
      </>
    )
  }

  if (modal.kind === 'help') {
    return (
      <>
        <div style={{ fontSize: 32, marginBottom: 8 }}>❓</div>
        <Typography.Title level={5} style={{ margin: 0, marginBottom: 12 }}>
          玩法
        </Typography.Title>
        <div style={{ textAlign: 'left', fontSize: 13, color: '#555', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 6px' }}>🌟 拖拽题：把图标拖到匹配的格子里</p>
          <p style={{ margin: '0 0 6px' }}>🗺️ 热点题：点击正确方向按钮</p>
          <p style={{ margin: '0 0 6px' }}>🃏 翻牌题：找出所有相同的配对</p>
          <p style={{ margin: 0 }}>❓ 单选题：选择正确答案</p>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={onClose} block>
            知道了
          </Button>
        </div>
      </>
    )
  }

  return null
}

export default function ModalStack({ stack, onClose, onNextLevel, onRestart }: Props) {
  // Escape closes top modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack.length > 0) {
        onClose(stack[stack.length - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stack, onClose])

  return (
    <>
      {stack.map((modal, i) => (
        <div
          key={`${modal.kind}-${i}`}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050 + i,
          }}
          onClick={() => onClose(modal)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              width: 288,
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <ModalContent
              modal={modal}
              onClose={() => onClose(modal)}
              onNextLevel={onNextLevel}
              onRestart={onRestart}
            />
          </div>
        </div>
      ))}
    </>
  )
}
