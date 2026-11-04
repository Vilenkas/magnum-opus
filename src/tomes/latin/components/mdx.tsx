import type { MDXComponents } from 'mdx/types'
import { DeclensionDrill } from './DeclensionDrill'
import { DeclensionTable } from './DeclensionTable'

/** Components available inside every Latin MDX chapter without importing. */
export const mdxComponents: MDXComponents = {
  DeclensionTable,
  DeclensionDrill,
}
