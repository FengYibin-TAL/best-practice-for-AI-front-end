import { Box, Typography, Button, Dialog, DialogContent } from '@mui/material'

export type ModalType = 'page-complete' | 'final' | 'help'

export interface ModalEntry {
  type: ModalType
  score?: number
  levelName?: string   // e.g. "第 1 关"
  levelId?: number     // e.g. 1
}

interface Props {
  stack: ModalEntry[]
  totalScore: number
  onClose: () => void
  onNextLevel: () => void
  onRestart: () => void
}

function PageCompleteContent({ entry, onClose, onNextLevel }: { entry: ModalEntry; onClose: () => void; onNextLevel: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>🎉</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>第 {entry.levelId} 关完成</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>⭐⭐⭐</Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderColor: 'grey.400' }}>重玩</Button>
        <Button variant="contained" onClick={onNextLevel} sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155' } }}>下一关</Button>
      </Box>
    </Box>
  )
}

function FinalContent({ totalScore, onRestart }: { totalScore: number; onRestart: () => void }) {
  const hasBadge = totalScore >= 8
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>🏆</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>全部完成</Typography>
      <Typography variant="body1" sx={{ mb: 0.5 }}>总分 <b>{totalScore}</b></Typography>
      {hasBadge && (
        <Typography variant="body2" color="success.main" sx={{ mb: 1.5 }}>🏅 徽章解锁</Typography>
      )}
      <Button variant="contained" onClick={onRestart} sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155' }, mt: 1 }}>
        重玩全部
      </Button>
    </Box>
  )
}

function HelpContent({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>玩法</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', lineHeight: 1.8 }}>
        拖拽：把图标拖到虚线框。<br />
        翻牌：翻开两张配对。<br />
        热点：点正确方向。<br />
        测验：选正确答案。<br />
        完成所有星过关；Escape 关弹窗。
      </Typography>
      <Button variant="outlined" onClick={onClose} sx={{ borderColor: 'grey.400', mt: 2 }}>知道了</Button>
    </Box>
  )
}

export default function ModalStack({ stack, totalScore, onClose, onNextLevel, onRestart }: Props) {
  if (stack.length === 0) return null

  return (
    <>
      {stack.map((entry, index) => {
        const zBase = 1300
        return (
          <Dialog
            key={`${entry.type}-${index}`}
            open={true}
            disableEscapeKeyDown={true}
            onClose={() => {}}
            PaperProps={{
              sx: { borderRadius: 3, width: '288px', maxWidth: '90vw' },
            }}
            sx={{ zIndex: zBase + index * 10 }}
          >
            <DialogContent sx={{ p: 0 }}>
              {entry.type === 'page-complete' && (
                <PageCompleteContent entry={entry} onClose={onClose} onNextLevel={onNextLevel} />
              )}
              {entry.type === 'final' && (
                <FinalContent totalScore={totalScore} onRestart={onRestart} />
              )}
              {entry.type === 'help' && (
                <HelpContent onClose={onClose} />
              )}
            </DialogContent>
          </Dialog>
        )
      })}
    </>
  )
}
