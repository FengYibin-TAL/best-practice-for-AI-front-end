import { useEffect, useState, useCallback } from 'react'
import { LEVELS, type Star } from './data/levels'
import { loadProgress, saveProgress, clearProgress, type Progress } from './lib/storage'
import Header from './components/Header'
import PageNav from './components/PageNav'
import DragFillStar from './components/DragFillStar'
import FlipMatchStar from './components/FlipMatchStar'
import HotspotStar from './components/HotspotStar'
import QuizStar from './components/QuizStar'
import ModalStack, { type Modal } from './components/ModalStack'
import Confetti from './components/Confetti'

let mid = 0
const newModal = (m: Omit<Modal, 'id'>): Modal => ({ ...m, id: `m${++mid}` })

function StarView({ star, onComplete }: { star: Star; onComplete: () => void }) {
  if (star.type === 'drag-fill' && star.dragFill)
    return <div className="w-56 h-40 bg-white/20 rounded-lg"><DragFillStar pieces={star.dragFill.pieces} slots={star.dragFill.slots} onComplete={onComplete} /></div>
  if (star.type === 'flip-match' && star.flipMatch)
    return <FlipMatchStar cards={star.flipMatch.cards} onComplete={onComplete} />
  if (star.type === 'hotspot' && star.hotspot)
    return <HotspotStar regions={star.hotspot.regions} correctId={star.hotspot.correctId} onComplete={onComplete} />
  if (star.type === 'quiz-single' && star.quiz)
    return <QuizStar question={star.quiz.question} options={star.quiz.options} onComplete={onComplete} />
  return null
}

export default function App() {
  const [levelIdx, setLevelIdx] = useState(() => {
    const p = loadProgress()
    return p ? Math.min(p.level, LEVELS.length - 1) : 0
  })
  const [completed, setCompleted] = useState<Record<number, Set<string>>>(() => {
    const p = loadProgress()
    const c: Record<number, Set<string>> = {}
    if (p?.completed) Object.entries(p.completed).forEach(([k, v]) => { c[+k] = new Set(v) })
    return c
  })
  const [ratings, setRatings] = useState<Record<number, number>>(() => loadProgress()?.ratings || {})
  const [modals, setModals] = useState<Modal[]>([])
  const [confetti, setConfetti] = useState(0)
  const [round, setRound] = useState(0)

  const level = LEVELS[levelIdx]
  const doneSet = completed[levelIdx] || new Set<string>()
  const doneCount = doneSet.size
  const totalScore = Object.values(completed).reduce((s, set) => s + set.size, 0)
  const allLevelsDone = LEVELS.every((lv, i) => (completed[i]?.size || 0) >= lv.stars.length)
  const badge = totalScore >= 8

  useEffect(() => {
    const p: Progress = {
      level: levelIdx,
      completed: Object.fromEntries(Object.entries(completed).map(([k, v]) => [k, [...v]])) as Record<number, string[]>,
      ratings,
      total: totalScore,
    }
    saveProgress(p)
  }, [levelIdx, completed, ratings, totalScore])

  useEffect(() => {
    if (doneCount >= level.stars.length && !ratings[levelIdx]) {
      setRatings((r) => ({ ...r, [levelIdx]: 3 }))
      setConfetti((c) => c + 1)
      if (!allLevelsDone) setModals((m) => [...m, newModal({ kind: 'page-complete', rating: 3, total: level.id })])
    }
  }, [doneCount, level, ratings, levelIdx, allLevelsDone])

  useEffect(() => {
    if (allLevelsDone && !modals.some((m) => m.kind === 'final')) {
      setModals((m) => [...m, newModal({ kind: 'final', score: totalScore, badge })])
    }
  }, [allLevelsDone, modals, totalScore, badge])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modals.length) setModals((m) => m.slice(0, -1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modals])

  const completeStar = useCallback((starId: string) => {
    setCompleted((prev) => {
      const cur = new Set(prev[levelIdx] || [])
      if (cur.has(starId)) return prev
      cur.add(starId)
      return { ...prev, [levelIdx]: cur }
    })
  }, [levelIdx])

  const closeTop = () => setModals((m) => m.slice(0, -1))
  const openHelp = () => setModals((m) => [...m, newModal({ kind: 'help' })])
  const nextLevel = () => {
    setModals((m) => m.slice(0, -1))
    setLevelIdx((i) => Math.min(LEVELS.length - 1, i + 1))
  }
  const replayLevel = () => {
    setModals((m) => m.slice(0, -1))
    setCompleted((c) => ({ ...c, [levelIdx]: new Set() }))
    setRatings((r) => {
      const n = { ...r }
      delete n[levelIdx]
      return n
    })
    setRound((r) => r + 1)
  }
  const replayAll = () => {
    setModals([])
    setCompleted({})
    setRatings({})
    setLevelIdx(0)
    setRound((r) => r + 1)
    clearProgress()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex flex-col items-center font-sans">
      <Header level={level.id} total={LEVELS.length} score={totalScore} badge={badge} onHelp={openHelp} />
      <div
        key={levelIdx}
        className="relative w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
        style={{ background: level.bg, aspectRatio: '4 / 3' }}
      >
        {level.stars.map((star) => (
          <div
            key={`${levelIdx}-${round}-${star.id}`}
            className="absolute"
            style={{ left: `${star.pos.x * 100}%`, top: `${star.pos.y * 100}%`, transform: 'translate(-50%,-50%)' }}
          >
            <StarView star={star} onComplete={() => completeStar(star.id)} />
          </div>
        ))}
      </div>
      <PageNav
        level={level.id}
        total={LEVELS.length}
        onChange={(l) => setLevelIdx(l - 1)}
        dots={LEVELS.map((_, i) => (completed[i]?.size || 0) >= LEVELS[i].stars.length)}
      />
      <ModalStack modals={modals} onClose={closeTop} onNext={nextLevel} onReplay={replayLevel} onReplayAll={replayAll} />
      <Confetti run={confetti} />
    </div>
  )
}
