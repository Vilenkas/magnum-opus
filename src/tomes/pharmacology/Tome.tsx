import { lazy, Suspense, useMemo, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/ibm-plex-sans/wght-italic.css'
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/source-serif-4/wght-italic.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import { useOutline } from '@/forge/useOutline'
import type { TomeProps } from '../types'
import { books, type Book } from './books'
import { BookIndex } from './components/BookIndex'
import { CitationProvider, Sources } from './components/Citations'
import { ClassPage } from './components/ClassShelf'
import { DrugBank } from './components/DrugBank'
import { DrugCard } from './components/DrugCard'
import { DrugSearch } from './components/DrugSearch'
import { inTome } from './components/links'
import { mdxComponents } from './components/mdx'
import { classById, drugById, drugs } from './data/catalog'
import styles from './tome.module.css'

/**
 * Routes inside the tome: '' front page, '<book>' a chapter of the treatise, 'drugs' the bank,
 * 'drugs/<id>' a drug's card, 'classes/<id>' a family or class.
 */
export default function PharmacologyTome({ manifest, path }: TomeProps) {
  const [head, id] = path.split('/')
  let page
  if (head === 'drugs' && id && drugById.has(id)) page = <DrugCard drug={drugById.get(id)!} />
  else if (head === 'drugs') page = <DrugBank />
  else if (head === 'classes' && id && classById.has(id)) page = <ClassPage cls={classById.get(id)!} />
  else {
    const book = books.find((b) => b.id === head && b.load)
    page = book ? <BookView key={book.id} book={book} /> : <Frontispiece title={manifest.title} subtitle={manifest.subtitle} />
  }
  return <div className={styles.root}>{page}</div>
}

function Frontispiece({ title, subtitle }: { title: string; subtitle?: string }) {
  const parts = [...new Set(books.map((b) => b.part))]
  return (
    <main className={styles.frontispiece}>
      <header className={styles.titlePage}>
        <p className={styles.kicker}>
          <span className={styles.rx} aria-hidden>
            ℞
          </span>
          Tratado y banco de fármacos
        </p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <section className={styles.bankBox} aria-label="Banco de fármacos">
        <DrugSearch />
        <p className={styles.bankNote}>
          {drugs.length} fichas por ahora ·{' '}
          <Link {...inTome('drugs')} className={styles.bankLink}>
            Recorrer el banco por familias →
          </Link>
        </p>
      </section>

      {parts.map((part) => (
        <nav key={part} aria-label={part} className={styles.part}>
          <h2 className={styles.partTitle}>{part}</h2>
          <ol className={styles.bookList}>
            {books
              .filter((b) => b.part === part)
              .map((book) => (
                <li key={book.id}>
                  {book.load ? (
                    <Link {...inTome(book.id)} className={styles.bookEntry}>
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
      ))}
    </main>
  )
}

function BookEntry({ book }: { book: Book }) {
  return (
    <>
      <span className={styles.numeral}>{book.numeral}</span>
      <span className={styles.bookText}>
        <span className={styles.bookTitle}>{book.title}</span>
        <span className={styles.bookSummary}>{book.summary}</span>
      </span>
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
        <Link {...inTome()} className={styles.crumb}>
          Farmacología · {book.part}
        </Link>
        <p className={styles.bookNumeral}>Capítulo {book.numeral}</p>
        <h1 className={styles.bookHeading}>{book.title}</h1>
      </header>
      <div ref={prose} className={styles.prose}>
        <CitationProvider>
          <Suspense fallback={<p className={styles.loading}>Abriendo el capítulo…</p>}>
            <Content components={mdxComponents} />
            <Sources />
          </Suspense>
        </CitationProvider>
      </div>
    </article>
  )
}
