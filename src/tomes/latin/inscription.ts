/** Inscriptions wrote U as V and separated words with interpuncts: LINGVA·LATINA. */
export const toInscription = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/U/g, 'V')
    .replace(/\s+/g, '·')
