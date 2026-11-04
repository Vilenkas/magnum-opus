# Magnum Opus

A personal, offline, interactive encyclopedia where every topic has its own design.

```sh
pnpm install
pnpm dev                                  # http://localhost:5173
pnpm new-tome norse-mythology "Mitología nórdica"
```

See [CLAUDE.md](CLAUDE.md) for architecture and conventions.

## Roadmap

- [x] Phase 0 — Foundations: Vite + React + TS, MDX, router, tome registry, scaffolder
- [ ] Phase 1 — Shell: search (Ctrl+K), tome transitions
- [ ] Phase 2 — Anatomy pilot: osteology with a 3D skeleton and quizzes
  - [x] Z-Anatomy skeleton → GLB pipeline, Spanish names, interactive viewer
  - [x] Skeleton quiz on the 3D model: identify / locate / type, weighted by past mistakes
  - [x] Bony landmarks: 895 pins with Spanish names in the viewer, and in the quiz

## Credits

3D anatomy derived from [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy)
(CC BY-SA 4.0), itself based on BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 Japan).
- [ ] Phase 3 — Extract `src/forge/` from the second tome
- [ ] Phase 4 — Tauri desktop packaging
- [ ] Phase 5 — Knowledge map, daily spaced-repetition review, notes
