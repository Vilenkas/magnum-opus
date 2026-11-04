/** Stroke icons of the shell chrome (24×24 grid, currentColor). */

/** Book spines on a shelf: the library, i.e. the Atlas. */
export const SHELVES_PATH = 'M5 4v16M9 4v16M13 6l4 14M3 20h18'

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
