import { useCallback, useMemo, useState } from 'react'
import { jointClasses, jointGenera, type JointClassId, type JointExample } from '../data/joints'
import { landmarkById } from '../data/landmarks'
import { pieceById, type BonePiece } from '../data/skeleton'
import { FullscreenButton, useFullscreen } from './skeleton/Fullscreen'
import { SkeletonStage, StageTag, type Focus, type PieceLook } from './skeleton/SkeletonStage'
import plate from './skeleton/plate.module.css'
import styles from './JointTypes.module.css'

function focusOn(example: JointExample): Focus {
  const anchor = example.anchor ? landmarkById.get(example.anchor) : undefined
  return anchor
    ? { kind: 'joint', position: anchor.position, pieceIds: example.pieces, view: example.view, frame: example.frame }
    : { kind: 'piece', id: example.pieces[0], context: 3 }
}

/** Lámina: the classes and genera of joints, each shown on a real joint of the skeleton. */
export function JointTypes() {
  const [classId, setClassId] = useState<JointClassId>('diarthrosis')
  const [genusId, setGenusId] = useState('enarthrosis')
  const [exampleId, setExampleId] = useState('hip')
  const fullscreen = useFullscreen<HTMLElement>()

  const jointClass = jointClasses.find((c) => c.id === classId)!
  const genera = jointGenera.filter((g) => g.class === classId)
  const genus = jointGenera.find((g) => g.id === genusId)!
  const example = genus.examples.find((e) => e.id === exampleId) ?? genus.examples[0]
  // A new object on every change re-frames the camera even if the target repeats.
  const focus = useMemo(() => focusOn(example), [example])

  const chooseClass = (id: JointClassId) => {
    const first = jointGenera.find((g) => g.class === id)!
    setClassId(id)
    setGenusId(first.id)
    setExampleId(first.examples[0].id)
  }

  const chooseGenus = (id: string) => {
    setGenusId(id)
    setExampleId(jointGenera.find((g) => g.id === id)!.examples[0].id)
  }

  const lookOf = useCallback(
    (p: BonePiece): PieceLook => {
      const i = example.pieces.indexOf(p.id)
      // Two tones, so the bones of the joint can be told apart; the rest steps back.
      if (i === 0) return 'selected'
      if (i > 0) return 'hover'
      return 'ghost'
    },
    [example],
  )

  const bones = example.pieces.map((id) => pieceById.get(id)!.base).join(' · ')

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>Lámina I · Clasificación de las articulaciones</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton active={fullscreen.active} onClick={fullscreen.toggle} />
        </div>
      )}

      <div className={styles.classes} role="tablist" aria-label="Clases de articulaciones">
        {jointClasses.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === classId}
            className={styles.classTab}
            data-active={c.id === classId}
            onClick={() => chooseClass(c.id)}
          >
            <span className={styles.className}>{c.name}</span>
            <span className={styles.classAka}>{c.aka}</span>
          </button>
        ))}
      </div>

      <p className={styles.classDescription}>{jointClass.description}</p>

      <div className={plate.chipBar} role="toolbar" aria-label="Géneros">
        {genera.map((g) => (
          <button key={g.id} className={plate.chip} data-active={g.id === genus.id} onClick={() => chooseGenus(g.id)}>
            {g.name}
          </button>
        ))}
      </div>

      <SkeletonStage lookOf={lookOf} isPickable={() => false} focus={focus}>
        <StageTag>{example.name}</StageTag>
      </SkeletonStage>

      <div className={plate.legend} aria-live="polite">
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <p className={plate.kicker}>
                {jointClass.name}
                {genus.aka && ` · ${genus.aka}`}
              </p>
              <h3 className={plate.title}>{genus.name}</h3>
            </div>
            {genus.examples.length > 1 && (
              <div className={styles.examples} role="group" aria-label="Ejemplos">
                {genus.examples.map((e) => (
                  <button key={e.id} className={plate.chip} data-active={e.id === example.id} onClick={() => setExampleId(e.id)}>
                    {e.name.replace(/^Articulación /, '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <dl className={styles.traits}>
            <dt>Superficies</dt>
            <dd>{genus.surfaces}</dd>
            <dt>Medios de unión</dt>
            <dd>{genus.ligaments}</dd>
            <dt>Movimientos</dt>
            <dd>{genus.movements}</dd>
          </dl>

          <p className={styles.example}>
            <span className={styles.exampleLabel}>Ejemplo</span> {example.name} ·{' '}
            <span className={plate.latin} lang="la">
              {example.latin}
            </span>{' '}
            <span className={plate.english}>({bones})</span>
          </p>
        </div>
      </div>
    </figure>
  )
}
