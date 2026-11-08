import { describe, expect, it } from 'vitest'
import nervous from '../../assets/nervous.json'
import soft from '../../assets/soft-tissues.json'
import vessels from '../../assets/vessels.json'
import { JOINTS } from '../joint-index'
import { pieces } from '../skeleton'
import { DESCRIPTION_FILES, descriptionKey, descriptionOf, sourceLabel } from './index'

const known = new Set(
  [...pieces, ...(soft as { en: string }[]), ...(vessels as { en: string }[]), ...(nervous as { en: string }[]), ...JOINTS].map((e) => descriptionKey(e.en)),
)

describe('descriptions', () => {
  it('describe only structures that exist in a viewer’s model', () => {
    for (const [file, entries] of Object.entries(DESCRIPTION_FILES))
      for (const en of Object.keys(entries)) expect(known.has(descriptionKey(en)), `${file}: ${en}`).toBe(true)
  })

  it('are written in paragraphs and cite at least one source, with balanced emphasis marks', () => {
    for (const entries of Object.values(DESCRIPTION_FILES))
      for (const [en, d] of Object.entries(entries)) {
        expect(d.text.length, en).toBeGreaterThan(0)
        expect(d.sources.length, en).toBeGreaterThan(0)
        for (const p of d.text) expect((p.match(/\*\*/g) ?? []).length % 2, en).toBe(0)
      }
  })

  it('describe every bone, joint, joint piece and muscle of the upper limb', () => {
    const upper = (soft as { set: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) => e.set === 'joints' && e.groups?.some((g) => /upper limb|pectoral girdle|of hand/i.test(g.en)),
    )
    for (const e of upper) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const j of JOINTS.filter((j) => j.region === 'upper-limb')) expect(descriptionOf(j.en), j.en).toBeDefined()
    const muscles = (soft as { set: string; kind: string; part?: string; en: string; groups?: { en: string }[] }[]).filter(
      (e) =>
        e.set === 'muscles' &&
        e.kind === 'muscle' &&
        e.part === 'belly' &&
        e.groups?.some((g) => g.en === 'Muscles of upper limb' || /^(Trapezius|Latissimus dorsi|Pectoralis major) muscle$/.test(g.en)),
    )
    expect(muscles.length).toBeGreaterThan(50)
    for (const e of muscles) expect(descriptionOf(e.en), e.en).toBeDefined()
    for (const en of ['Serratus anterior muscle', 'Pectoralis minor muscle', 'Subclavius muscle', 'Rhomboid major muscle', 'Levator scapulae'])
      expect(descriptionOf(en), en).toBeDefined()
    for (const p of pieces.filter((p) => ['pectoral-girdle', 'arm-forearm', 'carpals', 'metacarpals', 'hand-phalanges'].includes(p.group)))
      expect(descriptionOf(p.en), p.en).toBeDefined()
  })

  it('are found whatever the case, and missing ones say nothing', () => {
    expect(descriptionOf('right atrium')).toBeDefined()
    expect(descriptionOf('Not a structure')).toBeUndefined()
    expect(descriptionOf(undefined)).toBeUndefined()
  })

  it('print short references with volume and page', () => {
    expect(sourceLabel({ fuente: 'testut-2', p: '39' })).toBe('Testut, t. II, p. 39')
    expect(sourceLabel({ fuente: 'latarjet-ruiz-2', p: '869' })).toBe('Latarjet y Ruiz Liard, t. 2, p. 869')
  })
})
