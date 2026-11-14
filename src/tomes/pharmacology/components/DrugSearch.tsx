import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { classes, classPathText, drugs, lineage } from '../data/catalog'
import { searchBank, type Hit } from '../data/search'
import { classPath, drugPath, inTome } from './links'
import styles from './DrugSearch.module.css'

const LIMIT = 8

/** The bank's search box, with its results listed under it as you type. */
export function DrugSearch({ autoFocus = false, placeholder = 'Busca un fármaco, una marca o una familia…' }: { autoFocus?: boolean; placeholder?: string }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const listId = useId()
  const hits = useMemo(() => searchBank(query, drugs, classes, classPathText).slice(0, LIMIT), [query])

  const pathOf = (h: Hit) => (h.kind === 'drug' ? drugPath(h.drug.id) : classPath(h.cls.id))

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (!hits.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % hits.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + hits.length) % hits.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      navigate(inTome(pathOf(hits[Math.min(active, hits.length - 1)])))
    }
  }

  return (
    <div className={styles.search}>
      <label className={styles.box}>
        <span className={styles.icon} aria-hidden>
          ⌕
        </span>
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Buscar en el banco de fármacos"
          aria-controls={listId}
          aria-activedescendant={hits.length ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKey}
        />
      </label>
      {query.trim() && (
        <ul id={listId} className={styles.results} role="listbox" aria-label="Resultados">
          {hits.length === 0 && <li className={styles.empty}>Nada con «{query.trim()}» en el banco todavía.</li>}
          {hits.map((h, i) => (
            <li key={pathOf(h)} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <Link {...inTome(pathOf(h))} className={styles.hit} onMouseEnter={() => setActive(i)}>
                {h.kind === 'drug' ? (
                  <>
                    <span className={styles.name}>
                      {h.drug.name}
                      {h.drug.brand && <span className={styles.brand}>{h.drug.brand}</span>}
                    </span>
                    <span className={styles.detail}>
                      {lineage(h.drug.classes[0])
                        .map((c) => c.title)
                        .join(' › ')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.name}>
                      <span className={styles.kind}>Familia</span>
                      {h.cls.title}
                    </span>
                    <span className={styles.detail}>
                      {lineage(h.cls.id)
                        .slice(0, -1)
                        .map((c) => c.title)
                        .join(' › ') || 'Familia del tratado'}
                    </span>
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
