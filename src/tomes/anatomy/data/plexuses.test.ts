import { describe, expect, it } from 'vitest'
import { BRACHIAL, LUMBOSACRAL, outcome, rootsOf, signsOf, type Plexus, type Status } from './plexuses'

const lesion = (p: Plexus, id: string) => p.lesions.find((l) => l.id === id)!
const run = (p: Plexus, id: string) => outcome(p, lesion(p, id))
const signs = (p: Plexus, id: string) => signsOf(p, run(p, id)).map((s) => s.id)
const statuses = (m: Map<string, Status>, st: Status) => [...m].filter(([, v]) => v === st).map(([k]) => k)

describe('plexuses: the data', () => {
  for (const p of [BRACHIAL, LUMBOSACRAL]) {
    const ids = new Set(p.nodes.map((n) => n.id))
    it(`${p.id}: every parent, nerve and lesion names an existing node`, () => {
      for (const n of p.nodes) for (const f of n.from) expect(ids.has(f), `${n.id} ← ${f}`).toBe(true)
      for (const x of [...p.muscles, ...p.skin]) for (const s of x.supply) expect(ids.has(s.nerve), `${x.id}: ${s.nerve}`).toBe(true)
      for (const l of p.lesions) for (const n of l.nodes) expect(ids.has(n), `${l.id}: ${n}`).toBe(true)
      for (const r of p.reflexes) expect(p.muscles.some((m) => m.id === r.muscle)).toBe(true)
    })

    it(`${p.id}: every fibre a structure claims can reach its nerve from that root`, () => {
      for (const x of [...p.muscles, ...p.skin]) for (const s of x.supply) for (const r of s.roots) expect(rootsOf(p, s.nerve), `${x.id}: ${r} → ${s.nerve}`).toContain(r)
    })

    it(`${p.id}: no lesion leaves everything intact`, () => {
      for (const l of p.lesions) {
        const o = outcome(p, l)
        expect(
          [...o.muscles.values(), ...o.skin.values()].some((v) => v !== 'ok'),
          l.id,
        ).toBe(true)
      }
    })
  }
})

describe('brachial plexus: its constitution (Testut pp. 259–260)', () => {
  it('makes the lateral cord of C5–C7, the medial of C8–T1 and the posterior of all five roots', () => {
    expect(rootsOf(BRACHIAL, 'musculocutaneous')).toEqual(['C5', 'C6', 'C7'])
    expect(rootsOf(BRACHIAL, 'ulnar')).toEqual(['C8', 'T1'])
    expect(rootsOf(BRACHIAL, 'radial')).toEqual(['C5', 'C6', 'C7', 'C8', 'T1'])
  })

  it('builds the median of two roots, one from each anterior cord', () => {
    expect(BRACHIAL.nodes.find((n) => n.id === 'median')!.from.sort()).toEqual(['lateral', 'medial'])
    expect(rootsOf(BRACHIAL, 'median')).toEqual(['C5', 'C6', 'C7', 'C8', 'T1'])
  })
})

describe('brachial plexus: the palsies (Moore 8.ª pp. 199–200, 214, 241, 260)', () => {
  it('Erb–Duchenne: the shoulder and the elbow flexors go, the hand stays; the waiter’s tip', () => {
    const o = run(BRACHIAL, 'erb')
    for (const m of ['deltoid', 'supraspinatus', 'infraspinatus', 'biceps', 'brachialis', 'brachioradialis']) expect(o.muscles.get(m), m).toBe('lost')
    for (const m of ['interossei', 'thenar', 'fdpMedial']) expect(o.muscles.get(m), m).toBe('ok')
    expect(o.muscles.get('serratus')).toBe('ok') // its nerve leaves the roots before the trunk
    expect(o.reflexes.get('biceps')).toBe('lost')
    expect(signs(BRACHIAL, 'erb')).toContain('waiter')
  })

  it('Klumpke: the hand’s own muscles go, the shoulder stays; claw and Horner', () => {
    const o = run(BRACHIAL, 'klumpke')
    expect(statuses(o.muscles, 'lost')).toEqual(expect.arrayContaining(['thenar', 'hypothenar', 'interossei', 'lumbricals12', 'lumbricals34']))
    for (const m of ['deltoid', 'biceps']) expect(o.muscles.get(m)).toBe('ok')
    expect(signs(BRACHIAL, 'klumpke')).toEqual(expect.arrayContaining(['claw', 'horner']))
  })

  it('one root alone paralyses nothing and anaesthetises nothing (Sherrington; Thornburn)', () => {
    for (const id of ['c6', 'c7']) {
      const o = run(BRACHIAL, id)
      expect(statuses(o.muscles, 'lost'), id).toEqual([])
      expect(statuses(o.skin, 'lost'), id).toEqual([])
      expect(statuses(o.muscles, 'weak').length, id).toBeGreaterThan(3)
    }
  })

  it('C7 takes the triceps reflex; C6 only weakens the biceps reflex', () => {
    expect(run(BRACHIAL, 'c7').reflexes.get('triceps')).toBe('lost')
    expect(run(BRACHIAL, 'c6').reflexes.get('biceps')).toBe('weak')
  })

  it('the radial in its groove spares the triceps, whose branches leave above, but drops the wrist', () => {
    const o = run(BRACHIAL, 'radialGroove')
    expect(o.muscles.get('triceps')).toBe('ok')
    expect(o.reflexes.get('triceps')).toBe('ok')
    expect(o.muscles.get('brachioradialis')).toBe('lost')
    expect(o.skin.get('posteriorArm')).toBe('ok')
    expect(o.skin.get('dorsumRadial')).toBe('lost')
    expect(signs(BRACHIAL, 'radialGroove')).toContain('wristDrop')
  })

  it('the deep branch drops the fingers but not the wrist, and takes no skin', () => {
    const o = run(BRACHIAL, 'radialDeep')
    expect(signs(BRACHIAL, 'radialDeep')).toContain('fingerDrop')
    expect(signs(BRACHIAL, 'radialDeep')).not.toContain('wristDrop')
    expect(statuses(o.skin, 'lost')).toEqual([])
  })

  it('the posterior cord takes the deltoid and the whole radial: the crutch palsy', () => {
    const o = run(BRACHIAL, 'posteriorCord')
    for (const m of ['deltoid', 'latissimus', 'triceps', 'extensors']) expect(o.muscles.get(m), m).toBe('lost')
    expect(o.muscles.get('biceps')).toBe('ok')
  })

  it('the median at the elbow gives the hand of benediction; at the wrist only the ape hand', () => {
    expect(signs(BRACHIAL, 'medianElbow')).toEqual(expect.arrayContaining(['benediction', 'ape']))
    expect(signs(BRACHIAL, 'medianWrist')).toContain('ape')
    expect(signs(BRACHIAL, 'medianWrist')).not.toContain('benediction')
  })

  it('the carpal tunnel spares the palm: its branch leaves the median above the wrist', () => {
    const o = run(BRACHIAL, 'medianWrist')
    expect(o.skin.get('palmLateral')).toBe('ok')
    expect(o.skin.get('fingersMedian')).toBe('lost')
    expect(run(BRACHIAL, 'medianElbow').skin.get('palmLateral')).toBe('lost')
  })

  it('the ulnar claws the ring and little fingers at either level; at the wrist the dorsum is spared and the deep flexor kept', () => {
    for (const id of ['ulnarElbow', 'ulnarWrist']) expect(signs(BRACHIAL, id)).toContain('ulnarClaw')
    const wrist = run(BRACHIAL, 'ulnarWrist')
    expect(wrist.skin.get('dorsumUlnar')).toBe('ok')
    expect(wrist.muscles.get('fdpMedial')).toBe('ok')
    const elbow = run(BRACHIAL, 'ulnarElbow')
    expect(elbow.skin.get('dorsumUlnar')).toBe('lost')
    expect(elbow.muscles.get('fcu')).toBe('lost')
  })

  it('the axillary takes the deltoid and the teres minor; the long thoracic wings the scapula', () => {
    expect(statuses(run(BRACHIAL, 'axillary').muscles, 'lost').sort()).toEqual(['deltoid', 'teresMinor'])
    expect(signs(BRACHIAL, 'longThoracic')).toEqual(['winged'])
  })

  it('the brachialis keeps the radial’s branch when the musculocutaneous is cut (Testut p. 295)', () => {
    const o = run(BRACHIAL, 'musculocutaneous')
    expect(o.muscles.get('biceps')).toBe('lost')
    expect(o.muscles.get('brachialis')).toBe('weak')
  })
})

describe('lumbosacral plexus: its constitution (Testut pp. 307–336)', () => {
  it('makes the femoral and the obturator of L2–L4, and both sciatic nerves of L4–S3 or S2', () => {
    expect(rootsOf(LUMBOSACRAL, 'femoral')).toEqual(['L2', 'L3', 'L4'])
    expect(rootsOf(LUMBOSACRAL, 'obturator')).toEqual(['L2', 'L3', 'L4'])
    expect(rootsOf(LUMBOSACRAL, 'tibial')).toEqual(['L4', 'L5', 'S1', 'S2', 'S3'])
    expect(rootsOf(LUMBOSACRAL, 'peroneal')).toEqual(['L4', 'L5', 'S1', 'S2'])
  })
})

describe('lumbosacral plexus: the palsies (Moore 8.ª pp. 108, 718, 741, 764–766)', () => {
  it('L5 takes no reflex, only weakens the foot’s lifters; S1 takes the Achilles; L4 weakens the patellar', () => {
    const l5 = run(LUMBOSACRAL, 'l5')
    expect(l5.reflexes.get('patellar')).toBe('ok')
    expect(l5.reflexes.get('achilles')).toBe('ok')
    expect(l5.muscles.get('ehl')).toBe('weak')
    expect(run(LUMBOSACRAL, 's1').reflexes.get('achilles')).toBe('lost')
    expect(run(LUMBOSACRAL, 'l4').reflexes.get('patellar')).toBe('weak')
  })

  it('the femoral takes the quadriceps and its reflex, but not the iliacus, whose branches leave in the pelvis', () => {
    const o = run(LUMBOSACRAL, 'femoral')
    expect(o.muscles.get('quadriceps')).toBe('lost')
    expect(o.reflexes.get('patellar')).toBe('lost')
    expect(o.muscles.get('iliacus')).toBe('ok')
    expect(o.skin.get('medialLeg')).toBe('lost')
    expect(signs(LUMBOSACRAL, 'femoral')).toEqual(['quadriceps'])
  })

  it('the superior gluteal gives Trendelenburg’s sign', () => {
    expect(signs(LUMBOSACRAL, 'superiorGluteal')).toEqual(['trendelenburg'])
  })

  it('the sciatic in the buttock takes all below the knee and the hamstrings, but neither the patellar nor the back of the thigh', () => {
    const o = run(LUMBOSACRAL, 'sciatic')
    expect(o.muscles.get('hamstrings')).toBe('lost')
    expect(o.reflexes.get('achilles')).toBe('lost')
    expect(o.reflexes.get('patellar')).toBe('ok')
    expect(o.skin.get('posteriorThigh')).toBe('ok')
    expect(signs(LUMBOSACRAL, 'sciatic')).toEqual(expect.arrayContaining(['footDrop', 'tiptoe']))
  })

  it('the peroneal at the neck of the fibula drops the foot and spares the plantar flexors', () => {
    const o = run(LUMBOSACRAL, 'peroneal')
    expect(signs(LUMBOSACRAL, 'peroneal')).toEqual(['footDrop'])
    expect(o.muscles.get('tricepsSurae')).toBe('ok')
    expect(o.muscles.get('hamstrings')).toBe('ok')
    expect(o.skin.get('anterolateralLeg')).toBe('lost')
  })

  it('the tibial in the popliteal fossa keeps the hamstrings but not the calf', () => {
    const o = run(LUMBOSACRAL, 'tibial')
    expect(o.muscles.get('hamstrings')).toBe('ok')
    expect(signs(LUMBOSACRAL, 'tibial')).toEqual(['tiptoe'])
    expect(o.skin.get('sole')).toBe('lost')
  })

  it('the low roots of the cauda equina take the saddle and the sphincters', () => {
    expect(signs(LUMBOSACRAL, 'cauda')).toContain('sphincters')
    expect(run(LUMBOSACRAL, 'cauda').skin.get('anterolateralLeg')).toBe('ok')
  })
})
