import { useState, useEffect, useCallback } from 'react'
import { LEVELS } from './data/levels'
import type { Level, Star } from './data/levels'
import { loadProgress, saveProgress } from './lib/storage'
import DragFillStar from './components/DragFillStar'
import FlipMatchStar from './components/FlipMatchStar'
import HotspotStar from './components/HotspotStar'
import QuizStar from './components/QuizStar'
import ModalStack from './components/ModalStack'
import type { ModalDef } from './components/ModalStack'
import Header from './components/Header'
import PageNav from './components/PageNav'
import Confetti from './components/Confetti'

// ─── Score helpers ────────────────────────────────────────────────────────────

function totalStars(levels: Level[]) {
  return levels.reduce((acc, l) => acc + l.stars.length, 0)
}

function scoreForLevel(levelId: number, completed: Set<string>, level: Level) {
  return level.stars.filter(s => completed.has(s.id)).length
}

// ─── Star widget renderer ─────────────────────────────────────────────────────

function StarWidget({
  star,
  onComplete,
}: {
  star: Star
  onComplete: () => void
}) {
  if (star.type === 'drag-fill' && star.dragFill) {
    return <div style={{ width: 224, height: 160, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }}><DragFillStar data={star.dragFill} onComplete={onComplete} /></div>
  }
  if (star.type === 'hotspot' && star.hotspot) {
    return <HotspotStar data={star.hotspot} onComplete={onComplete} />
  }
  if (star.type === 'quiz-single' && star.quiz) {
    return <QuizStar data={star.quiz} onComplete={onComplete} />
  }
  if (star.type === 'flip-match' && star.flipMatch) {
    return <FlipMatchStar data={star.flipMatch} onComplete={onComplete} />
  }
  return null
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // Restore persisted progress
  const saved = loadProgress()
  const [currentLevelIdx, setCurrentLevelIdx] = useState(() =>
    Math.min(saved.currentLevel, LEVELS.length - 1)
  )
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(saved.completed)
  )
  const [modalStack, setModalStack] = useState<ModalDef[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const currentLevel = LEVELS[currentLevelIdx]
  const levelScore = scoreForLevel(currentLevel.id, completed, currentLevel)
  const levelTotal = currentLevel.stars.length
  const levelDone = levelScore >= levelTotal

  const globalScore = completed.size
  const globalTotal = totalStars(LEVELS)

  // Persist on every change
  useEffect(() => {
    saveProgress({ completed: [...completed], currentLevel: currentLevelIdx })
  }, [completed, currentLevelIdx])

  const completeStar = useCallback(
    (id: string) => {
      setCompleted(prev => {
        if (prev.has(id)) return prev
        const next = new Set(prev).add(id)

        const level = LEVELS[currentLevelIdx]
        const levelNowDone = level.stars.every(s => next.has(s.id))

        if (levelNowDone) {
          const isLast = currentLevelIdx === LEVELS.length - 1
          const score = level.stars.length // all done

          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 2200)

          if (isLast) {
            const total = [...next].length
            setModalStack(ms => [
              ...ms,
              { kind: 'final', score: total, badgeUnlocked: total >= 8 },
            ])
          } else {
            setModalStack(ms => [
              ...ms,
              {
                kind: 'page-complete',
                levelId: level.id,
                score,
                total: score,
              },
            ])
          }
        }

        return next
      })
    },
    [currentLevelIdx]
  )

  const closeModal = useCallback((modal: ModalDef) => {
    setModalStack(prev => prev.filter(m => m !== modal))
  }, [])

  const goNextLevel = useCallback(() => {
    setModalStack([])
    setCurrentLevelIdx(i => Math.min(i + 1, LEVELS.length - 1))
  }, [])

  const goPrevLevel = useCallback(() => {
    setCurrentLevelIdx(i => Math.max(i - 1, 0))
  }, [])

  const restart = useCallback(() => {
    setCompleted(new Set())
    setCurrentLevelIdx(0)
    setModalStack([])
  }, [])

  const openHelp = useCallback(() => {
    setModalStack(ms => {
      if (ms.some(m => m.kind === 'help')) return ms
      return [...ms, { kind: 'help' }]
    })
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header bar */}
      <Header
        levelId={currentLevel.id}
        score={levelScore}
        total={levelTotal}
        onHelp={openHelp}
      />

      {/* Level canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 896,
          aspectRatio: '4 / 3',
          borderRadius: 16,
          overflow: 'hidden',
          background: currentLevel.bg,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}
      >
        {/* Level complete overlay */}
        {levelDone && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            🎉
          </div>
        )}

        {/* Stars */}
        {currentLevel.stars.map(star => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.pos.x * 100}%`,
              top: `${star.pos.y * 100}%`,
              transform: 'translate(-50%,-50%)',
              zIndex: completed.has(star.id) ? 2 : 3,
            }}
          >
            <StarWidget star={star} onComplete={() => completeStar(star.id)} />
          </div>
        ))}
      </div>

      {/* Page navigation */}
      <PageNav
        current={currentLevelIdx}
        total={LEVELS.length}
        canPrev={currentLevelIdx > 0}
        canNext={currentLevelIdx < LEVELS.length - 1}
        onPrev={goPrevLevel}
        onNext={goNextLevel}
      />

      {/* Global score */}
      <div style={{ marginTop: 12, color: '#94a3b8', fontSize: 13 }}>
        总进度 {globalScore} / {globalTotal}
      </div>

      {/* Modal stack */}
      <ModalStack
        stack={modalStack}
        onClose={closeModal}
        onNextLevel={goNextLevel}
        onRestart={restart}
      />

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </div>
  )
}
