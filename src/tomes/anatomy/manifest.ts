import type { TomeManifest } from '../types'

const manifest: TomeManifest = {
  id: 'anatomy',
  title: 'Anatomía',
  subtitle: 'De humani corporis fabrica',
  description: 'La arquitectura del cuerpo humano, desde los huesos hasta los órganos.',
  tier: 'codex',
  status: 'draft',
  home: 'health/basic-sciences/anatomy',
  facets: { system: ['skeletal', 'cardiovascular', 'lymphatic'] },
  tags: ['esqueleto', 'huesos', 'accidentes óseos', 'corazón', 'arterias', 'venas', 'linfáticos'],
  palette: {
    background: '#efe6d2',
    foreground: '#2b2118',
    accent: '#9c3b26',
  },
  createdAt: '2026-11-04',
}

export default manifest
