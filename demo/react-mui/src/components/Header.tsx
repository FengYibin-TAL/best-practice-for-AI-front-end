import { Box, Typography } from '@mui/material'

interface Props {
  level: number
  totalLevels: number
  score: number
  hasBadge: boolean
  onHelp: () => void
}

export default function Header({ level, totalLevels, score, hasBadge, onHelp }: Props) {
  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', maxWidth:768, mb:2, px:1 }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <Typography variant="h6" sx={{ fontWeight:700 }}>Epic Labs</Typography>
        <Box sx={{ px:1, py:0.25, borderRadius:8, bgcolor:'grey.200' }}>
          <Typography variant="caption" sx={{ color:'grey.600' }}>Lv {level}/{totalLevels}</Typography>
        </Box>
      </Box>
      <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
        <Typography variant="body2">⭐ {score}</Typography>
        <Typography variant="body1" title={hasBadge ? '徽章已解锁' : '未解锁'}>{hasBadge ? '🏆' : '▪️'}</Typography>
        <button
          className="help-btn"
          aria-label="帮助"
          onClick={onHelp}
          style={{ width:28, height:28, borderRadius:'50%', border:'1px solid #cbd5e1', background:'white', cursor:'pointer', fontSize:14, color:'#475569', display:'flex', alignItems:'center', justifyContent:'center' }}
        >?</button>
      </Box>
    </Box>
  )
}
