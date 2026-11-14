import { Link } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import rawMolecules from '../assets/molecules.json'
import { classAdverse, classById, durationOf, formatHalfLife, lineage, mechanismOf, siblingsOf } from '../data/catalog'
import type { Molecule as MoleculeData } from '../data/molecule'
import type { Drug } from '../data/types'
import { RefList } from './Citations'
import { HalfLifeBar } from './HalfLifeBar'
import { BrandName } from './BrandName'
import { ClassLink, DrugLink, Formula, inTome, Rich } from './links'
import { Molecule } from './Molecule'
import styles from './DrugCard.module.css'

const molecules = rawMolecules as unknown as Record<string, MoleculeData>

const DURATION = { short: 'acción corta', intermediate: 'acción intermedia', long: 'acción prolongada' }

/** A drug's card: who it is, what it does, its molecule. */
export function DrugCard({ drug }: { drug: Drug }) {
  const molecule = molecules[drug.id]
  const chain = lineage(drug.classes[0])
  const shared = classAdverse(drug)
  const siblings = siblingsOf(drug)
  const also = drug.classes.slice(1).map((id) => classById.get(id)!)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [drug.id])

  return (
    <article className={styles.card}>
      <nav className={styles.crumbs} aria-label="Ruta">
        <Link {...inTome()}>Farmacología</Link>
        <span aria-hidden>›</span>
        <Link {...inTome('drugs')}>Banco</Link>
        {chain.map((c) => (
          <span key={c.id} className={styles.crumb}>
            <span aria-hidden>›</span>
            <ClassLink id={c.id}>{c.title}</ClassLink>
          </span>
        ))}
      </nav>

      <header className={styles.header}>
        <div className={styles.names}>
          <h1 className={styles.name}>{drug.name}</h1>
          <p className={styles.inn}>
            <span lang="en">{drug.inn}</span>
            <span className={styles.innTag}>DCI en inglés</span>
            <BrandName key={drug.id} drug={drug} className={styles.brand} />
          </p>
        </div>
        {drug.status && (
          <p className={`${styles.status} ${styles[drug.status.kind]}`}>
            <strong>{drug.status.kind === 'withdrawn' ? 'Retirado' : 'En desuso'}</strong> {drug.status.note}
          </p>
        )}
        <p className={styles.summary}>{drug.summary}</p>
        {also.length > 0 && (
          <p className={styles.also}>
            También:
            {also.map((c) => (
              <ClassLink key={c.id} id={c.id} className={styles.chip}>
                {c.title}
              </ClassLink>
            ))}
          </p>
        )}
      </header>

      <div className={styles.body}>
        <aside className={styles.molecule} aria-label="Molécula">
          <div className={styles.structure}>
            <Molecule molecule={molecule} title={drug.name} />
          </div>
          <dl className={styles.facts}>
            <dt>Fórmula</dt>
            <dd className={styles.mono}>
              <Formula formula={molecule.formula} />
            </dd>
            <dt>Masa molar</dt>
            <dd className={styles.mono}>{molecule.weight.toFixed(2).replace('.', ',')} g/mol</dd>
            {molecule.xlogp !== undefined && (
              <>
                <dt title="Coeficiente de reparto octanol/agua calculado: cuanto mayor, más liposoluble">Liposolubilidad</dt>
                <dd className={styles.mono}>XLogP {String(molecule.xlogp).replace('.', ',')}</dd>
              </>
            )}
            {molecule.atc.length > 0 && (
              <>
                <dt>Código ATC</dt>
                <dd className={styles.mono}>{molecule.atc.join(' · ')}</dd>
              </>
            )}
            <dt>PubChem</dt>
            <dd className={styles.mono}>CID {molecule.cid}</dd>
          </dl>
          <p className={styles.iupac} lang="en">
            {molecule.iupac}
          </p>
        </aside>

        <div className={styles.text}>
          <Section title="Mecanismo">
            <p>{mechanismOf(drug)}</p>
          </Section>

          <Section title="Para qué se usa">
            <List items={drug.uses} />
          </Section>

          {(drug.halfLife || drug.kinetics) && (
            <Section title="Farmacocinética">
              {drug.halfLife && (
                <div className={styles.halfLife}>
                  <p>
                    <span className={styles.label}>Semivida</span>{' '}
                    <strong className={styles.mono}>{formatHalfLife(drug.halfLife)}</strong>
                    {drug.halfLife.metabolites && <span className={styles.hint}> con sus metabolitos activos</span>}
                    {chain.some((c) => c.id === 'benzodiazepines') && (
                      <span className={styles.hint}> · {DURATION[durationOf(drug.halfLife)]}</span>
                    )}
                  </p>
                  <HalfLifeBar halfLife={drug.halfLife} />
                </div>
              )}
              {drug.kinetics && <List items={drug.kinetics} />}
            </Section>
          )}

          {(drug.adverse || shared.length > 0) && (
            <Section title="Efectos adversos">
              {drug.adverse && <List items={drug.adverse} />}
              {shared.map(({ cls, effects }) => (
                <div key={cls.id} className={styles.shared}>
                  <p className={styles.sharedTitle}>
                    Comunes a <ClassLink id={cls.id}>{cls.title.toLowerCase()}</ClassLink>
                  </p>
                  <List items={effects} />
                </div>
              ))}
            </Section>
          )}

          {drug.interactions && (
            <Section title="Interacciones">
              <List items={drug.interactions} />
            </Section>
          )}

          {drug.notes && (
            <Section title="Notas">
              {drug.notes.map((n) => (
                <p key={n}>
                  <Rich text={n} />
                </p>
              ))}
            </Section>
          )}

          {siblings.length > 0 && (
            <Section title={`Otros ${chain.length > 1 ? `en «${chain[chain.length - 1].title.toLowerCase()}»` : 'de la familia'}`}>
              <p className={styles.siblings}>
                {siblings.map((s) => (
                  <DrugLink key={s.id} id={s.id} className={styles.chip} />
                ))}
              </p>
            </Section>
          )}

          <Section title="Fuentes">
            <RefList refs={[...drug.refs, { source: 'pubchem' }, ...(molecule.atc.length ? [{ source: 'wikidata' as const }] : [])]} />
          </Section>
        </div>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((i) => (
        <li key={i}>
          <Rich text={i} />
        </li>
      ))}
    </ul>
  )
}
