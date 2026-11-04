# Organising knowledge

How Magnum Opus decides where a topic lives. Read this before adding a tome or a node.

## Three separate things

| Concept | What it is | Where |
| --- | --- | --- |
| **Map of knowledge** | A tree of areas, any depth. Pure data, no design. | `src/tomes/taxonomy.ts` |
| **Tome** | A bespoke experience (own design, code, chapters). | `src/tomes/<id>/` |
| **Facets** | Cross-cutting labels that group tomes from different branches. | `facets` in `taxonomy.ts` |

A tome hangs from **exactly one** node (`home` in its manifest). It can describe itself with
facets, and point to other tomes with `related` (see also) and `prereqs` (read first).

The tree says *where* something is, not *in what order* to read it. Order comes from
`prereqs`, which form suggested routes; several routes can cross the same tome.

## The rule: classify by discipline, not by object

A discipline is a method, a question asked about the world. An object is the thing the
question is about. The tree is made of disciplines; objects become facets.

- Anatomy asks *how is it built*, physiology *how does it work*, pharmacology *what do
  drugs do to it*, imaging *how do we see inside*. Each is a node.
- The heart is an object: anatomy, physiology, pharmacology and imaging all study it.
  So it isn't a node: `system: cardiovascular` is a facet, and filtering by it gathers the
  heart from every discipline.
- Clinical specialties (cardiology, nephrology…) are the medical practice applied to one
  system. They are nodes under `health/clinical`, tagged with their system facet. They don't
  compete with anatomy for a place.

## Placing a new topic

1. **Which discipline or method does it use?** That node is its `home`. If the node doesn't
   exist, add it under its parent discipline. When unsure between two, pick the one whose
   *method* the content follows, and put the other in `related`.
2. **What object or system is it about?** Those are its `facets`.
3. **Does it need its own design, or is it big enough to stand alone?** Then it's a tome.
   Otherwise it's a chapter (a "book") inside the tome that already covers that branch.

A tome covers its node's whole subtree until a more specific tome claims a child. The
anatomy tome lives at `health/basic-sciences/anatomy` and its books (Osteología,
Artrología…) match the child nodes. If myology ever needs its own tome, it moves to
`…/anatomy/myology` and anatomy keeps the rest. The same goes for mathematics: one
"Cálculo" tome with derivatives and integrals as chapters, split only when it grows.

## Rules for the tree itself

- Ids are English kebab-case and only unique among siblings: the **path** is the identity
  (`health/clinical/neurology` ≠ `health/basic-sciences/anatomy/neurology`).
- Titles are Spanish content.
- Nodes may exist with no tome. Adding or reshaping branches is cheap. Renaming or moving a
  node that tomes point to means updating their `home`, which the registry and tests enforce.
- Don't add a node for an object (an organ, a period, a person). If it only gathers
  material from several disciplines, it's a facet or a route.
- Add a new facet only when it groups tomes living in different branches.
- `tags` are free search keywords. Don't repeat `home` or facets there.

## Validation

`placementProblems()` checks `home`, facets, `related` and `prereqs`. The registry throws on
startup if a tome is misplaced, `src/tomes/taxonomy.test.ts` checks every manifest, and
`pnpm new-tome <id> "<Título>" <home>` refuses an unknown path.
