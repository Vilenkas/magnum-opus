/**
 * Scaffolds a new tome.
 * Usage: pnpm new-tome <id> "<Display title>" <home>
 *   e.g. pnpm new-tome physiology "Fisiología" health/basic-sciences/physiology
 * <home> must be a path in src/tomes/taxonomy.ts (add the node first if needed;
 * see docs/taxonomy.md for how to choose it).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nodeAt, taxonomyPaths } from '../src/tomes/taxonomy.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const templateDir = join(root, 'scripts', 'templates', 'tome')

const [id, title, home] = process.argv.slice(2)

if (!id || !title || !home) {
  console.error('Usage: pnpm new-tome <id> "<Display title>" <home>')
  process.exit(1)
}
if (!nodeAt(home)) {
  console.error(`Unknown home "${home}". Add the node to src/tomes/taxonomy.ts first. Known paths:`)
  for (const path of taxonomyPaths()) console.error(`  ${path}`)
  process.exit(1)
}
if (!/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error(`Invalid id "${id}": use lowercase English kebab-case (e.g. norse-mythology).`)
  process.exit(1)
}

const target = join(root, 'src', 'tomes', id)
if (existsSync(target)) {
  console.error(`Tome "${id}" already exists at ${target}`)
  process.exit(1)
}

const componentName = id
  .split('-')
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('')

const replacements: Record<string, string> = {
  __ID__: id,
  __TITLE__: title.replaceAll("'", "\'"),
  __HOME__: home,
  __DATE__: new Date().toISOString().slice(0, 10),
  __COMPONENT__: componentName,
}

mkdirSync(target, { recursive: true })
for (const file of readdirSync(templateDir)) {
  let content = readFileSync(join(templateDir, file), 'utf8')
  for (const [key, value] of Object.entries(replacements)) content = content.replaceAll(key, value)
  writeFileSync(join(target, file.replace(/\.tpl$/, '')), content)
}

console.log(`Created tome "${title}" at src/tomes/${id}/`)
