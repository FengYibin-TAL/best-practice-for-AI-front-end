// ─── Types ────────────────────────────────────────────────────────────────────

export type StarType = 'drag-fill' | 'hotspot' | 'quiz-single' | 'flip-match'

export interface DragPiece {
  id: string
  emoji: string
  slotId: string
}

export interface DragSlot {
  id: string
  x: number  // % of widget container width
  y: number  // % of widget container height
  w: number
  h: number
}

export interface DragFillData {
  pieces: DragPiece[]
  slots: DragSlot[]
}

export interface HotspotRegion {
  id: string
  label: string
}

export interface HotspotData {
  regions: HotspotRegion[]
  correctId: string
}

export interface QuizOption {
  id: string
  text: string
  correct: boolean
}

export interface QuizData {
  question: string
  options: QuizOption[]
}

export interface FlipCard {
  id: string
  groupId: string
  emoji: string
}

export interface FlipMatchData {
  cards: FlipCard[]
}

export interface Star {
  id: string
  type: StarType
  pos: { x: number; y: number }
  dragFill?: DragFillData
  hotspot?: HotspotData
  quiz?: QuizData
  flipMatch?: FlipMatchData
}

export interface Level {
  id: number
  bg: string
  stars: Star[]
}

// ─── Level Data ───────────────────────────────────────────────────────────────

export const LEVELS: Level[] = [
  {
    id: 1,
    bg: 'linear-gradient(135deg,#fde68a,#fca5a5)',
    stars: [
      {
        id: 'L1_1a',
        type: 'drag-fill',
        pos: { x: 0.3, y: 0.4 },
        dragFill: {
          pieces: [
            { id: 'p1', emoji: '🍎', slotId: 's1' },
            { id: 'p2', emoji: '🍌', slotId: 's2' },
            { id: 'p3', emoji: '🍇', slotId: 's3' },
          ],
          slots: [
            { id: 's1', x: 18, y: 12, w: 18, h: 24 },
            { id: 's2', x: 42, y: 12, w: 18, h: 24 },
            { id: 's3', x: 66, y: 12, w: 18, h: 24 },
          ],
        },
      },
      {
        id: 'L1_1b',
        type: 'hotspot',
        pos: { x: 0.68, y: 0.6 },
        hotspot: {
          regions: [
            { id: 'u', label: '↑' },
            { id: 'd', label: '↓' },
            { id: 'l', label: '←' },
            { id: 'r', label: '→' },
          ],
          correctId: 'u',
        },
      },
    ],
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg,#bfdbfe,#a5f3fc)',
    stars: [
      {
        id: 'L2_2a',
        type: 'flip-match',
        pos: { x: 0.3, y: 0.42 },
        flipMatch: {
          cards: [
            { id: 'c1', groupId: 'a', emoji: '🐶' },
            { id: 'c2', groupId: 'b', emoji: '🐱' },
            { id: 'c3', groupId: 'c', emoji: '🐰' },
            { id: 'c4', groupId: 'a', emoji: '🐶' },
            { id: 'c5', groupId: 'b', emoji: '🐱' },
            { id: 'c6', groupId: 'c', emoji: '🐰' },
          ],
        },
      },
      {
        id: 'L2_2b',
        type: 'quiz-single',
        pos: { x: 0.68, y: 0.7 },
        quiz: {
          question: 'Largest planet?',
          options: [
            { id: 'o1', text: 'Earth ❌', correct: false },
            { id: 'o2', text: 'Jupiter ✅', correct: true },
            { id: 'o3', text: 'Mars ❌', correct: false },
          ],
        },
      },
    ],
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg,#ddd6fe,#fbcfe8)',
    stars: [
      {
        id: 'L3_3a',
        type: 'drag-fill',
        pos: { x: 0.26, y: 0.4 },
        dragFill: {
          pieces: [
            { id: 'p1', emoji: '🌟', slotId: 's1' },
            { id: 'p2', emoji: '⭐', slotId: 's2' },
            { id: 'p3', emoji: '✨', slotId: 's3' },
            { id: 'p4', emoji: '💫', slotId: 's4' },
            { id: 'p5', emoji: '⚡', slotId: 's5' },
          ],
          slots: [
            { id: 's1', x: 5,  y: 12, w: 14, h: 24 },
            { id: 's2', x: 22, y: 12, w: 14, h: 24 },
            { id: 's3', x: 39, y: 12, w: 14, h: 24 },
            { id: 's4', x: 56, y: 12, w: 14, h: 24 },
            { id: 's5', x: 73, y: 12, w: 14, h: 24 },
          ],
        },
      },
      {
        id: 'L3_3b',
        type: 'hotspot',
        pos: { x: 0.72, y: 0.55 },
        hotspot: {
          regions: [
            { id: 'u', label: '↑' },
            { id: 'd', label: '↓' },
            { id: 'l', label: '←' },
            { id: 'r', label: '→' },
          ],
          correctId: 'l',
        },
      },
      {
        id: 'L3_3c',
        type: 'quiz-single',
        pos: { x: 0.5, y: 0.85 },
        quiz: {
          question: 'Fastest land animal?',
          options: [
            { id: 'o1', text: 'Lion ❌', correct: false },
            { id: 'o2', text: 'Cheetah ✅', correct: true },
          ],
        },
      },
    ],
  },
]
