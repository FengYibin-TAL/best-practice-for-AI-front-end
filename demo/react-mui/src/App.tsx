import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { LEVELS } from './data/levels'
import { loadProgress, saveProgress, clearProgress } from './lib/storage'
import DragFillStar from './components/DragFillStar'
import FlipMatchStar from './components/FlipMatchStar'
import HotspotStar from './components/HotspotStar'
import QuizStar from './components/QuizStar'
import ModalStack, { type ModalEntry } from './components/ModalStack'
import Header from './components/Header'
import PageNav from './components/PageNav'
import Confetti from './components/Confetti'
import type { Star } from './data/levels'

function StarView({ star, onComplete }: { star: Star; onComplete: () => void }) {
  if (star.type === 'drag-fill' && star.dragFill)
    return <Box sx={{ width: 224, height: 160, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}><DragFillStar data={star.dragFill} onComplete={onComplete} /></Box>
  if (star.type === 'flip-match' && star.flipMatch)
    return <FlipMatchStar data={star.flipMatch} onComplete={onComplete} />
  if (star.type === 'hotspot' && star.hotspot)
    return <HotspotStar data={star.hotspot} onComplete={onComplete} />
  if (star.type === 'quiz-single' && star.quiz)
    return <QuizStar data={star.quiz} onComplete={onComplete} />
  return null
}

export default function App() {
  const [levelIdx, setLevelIdx] = useState(() => {
    const p = loadProgress()
    return p ? Math.min(p.currentLevel, LEVELS.length - 1) : 0
  })
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const p = loadProgress()
    return new Set(p?.completed ?? [])
  })
  const [modalStack, setModalStack] = useState<ModalEntry[]>([])
  const [confetti, setConfetti] = useState(0)
  const [round, setRound] = useState(0)

  const level = LEVELS[levelIdx]
  const totalScore = completed.size
  const badge = totalScore >= 8
  const allDone = LEVELS.every(lv => lv.stars.every(s => completed.has(s.id)))

  useEffect(() => {
    saveProgress({ currentLevel: levelIdx, completed: [...completed] })
  }, [levelIdx, completed])

  useEffect(() => {
    const levelNowDone = level.stars.every(s => completed.has(s.id))
    if (!levelNowDone) return
    if (modalStack.some(m => m.type === 'page-complete' || m.type === 'final')) return
    setConfetti(c => c + 1)
    if (allDone) {
      setModalStack(ms => [...ms, { type: 'final', score: totalScore }])
    } else {
      setModalStack(ms => [...ms, { type: 'page-complete', levelId: level.id }])
    }
  }, [completed]) // eslint-disable-line

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalStack(m => m.slice(0, -1))
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  const completeStar = useCallback((id: string) => {
    setCompleted(prev => {
      if (prev.has(id)) return prev
      return new Set([...prev, id])
    })
  }, [])

  const closeTop = useCallback(() => setModalStack(m => m.slice(0, -1)), [])
  const openHelp = () => setModalStack(ms => [...ms, { type: 'help' }])
  const goNext = () => {
    setModalStack(m => m.slice(0, -1))
    setLevelIdx(i => Math.min(LEVELS.length - 1, i + 1))
  }
  const restart = () => {
    setModalStack([])
    setCompleted(new Set())
    setLevelIdx(0)
    setRound(r => r + 1)
    clearProgress()
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <Header
        level={level.id}
        totalLevels={LEVELS.length}
        score={totalScore}
        hasBadge={badge}
        onHelp={openHelp}
      />
      <Box
        key={`${levelIdx}-${round}`}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 768,
          aspectRatio: '4 / 3',
          borderRadius: 4,
          boxShadow: 3,
          overflow: 'hidden',
          background: level.bg,
          transition: 'all 0.3s',
        }}
      >
        {level.stars.map((star) => (
          <Box
            key={`${levelIdx}-${round}-${star.id}`}
            sx={{
              position: 'absolute',
              left: `${star.pos.x * 100}%`,
              top: `${star.pos.y * 100}%`,
              transform: 'translate(-50%,-50%)',
            }}
          >
            <StarView star={star} onComplete={() => completeStar(star.id)} />
          </Box>
        ))}
      </Box>
      <PageNav
        currentIndex={levelIdx}
        total={LEVELS.length}
        onPrev={() => setLevelIdx(i => Math.max(0, i - 1))}
        onNext={() => setLevelIdx(i => Math.min(LEVELS.length - 1, i + 1))}
      />
      <ModalStack
        stack={modalStack}
        totalScore={totalScore}
        onClose={closeTop}
        onNextLevel={goNext}
        onRestart={restart}
      />
      {confetti > 0 && <Confetti key={confetti} />}
    </Box>
  )
}
