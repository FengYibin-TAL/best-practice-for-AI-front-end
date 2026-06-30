interface Props {
  level: number
  total: number
  onChange: (lvl: number) => void
  dots: boolean[]
}

export default function PageNav({ level, total, onChange, dots }: Props) {
  return (
    <div className="w-full max-w-3xl flex items-center justify-center gap-4 mt-3">
      <button
        disabled={level <= 1}
        onClick={() => onChange(level - 1)}
        className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 text-slate-700 text-sm"
      >← 上一页</button>
      <div className="flex gap-1.5">
        {dots.map((d, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${d ? 'bg-green-500' : i + 1 === level ? 'bg-slate-700' : 'bg-slate-300'}`}
          />
        ))}
      </div>
      <button
        disabled={level >= total}
        onClick={() => onChange(level + 1)}
        className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-30 hover:bg-slate-50 text-slate-700 text-sm"
      >下一页 →</button>
    </div>
  )
}
