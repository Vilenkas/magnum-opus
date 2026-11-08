import { useCallback, useMemo, useState } from "react";
import musclesUrl from "../assets/muscles.glb?url";
import jointsUrl from "../assets/joints.glb?url";
import insertionsUrl from "../assets/insertions.glb?url";
import { latinWithSide } from "../data/latin";
import { pieceById, type BonePiece } from "../data/skeleton";
import {
  insertionsOf,
  jointKindLabel,
  muscleOf,
  softById,
  softName,
  type SoftEntry,
} from "../data/soft-tissues";
import {
  jointIndex,
  jointIndexKey,
  jointKicker,
  jointParts,
  jointPieceList,
  type JointDef,
  type JointIndexEntry,
  type JointSide,
} from "../data/joint-index";
import type { IndexSection } from "../data/structure-index";
import {
  tissueEntryOf,
  tissueIndex,
  type TissueIndexEntry,
} from "../data/viewer-indexes";
import { Description, DescriptionButton } from "./skeleton/Description";
import { FullscreenButton, useFullscreen } from "./skeleton/Fullscreen";
import { IndexedStage } from "./skeleton/IndexedStage";
import {
  SkeletonStage,
  StageTag,
  type Focus,
  type PieceLook,
  type TissueLayer,
  type TissueLook,
} from "./skeleton/SkeletonStage";
import plate from "./skeleton/plate.module.css";
import styles from "./TissueViewer.module.css";

type LayerId = "bones" | "muscles" | "joints" | "insertions";

const LAYERS: { id: LayerId; label: string }[] = [
  { id: "bones", label: "Huesos" },
  { id: "muscles", label: "Músculos" },
  { id: "joints", label: "Ligamentos" },
  { id: "insertions", label: "Inserciones" },
];

const sideLabel = { left: "izquierdo", right: "derecho" } as const;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Muscle-layer pieces kept off the plate: small and in the way (bursae, sheaths) or veils (fasciae). */
const QUIET_KINDS = new Set(["bursa", "sheath", "fascia"]);

/** A whole joint on the plate: its pieces and bones on one side, the rest of the body stepped back. */
interface JointFocus {
  def: JointDef;
  side: JointSide;
  pieces: Set<string>;
  bones: Set<string>;
}

type AnyIndexEntry = TissueIndexEntry | JointIndexEntry;

/** Artrología's index: joints first, by region, then single ligaments, then muscles. */
const jointSections: IndexSection<AnyIndexEntry>[] = [
  ...jointIndex,
  { ...tissueIndex[1], label: "Ligamentos y cartílagos" },
  tissueIndex[0],
];

/** The selectable thing a node stands for: a muscle (any of its pieces), a joint piece or a bone. */
function targetOf(id: string | null): string | null {
  if (!id) return null;
  const soft = softById.get(id);
  if (!soft) return id;
  if (soft.set === "insertions") return soft.musclePieces?.[0] ?? null;
  return soft.set === "muscles" ? (muscleOf(id)?.id ?? id) : id;
}

/**
 * Lámina: the skeleton with its soft tissues in layers. Selecting a muscle shows where it
 * arises (red) and where it ends (blue) on the bones. Shared by Miología and Artrología,
 * which differ only in the layers they start with.
 */
export function TissueViewer({
  caption,
  initial,
  storageKey,
  joints = false,
}: {
  caption: string;
  initial: Partial<Record<LayerId, boolean>>;
  /** Index whole joints too (Artrología). */
  joints?: boolean;
  /** Per plate: remembers whether the index is folded. */
  storageKey: string;
}) {
  const [on, setOn] = useState<Record<LayerId, boolean>>({
    bones: true,
    muscles: false,
    joints: false,
    insertions: false,
    ...initial,
  });
  // A layer's model is fetched the first time it is needed, then kept.
  const [mounted, setMounted] = useState<Set<LayerId>>(
    () => new Set((Object.keys(on) as LayerId[]).filter((k) => on[k])),
  );
  // Usually one structure; from the index, both sides of a pair.
  const [selection, setSelection] = useState<string[]>([]);
  const [isolated, setIsolated] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  // One undo step per entry: a pair is put away, and brought back, together.
  const [removed, setRemoved] = useState<string[][]>([]);
  const [focus, setFocus] = useState<Focus>({ kind: "all" });
  const [joint, setJoint] = useState<JointFocus | null>(null);
  const fullscreen = useFullscreen<HTMLElement>();

  const selectedId = selection[0] ?? null;
  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const areas = useMemo(
    () =>
      selection
        .filter((id) => softById.get(id)?.set === "muscles")
        .flatMap((id) => insertionsOf.get(id) ?? []),
    [selection],
  );
  const areaIds = useMemo(() => new Set(areas.map((a) => a.id)), [areas]);
  const removedSet = useMemo(() => new Set(removed.flat()), [removed]);
  const isolating = isolated && selection.length > 0;
  const hoveredTarget = targetOf(hoveredId);

  const mount = (id: LayerId) =>
    setMounted((prev) => (prev.has(id) ? prev : new Set([...prev, id])));
  const toggle = (id: LayerId) => {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }));
    mount(id);
  };

  const selectIds = (ids: string[]) => {
    setSelection(ids);
    setReveal(false);
    setIsolated(false);
    // A muscle's areas live in the insertions model.
    if (ids.some((id) => softById.get(id)?.set === "muscles"))
      mount("insertions");
  };

  /** A whole joint: its bones and pieces stay, the rest of the body steps back. */
  const chooseJoint = (def: JointDef, side: JointSide = "right") => {
    const parts = jointParts(def, side);
    const pieces = new Set(parts.pieces.map((p) => p.id));
    setOn((prev) => ({ ...prev, bones: true, joints: true }));
    mount("joints");
    setRemoved((prev) =>
      prev.filter(
        (group) =>
          !group.some((id) => pieces.has(id) || parts.bones.includes(id)),
      ),
    );
    setJoint({ def, side, pieces, bones: new Set(parts.bones) });
    selectIds([]);
    setFocus({ kind: "nodes", ids: [...pieces], view: def.view });
  };

  const select = (id: string | null) => {
    const target = targetOf(id);
    // Inside a joint, its own pieces are picked one by one; anything else leaves it.
    const inJoint =
      joint &&
      (target
        ? joint.pieces.has(target) || joint.bones.has(target)
        : selection.length > 0);
    if (!inJoint) setJoint(null);
    selectIds(target ? [target] : []);
  };

  /** From the index: show the structure's layer, bring it back if it was hidden, and fly to it. */
  const choose = (entry: AnyIndexEntry) => {
    if ("joint" in entry) return chooseJoint(entry.joint);
    setJoint(null);
    const layer = entry.set === "muscles" ? "muscles" : "joints";
    setOn((prev) => ({ ...prev, [layer]: true }));
    mount(layer);
    setRemoved((prev) =>
      prev.filter((group) => !group.some((id) => entry.ids.includes(id))),
    );
    selectIds(entry.ids);
    setFocus({ kind: "node", id: entry.ids[0], context: 2 });
  };

  const boneLook = useCallback(
    (p: BonePiece): PieceLook => {
      if (!on.bones || removedSet.has(p.id)) return "hidden";
      if (selectedSet.has(p.id)) return "selected";
      if (joint && !joint.bones.has(p.id)) return "ghost";
      // A bone alone: the rest of the skeleton steps back. A muscle alone keeps its bones.
      if (isolating && pieceById.has(selection[0])) return "ghost";
      if (p.id === hoveredTarget) return "hover";
      return "base";
    },
    [
      on.bones,
      removedSet,
      selectedSet,
      isolating,
      selection,
      hoveredTarget,
      joint,
    ],
  );

  const layers = useMemo<TissueLayer[]>(() => {
    const list: TissueLayer[] = [];
    if (mounted.has("muscles"))
      list.push({
        id: "muscles",
        url: musclesUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id);
          const muscle = muscleOf(id)?.id ?? id;
          if (
            !on.muscles ||
            !e ||
            QUIET_KINDS.has(e.kind) ||
            removedSet.has(muscle)
          )
            return "hidden";
          if (selectedSet.has(muscle)) return reveal ? "ghost" : "selected";
          if (reveal || isolating || joint) return "faded";
          if (muscle === hoveredTarget) return "hover";
          return e.part === "tendon" ? "tendon" : "muscle";
        },
        isPickable: (id) =>
          !reveal && !QUIET_KINDS.has(softById.get(id)?.kind ?? ""),
      });
    if (mounted.has("joints"))
      list.push({
        id: "joints",
        url: jointsUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id);
          if (!on.joints || !e || removedSet.has(id)) return "hidden";
          if (joint && !joint.pieces.has(id)) return "hidden";
          if (selectedSet.has(id)) return "selected";
          if (isolating) return "faded";
          if (id === hoveredTarget) return "hover";
          return e.kind === "articular capsule"
            ? "capsule"
            : e.kind === "ligament"
              ? "ligament"
              : "cartilage";
        },
      });
    if (mounted.has("insertions"))
      list.push({
        id: "insertions",
        url: insertionsUrl,
        lookOf: (id): TissueLook => {
          const e = softById.get(id);
          // All areas with the layer on; otherwise only those of the selected muscle.
          if (!e || !(on.insertions || areaIds.has(id))) return "hidden";
          return e.kind === "origin" ? "origin" : "insertion";
        },
        isPickable: (id) => on.insertions || areaIds.has(id),
      });
    return list;
  }, [
    mounted,
    on,
    removedSet,
    selectedSet,
    isolating,
    hoveredTarget,
    reveal,
    areaIds,
    joint,
  ]);

  const remove = () => {
    setRemoved((prev) => [...prev, selection]);
    selectIds([]);
  };

  const hoveredName =
    hoveredTarget && !selectedSet.has(hoveredTarget)
      ? nameOf(hoveredTarget)
      : null;
  const selectedKey = selectedId
    ? (tissueEntryOf.get(selectedId)?.key ?? selectedId)
    : joint
      ? jointIndexKey(joint.def)
      : null;

  return (
    <figure className={plate.plate} ref={fullscreen.ref}>
      <figcaption className={plate.caption}>{caption}</figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton
            active={fullscreen.active}
            onClick={fullscreen.toggle}
          />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Capas">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            className={plate.chip}
            data-active={on[l.id]}
            aria-pressed={on[l.id]}
            onClick={() => toggle(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <IndexedStage<AnyIndexEntry>
        sections={joints ? jointSections : tissueIndex}
        selectedKey={selectedKey}
        onChoose={choose}
        storageKey={storageKey}
        label={
          joints
            ? "Buscar una articulación, un ligamento o un músculo"
            : "Buscar un músculo o un ligamento"
        }
      >
        <SkeletonStage
          lookOf={boneLook}
          layers={layers}
          focus={focus}
          onPick={select}
          onHoverChange={setHoveredId}
        >
          {hoveredName && <StageTag>{hoveredName}</StageTag>}
          {removed.length > 0 && (
            <div className={styles.removedBar}>
              <span>
                {removed.length} {removed.length === 1 ? "oculta" : "ocultas"}
              </span>
              <button
                className={styles.barButton}
                onClick={() => setRemoved((prev) => prev.slice(0, -1))}
              >
                Deshacer
              </button>
              <button
                className={styles.barButton}
                onClick={() => setRemoved([])}
              >
                Restablecer
              </button>
            </div>
          )}
        </SkeletonStage>
      </IndexedStage>

      <div className={plate.legend} aria-live="polite">
        {selectedId ? (
          <SelectionCard
            ids={selection}
            areas={areas}
            reveal={reveal}
            isolated={isolated}
            onFocus={() => setFocus({ kind: "node", id: selectedId })}
            onReveal={() => setReveal((v) => !v)}
            onIsolate={() => setIsolated((v) => !v)}
            onHide={remove}
            onBack={joint ? () => selectIds([]) : undefined}
            jointName={joint?.def.es}
          />
        ) : joint ? (
          <JointCard
            joint={joint}
            onPiece={(id) => {
              selectIds([id]);
              setFocus({ kind: "node", id, context: 2 });
            }}
            onFocus={() =>
              setFocus({
                kind: "nodes",
                ids: [...joint.pieces],
                view: joint.def.view,
              })
            }
            onSide={() =>
              chooseJoint(joint.def, joint.side === "right" ? "left" : "right")
            }
            onLeave={() => {
              setJoint(null);
              setFocus({ kind: "all" });
            }}
          />
        ) : (
          <p className={plate.hint}>
            Activa las capas · clic para identificar · en un músculo verás su
            origen (rojo) y su inserción (azul)
          </p>
        )}
      </div>
    </figure>
  );
}

function nameOf(id: string): string {
  const soft = softById.get(id);
  if (soft)
    return (
      capitalize(softName(soft)) + (soft.side ? ` ${sideLabel[soft.side]}` : "")
    );
  return pieceById.get(id)?.name ?? id;
}

function SelectionCard({
  ids,
  areas,
  reveal,
  isolated,
  onFocus,
  onReveal,
  onIsolate,
  onHide,
  onBack,
  jointName,
}: {
  ids: string[];
  areas: SoftEntry[];
  reveal: boolean;
  isolated: boolean;
  onFocus: () => void;
  onReveal: () => void;
  onIsolate: () => void;
  onHide: () => void;
  /** Inside a joint: back to the joint's card. */
  onBack?: () => void;
  jointName?: string;
}) {
  const [described, setDescribed] = useState(false);
  const id = ids[0];
  const pair = ids.length > 1;
  const soft = softById.get(id);
  const bone = pieceById.get(id);
  const kicker = soft
    ? [
        soft.set === "joints"
          ? (jointKindLabel[soft.kind] ?? "Articulación")
          : "Músculo",
        soft.groups?.[0]?.es ?? soft.groups?.[0]?.en,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Hueso";
  const latin = soft
    ? soft.la
    : bone
      ? latinWithSide(bone.en, bone.side)
      : undefined;
  const en = soft?.en ?? bone?.en;

  const bonesOf = (kind: "origin" | "insertion") => {
    const names = areas
      .filter((a) => a.kind === kind)
      .map((a) => pieceById.get(a.bone!)?.base ?? a.bone!);
    return [...new Set(names)];
  };
  const origins = bonesOf("origin");
  const insertions = bonesOf("insertion");

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <p className={plate.kicker}>{kicker}</p>
          <h3 className={plate.title}>
            {pair && soft ? capitalize(softName(soft)) : nameOf(id)}
          </h3>
          <p className={plate.meta}>
            {latin && (
              <>
                <span className={plate.latin} lang="la">
                  {latin}
                </span>
                {" · "}
              </>
            )}
            <span className={plate.english} lang="en">
              {en}
            </span>
            {pair && <> · derecho e izquierdo</>}
          </p>
        </div>
        <div className={styles.actions}>
          {onBack && (
            <button className={plate.button} onClick={onBack} title={jointName}>
              ← Articulación
            </button>
          )}
          <DescriptionButton
            className={plate.button}
            open={described}
            onClick={() => setDescribed((v) => !v)}
          />
          <button className={plate.button} onClick={onFocus}>
            Enfocar
          </button>
          {areas.length > 0 && (
            <button
              className={plate.button}
              onClick={onReveal}
              aria-pressed={reveal}
            >
              {reveal ? "Ver el músculo" : "Ver en el hueso"}
            </button>
          )}
          <button
            className={plate.button}
            onClick={onIsolate}
            aria-pressed={isolated}
          >
            {isolated ? "Ver todo" : "Aislar"}
          </button>
          <button className={plate.button} onClick={onHide}>
            Ocultar
          </button>
        </div>
      </div>
      {areas.length > 0 && (
        <dl className={styles.areas}>
          {origins.length > 0 && (
            <>
              <dt>
                <span
                  className={styles.swatch}
                  data-kind="origin"
                  aria-hidden
                />{" "}
                Origen
              </dt>
              <dd>{origins.join(" · ")}</dd>
            </>
          )}
          {insertions.length > 0 && (
            <>
              <dt>
                <span
                  className={styles.swatch}
                  data-kind="insertion"
                  aria-hidden
                />{" "}
                Inserción
              </dt>
              <dd>{insertions.join(" · ")}</dd>
            </>
          )}
        </dl>
      )}
      {described && <Description en={en} />}
    </div>
  );
}

/** A whole joint: what it is, the bones it joins and its pieces, each one a way into its own card. */
function JointCard({
  joint,
  onPiece,
  onFocus,
  onSide,
  onLeave,
}: {
  joint: JointFocus;
  onPiece: (id: string) => void;
  onFocus: () => void;
  onSide: () => void;
  onLeave: () => void;
}) {
  const [described, setDescribed] = useState(false);
  const { def, side } = joint;
  const pieces = jointPieceList(def, side);
  const bones = [
    ...new Set([...joint.bones].map((id) => pieceById.get(id)?.base ?? id)),
  ];
  const paired =
    pieces.some((p) => p.side) ||
    [...joint.bones].some((id) => pieceById.get(id)?.side);

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <p className={plate.kicker}>Articulación · {jointKicker(def)}</p>
          <h3 className={plate.title}>{def.es}</h3>
          <p className={plate.meta}>
            <span className={plate.latin} lang="la">
              {def.la}
            </span>
            {" · "}
            <span className={plate.english} lang="en">
              {def.en}
            </span>
            {paired && <> · lado {side === "right" ? "derecho" : "izquierdo"}</>}
          </p>
        </div>
        <div className={styles.actions}>
          <DescriptionButton
            className={plate.button}
            open={described}
            onClick={() => setDescribed((v) => !v)}
          />
          <button className={plate.button} onClick={onFocus}>
            Enfocar
          </button>
          {paired && (
            <button className={plate.button} onClick={onSide}>
              Ver el {side === "right" ? "izquierdo" : "derecho"}
            </button>
          )}
          <button className={plate.button} onClick={onLeave}>
            Ver todo
          </button>
        </div>
      </div>
      <dl className={styles.areas}>
        <dt>Huesos</dt>
        <dd>
          {bones.length > 6
            ? `${bones.slice(0, 6).join(" · ")} y ${bones.length - 6} más`
            : bones.join(" · ")}
        </dd>
        <dt>Piezas</dt>
        <dd>
          <ul className={styles.parts}>
            {pieces.map((p) => (
              <li key={p.id}>
                <button
                  className={styles.part}
                  onClick={() => onPiece(p.id)}
                  title={p.la ?? p.en}
                >
                  {capitalize(softName(p))}
                </button>
              </li>
            ))}
          </ul>
        </dd>
      </dl>
      {described && <Description en={def.en} />}
    </div>
  );
}
