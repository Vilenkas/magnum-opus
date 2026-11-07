# Anatomy tome: pending work

Where we left off (2026-11-05). Page numbers are Testut–Latarjet t. II book pages
(PDF = book + 14, + 16 from ~p. 580; check the running header). Index of both volumes and of
Netter's plates in `library/anatomy/testut-notes.md` and `library/anatomy/netter-index.tsv`.

## Next: Libro V · Neurología

- [x] **Protuberancia anular** (pp. 754–783): written, with the `Hemiplegia` plate (crossed and
      alternate hemiplegia, fig. 634) and figs. 625–646.
- [x] **Cerebelo** (pp. 784–834): written, with the `CerebellarCortex` plate (fig. 678) and
      Netter S-42 for today's lobes.
- [x] **Cuarto ventrículo** (pp. 835–857): written, with the `VentricleFloor` plate (figs. 694, 700)
      and Netter S-34/S-41 for today's names and the apertures.
- [ ] **Pedúnculos cerebrales**, tubérculos cuadrigéminos y acueducto (858), **cerebro** (index p. XIV on).
      Map the remaining pages in `testut-notes.md` first.
- [ ] A plate for the cerebellum's lobes: classical names, Bolk, Edinger and today's (Larsell I–X,
      Netter S-42) on one unfolded cerebellum (fig. 660).
- [ ] **Vasos de la médula espinal** (pp. 681–697), left out of the cord section.
- [ ] **Núcleos del bulbo** in detail (pp. 719–750): better written together with the cranial
      nerves, where they make sense.
- [ ] Netter plates for neurology: S-16 (médula y nervios espinales), S-23/S-25 (arterias y venas
      de la médula), S-31/S-33 (cerebro), S-34/S-35 (ventrículos y LCR), S-40 (tronco del encéfalo),
      S-54/S-55 (núcleos de los nervios craneales).

## To review (the user, as domain expert)

- [ ] `src/tomes/anatomy/data/nervous-names.ts`: hand-written names. Cranial nerves follow TA2
      (*abducens*, *troclear*, *accesorio*), not Testut (motor ocular externo, patético, espinal):
      decide which nomenclature the viewer shows. Finer gyri and sulci were translated by us.
- [ ] `src/tomes/anatomy/data/vessel-names.ts`: hand-written names, especially the branches of the
      middle cerebral artery. Heart valves keep TA2's terms ("valva atrioventricular derecha"), not
      "tricúspide".
- [ ] `CordSections`: below the cervical cord the whole posterior funiculus is drawn as Goll's
      fascicle (the paramedian septum is only seen above). Fascicles are schematic, not measured.

- [ ] `Hemiplegia` plate: the eponyms (Weber, Millard-Gubler, Jackson) and the bilateral supply of
      the eye muscles' nuclei and of the upper face are current knowledge, not in Testut: no source
      in the library cites them yet. The plate places each corticonuclear crossing just above its
      nucleus, a simplification.

- [ ] Cerebellum, current knowledge with no source in the library yet: climbing fibres come from
      the inferior olive; Purkinje and basket cells are inhibitory; Bolk's somatotopy not confirmed.

## Ideas mentioned, not started

- [ ] Sexual dimorphism of the **skull** (Testut t. I p. 300), as a second view of the pelvis plate
      or its own plate.
- [ ] Neurology intro: the claims about sponges and starfish are uncited (no modern zoology source
      in the library yet); cite them when one is added.
- [ ] Libro VI · Esplacnología: needs female organs in 3D, which Z-Anatomy doesn't have (its female
      collections are empty). The only case where looking for another source is worth it.

## Known limits

- Z-Anatomy has no lymphatic vessels, only nodes and lymphoid organs.
- In the 3D viewers a deep structure can be hidden by its neighbours when selected: «Aislar» solves it.
- The 3D models are male only (BodyParts3D); sex differences get dedicated plates.
