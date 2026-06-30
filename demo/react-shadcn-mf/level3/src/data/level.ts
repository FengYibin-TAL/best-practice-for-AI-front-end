export type StarType = 'drag-fill' | 'hotspot' | 'quiz-single'
export interface DragFillConfig {
  pieces: { id: string; emoji: string; slotId: string }[]
  slots: { id: string; x: number; y: number; w: number; h: number }[]
}
export interface HotspotConfig {
  regions: { id: string; dir: 'up' | 'down' | 'left' | 'right' }[]
  correctId: string
}
export interface QuizConfig { question: string; options: { id: string; text: string; correct: boolean }[] }
export interface Star {
  id: string; type: StarType; pos: { x: number; y: number }
  dragFill?: DragFillConfig; hotspot?: HotspotConfig; quiz?: QuizConfig
}

export const STARS: Star[] = [
  { id: '3a', type: 'drag-fill', pos: { x: 0.26, y: 0.4 },
    dragFill: {
      pieces: [{ id: 'p1', emoji: '🌟', slotId: 's1' }, { id: 'p2', emoji: '⭐', slotId: 's2' }, { id: 'p3', emoji: '✨', slotId: 's3' }, { id: 'p4', emoji: '💫', slotId: 's4' }, { id: 'p5', emoji: '⚡', slotId: 's5' }],
      slots: [{ id: 's1', x: 8, y: 10, w: 14, h: 20 }, { id: 's2', x: 24, y: 10, w: 14, h: 20 }, { id: 's3', x: 40, y: 10, w: 14, h: 20 }, { id: 's4', x: 56, y: 10, w: 14, h: 20 }, { id: 's5', x: 72, y: 10, w: 14, h: 20 }],
    } },
  { id: '3b', type: 'hotspot', pos: { x: 0.72, y: 0.55 },
    hotspot: { regions: [{ id: 'u', dir: 'up' }, { id: 'd', dir: 'down' }, { id: 'l', dir: 'left' }, { id: 'r', dir: 'right' }], correctId: 'l' } },
  { id: '3c', type: 'quiz-single', pos: { x: 0.5, y: 0.85 },
    quiz: { question: 'Fastest land animal?', options: [{ id: 'o1', text: 'Lion', correct: false }, { id: 'o2', text: 'Cheetah', correct: true }] } },
]
