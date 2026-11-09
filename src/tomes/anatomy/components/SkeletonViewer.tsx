import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { latinOf, latinWithSide } from "../data/latin";
import {
  landmarkById,
  landmarksByPiece,
  type Landmark,
} from "../data/landmarks";
import {
  groupById,
  pieceById,
  regionOf,
  type BonePiece,
  type GroupId,
  type RegionId,
} from "../data/skeleton";
import { boneIndex } from "../data/viewer-indexes";
import { Description, DescriptionButton } from "./skeleton/Description";
import { FullscreenButton, useFullscreen } from "./skeleton/Fullscreen";
import { IndexedStage } from "./skeleton/IndexedStage";
import {
  SkeletonStage,
  StageTag,
  type Focus,
  type Marker,
  type PieceLook,
} from "./skeleton/SkeletonStage";
import plate from "./skeleton/plate.module.css";
import styles from "./SkeletonViewer.module.css";

/** What the viewer isolates: nothing, a body region, or a single group of pieces. */
type Scope = { kind: "region"; id: RegionId } | { kind: "group"; id: GroupId };

const SCOPES: { label: string; scope: Scope | null }[] = [
  { label: "Todo", scope: null },
  { label: "Cabeza", scope: { kind: "region", id: "head" } },
  // Tiny and buried in the temporal bone: nearly unreachable without their own scope.
  {
    label: "Huesecillos del oído",
    scope: { kind: "group", id: "auditory-ossicles" },
  },
  { label: "Cuello", scope: { kind: "region", id: "neck" } },
  { label: "Columna vertebral", scope: { kind: "region", id: "spine" } },
  { label: "Tórax", scope: { kind: "region", id: "thorax" } },
  { label: "Miembro superior", scope: { kind: "region", id: "upper-limb" } },
  { label: "Miembro inferior", scope: { kind: "region", id: "lower-limb" } },
];

const sameScope = (a: Scope | null, b: Scope | null) =>
  a?.kind === b?.kind && a?.id === b?.id;

const focusFor = (scope: Scope | null): Focus =>
  !scope
    ? { kind: "all" }
    : scope.kind === "region"
      ? { kind: "region", region: scope.id }
      : { kind: "group", group: scope.id };

const focusOnLandmark = (l: Landmark): Focus => ({
  kind: "point",
  pieceId: l.pieceId,
  position: l.position,
  normal: l.normal,
});

/** Pieces the user has taken out of the way, to see what's behind them. */
type Removal = "hidden" | "dimmed";

/** Lámina II: the full skeleton, explorable. */
export function SkeletonViewer() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope | null>(null);
  const [focus, setFocus] = useState<Focus>({ kind: "all" });
  const [removed, setRemoved] = useState<Map<string, Removal>>(new Map());
  // Undo stack: each entry is the piece removed by that step.
  const [history, setHistory] = useState<string[]>([]);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [landmarkId, setLandmarkId] = useState<string | null>(null);
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<string | null>(
    null,
  );
  // Only the selected piece stays solid; the rest of the skeleton turns translucent.
  const [isolated, setIsolated] = useState(false);
  const lastClick = useRef<{ id: string | null; t: number }>({
    id: null,
    t: 0,
  });
  const fullscreen = useFullscreen<HTMLElement>();

  const selected = selectedId ? pieceById.get(selectedId) : undefined;
  const hovered = hoveredId ? pieceById.get(hoveredId) : undefined;
  const pieceLandmarks = useMemo(
    () => (selectedId ? (landmarksByPiece.get(selectedId) ?? []) : []),
    [selectedId],
  );
  const pinsVisible = showLandmarks && pieceLandmarks.length > 0;
  const activeLandmark = landmarkId ? landmarkById.get(landmarkId) : undefined;
  const hoveredLandmark = hoveredLandmarkId
    ? landmarkById.get(hoveredLandmarkId)
    : undefined;

  // A new bone means a new set of landmarks.
  useEffect(() => {
    setLandmarkId(null);
    setHoveredLandmarkId(null);
    setIsolated(false);
  }, [selectedId]);

  const inScope = useCallback(
    (p: BonePiece) =>
      !scope ||
      (scope.kind === "region"
        ? regionOf(p).id === scope.id
        : p.group === scope.id),
    [scope],
  );

  const lookOf = useCallback(
    (p: BonePiece, hovered: string | null): PieceLook => {
      const removal = removed.get(p.id);
      if (removal === "hidden") return "hidden";
      // With pins on it, a lighter tint keeps the landmarks readable.
      if (p.id === selectedId) return pinsVisible ? "hover" : "selected";
      if (isolated && selectedId) return "ghost";
      if (removal === "dimmed") return "ghost";
      // Looking at a landmark: everything else turns translucent so nothing hides it
      // (e.g. the hanging forearm in front of the greater trochanter).
      if (landmarkId) return "ghost";
      if (!inScope(p)) return "faded";
      if (p.id === hovered) return "hover";
      return "base";
    },
    [selectedId, inScope, removed, pinsVisible, landmarkId, isolated],
  );

  const markers = useMemo<Marker[]>(
    () =>
      pinsVisible
        ? pieceLandmarks.map((l) => ({
            id: l.id,
            pieceId: l.pieceId,
            position: l.position,
            normal: l.normal,
            opening: l.opening,
            look:
              l.id === landmarkId || l.id === hoveredLandmarkId
                ? "active"
                : "normal",
          }))
        : [],
    [pinsVisible, pieceLandmarks, landmarkId, hoveredLandmarkId],
  );

  // Dimmed and hidden pieces let clicks through, so what's behind them can be picked.
  const isPickable = useCallback(
    (p: BonePiece) => inScope(p) && !removed.has(p.id),
    [inScope, removed],
  );

  const handlePick = (id: string | null) => {
    // A second click on the same piece frames the camera on it.
    const now = performance.now();
    if (id && id === lastClick.current.id && now - lastClick.current.t < 400)
      setFocus({ kind: "piece", id });
    lastClick.current = { id, t: now };
    setSelectedId(id);
  };

  /** From the index: select the piece, bring it back if it was put away, and fly to it. */
  const choosePiece = (id: string) => {
    const piece = pieceById.get(id);
    if (!piece) return;
    if (!inScope(piece)) setScope(null);
    if (removed.has(id)) {
      setRemoved((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      setHistory((prev) => prev.filter((h) => h !== id));
    }
    setSelectedId(id);
    setFocus({ kind: "piece", id });
  };

  const selectLandmark = (id: string) => {
    const l = landmarkById.get(id);
    if (!l) return;
    setShowLandmarks(true);
    setLandmarkId(id);
    setFocus(focusOnLandmark(l));
  };

  const isolate = (next: Scope | null) => {
    setScope(next);
    setFocus(focusFor(next));
    if (
      selected &&
      next &&
      !(next.kind === "region"
        ? regionOf(selected).id === next.id
        : selected.group === next.id)
    ) {
      setSelectedId(null);
    }
  };

  const remove = (id: string, how: Removal) => {
    setRemoved((prev) => new Map(prev).set(id, how));
    setHistory((prev) => [...prev, id]);
    setSelectedId(null);
  };

  const undo = () => {
    const id = history[history.length - 1];
    if (!id) return;
    setRemoved((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    setHistory((prev) => prev.slice(0, -1));
  };

  const reset = () => {
    setRemoved(new Map());
    setHistory([]);
    setSelectedId(null);
    setScope(null);
    setFocus({ kind: "all" });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    } else if (e.key === "Escape") {
      if (landmarkId) setLandmarkId(null);
      else if (selectedId) setSelectedId(null);
    } else if (selectedId && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key.toLowerCase() === "o") remove(selectedId, "hidden");
      if (e.key.toLowerCase() === "a") remove(selectedId, "dimmed");
    }
  };

  const hiddenCount = [...removed.values()].filter(
    (r) => r === "hidden",
  ).length;
  const dimmedCount = removed.size - hiddenCount;
  const tag =
    hoveredLandmark?.name ??
    (hovered && hovered.id !== selectedId ? hovered.name : null);

  return (
    // tabIndex lets the plate take focus when the canvas is clicked, for keyboard shortcuts.
    <figure
      className={plate.plate}
      ref={fullscreen.ref}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <figcaption className={plate.caption}>
        Lámina II · El esqueleto humano
      </figcaption>
      {fullscreen.supported && (
        <div className={plate.tools}>
          <FullscreenButton
            active={fullscreen.active}
            onClick={fullscreen.toggle}
          />
        </div>
      )}

      <div className={plate.chipBar} role="toolbar" aria-label="Aislar región">
        {SCOPES.map(({ label, scope: s }) => (
          <button
            key={label}
            className={plate.chip}
            data-active={sameScope(scope, s)}
            onClick={() => isolate(s)}
          >
            {label}
          </button>
        ))}
      </div>

      <IndexedStage
        sections={boneIndex}
        selectedKey={selectedId}
        onChoose={(e) => choosePiece(e.key)}
        storageKey="skeleton"
        label="Buscar un hueso"
      >
        <SkeletonStage
          lookOf={lookOf}
          isPickable={isPickable}
          focus={focus}
          onPick={handlePick}
          onHoverChange={setHoveredId}
          markers={markers}
          onMarkerHover={setHoveredLandmarkId}
          onMarkerPick={selectLandmark}
        >
          {tag && <StageTag>{tag}</StageTag>}
          {removed.size > 0 && (
            <div className={styles.removedBar}>
              <span>
                {hiddenCount > 0 &&
                  `${hiddenCount} ${hiddenCount === 1 ? "oculta" : "ocultas"}`}
                {hiddenCount > 0 && dimmedCount > 0 && " · "}
                {dimmedCount > 0 &&
                  `${dimmedCount} ${dimmedCount === 1 ? "atenuada" : "atenuadas"}`}
              </span>
              <button
                className={styles.barButton}
                onClick={undo}
                title="Deshacer (Ctrl+Z)"
              >
                Deshacer
              </button>
              <button className={styles.barButton} onClick={reset}>
                Restablecer modelo
              </button>
            </div>
          )}
        </SkeletonStage>
      </IndexedStage>

      <div className={plate.legend} aria-live="polite">
        {selected ? (
          <>
            <PieceCard
              piece={selected}
              onFocus={() => setFocus({ kind: "piece", id: selected.id })}
              isolated={isolated}
              onIsolate={() => setIsolated((v) => !v)}
              onDim={() => remove(selected.id, "dimmed")}
              onHide={() => remove(selected.id, "hidden")}
            />
            {pieceLandmarks.length > 0 && (
              <LandmarkPanel
                landmarks={pieceLandmarks}
                active={activeLandmark}
                hoveredId={hoveredLandmarkId}
                showPins={showLandmarks}
                onTogglePins={() => setShowLandmarks((v) => !v)}
                onHover={setHoveredLandmarkId}
                onSelect={selectLandmark}
              />
            )}
          </>
        ) : (
          <p className={plate.hint}>
            Pulsa ▶ y arrastra para girar · rueda para acercar · clic para identificar ·
            doble clic para enfocar · selecciona y pulsa O para ocultar o A para
            atenuar
          </p>
        )}
      </div>
    </figure>
  );
}

function PieceCard({
  piece,
  onFocus,
  isolated,
  onIsolate,
  onDim,
  onHide,
}: {
  piece: BonePiece;
  onFocus: () => void;
  isolated: boolean;
  onIsolate: () => void;
  onDim: () => void;
  onHide: () => void;
}) {
  const [described, setDescribed] = useState(false);
  const group = groupById.get(piece.group)!;
  const region = regionOf(piece);
  return (
    <>
      <div className={styles.card}>
        <div>
          <p className={plate.kicker}>
            {region.division === "axial"
              ? "Esqueleto axial"
              : "Esqueleto apendicular"}{" "}
            · {region.name} · {group.name}
          </p>
          <h3 className={plate.title}>{piece.name}</h3>
          <p className={plate.meta}>
            <TaNames en={piece.en} side={piece.side} />
            {piece.aliases && piece.aliases.length > 0 && (
              <> · También: {piece.aliases.join(", ")}</>
            )}
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
          <button
            className={plate.button}
            onClick={onIsolate}
            aria-pressed={isolated}
          >
            {isolated ? "Ver todo" : "Aislar"}
          </button>
          <button className={plate.button} onClick={onDim} title="Atenuar (A)">
            Atenuar
          </button>
          <button className={plate.button} onClick={onHide} title="Ocultar (O)">
            Ocultar
          </button>
        </div>
      </div>
      {described && <Description en={piece.en} />}
    </>
  );
}

function LandmarkPanel({
  landmarks,
  active,
  hoveredId,
  showPins,
  onTogglePins,
  onHover,
  onSelect,
}: {
  landmarks: Landmark[];
  active?: Landmark;
  hoveredId: string | null;
  showPins: boolean;
  onTogglePins: () => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className={styles.landmarks} aria-label="Accidentes óseos">
      <div className={styles.landmarksHead}>
        <span className={plate.kicker}>
          Accidentes óseos · {landmarks.length}
        </span>
        <button className={styles.linkButton} onClick={onTogglePins}>
          {showPins ? "Ocultar pines" : "Mostrar pines"}
        </button>
      </div>

      {active && (
        <p className={styles.landmarkDetail}>
          <strong>{active.name}</strong>
          {" · "}
          <TaNames en={active.en} />
          {active.aliases.length > 0 && (
            <> · También: {active.aliases.join(", ")}</>
          )}
          {active.inconstant && (
            <span className={styles.badge}>inconstante</span>
          )}
          {active.opening && <span className={styles.badge}>abertura</span>}
        </p>
      )}

      <ul className={styles.landmarkList}>
        {landmarks.map((l) => (
          <li key={l.id}>
            <button
              className={styles.landmarkChip}
              data-active={l.id === active?.id || l.id === hoveredId}
              onMouseEnter={() => onHover(l.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(l.id)}
            >
              {l.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Terminologia Anatomica names: Latin (the standard) first, English as a quieter reference. */
function TaNames({ en, side }: { en: string; side?: "left" | "right" }) {
  const latin = side ? latinWithSide(en, side) : latinOf(en);
  return (
    <>
      {latin && (
        <span className={plate.latin} lang="la">
          {latin}
        </span>
      )}
      {latin && " · "}
      <span className={plate.english} lang="en">
        {en}
      </span>
    </>
  );
}
