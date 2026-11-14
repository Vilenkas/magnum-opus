import { describe, expect, it } from 'vitest'
import { drugById, isWithin } from './catalog'
import { bindingOf, bindings, expectedEffects } from './antidepressant-binding'

const lv = (id: string) => bindingOf(id)!.levels

describe('antidepressant binding (Katzung cuadro 30-2)', () => {
  it('names antidepressants of the bank, once each', () => {
    const ids = bindings.flatMap((b) => b.ids)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(isWithin(drugById.get(id)!.classes[0], 'antidepressants'), id).toBe(true)
  })

  it('makes the SSRIs block SERT strongly and spare the receptors behind the tricyclics’ adverse effects', () => {
    for (const id of ['citalopram', 'fluoxetine', 'fluvoxamine', 'paroxetine', 'sertraline']) {
      expect(lv(id).sert, id).toBe(3)
      expect(lv(id).net ?? 0, id).toBeLessThanOrEqual(1)
      expect(expectedEffects(bindingOf(id)!), id).toEqual([])
    }
  })

  it('makes the tertiary-amine tricyclics more anticholinergic than the secondary ones', () => {
    const maxSecondary = Math.max(lv('desipramine').m!, lv('nortriptyline').m!)
    for (const id of ['amitriptyline', 'imipramine']) expect(lv(id).m!, id).toBeGreaterThan(maxSecondary)
  })

  it('sorts the tricyclics by transporter as the text does', () => {
    // Clomipramine prefers SERT (hence obsessive-compulsive disorder); desipramine and nortriptyline, NET.
    expect(lv('clomipramine').sert!).toBeGreaterThan(lv('clomipramine').net!)
    for (const id of ['desipramine', 'nortriptyline']) expect(lv(id).net!, id).toBeGreaterThan(lv(id).sert!)
  })

  it('explains mirtazapine’s sedation and bupropion’s lack of serotonergic action', () => {
    expect(expectedEffects(bindingOf('mirtazapine')!)).toContain('Sedación y aumento de peso')
    expect(lv('bupropion').sert).toBe(0)
    expect(Object.values(lv('bupropion')).every((v) => (v ?? 0) <= 0.5)).toBe(true)
  })
})
