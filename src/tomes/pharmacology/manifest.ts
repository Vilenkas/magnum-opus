import type { TomeManifest } from '../types'

const manifest: TomeManifest = {
  id: 'pharmacology',
  title: 'Farmacología',
  subtitle: 'Vademécum razonado',
  description: 'Qué hace cada fármaco y para qué sirve: sus familias, su mecanismo y su molécula, con un banco de fichas.',
  tier: 'codex',
  status: 'draft',
  home: 'health/basic-sciences/pharmacology',
  facets: { system: ['nervous'] },
  tags: ['fármacos', 'medicamentos', 'psicofármacos', 'ansiolíticos', 'antidepresivos', 'antipsicóticos', 'antiepilépticos'],
  palette: {
    background: '#eef0ec',
    foreground: '#1c2626',
    accent: '#2e6b55',
  },
  createdAt: '2026-11-13',
}

export default manifest
