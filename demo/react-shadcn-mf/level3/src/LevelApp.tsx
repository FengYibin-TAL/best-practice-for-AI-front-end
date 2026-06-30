import { STARS } from './data/level'
import DragFillStar from './components/DragFillStar'
import HotspotStar from './components/HotspotStar'
import QuizStar from './components/QuizStar'

interface Props {
  completed: Set<string>
  onComplete: (starId: string) => void
}

export default function LevelApp({ completed, onComplete }: Props) {
  return (
    <>
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{ left: `${star.pos.x * 100}%`, top: `${star.pos.y * 100}%`, transform: 'translate(-50%,-50%)', zIndex: completed.has(star.id) ? 2 : 3 }}
        >
          {star.type === 'drag-fill' && star.dragFill && !completed.has(star.id) && (
            <div className="w-56 h-40 bg-white/20 rounded-lg">
              <DragFillStar pieces={star.dragFill.pieces} slots={star.dragFill.slots} onComplete={() => onComplete(star.id)} />
            </div>
          )}
          {star.type === 'drag-fill' && star.dragFill && completed.has(star.id) && (
            <div className="text-4xl">✅</div>
          )}
          {star.type === 'hotspot' && star.hotspot && (
            <HotspotStar regions={star.hotspot.regions} correctId={star.hotspot.correctId} onComplete={() => onComplete(star.id)} />
          )}
          {star.type === 'quiz-single' && star.quiz && (
            <QuizStar question={star.quiz.question} options={star.quiz.options} onComplete={() => onComplete(star.id)} />
          )}
        </div>
      ))}
    </>
  )
}
