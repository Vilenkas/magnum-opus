import { describe, expect, it } from 'vitest'
import { LESIONS, NODES, ORGANS, SEGMENTS, affected, lesion, organState, relayOf, type Way } from './autonomic'

const ways = ORGANS.flatMap((o) => [
  ...(o.sympathetic ? [{ organ: o.id, system: 'sympathetic' as const, way: o.sympathetic }] : []),
  ...(o.parasympathetic
    ? [
        {
          organ: o.id,
          system: 'parasympathetic' as const,
          way: o.parasympathetic,
        },
      ]
    : []),
])
const seg = (s: string) => SEGMENTS.indexOf(s)
const state = (l: string, organ: string) =>
  organState(
    ORGANS.find((o) => o.id === organ)!,
    lesion(l),
  )
const sorted = (xs: string[]) => [...xs].sort()

describe('vegetative system: the data', () => {
  it('names existing nodes, of the right system, with the relay on the way', () => {
    const ids = new Map(NODES.map((n) => [n.id, n]))
    for (const { organ, system, way } of ways) {
      for (const n of way.path) {
        expect(ids.has(n), `${organ}: ${n}`).toBe(true)
        expect(ids.get(n)!.system, `${organ}: ${n}`).toBe(system)
      }
      if (way.relay !== 'organ') {
        expect(way.path, organ).toContain(way.relay)
        expect(ids.get(way.relay)!.ganglion, `${organ}: ${way.relay}`).toBe(true)
      }
    }
    for (const l of LESIONS) for (const n of l.nodes) expect(ids.has(n), l.id).toBe(true)
  })

  it('every organ can be reached by some lesion, and every lesion changes some organ', () => {
    const hit = new Set(LESIONS.flatMap((l) => affected(l)))
    for (const o of ORGANS) expect(hit.has(o.id), o.id).toBe(true)
    for (const l of LESIONS) expect(affected(l).length, l.id).toBeGreaterThan(0)
  })
})

describe('vegetative system: its constitution (Testut pp. 384–392)', () => {
  it('the sympathetic leaves the cord only between T1 and L2 (thoracolumbar)', () => {
    for (const { organ, way } of ways.filter((w) => w.system === 'sympathetic')) {
      const [a, b] = way.centre as [string, string]
      expect(seg(a), organ).toBeGreaterThanOrEqual(seg('T1'))
      expect(seg(b), organ).toBeLessThanOrEqual(seg('L2'))
      expect(seg(a), organ).toBeLessThanOrEqual(seg(b))
    }
  })

  it('the parasympathetic comes only from the III, VII, IX and X and from S2–S4 (craniosacral)', () => {
    for (const { organ, way } of ways.filter((w) => w.system === 'parasympathetic')) {
      if (typeof way.centre === 'string') expect(['III', 'VII', 'IX', 'X'], organ).toContain(way.centre)
      else expect(way.centre, organ).toEqual(['S2', 'S4'])
    }
  })

  it('the parasympathetic relays near the organ, the sympathetic near the cord', () => {
    for (const { organ, system, way } of ways) {
      const r = relayOf(way as Way)
      if (!r) continue
      if (system === 'parasympathetic') expect(r.x, organ).toBeLessThanOrEqual(0.2)
      else expect(r.x, organ).toBeGreaterThanOrEqual(0.45)
    }
  })

  it('so, for one organ, the sympathetic postganglionic fibre is the longer of the two (Testut p. 389)', () => {
    for (const o of ORGANS.filter((x) => x.sympathetic && x.parasympathetic)) {
      expect(relayOf(o.sympathetic!)!.x, o.id).toBeGreaterThan(relayOf(o.parasympathetic!)!.x)
    }
  })

  it('both systems act on the iris, the heart, the bronchi, the gut, the rectum and the bladder', () => {
    expect(sorted(ORGANS.filter((o) => o.sympathetic && o.parasympathetic).map((o) => o.id))).toEqual(sorted(['pupil', 'heart', 'bronchi', 'gut', 'rectum', 'bladder']))
  })

  it('the skin, its glands and the vessels of the limbs have only the sympathetic (Testut p. 389)', () => {
    for (const id of ['face', 'arm', 'leg']) expect(ORGANS.find((o) => o.id === id)!.parasympathetic, id).toBeUndefined()
  })
})

describe('vegetative system: the lesions (Moore 8.ª pp. 546, 921, 1026)', () => {
  it('Horner: the cervical chain, the stellate or the root T1 shrink the pupil, drop the lid and dry the face', () => {
    for (const id of ['cervicalChain', 'stellate', 'T1root']) {
      expect(state(id, 'pupil').state, id).toBe('parasympathetic')
      expect(state(id, 'lid').state, id).toBe('lost')
      expect(state(id, 'face').state, id).toBe('lost')
      expect(state(id, 'accommodation').state, id).toBe('normal')
    }
  })

  it('the stellate also warms and dries the hand; the cervical chain above it does not', () => {
    expect(state('stellate', 'arm').state).toBe('lost')
    expect(state('cervicalChain', 'arm').state).toBe('normal')
  })

  it('the third nerve dilates the pupil and takes accommodation, but leaves the face and the lid', () => {
    expect(sorted(affected(lesion('oculomotor')))).toEqual(['accommodation', 'pupil'])
    expect(state('oculomotor', 'pupil').state).toBe('sympathetic')
  })

  it('the vagi in the neck take the brake off the heart; cut at the hiatus they spare it', () => {
    expect(state('vagusNeck', 'heart').state).toBe('sympathetic')
    expect(state('vagusNeck', 'gut').state).toBe('sympathetic')
    expect(affected(lesion('vagotomy'))).toEqual(['gut'])
  })

  it('S2–S4 retain the urine and abolish erection, but not ejaculation; the presacral nerve the reverse', () => {
    expect(state('sacral', 'bladder').state).toBe('sympathetic')
    expect(state('sacral', 'erection').state).toBe('lost')
    expect(state('sacral', 'ejaculation').state).toBe('normal')
    expect(state('presacral', 'ejaculation').state).toBe('lost')
    expect(state('presacral', 'erection').state).toBe('normal')
  })

  it('the lumbar sympathectomy changes only the leg; the splanchnics the gut and the adrenal', () => {
    expect(affected(lesion('lumbarChain'))).toEqual(['leg'])
    expect(sorted(affected(lesion('splanchnic')))).toEqual(['adrenal', 'gut'])
  })

  it('the facial in the petrous bone dries the eye and the submaxillary, not the parotid', () => {
    expect(sorted(affected(lesion('intermediary')))).toEqual(['lacrimal', 'submandibular'])
  })
})
