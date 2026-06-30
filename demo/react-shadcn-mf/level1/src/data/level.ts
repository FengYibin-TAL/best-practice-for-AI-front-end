export type StarType = 'drag-fill' | 'hotspot'
export interface DragFillConfig {
  pieces: { id: string; emoji: string; slotId: string }[]
  slots: { id: string; x: number; y: number; w: number; h: number }[]
}
export interface HotspotConfig {
  regions: { id: string; dir: 'up' | 'down' | 'left' | 'right' }[]
  correctId: string
}
export interface Star {
  id: string; type: StarType; pos: { x: number; y: number }
  dragFill?: DragFillConfig; hotspot?: HotspotConfig
}

export const STARS: Star[] = [
  { id: '1a', type: 'drag-fill', pos: { x: 0.3, y: 0.4 },
    dragFill: {
      pieces: [{ id: 'p1', emoji: '🍎', slotId: 's1' }, { id: 'p2', emoji: '🍌', slotId: 's2' }, { id: 'p3', emoji: '🍇', slotId: 's3' }],
      slots: [{ id: 's1', x: 18, y: 12, w: 18, h: 24 }, { id: 's2', x: 42, y: 12, w: 18, h: 24 }, { id: 's3', x: 66, y: 12, w: 18, h: 24 }],
    } },
  { id: '1b', type: 'hotspot', pos: { x: 0.68, y: 0.6 },
    hotspot: { regions: [{ id: 'u', dir: 'up' }, { id: 'd', dir: 'down' }, { id: 'l', dir: 'left' }, { id: 'r', dir: 'right' }], correctId: 'u' } },
]
