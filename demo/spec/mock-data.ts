// 共享数据契约（框架无关）。各栈将其拷入 src/data/ 或直接引用。
// 来源：EpicWeb EpicLabsBookPage / Star / DragFillItem / HotspotRegion 接口契约。

export type StarType = 'drag-fill' | 'hotspot' | 'quiz-single';

export interface StarCoordinates { x: number; y: number } // 0~1，相对书页

export interface DragFillItem {
  id: string;
  imageUrl: string;
  targetXPercent: number;
  targetYPercent: number;
  targetWidthPercent: number;
  targetHeightPercent: number;
}

export interface HotspotRegion {
  x: number; y: number; width: number; height: number; // 百分比
  direction: 'left' | 'right';
}

export interface QuizOption { id: string; text: string; correct: boolean }

export interface Star {
  id: string;
  type: StarType;
  coordinates: StarCoordinates;
  dragFill?: { items: DragFillItem[] };
  hotspot?: { regions: HotspotRegion[]; correctIndex: number };
  quiz?: { question: string; options: QuizOption[] };
}

export interface EpicLabsBookPage {
  pageNumber: number;
  starCount: number;
  stars: Star[];
  motionUrl?: string;
}

// mock API：替代 EpicWeb 的 getAvailableGroupings()
export function getAvailableGroupings(): Promise<{ pages: EpicLabsBookPage[] }> {
  return Promise.resolve({
    pages: [
      {
        pageNumber: 1,
        starCount: 3,
        stars: [
          {
            id: 's1', type: 'drag-fill', coordinates: { x: 0.3, y: 0.4 },
            dragFill: {
              items: [
                { id: 'd1', imageUrl: '/mock/piece-1.png', targetXPercent: 20, targetYPercent: 30, targetWidthPercent: 12, targetHeightPercent: 12 },
              ],
            },
          },
          {
            id: 's2', type: 'hotspot', coordinates: { x: 0.6, y: 0.5 },
            hotspot: {
              regions: [
                { x: 55, y: 40, width: 15, height: 15, direction: 'right' },
                { x: 75, y: 40, width: 15, height: 15, direction: 'right' },
              ],
              correctIndex: 0,
            },
          },
          {
            id: 's3', type: 'quiz-single', coordinates: { x: 0.5, y: 0.8 },
            quiz: {
              question: 'Which one is correct?',
              options: [
                { id: 'q1', text: 'A', correct: true },
                { id: 'q2', text: 'B', correct: false },
              ],
            },
          },
        ],
      },
    ],
  });
}

// 埋点事件名契约
export const TRACK_EVENTS = {
  STAR_CLICK: 'EPIC_LABS_STAR_CLICK',
  DRAG_FILL_COMPLETE: 'EPIC_LABS_DRAG_FILL_COMPLETE',
  HOTSPOT_CORRECT: 'EPIC_LABS_HOTSPOT_CORRECT',
  QUIZ_COMPLETE: 'EPIC_LABS_QUIZ_COMPLETE',
} as const;
