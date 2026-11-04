import type { TomeManifest } from '../types'

const manifest: TomeManifest = {
  id: '__ID__',
  title: '__TITLE__',
  description: 'Describe este tomo en una frase.',
  tier: 'scroll',
  status: 'draft',
  // Path in src/tomes/taxonomy.ts, chosen by discipline (docs/taxonomy.md).
  home: '__HOME__',
  tags: [],
  palette: {
    background: '#1a1a1a',
    foreground: '#f2f2f2',
    accent: '#d4a14a',
  },
  createdAt: '__DATE__',
}

export default manifest
