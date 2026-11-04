import type { TomeManifest } from '../types'

const manifest: TomeManifest = {
  id: 'latin',
  title: 'Latín',
  subtitle: 'Lingua Latina',
  description: 'La lengua de Roma: su alfabeto, su historia y su gramática, para leerla y practicarla.',
  tier: 'codex',
  status: 'draft',
  home: 'languages/classical/latin',
  tags: ['gramática', 'declinaciones', 'Roma'],
  // Anatomical terminology is Latin: the two tomes speak to each other.
  related: ['anatomy'],
  palette: {
    background: '#ece8df',
    foreground: '#2a2622',
    accent: '#a8322a',
  },
  createdAt: '2026-11-04',
}

export default manifest
