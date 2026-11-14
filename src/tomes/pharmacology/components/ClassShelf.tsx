import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { books } from '../books'
import { childrenOf, classById, drugs, drugsIn, familyOf, formatHalfLife, lineage } from '../data/catalog'
import type { DrugClass, Drug } from '../data/types'
import { ClassLink, DrugLink, inTome } from './links'
import styles from './ClassShelf.module.css'

/** One drug as a chip: name, and its half-life when known. */
function DrugChip({ drug }: { drug: Drug }) {
  return (
    <DrugLink id={drug.id} className={styles.chip}>
      <span className={styles.chipName}>{drug.name}</span>
      {drug.halfLife && <span className={styles.chipMeta}>{formatHalfLife(drug.halfLife)}</span>}
      {drug.status && <span className={styles.chipStatus}>{drug.status.kind === 'withdrawn' ? 'retirado' : 'en desuso'}</span>}
    </DrugLink>
  )
}

/** Drugs whose main class is exactly this one. */
const own = (id: string) => drugs.filter((d) => d.classes[0] === id)

/**
 * A class laid out as shelves: its own drugs, then one shelf per subclass, recursively. In MDX:
 * `<ClassShelf clase="benzodiazepines" />`.
 */
export function ClassShelf({ clase, depth = 0 }: { clase: string; depth?: number }) {
  const cls = classById.get(clase)
  if (!cls) return import.meta.env.DEV ? <p className={styles.missing}>[clase desconocida: {clase}]</p> : null
  const subs = childrenOf(clase).filter((c) => drugsIn(c.id).length)
  // A class with no drugs of its own (the anticonvulsant mood stabilisers) shows those serving it.
  const mine = own(clase).length || subs.length ? own(clase) : drugsIn(clase, true)
  return (
    <div className={depth ? styles.sub : styles.shelf}>
      {depth > 0 && (
        <h4 className={styles.subTitle}>
          <ClassLink id={cls.id}>{cls.title}</ClassLink>
        </h4>
      )}
      {mine.length > 0 && (
        <p className={styles.chips}>
          {mine.map((d) => (
            <DrugChip key={d.id} drug={d} />
          ))}
        </p>
      )}
      {subs.map((s) => (
        <ClassShelf key={s.id} clase={s.id} depth={depth + 1} />
      ))}
    </div>
  )
}

/** A class's own page: what it is, how it acts, what it shares, and its drugs. */
export function ClassPage({ cls }: { cls: DrugClass }) {
  const chain = lineage(cls.id)
  const family = familyOf(cls.id)
  const book = books.find((b) => b.id === family.book)
  const count = drugsIn(cls.id).length
  const guests = drugsIn(cls.id, true).filter((d) => !drugsIn(cls.id).includes(d))
  const mechanism = [...chain].reverse().find((c) => c.mechanism)?.mechanism

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [cls.id])

  return (
    <article className={styles.page}>
      <nav className={styles.crumbs} aria-label="Ruta">
        <Link {...inTome()}>Farmacología</Link>
        <span aria-hidden>›</span>
        <Link {...inTome('drugs')}>Banco</Link>
        {chain.slice(0, -1).map((c) => (
          <span key={c.id} className={styles.crumb}>
            <span aria-hidden>›</span>
            <ClassLink id={c.id}>{c.title}</ClassLink>
          </span>
        ))}
      </nav>
      <header className={styles.header}>
        <p className={styles.kicker}>{chain.length > 1 ? 'Clase' : 'Familia'}</p>
        <h1 className={styles.title}>{cls.title}</h1>
        <p className={styles.summary}>{cls.summary}</p>
        {mechanism && (
          <p className={styles.mechanism}>
            <span className={styles.label}>Mecanismo</span> {mechanism}
          </p>
        )}
        {book && (
          <p className={styles.book}>
            {book.load ? (
              <Link {...inTome(book.id)}>
                Leer el capítulo «{book.title}» →
              </Link>
            ) : (
              <span>El capítulo «{book.title}» está en preparación.</span>
            )}
          </p>
        )}
      </header>

      {cls.adverse && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Efectos adversos comunes</h2>
          <ul className={styles.list}>
            {cls.adverse.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {count ? `${count} ${count === 1 ? 'fármaco' : 'fármacos'}` : 'Fármacos'}
        </h2>
        {count ? <ClassShelf clase={cls.id} /> : <p className={styles.empty}>Sus fichas aún están por escribir.</p>}
      </section>

      {guests.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>También se usan aquí</h2>
          <p className={styles.chips}>
            {guests.map((d) => (
              <DrugChip key={d.id} drug={d} />
            ))}
          </p>
        </section>
      )}
    </article>
  )
}
