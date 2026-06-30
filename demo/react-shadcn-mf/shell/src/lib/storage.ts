const KEY = 'epic-labs-mf-v1'

export interface Progress {
  level: number
  completed: Record<number, string[]>
  ratings: Record<number, number>
  total: number
}

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Progress) : null
  } catch {
    return null
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch { /* ignore */ }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch { /* ignore */ }
}
