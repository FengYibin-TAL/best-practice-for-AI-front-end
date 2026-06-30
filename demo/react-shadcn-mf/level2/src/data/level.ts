export type StarType = 'flip-match' | 'quiz-single'
export interface FlipMatchConfig { cards: { id: string; pairId: string; emoji: string }[] }
export interface QuizConfig { question: string; options: { id: string; text: string; correct: boolean }[] }
export interface Star {
  id: string; type: StarType; pos: { x: number; y: number }
  flipMatch?: FlipMatchConfig; quiz?: QuizConfig
}

export const STARS: Star[] = [
  { id: '2a', type: 'flip-match', pos: { x: 0.3, y: 0.42 },
    flipMatch: { cards: [{ id: 'c1', pairId: 'a', emoji: '🐶' }, { id: 'c2', pairId: 'b', emoji: '🐱' }, { id: 'c3', pairId: 'c', emoji: '🐰' }, { id: 'c4', pairId: 'a', emoji: '🐶' }, { id: 'c5', pairId: 'b', emoji: '🐱' }, { id: 'c6', pairId: 'c', emoji: '🐰' }] } },
  { id: '2b', type: 'quiz-single', pos: { x: 0.68, y: 0.7 },
    quiz: { question: 'Largest planet?', options: [{ id: 'o1', text: 'Earth', correct: false }, { id: 'o2', text: 'Jupiter', correct: true }, { id: 'o3', text: 'Mars', correct: false }] } },
]
