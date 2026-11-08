import { describe, expect, it } from 'vitest'
import { BLEEDS, LAYERS, MID, SULCI, SUTURES, bleedOf, bleedThickness, boundaries } from './meninges'

const xs = Array.from({ length: 593 }, (_, i) => MID - 296 + i)

describe('meninges: the layers', () => {
  it('go from the bone to the cortex in Testut’s order, the dura’s two leaves first', () => {
    expect(LAYERS.map((l) => l.id)).toEqual(['bone', 'periosteal', 'meningeal', 'border', 'arachnoid', 'subarachnoid', 'pia', 'cortex'])
  })

  it('never cross: every boundary lies below the one before it, with or without a bleed', () => {
    for (const b of [undefined, ...BLEEDS])
      for (const x of xs) {
        const { ys } = boundaries(x, b)
        for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThan(ys[i - 1])
      }
  })

  it('leave the arachnoid bridging the sulci while the pia goes down into them', () => {
    for (const [c, depth] of SULCI) {
      const crown = boundaries(MID - c + 20).ys
      const sulcus = boundaries(MID - c).ys
      expect(sulcus[4] - sulcus[3]).toBeCloseTo(crown[4] - crown[3]) // arachnoid: same thickness
      expect(sulcus[5] - sulcus[4]).toBeGreaterThan(crown[5] - crown[4] + depth / 2) // space widens
    }
  })
})

describe('meninges: the bleeds', () => {
  const extra = bleedOf('extradural')
  const sub = bleedOf('subdural')
  const sah = bleedOf('subarachnoid')

  it('open the right interface: bone | dura, dura | arachnoid, arachnoid | pia', () => {
    expect([extra.at, sub.at, sah.at]).toEqual([1, 3, 4])
  })

  it('keep the extradural clot between two sutures, where the dura is fixed to the bone', () => {
    const [lo, hi] = extra.span
    expect(SUTURES.some((s) => s <= lo)).toBe(true)
    expect(SUTURES.some((s) => s >= hi)).toBe(true)
    for (const s of SUTURES) for (const side of [1, -1] as const) expect(bleedThickness(extra, MID + side * s, -1)).toBe(0)
  })

  it('let the subdural one cross the squamous suture but not the falx', () => {
    expect(bleedThickness(sub, MID - SUTURES[1], -1)).toBeGreaterThan(0)
    for (let d = 0; d < 296; d += 4) expect(bleedThickness(sub, MID + d, -1)).toBe(0) // other side
  })

  it('make the extradural clot short and thick, the subdural one long and thin', () => {
    const len = (b: typeof extra) => b.span[1] - b.span[0]
    expect(extra.peak / len(extra)).toBeGreaterThan(2 * (sub.peak / len(sub)))
  })

  it('push the brain in by the clot’s thickness, and leave what lies outside it in place', () => {
    for (const b of [extra, sub]) {
      const x = MID - b.peakAt
      const before = boundaries(x).ys
      const { ys, bloodTop } = boundaries(x, b)
      expect(bloodTop).toBeCloseTo(before[b.at])
      for (let i = 0; i < b.at; i++) expect(ys[i]).toBe(before[i])
      for (let i = b.at; i < ys.length; i++) expect(ys[i] - before[i]).toBeCloseTo(b.peak)
    }
  })

  it('let the subarachnoid blood fill the existing space on both sides, without a mass of its own', () => {
    expect(sah.oneSide).toBe(false)
    for (const x of [MID - 104, MID + 104]) {
      const { ys, bloodTop } = boundaries(x, sah)
      expect(ys).toEqual(boundaries(x).ys)
      expect(bloodTop).toBe(ys[4])
    }
  })
})
