import type { ComponentType } from 'react'

/**
 * How much bespoke work a tome has. A tome can be promoted over time.
 * - scroll:   MDX content with its own palette and fonts.
 * - codex:    custom layout, animations, a 3D model, quizzes.
 * - grimoire: fully bespoke experience (navigable 3D scenes, mini-games, narrative).
 */
export type TomeTier = 'scroll' | 'codex' | 'grimoire'

export type TomeStatus = 'draft' | 'published'

/**
 * Lightweight, eagerly-loaded metadata. Keep it free of heavy imports:
 * every manifest is bundled into the shell so the Atlas can render without
 * loading any tome.
 */
export interface TomeManifest {
  /** URL slug. Must match the folder name. */
  id: string
  /** Display title (Spanish content). */
  title: string
  subtitle?: string
  description: string
  tier: TomeTier
  status: TomeStatus
  tags: string[]
  /** Ids of related tomes, used for the knowledge map. */
  related?: string[]
  /** Colors the shell uses to preview the tome (Atlas card, transitions). */
  palette: {
    background: string
    foreground: string
    accent: string
  }
  /** ISO date (YYYY-MM-DD). */
  createdAt: string
}

/** Props the shell passes to a tome's entry component. */
export interface TomeProps {
  manifest: TomeManifest
  /** Remainder of the URL after /tomes/<id>/ ('' at the tome's root). */
  path: string
}

export type TomeComponent = ComponentType<TomeProps>
