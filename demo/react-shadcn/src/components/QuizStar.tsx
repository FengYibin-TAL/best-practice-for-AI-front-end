import { useState } from 'react'

interface Props {
  question: string
  options: { id: string; text: string; correct: boolean }[]
  onComplete: () => void
}

export default function QuizStar({ question, options, onComplete }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const choose = (o: { id: string; correct: boolean }) => {
    if (done) return
    if (o.correct) {
      setPicked(o.id)
      setDone(true)
      onComplete()
    } else {
      setPicked(o.id)
      setTimeout(() => setPicked(null), 400)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 w-52">
      <p className="text-xs font-medium mb-2 text-slate-700">{question}</p>
      <div className="flex flex-col gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => choose(o)}
            disabled={done}
            className={`px-2.5 py-1.5 rounded border text-xs transition text-left ${
              done && o.correct
                ? 'bg-green-100 border-green-500'
                : picked === o.id
                ? 'bg-red-100 border-red-500 animate-shake'
                : 'bg-white border-slate-300 hover:border-slate-500'
            }`}
          >{o.text}</button>
        ))}
      </div>
    </div>
  )
}
