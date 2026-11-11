import { describe, expect, it } from 'vitest'
import { COLLATERALS, LESIONS, NORMAL, TERRITORIES, VEINS, lesionById, outcomes, type LesionId, type TerritoryId } from './venous-return'

const of = (lesion: LesionId | null, territory: TerritoryId) => {
  const o = outcomes(lesion ? lesionById.get(lesion)!.occludes : []).find((x) => x.territory.id === territory)!
  return { ...o, ids: o.collaterals.map((c) => c.id).sort() }
}

describe('venous return', () => {
  it('joins only veins it knows', () => {
    const ids = new Set(VEINS.map((v) => v.id))
    for (const [a, b] of NORMAL) expect(ids.has(a) && ids.has(b), `${a}–${b}`).toBe(true)
    for (const c of COLLATERALS) for (const e of [...c.ends, ...(c.signFrom ? [c.signFrom] : [])]) expect(ids.has(e), `${c.id}: ${e}`).toBe(true)
    for (const t of TERRITORIES) expect(ids.has(t.into), t.id).toBe(true)
    for (const l of LESIONS) for (const v of l.occludes) expect(ids.has(v), l.id).toBe(true)
  })

  it('drains every territory along the normal veins when nothing is closed', () => {
    for (const o of outcomes([])) expect(o.normal, o.territory.id).toBe(true)
  })

  it('opens the four portocaval anastomoses in cirrhosis, with oesophageal varices and the caput medusae', () => {
    const gut = of('cirrhosis', 'gut')
    expect(gut.normal).toBe(false)
    expect(gut.ids).toEqual(['oesophageal', 'paraumbilical', 'rectal', 'retroperitoneal'])
    expect(gut.signs.join(' ')).toMatch(/esofágicas/)
    expect(gut.signs.join(' ')).toMatch(/medusa/)
    // The rest of the body is untouched.
    for (const t of ['head', 'kidneys', 'lower-limbs'] as const) expect(of('cirrhosis', t).normal).toBe(true)
  })

  it('spares the paraumbilical veins when the portal trunk itself is blocked', () => {
    const gut = of('portal-thrombosis', 'gut')
    expect(gut.ids).toEqual(['oesophageal', 'rectal', 'retroperitoneal'])
    expect(gut.signs.join(' ')).not.toMatch(/medusa/)
  })

  it('sends the upper body through the azygos when the superior cava is closed above it', () => {
    const head = of('svc-above', 'head')
    expect(head.ids).toContain('upper-laterovertebral')
    expect(head.ids).toContain('anterolateral')
    // The paravertebral route has neither end in the stuck veins: it is not needed.
    expect(head.ids).not.toContain('paravertebral')
    // The azygos itself still drains: the chest wall is untouched.
    expect(of('svc-above', 'thoracic-wall').normal).toBe(true)
  })

  it('reverses the azygos towards the inferior cava when the obstruction is at or below it', () => {
    const head = of('svc-below', 'head')
    expect(head.ids).not.toContain('upper-laterovertebral')
    // The paraumbilical veins only carry portal blood outwards.
    expect(head.ids).not.toContain('paraumbilical')
    expect(head.ids).toEqual(expect.arrayContaining(['intravertebral', 'anteromedial', 'anterolateral']))
    const wall = of('svc-below', 'thoracic-wall')
    expect(wall.normal).toBe(false)
    expect(wall.ids).toEqual(expect.arrayContaining(['paravertebral', 'intravertebral']))
    // The oesophageal veins carry portal blood to the azygos, not the other way.
    expect(wall.ids).not.toContain('oesophageal')
  })

  it('lifts the lower body to the superior cava when the inferior cava is closed below the kidneys', () => {
    const legs = of('ivc-infra', 'lower-limbs')
    expect(legs.ids).toEqual(expect.arrayContaining(['paravertebral', 'intravertebral', 'anteromedial', 'anterolateral']))
    expect(legs.signs.join(' ')).toMatch(/subcutánea/)
    expect(legs.signs.join(' ')).not.toMatch(/medusa/)
    expect(legs.ids).not.toContain('paraumbilical')
    // The rectal veins take iliac blood into the portal system.
    expect(legs.ids).toContain('rectal')
    expect(of('ivc-infra', 'kidneys').normal).toBe(true)
  })
})
