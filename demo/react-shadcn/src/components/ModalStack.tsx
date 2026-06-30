export interface Modal {
  id: string
  kind: 'page-complete' | 'final' | 'help'
  rating?: number
  score?: number
  total?: number
  badge?: boolean
}

interface Props {
  modals: Modal[]
  onClose: () => void
  onNext: () => void
  onReplay: () => void
  onReplayAll: () => void
}

export default function ModalStack({ modals, onClose, onNext, onReplay, onReplayAll }: Props) {
  return (
    <>
      {modals.map((m, i) => (
        <div key={m.id} className="fixed inset-0 bg-black/40 flex items-center justify-center" style={{ zIndex: 50 + i }} onClick={onClose}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-72 text-center" onClick={(e) => e.stopPropagation()}>
            {m.kind === 'page-complete' && (
              <>
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-xl font-bold text-slate-800">第 {m.total} 关完成！</h2>
                <p className="text-2xl mt-1">{'⭐'.repeat(m.rating || 1)}{'☆'.repeat(3 - (m.rating || 1))}</p>
                <div className="flex gap-2 mt-4 justify-center">
                  <button onClick={onReplay} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">重玩</button>
                  <button onClick={onNext} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700">下一关</button>
                </div>
              </>
            )}
            {m.kind === 'final' && (
              <>
                <div className="text-4xl mb-2">🏆</div>
                <h2 className="text-xl font-bold text-slate-800">全部完成！</h2>
                <p className="text-slate-500 mt-1">总分 <span className="font-bold text-slate-800">{m.score}</span></p>
                <p className="text-2xl mt-2">{m.badge ? '🏅 徽章解锁' : ''}</p>
                <div className="flex gap-2 mt-4 justify-center">
                  <button onClick={onReplayAll} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700">重玩全部</button>
                </div>
              </>
            )}
            {m.kind === 'help' && (
              <>
                <h2 className="text-lg font-bold text-slate-800 mb-2">玩法</h2>
                <p className="text-sm text-slate-600 text-left leading-relaxed">
                  拖拽：把图标拖到虚线框。<br />
                  翻牌：翻开两张配对。<br />
                  热点：点正确方向。<br />
                  测验：选正确答案。<br />
                  完成所有星过关；Escape 关弹窗。
                </p>
                <div className="mt-4">
                  <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-900 text-white">知道了</button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
