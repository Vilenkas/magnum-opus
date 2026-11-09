import { lazy, Suspense, useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import '@fontsource/marcellus'
import '@fontsource-variable/alegreya'
import '@fontsource-variable/alegreya/wght-italic.css'
import { useOutline } from '@/forge/useOutline'
import type { TomeProps } from '../types'
import { books, type Book } from './books'
import { BookIndex } from './components/BookIndex'
import { toInscription } from './inscription'
import { mdxComponents } from './components/mdx'
import styles from './tome.module.css'

export default function LatinTome({ path }: TomeProps) {
  const book = books.find((b) => b.id === path && b.load)
  return <div className={styles.root}>{book ? <BookView book={book} /> : <Frontispiece />}</div>
}

function Frontispiece() {
  return (
    <main className={styles.frontispiece}>
      <header className={styles.tabulaAnsata}>
        <p className={styles.kicker}>{toInscription('Liber de lingua')}</p>
        <h1 className={styles.title}>{toInscription('Lingua Latina')}</h1>
        <p className={styles.subtitle}>La lengua de Roma, para leerla y practicarla</p>
      </header>

      <nav aria-label="Libros del tomo">
        <ol className={styles.books}>
          {books.map((book) => (
            <li key={book.id}>
              {book.load ? (
                <Link to="/tomes/$tomeId/$" params={{ tomeId: 'latin', _splat: book.id }} className={styles.book}>
                  <BookEntry book={book} />
                </Link>
              ) : (
                <div className={`${styles.book} ${styles.bookPending}`}>
                  <BookEntry book={book} />
                  <span className={styles.pending}>En preparación</span>
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
      <span className={styles.numeral}>{book.numeral}</span>
      <span className={styles.bookLatin}>{toInscription(book.latin)}</span>
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
    <article className={styles.chapter}>
      <BookIndex numeral={book.numeral} title={book.latin} {...outline} />
      <header className={styles.chapterHeader}>
        <Link to="/tomes/$tomeId" params={{ tomeId: 'latin' }} className={styles.crumb}>
          {toInscription('Lingua Latina')}
        </Link>
        <p className={styles.chapterNumeral}>Liber {book.numeral}</p>
        <h1 className={styles.chapterLatin}>{toInscription(book.latin)}</h1>
        <p className={styles.chapterTitle}>{book.title}</p>
      </header>
      <div ref={prose} className={styles.prose}>
        <Suspense fallback={<p className={styles.loading}>Abriendo el libro…</p>}>
          <Content components={mdxComponents} />
        </Suspense>
      </div>
    </article>
  )
}
