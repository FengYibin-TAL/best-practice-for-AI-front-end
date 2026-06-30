interface Props {
  level: number
  total: number
  score: number
  badge: boolean
  onHelp: () => void
}

export default function Header({ level, total, score, badge, onHelp }: Props) {
  return (
    <header className="w-full max-w-3xl flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold text-slate-800">Epic Labs</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Lv {level}/{total}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm">⭐ {score}</span>
        <span className="text-lg" title={badge ? '徽章已解锁' : '未解锁'}>{badge ? '🏆' : '▪️'}</span>
        <button
          onClick={onHelp}
          className="help-btn w-7 h-7 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          aria-label="帮助"
        >?</button>
      </div>
    </header>
  )
}
