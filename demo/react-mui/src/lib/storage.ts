const KEY = 'epic-labs-progress-v2'

export interface ProgressState {
  currentLevel: number   // 0-indexed
  completedStars: string[]  // star ids that are done
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { currentLevel: 0, completedStars: [] }
    return JSON.parse(raw) as ProgressState
  } catch {
    return { currentLevel: 0, completedStars: [] }
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function clearProgress(): void {
  localStorage.removeItem(KEY)
}
