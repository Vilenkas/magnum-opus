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
- [x] **Mesencéfalo** (pp. 858–895): pedúnculos, tubérculos cuadrigéminos y acueducto, with the
      `MidbrainSections` plate (two sections; the pes after Testut and after today's description).
- [x] **Cerebro** (pp. 896–1237, index p. XIV): written in parts. Split it, roughly: ~~exterior and
      lobes (896–953)~~ (written, with the `Gyri` plate and Netter S-31 to S-33), ~~cortex and localizations (954–986)~~ (written, `CortexTypes` plate and the localizations mode of `Gyri`), ~~interior (987–1037)~~ (written, `Ventricles` plate and Netter S-35), ~~grey nuclei, internal
      capsule and white matter (1038–1113)~~ (written, `InternalCapsule` plate), ~~motor and sensory
      pathways (1114–1137)~~ (written, `Pathways` plate), ~~special-sense pathways (1138–1189)~~ (written,
      `VisualFields` plate), ~~cranioencephalic topography (1190–1195)~~ (written, `CranialTopography` plate) and
      cerebral circulation (Art. VIII, 1195–~1240, end not mapped).
- [ ] A plate for the cerebellum's lobes: classical names, Bolk, Edinger and today's (Larsell I–X,
      Netter S-42) on one unfolded cerebellum (fig. 660).
- [x] **Vasos de la médula espinal** (pp. 681–689): written, with figs. 557–560 bis; no plate. Still unwritten in the
      cord: the conus and filum terminale (~pp. 674–681) and its functional value (pp. 689–697).
- [ ] **Núcleos del bulbo** in detail (pp. 719–750): better written together with the cranial
      nerves, where they make sense.
- [ ] Netter plates for neurology: S-16 (médula y nervios espinales), S-23/S-25 (arterias y venas
      de la médula), S-31/S-33 (cerebro), S-34/S-35 (ventrículos y LCR), S-40 (tronco del encéfalo),
      S-54/S-55 (núcleos de los nervios craneales).

## Depth of the first four books

Osteología, Artrología, Miología and Angiología only cover Testut's *general* anatomy chapters
(~4,000 words each); the *descriptive* part (each bone, each joint, each muscle, each artery's course)
lives only in the 3D viewers and the quiz, without prose. Neurología covers both (~18,000 words so
far). Pending, after the cerebrum: decide with the user whether and in what order to write it.

- [ ] Osteología descriptiva: vértebras, cráneo, cara, miembros (t. I pp. 44–473).
- [ ] Artrología descriptiva: las articulaciones región por región (t. I pp. 493–735).
- [ ] Miología descriptiva: los músculos región por región (t. I, from p. 764).
- [ ] Angiología descriptiva: arterias, venas y linfáticos en su trayecto (t. II pp. 167–563).

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

- [ ] Mesencephalon, current knowledge with no source in the library yet: the pes' fifths as they
      are described today (frontopontine, corticospinal and corticonuclear, parietotemporopontine).

- [ ] Brain: Testut's pages on brain weight and gyral patterns compare sexes and "races" (fig. 769, the
      pie of the third frontal in three "ethnic types"; symmetry as a mark of "superiority"). Left out
      on purpose, along with that figure; only the measurements were kept.

- [ ] Cortex: Testut's localizations are those of 1975 (the classical language centres, Pierre Marie,
      Dejerine). Today's view of language as a network, and the sensory and motor maps after Penfield,
      have no source in the library yet. The layer shares of `cortex-types.ts` are read off fig. 795,
      not measured.

- [ ] Pathways, current knowledge with no source in the library yet: the spinothalamic tract crossing
      within one or two segments by the anterior white commissure; the small human rubrospinal tract and
      the cerebellum and basal ganglia acting mainly through the thalamus on the motor cortex. The
      `Pathways` plate follows Testut (dentate → red nucleus → rubrospinal; pallidum → red nucleus) and
      draws the direct cerebellar fascicle ending in the cerebellar cortex of its side, not in the vermis.
      Testut's pages on the thalamus mix Head's view (pain stops there) with the one the plate follows
      (all general sensibility reaches the cortex).

- [ ] Special senses, current knowledge with no source in the library yet: the limbic lobe as Papez's
      circuit (memory, emotion) rather than olfactory cortex; olfaction reaching the cortex without the
      thalamus; ~1 million fibres per optic nerve, about half crossed (Testut: 150,000 direct, 250,000
      crossed); the pituitary tumour as the usual cause of bitemporal hemianopia (the `VisualFields` plate
      adds the chiasm lesion, deduced from the semidecussation, not described by Testut); vestibular input
      reaching the cortex through the thalamus; taste going solitary nucleus → thalamus → insula and
      frontal operculum (Testut, after Grasset: the hippocampal gyrus). Testut's fig. 964 (Favory) loops
      the upper crossed fibres into the opposite nerve; Wilbrand's knee is usually said of the lower ones.
      Macular fibres are left out of the plate.

- [ ] Cranioencephalic topography: the skull of the `CranialTopography` plate is drawn to average measures, not
      taken from a specimen; on it Poirier's and Lucas-Championnière's upper ends of Rolando differ by ~2 cm, and
      Testut and Jacob's ventricle ends ~1 cm behind the lambdoid suture where Marie, Foix and Bertrand put it 1 cm in
      front. Fig. 990 draws Lucas-Championnière's Sylvian line rising backwards, while the text says parallel to the
      arch: the plate follows the text. The 10-20 EEG system mentioned at the end has no source in the library.

- [ ] Cerebral circulation, current knowledge with no source in the library yet: the middle cerebral as a terminal
      branch of the carotid (Testut: a collateral of the anterior, after embryology); a complete, regular circle in
      under half of people; middle cerebral occlusion as the commonest infarct; Testut's veins of Galen = internal
      cerebral veins, his ampulla = great cerebral vein, his basilar veins = basal veins of Rosenthal; the glymphatic
      system and the meningeal lymphatics (2015). The territories of `WillisCircle` are drawn by eye after figs.
      1009–1010; each gyrus goes wholly to the territory of its centroid (the superior parietal falls to the middle
      cerebral, though Testut splits it).

- [ ] Spinal cord vessels, current knowledge with no source in the library yet: anterior spinal artery → anterior two
      thirds, posterior spinal arteries → posterior third; the upper thoracic watershed; paraplegia after injury to the
      artery of Adamkiewicz.

- [x] Modern references added (Latarjet–Ruiz Liard, Rouvière–Delmas, Moore, Pró; see `library/anatomy/testut-notes.md`).
      Neurology's "today" claims now cite them: climbing fibres from the olive, the fourth ventricle's apertures, the
      spinothalamic crossing, dentate → thalamus → cortex, Papez, the pituitary and bitemporal hemianopia, the taste
      pathway (corrected: inferior postcentral gyrus, frontoparietal operculum and upper insula), the middle cerebral as
      the largest terminal branch of the carotid, the frequency of middle cerebral syndromes, Willis variants (rewritten
      after Moore: no "under half" figure), Rosenthal's vein, the spinal arteries and Adamkiewicz, the facial nucleus.
      Still without a source in these four books: Purkinje cells inhibiting the deep nuclei, ~1 million optic fibres,
      olfaction bypassing the thalamus, a vestibular cortex reached through the thalamus, bilateral supply of the eye
      muscles' nuclei, the basal ganglia's loop through the thalamus, the glymphatic system and meningeal lymphatics.
      Rouvière t. 4 p. 276 still says the granular layer inhibits Purkinje cells (granule cells are excitatory today).

- [x] The general chapters of Osteología, Artrología, Miología and Angiología contrasted with the modern references
      (2026-11-08). Changed or added: proximal/distal (Testut: towards the median plane; today: towards the trunk or
      origin), epiphyseal cartilage and metaphysis, osteons and bone cells, only red and yellow marrow, lymphatics in the
      periosteum; joints by tissue (fibrous, cartilaginous, synovial) with today's names for Testut's six genera, the
      sacroiliac as a synovial joint; three kinds of muscle, origin and insertion, epimysium, motor unit, a table of
      Testut's muscle names against TA; heart weight (200–250 g today against Testut's 270–275), precapillary sphincters
      and pericytes, no lymphatics in the CNS, atrium and lymph node, right lymphatic duct. Pró (p. 44) defines the
      endomysium as Testut does (round the primary fascicles), not round each fibre: left as it was.

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
