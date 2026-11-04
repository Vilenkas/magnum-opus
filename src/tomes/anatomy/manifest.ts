import type { TomeManifest } from '../types'

const manifest: TomeManifest = {
  id: 'anatomy',
  title: 'Anatomía',
  subtitle: 'De humani corporis fabrica',
  description: 'La arquitectura del cuerpo humano, comenzando por su armazón: los huesos.',
  tier: 'codex',
  status: 'draft',
  home: 'health/basic-sciences/anatomy',
  facets: { system: ['skeletal'] },
  tags: ['esqueleto', 'huesos', 'accidentes óseos'],
  palette: {
    background: '#efe6d2',
    foreground: '#2b2118',
    accent: '#9c3b26',
  },
  createdAt: '2026-11-04',
}

export default manifest
