/**
 * Tiny persistent key-value store for tomes (progress, quiz stats…).
 * Backed by localStorage, which persists in both the browser and Tauri's webview.
 * Keys are namespaced; reads and writes never throw (private mode, quota, etc.).
 */
const PREFIX = 'magnum-opus:'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage unavailable: progress simply isn't kept this session.
  }
}
