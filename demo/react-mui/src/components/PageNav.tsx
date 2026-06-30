import { Box, Button } from '@mui/material'

interface Props {
  currentIndex: number  // 0-indexed
  total: number
  onPrev: () => void
  onNext: () => void
}

export default function PageNav({ currentIndex, total, onPrev, onNext }: Props) {
  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:2, mt:2 }}>
      <Button
        variant="outlined"
        onClick={onPrev}
        disabled={currentIndex === 0}
        sx={{ minWidth:40, px:1.5, borderColor:'grey.400', color:'text.primary', '&:disabled':{ borderColor:'grey.200', color:'grey.400' } }}
      >
        ← 上一页
      </Button>
      <Box sx={{ display:'flex', gap:0.75 }}>
        {Array.from({ length: total }, (_, i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: i === currentIndex ? 'grey.800' : 'grey.300',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </Box>
      <Button
        variant="outlined"
        onClick={onNext}
        disabled={currentIndex === total - 1}
        sx={{ minWidth:40, px:1.5, borderColor:'grey.400', color:'text.primary', '&:disabled':{ borderColor:'grey.200', color:'grey.400' } }}
      >
        下一页 →
      </Button>
    </Box>
  )
}
