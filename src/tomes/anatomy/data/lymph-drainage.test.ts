import { describe, expect, it } from 'vitest'
import { LYMPH_EDGES, LYMPH_LESIONS, TERRITORIES, anglesOf, lymphNodeById, routesOf } from './lymph-drainage'

const lesion = (id: string) => LYMPH_LESIONS.find((l) => l.id === id)!.removes

describe('lymph drainage', () => {
  it('joins only nodes it knows, and every territory reaches a venous angle', () => {
    for (const [a, b] of LYMPH_EDGES) expect(lymphNodeById.has(a) && lymphNodeById.has(b), `${a} → ${b}`).toBe(true)
    for (const t of TERRITORIES) expect(routesOf(t.id).length, t.id).toBeGreaterThan(0)
  })

  it('takes every route through nodes before any trunk, and ends in a duct or a trunk at the angle', () => {
    for (const t of TERRITORIES)
      for (const route of routesOf(t.id)) {
        expect(lymphNodeById.get(route[1])!.kind, route.join(' → ')).toBe('nodes')
        expect(['duct', 'trunk']).toContain(lymphNodeById.get(route[route.length - 2])!.kind)
      }
  })

  it('sends the right upper quadrant to the right lymphatic duct only', () => {
    for (const t of ['head-neck-right', 'upper-limb-right', 'breast-right', 'lung-right', 'upper-intercostal-right'])
      expect(anglesOf(t), t).toEqual(['right'])
  })

  it('sends everything else to the thoracic duct, even the right lower limb and the right lower intercostal spaces', () => {
    for (const t of ['head-neck-left', 'upper-limb-left', 'lower-limb-right', 'lower-limb-left', 'abdominal-viscera', 'pelvic-viscera', 'lower-intercostal-right'])
      expect(anglesOf(t), t).toEqual(['left'])
    expect(routesOf('lower-intercostal-right')[0]).toContain('cisterna-chyli')
  })

  it('lets part of the left lung cross to the right', () => {
    expect(anglesOf('lung-left')).toEqual(['left', 'right'])
  })

  it('collects the subdiaphragmatic lymph in the cisterna chyli', () => {
    for (const t of ['abdominal-viscera', 'pelvic-viscera', 'lower-limb-right', 'lower-limb-left'])
      for (const r of routesOf(t)) expect(r, t).toContain('cisterna-chyli')
  })

  it('cuts all but the right upper quadrant when the thoracic duct is severed, and the left lung keeps its crossing', () => {
    const cut = lesion('thoracic-duct-neck')
    expect(anglesOf('lower-limb-left', cut)).toEqual([])
    expect(anglesOf('abdominal-viscera', cut)).toEqual([])
    expect(anglesOf('upper-limb-right', cut)).toEqual(['right'])
    expect(anglesOf('lung-left', cut)).toEqual(['right'])
  })
})
