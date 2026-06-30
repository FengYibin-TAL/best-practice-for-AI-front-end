import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { LEVEL_METAS } from './data/levels'
import { loadProgress, saveProgress, clearProgress, type Progress } from './lib/storage'
import Header from './components/Header'
import PageNav from './components/PageNav'
import ModalStack, { type Modal } from './components/ModalStack'
import Confetti from './components/Confetti'

// Module Federation remote imports — loaded dynamically at runtime
const LevelApps = [
  lazy(() => import('level1/LevelApp')),
  lazy(() => import('level2/LevelApp')),
  lazy(() => import('level3/LevelApp')),
]

let mid = 0
const newModal = (m: Omit<Modal, 'id'>): Modal => ({ ...m, id: `m${++mid}` })

export default function App() {
  const [levelIdx, setLevelIdx] = useState(() => {
    const p = loadProgress()
    return p ? Math.min(p.level, LEVEL_METAS.length - 1) : 0
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

  const meta = LEVEL_METAS[levelIdx]
  const doneSet = completed[levelIdx] || new Set<string>()
  const doneCount = doneSet.size
  const totalScore = Object.values(completed).reduce((s, set) => s + set.size, 0)
  const allLevelsDone = LEVEL_METAS.every((lv, i) => (completed[i]?.size || 0) >= lv.starCount)
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
    if (doneCount >= meta.starCount && !ratings[levelIdx]) {
      setRatings((r) => ({ ...r, [levelIdx]: 3 }))
      setConfetti((c) => c + 1)
      if (!allLevelsDone) setModals((m) => [...m, newModal({ kind: 'page-complete', rating: 3, total: meta.id })])
    }
  }, [doneCount, meta, ratings, levelIdx, allLevelsDone])

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
    // Defer state update to avoid "setState during render" warning when called
    // from a child component's render-phase effect (React strict mode + MF boundary)
    setTimeout(() => {
      setCompleted((prev) => {
        const cur = new Set(prev[levelIdx] || [])
        if (cur.has(starId)) return prev
        cur.add(starId)
        return { ...prev, [levelIdx]: cur }
      })
    }, 0)
  }, [levelIdx])

  const closeTop = () => setModals((m) => m.slice(0, -1))
  const openHelp = () => setModals((m) => [...m, newModal({ kind: 'help' })])
  const nextLevel = () => {
    setModals((m) => m.slice(0, -1))
    setLevelIdx((i) => Math.min(LEVEL_METAS.length - 1, i + 1))
  }
  const replayLevel = () => {
    setModals((m) => m.slice(0, -1))
    setCompleted((c) => ({ ...c, [levelIdx]: new Set() }))
    setRatings((r) => { const n = { ...r }; delete n[levelIdx]; return n })
    setRound((r) => r + 1)
  }
  const replayAll = () => {
    setModals([]); setCompleted({}); setRatings({}); setLevelIdx(0)
    setRound((r) => r + 1); clearProgress()
  }

  const LevelApp = LevelApps[levelIdx]

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex flex-col items-center font-sans">
      <Header level={meta.id} total={LEVEL_METAS.length} score={totalScore} badge={badge} onHelp={openHelp} />
      <div
        key={levelIdx}
        className="relative w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
        style={{ background: meta.bg, aspectRatio: '4 / 3' }}
      >
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-slate-500">加载中…</div>}>
          <LevelApp
            key={`${levelIdx}-${round}`}
            completed={doneSet}
            onComplete={completeStar}
          />
        </Suspense>
      </div>
      <PageNav
        level={meta.id}
        total={LEVEL_METAS.length}
        onChange={(l) => setLevelIdx(l - 1)}
        dots={LEVEL_METAS.map((_, i) => (completed[i]?.size || 0) >= LEVEL_METAS[i].starCount)}
      />
      <ModalStack modals={modals} onClose={closeTop} onNext={nextLevel} onReplay={replayLevel} onReplayAll={replayAll} />
      <Confetti run={confetti} />
    </div>
  )
}
