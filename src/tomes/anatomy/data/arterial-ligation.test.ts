import { describe, expect, it } from 'vitest'
import { LIGATURES, NETWORKS, PULSES, SEGMENTS, flows, openNetworks, segmentById } from './arterial-ligation'

const tie = (id: string) => {
  const l = LIGATURES.find((x) => x.id === id)!
  const f = flows([l.segment])
  return { f, pulse: (p: string) => f.get(PULSES.find((x) => x.id === p)!.segment), networks: openNetworks([l.segment]).map((n) => n.id) }
}

describe('arterial ligation', () => {
  it('names only segments it knows', () => {
    for (const n of NETWORKS) for (const e of n.ends) expect(segmentById.has(e), `${n.id}: ${e}`).toBe(true)
    for (const p of PULSES) expect(segmentById.has(p.segment), p.id).toBe(true)
    for (const l of LIGATURES) expect(segmentById.has(l.segment), l.id).toBe(true)
  })

  it('feeds every segment along the main arteries when nothing is tied', () => {
    const f = flows([])
    for (const s of SEGMENTS) expect(f.get(s.id), s.id).toBe('main')
  })

  it('saves the hand when the axillary is tied above the subscapular, through the scapular network', () => {
    const { f, pulse, networks } = tie('axillary-high')
    expect(f.get('palmar-arches')).toBe('collateral')
    expect(pulse('radial')).toBe('collateral')
    expect(networks).toEqual(['scapular'])
    // The subscapular artery now runs backwards, into the axillary.
    expect(f.get('subscapular')).toBe('collateral')
  })

  it('loses the arm when the axillary is tied between the subscapular and the profunda brachii', () => {
    const { f } = tie('axillary-low')
    expect(f.get('palmar-arches')).toBe('none')
    expect(f.get('brachial-distal')).toBe('none')
    expect(f.get('subscapular')).toBe('main')
  })

  it('keeps the hand when the brachial is clamped below the profunda, through the elbow network, without a radial pulse', () => {
    const { f, pulse, networks } = tie('brachial-low')
    expect(f.get('palmar-arches')).toBe('collateral')
    expect(pulse('radial')).toBe('collateral')
    expect(pulse('brachial')).not.toBe('main')
    expect(networks).toEqual(['elbow'])
  })

  it('compressing the subclavian over the first rib stops the pulses but not the scapular collaterals', () => {
    const { f, pulse } = tie('subclavian-compression')
    expect(pulse('subclavian')).toBe('none')
    expect(pulse('radial')).toBe('collateral')
    expect(f.get('thyrocervical')).toBe('main')
  })

  it('bypasses a femoral ligature below the profunda through the knee network, and above it through the cruciate anastomosis', () => {
    const low = tie('femoral-low')
    expect(low.f.get('popliteal')).toBe('collateral')
    expect(low.networks).toEqual(['genicular'])
    expect(low.pulse('dorsalis-pedis')).toBe('collateral')
    const high = tie('femoral-high')
    expect(high.f.get('profunda-femoris')).toBe('collateral')
    expect(high.networks).toContain('cruciate')
    expect(high.pulse('femoral')).toBe('none')
  })

  it('loses the leg below a torn popliteal artery', () => {
    const { f } = tie('popliteal')
    expect(f.get('anterior-tibial')).toBe('none')
    expect(f.get('posterior-tibial')).toBe('none')
  })
})
