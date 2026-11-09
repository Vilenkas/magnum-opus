import { lazy, Suspense, useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource-variable/eb-garamond'
import '@fontsource-variable/eb-garamond/wght-italic.css'
import { useOutline } from '@/forge/useOutline'
import type { TomeProps } from '../types'
import { books, type Book } from './books'
import { BookIndex } from './components/BookIndex'
import { CitationProvider, Sources } from './components/Citations'
import { GeometryQuiz } from './components/GeometryQuiz'
import { mdxComponents } from './components/mdx'
import styles from './tome.module.css'

export default function GeometryTome({ manifest, path }: TomeProps) {
  if (path === 'exam') {
    return <ExamView />
  }

  const book = books.find((b) => b.id === path && b.load)
  return (
    <div className={styles.root}>
      {book ? <BookView key={book.id} book={book} /> : <Frontispiece title={manifest.title} subtitle={manifest.subtitle} />}
    </div>
  )
}

function ExamView() {
  return (
    <div className={styles.root}>
      <article className={styles.book}>
        <header className={styles.bookHeader}>
          <Link to="/tomes/$tomeId" params={{ tomeId: 'geometry' }} className={styles.crumb}>
            Geometría
          </Link>
          <p className={styles.numeral}>Autoevaluación</p>
          <h1 className={styles.bookHeading}>Examen de Geometría Analítica</h1>
          <p className={styles.subtitle}>
            Evaluación interactiva basada en el tratado de Charles H. Lehmann
          </p>
          <div className={styles.rule} aria-hidden>
            ◈
          </div>
        </header>
        <div className={styles.prose}>
          <GeometryQuiz />
        </div>
      </article>
    </div>
  )
}

function Frontispiece({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <main className={styles.frontispiece}>
      <header className={styles.titlePage}>
        <p className={styles.kicker}>Tratado de</p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.rule} aria-hidden>
          ◈
        </div>
      </header>

      <nav aria-label="Libros del tratado">
        <ol className={styles.bookList}>
          {books.map((book) => (
            <li key={book.id}>
              {book.load ? (
                <Link
                  to="/tomes/$tomeId/$"
                  params={{ tomeId: 'geometry', _splat: book.id }}
                  className={styles.bookEntry}
                >
                  <BookEntry book={book} />
                </Link>
              ) : (
                <div className={`${styles.bookEntry} ${styles.bookPending}`}>
                  <BookEntry book={book} />
                  <span className={styles.pendingTag}>En preparación</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <section className={styles.examBanner} aria-label="Examen de autoevaluación">
        <span className={styles.numeral}>Autoevaluación interactiva</span>
        <h2 className={styles.bookTitle}>Examen de Geometría Analítica</h2>
        <p className={styles.bookSummary}>
          Ejercicios deductivos de distancia, división de segmentos, ecuaciones de rectas y secciones
          cónicas con citas y explicaciones de Lehmann.
        </p>
        <Link
          to="/tomes/$tomeId/$"
          params={{ tomeId: 'geometry', _splat: 'exam' }}
          className={styles.examLink}
        >
          Iniciar examen interactivo →
        </Link>
      </section>
    </main>
  )
}

function BookEntry({ book }: { book: Book }) {
  return (
    <>
      <span className={styles.numeral}>Libro {book.numeral}</span>
      <span className={styles.bookTitle}>{book.title}</span>
      <span className={styles.bookSummary}>{book.summary}</span>
    </>
  )
}

function BookView({ book }: { book: Book }) {
  const Content = useMemo(() => lazy(book.load!), [book])
  const prose = useRef<HTMLDivElement>(null)
  const outline = useOutline(prose)
  return (
    <article className={styles.book}>
      <BookIndex numeral={book.numeral} title={book.title} {...outline} />
      <header className={styles.bookHeader}>
        <Link to="/tomes/$tomeId" params={{ tomeId: 'geometry' }} className={styles.crumb}>
          Geometría
        </Link>
        <p className={styles.numeral}>Libro {book.numeral}</p>
        <h1 className={styles.bookHeading}>{book.title}</h1>
        {book.subtitle && <p className={styles.subtitle}>{book.subtitle}</p>}
        <div className={styles.rule} aria-hidden>
          ◈
        </div>
      </header>
      <div ref={prose} className={styles.prose}>
        <CitationProvider>
          <Suspense fallback={<p className={styles.loading}>Abriendo el libro…</p>}>
            <Content components={mdxComponents} />
            <Sources />
          </Suspense>
        </CitationProvider>
      </div>
    </article>
  )
}
