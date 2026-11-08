import { describe, expect, it } from 'vitest'
import {
  alongRolando,
  BREGMA,
  cerebellum,
  CHIPAULT_LINE,
  crossingAtHeight,
  dist,
  hemisphere,
  heightAt,
  inside,
  LAMBDA,
  LAMBDA_ARC,
  LANDMARKS,
  lowerBorder,
  MFB_POINTS,
  OPTOSTRIATE,
  ROLANDO,
  ROLANDO_CHAMPIONNIERE,
  ROLANDO_POIRIER,
  SUTURES,
  SYLVIAN,
  TEMPORAL_POLE,
  vaultLength,
  VENTRICLE_RECT,
  type Point,
} from './cranial-topography'

describe('the skull the constructions are built on', () => {
  it('has an adult nasion–inion arc and the usual frontal and parietal arcs', () => {
    expect(vaultLength).toBeGreaterThan(30)
    expect(vaultLength).toBeLessThan(35)
    const parietal = LAMBDA_ARC - 12.5
    expect(parietal).toBeGreaterThan(11)
    expect(parietal).toBeLessThan(14)
  })

  it('puts the lambda 6 or 7 cm above the inion (Testut p. 1191)', () => {
    const d = dist(LAMBDA, LANDMARKS.inion)
    expect(d).toBeGreaterThanOrEqual(6)
    expect(d).toBeLessThanOrEqual(7)
    expect(LAMBDA[1]).toBeGreaterThan(LANDMARKS.inion[1])
  })
})

describe('the hemisphere and the cerebellum', () => {
  it('starts the temporal lobe 15 mm behind the orbital process and 2 cm above the arch', () => {
    expect(TEMPORAL_POLE[0] - LANDMARKS.orbitalProcess[0]).toBeCloseTo(1.5)
    expect(TEMPORAL_POLE[1]).toBe(2)
  })

  it('lets the temporal lobe graze the arch at the jaw joint, then rise to the asterion', () => {
    const atJoint = lowerBorder.filter(([x]) => x > LANDMARKS.archBack - 1.5 && x < LANDMARKS.archBack + 0.5)
    expect(Math.min(...atJoint.map(([, y]) => y))).toBeLessThan(0.3)
    expect(Math.min(...atJoint.map(([, y]) => y))).toBeGreaterThan(-0.2)
    expect(lowerBorder.some((p) => dist(p, LANDMARKS.asterion) < 0.01)).toBe(true)
  })

  it('keeps the cerebellum below Chipault’s line and outside the hemisphere', () => {
    for (const p of cerebellum) {
      expect(p[1]).toBeLessThan(heightAt(CHIPAULT_LINE, p[0]))
      expect(inside(p, hemisphere)).toBe(false)
    }
  })
})

describe('the fissure of Rolando', () => {
  it('is placed within 2.5 cm by Poirier and by Lucas-Championnière', () => {
    expect(Math.abs(ROLANDO_POIRIER.upperArc - ROLANDO_CHAMPIONNIERE.upperArc)).toBeLessThan(2.5)
  })

  it('runs up and back, at the slant of the real fissure', () => {
    const [upper, lower] = ROLANDO
    const angle = (Math.atan2(upper[1] - lower[1], upper[0] - lower[0]) * 180) / Math.PI
    expect(angle).toBeGreaterThan(50)
    expect(angle).toBeLessThan(75)
  })

  it('reaches the midline well behind the bregma: the frontal lobe runs far under the parietal bone', () => {
    expect(ROLANDO_POIRIER.upperArc - 12.5).toBeGreaterThan(3)
    expect(ROLANDO[0][0]).toBeGreaterThan(BREGMA[0] + 3)
  })

  it('ends above the Sylvian line', () => {
    const gap = ROLANDO_POIRIER.lower[1] - SYLVIAN[0][1]
    expect(gap).toBeGreaterThan(1)
    expect(gap).toBeLessThan(3)
    expect(ROLANDO_POIRIER.lower[0]).toBeGreaterThan(SYLVIAN[0][0])
    expect(ROLANDO_POIRIER.lower[0]).toBeLessThan(SYLVIAN[1][0])
  })
})

describe('Marie, Foix and Bertrand against the classical methods', () => {
  it('puts Broca’s centre more than 2 cm in front of Rolando, and in front of the face’s centres', () => {
    expect(ROLANDO_POIRIER.lower[0] - MFB_POINTS.broca[0]).toBeGreaterThan(2)
    expect(alongRolando(2 / 3)[0]).toBeGreaterThan(MFB_POINTS.broca[0])
  })

  it('puts the angular gyrus about halfway between the end of Sylvius and the lambda', () => {
    expect(Math.abs(dist(MFB_POINTS.angular, LAMBDA) - 3)).toBeLessThan(1)
  })

  it('agrees with Testut and Jacob that the frontal horn reaches the coronal suture', () => {
    const coronal = crossingAtHeight(SUTURES.coronal, VENTRICLE_RECT.top)!
    expect(Math.abs(VENTRICLE_RECT.front - coronal)).toBeLessThan(1)
  })
})

describe('the deep parts', () => {
  const corners = (l: number, r: number, b: number, t: number): Point[] => [
    [l, b],
    [l, t],
    [r, b],
    [r, t],
  ]

  it('fits the lateral ventricle’s rectangle inside the hemisphere', () => {
    const { front, back, bottom, top } = VENTRICLE_RECT
    for (const c of corners(front, back, bottom, top)) expect(inside(c, hemisphere)).toBe(true)
  })

  it('fits the optostriate nuclei inside the hemisphere, behind the frontal pole and under the cortex', () => {
    const { front, back, top } = OPTOSTRIATE
    expect(back).toBeGreaterThan(front)
    for (const c of corners(front, back, VENTRICLE_RECT.bottom, top)) expect(inside(c, hemisphere)).toBe(true)
  })
})
