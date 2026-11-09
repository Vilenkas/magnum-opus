import { lazy, Suspense, useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource-variable/eb-garamond'
import '@fontsource-variable/eb-garamond/wght-italic.css'
import { useOutline } from '@/forge/useOutline'
import type { TomeProps } from '../types'
import { books, type Book } from './books'
import { BookIndex } from './components/BookIndex'
import { CitationProvider, Sources } from './components/Citations'
import { Loading } from './components/Loading'
import { mdxComponents } from './components/mdx'
import styles from './tome.module.css'

export default function AnatomyTome({ manifest, path }: TomeProps) {
  const book = books.find((b) => b.id === path && b.load)
  return (
    <div className={styles.root}>
      {book ? <BookView key={book.id} book={book} /> : <Frontispiece title={manifest.title} subtitle={manifest.subtitle} />}
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
          ❦
        </div>
      </header>

      <nav aria-label="Libros del tratado">
        <ol className={styles.bookList}>
          {books.map((book) => (
            <li key={book.id}>
              {book.load ? (
                <Link to="/tomes/$tomeId/$" params={{ tomeId: 'anatomy', _splat: book.id }} className={styles.bookEntry}>
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
        <Link to="/tomes/$tomeId" params={{ tomeId: 'anatomy' }} className={styles.crumb}>
          Anatomía
        </Link>
        <p className={styles.numeral}>Libro {book.numeral}</p>
        <h1 className={styles.bookHeading}>{book.title}</h1>
        <div className={styles.rule} aria-hidden>
          ❦
        </div>
      </header>
      <div ref={prose} className={styles.prose}>
        <CitationProvider>
          <Suspense fallback={<Loading label="Abriendo el libro…" />}>
            <Content components={mdxComponents} />
            {/* After the chapter, so every <Cita> has registered. */}
            <Sources />
          </Suspense>
        </CitationProvider>
      </div>
    </article>
  )
}
