import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl text-gold">404</p>
        <p className="mt-4 text-muted">Este tomo aún no ha sido escrito.</p>
        <Link to="/" className="mt-8 inline-block text-sm tracking-widest text-gold uppercase hover:underline">
          Volver al Atlas
        </Link>
      </div>
    </main>
  )
}
