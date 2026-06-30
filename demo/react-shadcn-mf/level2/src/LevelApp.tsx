import { STARS } from './data/level'
import FlipMatchStar from './components/FlipMatchStar'
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
          {star.type === 'flip-match' && star.flipMatch && (
            <FlipMatchStar cards={star.flipMatch.cards} onComplete={() => onComplete(star.id)} />
          )}
          {star.type === 'quiz-single' && star.quiz && (
            <QuizStar question={star.quiz.question} options={star.quiz.options} onComplete={() => onComplete(star.id)} />
          )}
        </div>
      ))}
    </>
  )
}
