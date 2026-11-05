// Terminologia Anatomica 2 (TA2.csv from Z-Anatomy): English term -> Latin and Spanish.
import { readFileSync } from 'node:fs'

/**
 * The tome's Spanish, which follows Testut where TA2 differs: "peroné" for "fíbula", "ganglio"
 * for the lymph "nodo" (same gender, so adjectives still agree), "aurícula" for "atrio", and
 * TA2's own slips.
 */
const spanish = (es) =>
  es &&
  es
    .replace(/\bfíbula\b/g, 'peroné')
    .replace(/\bFíbula\b/g, 'Peroné')
    .replace(/(^|[^\p{L}])([Nn])odo(s?)(?![\p{L}])/gu, (_, pre, n, s) => `${pre}${n === 'N' ? 'G' : 'g'}anglio${s}`)
    .replace(/(^|[^\p{L}])([Ii])liac([ao]s?)(?![\p{L}])/gu, '$1$2líac$3')
    .replace(/\binferiore\b/g, 'inferior')
    .replace(/\bMusculo\b/g, 'Músculo')
    // Feminine "aurícula": the article and the adjective follow.
    .replace(/\bdel atrio (derech|izquierd)o\b/g, 'de la aurícula $1a')
    .replace(/\b([Aa])trio (derech|izquierd)o\b/g, (_, a, side) => `${a === 'A' ? 'A' : 'a'}urícula ${side}a`)

/** Returns lookup(en) -> { la, es }, nulls when the term isn't in TA2. */
export function loadTa2(taPath) {
  // One quoted line per term, ';'-separated: TA2ID;English;Latin;Français;Español;…
  const ta = new Map()
  // Terms TA2 keeps in parentheses (not official, but in use) are looked up without them.
  const bare = (t) => t.trim().replace(/^\((.*)\)$/, '$1')
  for (const line of readFileSync(taPath, 'utf8').replace(/^﻿/, '').split(/\r?\n/).slice(1)) {
    const cols = line.replace(/^"|"$/g, '').split(';')
    if (cols.length < 5 || !cols[1]) continue
    const key = bare(cols[1]).toLowerCase()
    if (!ta.has(key)) ta.set(key, { la: bare(cols[2]), es: bare(cols[4]) })
  }
  return (en) => {
    const hit = ta.get(en.toLowerCase().replace(/^\(|\)$/g, ''))
    return hit ? { la: hit.la, es: spanish(hit.es) } : { la: null, es: null }
  }
}
