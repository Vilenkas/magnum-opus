/**
 * Desktop (Tauri) integration. Everything here is a no-op in the browser, so tomes can
 * call it unconditionally.
 */

/** True when running inside the Tauri desktop app. */
export const isDesktop = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

/**
 * In Tauri's webview the HTML Fullscreen API only fills the window. This also takes the
 * window itself fullscreen (or back), so a plate really covers the screen.
 */
export async function setWindowFullscreen(on: boolean): Promise<void> {
  if (!isDesktop) return
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    await getCurrentWindow().setFullscreen(on)
  } catch {
    // Missing permission or API: element fullscreen still works inside the window.
  }
}
