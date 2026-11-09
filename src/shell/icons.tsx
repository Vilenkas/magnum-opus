/** Stroke icons of the shell chrome (24×24 grid, currentColor). */

/** Book spines on a shelf: the library, i.e. the Atlas. */
export const SHELVES_PATH = 'M5 4v16M9 4v16M13 6l4 14M3 20h18'

/** An open book: a tome's front page. */
export const BOOK_PATH = 'M12 7C10 5.5 7 5 4 5.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 7v13'

export function Icon({ path, className = '' }: { path: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}
