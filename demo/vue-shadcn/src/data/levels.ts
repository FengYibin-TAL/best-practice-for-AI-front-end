export type StarType = 'drag-fill' | 'flip-match' | 'hotspot' | 'quiz-single'

export interface DragFillConfig {
  pieces: { id: string; emoji: string; slotId: string }[]
  slots: { id: string; x: number; y: number; w: number; h: number }[]
}
export interface FlipMatchConfig { cards: { id: string; pairId: string; emoji: string }[] }
export interface HotspotConfig { regions: { id: string; dir: 'up' | 'down' | 'left' | 'right' }[]; correctId: string }
export interface QuizConfig { question: string; options: { id: string; text: string; correct: boolean }[] }

export interface Star {
  id: string
  type: StarType
  pos: { x: number; y: number }
  dragFill?: DragFillConfig
  flipMatch?: FlipMatchConfig
  hotspot?: HotspotConfig
  quiz?: QuizConfig
}
export interface Level { id: number; bg: string; stars: Star[] }

export const LEVELS: Level[] = [
  {
    id: 1, bg: 'linear-gradient(135deg,#fde68a,#fca5a5)',
    stars: [
      { id: '1a', type: 'drag-fill', pos: { x: 0.3, y: 0.4 },
        dragFill: {
          pieces: [{ id: 'p1', emoji: '🍎', slotId: 's1' }, { id: 'p2', emoji: '🍌', slotId: 's2' }, { id: 'p3', emoji: '🍇', slotId: 's3' }],
          slots: [{ id: 's1', x: 18, y: 12, w: 18, h: 24 }, { id: 's2', x: 42, y: 12, w: 18, h: 24 }, { id: 's3', x: 66, y: 12, w: 18, h: 24 }],
        } },
      { id: '1b', type: 'hotspot', pos: { x: 0.68, y: 0.6 },
        hotspot: { regions: [{ id: 'u', dir: 'up' }, { id: 'd', dir: 'down' }, { id: 'l', dir: 'left' }, { id: 'r', dir: 'right' }], correctId: 'u' } },
    ],
  },
  {
    id: 2, bg: 'linear-gradient(135deg,#bfdbfe,#a5f3fc)',
    stars: [
      { id: '2a', type: 'flip-match', pos: { x: 0.3, y: 0.42 },
        flipMatch: { cards: [{ id: 'c1', pairId: 'a', emoji: '🐶' }, { id: 'c2', pairId: 'b', emoji: '🐱' }, { id: 'c3', pairId: 'c', emoji: '🐰' }, { id: 'c4', pairId: 'a', emoji: '🐶' }, { id: 'c5', pairId: 'b', emoji: '🐱' }, { id: 'c6', pairId: 'c', emoji: '🐰' }] } },
      { id: '2b', type: 'quiz-single', pos: { x: 0.68, y: 0.7 },
        quiz: { question: 'Largest planet?', options: [{ id: 'o1', text: 'Earth', correct: false }, { id: 'o2', text: 'Jupiter', correct: true }, { id: 'o3', text: 'Mars', correct: false }] } },
    ],
  },
  {
    id: 3, bg: 'linear-gradient(135deg,#ddd6fe,#fbcfe8)',
    stars: [
      { id: '3a', type: 'drag-fill', pos: { x: 0.26, y: 0.4 },
        dragFill: {
          pieces: [{ id: 'p1', emoji: '🌟', slotId: 's1' }, { id: 'p2', emoji: '⭐', slotId: 's2' }, { id: 'p3', emoji: '✨', slotId: 's3' }, { id: 'p4', emoji: '💫', slotId: 's4' }, { id: 'p5', emoji: '⚡', slotId: 's5' }],
          slots: [{ id: 's1', x: 8, y: 10, w: 14, h: 20 }, { id: 's2', x: 24, y: 10, w: 14, h: 20 }, { id: 's3', x: 40, y: 10, w: 14, h: 20 }, { id: 's4', x: 56, y: 10, w: 14, h: 20 }, { id: 's5', x: 72, y: 10, w: 14, h: 20 }],
        } },
      { id: '3b', type: 'hotspot', pos: { x: 0.72, y: 0.55 },
        hotspot: { regions: [{ id: 'u', dir: 'up' }, { id: 'd', dir: 'down' }, { id: 'l', dir: 'left' }, { id: 'r', dir: 'right' }], correctId: 'l' } },
      { id: '3c', type: 'quiz-single', pos: { x: 0.5, y: 0.85 },
        quiz: { question: 'Fastest land animal?', options: [{ id: 'o1', text: 'Lion', correct: false }, { id: 'o2', text: 'Cheetah', correct: true }] } },
    ],
  },
]
