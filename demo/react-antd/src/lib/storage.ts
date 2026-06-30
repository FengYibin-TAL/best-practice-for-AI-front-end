const KEY = 'epic-labs-progress-v2'

export interface ProgressData {
  completed: string[]  // star ids
  currentLevel: number
}

const DEFAULT: ProgressData = { completed: [], currentLevel: 0 }

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<ProgressData>
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      currentLevel: typeof parsed.currentLevel === 'number' ? parsed.currentLevel : 0,
    }
  } catch {
    return DEFAULT
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // ignore quota errors
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
