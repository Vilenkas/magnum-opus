import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { books } from '../books'
import { childrenOf, drugs, drugsIn } from '../data/catalog'
import { ClassShelf } from './ClassShelf'
import { DrugSearch } from './DrugSearch'
import { ClassLink, inTome } from './links'
import styles from './DrugBank.module.css'

/** The bank: search, then every family with its drugs on shelves. */
export function DrugBank() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <main className={styles.bank}>
      <nav className={styles.crumbs} aria-label="Ruta">
        <Link {...inTome()}>Farmacología</Link>
      </nav>
      <header className={styles.header}>
        <p className={styles.kicker}>Banco de fármacos</p>
        <h1 className={styles.title}>Vademécum</h1>
        <p className={styles.lead}>
          {drugs.length} principios activos, cada uno con su familia, su mecanismo y su molécula. Nombres internacionales.
        </p>
        <DrugSearch autoFocus />
      </header>

      {childrenOf(undefined).map((family) => {
        const count = drugsIn(family.id).length
        const book = books.find((b) => b.id === family.book)
        return (
          <section key={family.id} className={styles.family}>
            <div className={styles.familyHead}>
              <h2 className={styles.familyTitle}>
                <ClassLink id={family.id}>{family.title}</ClassLink>
              </h2>
              <span className={styles.count}>
                {count ? `${count} ${count === 1 ? 'ficha' : 'fichas'}` : 'en preparación'}
              </span>
              {book?.load && (
                <Link {...inTome(book.id)} className={styles.chapter}>
                  Capítulo {book.numeral} →
                </Link>
              )}
            </div>
            {count > 0 ? <ClassShelf clase={family.id} /> : <p className={styles.pending}>{family.summary}</p>}
          </section>
        )
      })}
    </main>
  )
}
