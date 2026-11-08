import { Fragment, type ReactNode } from "react";
import { descriptionOf, sourceLabel } from "../../data/descriptions";
import styles from "./Description.module.css";

/** `**bold**` and `*italic*` inside a description's paragraph. */
function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : part.startsWith("*") && part.length > 2 ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
}

/** The written description of the structure selected in a viewer, by its TA English name. */
export function Description({ en }: { en: string | null | undefined }) {
  const d = descriptionOf(en);
  if (!d)
    return (
      <div className={styles.panel} data-empty>
        <p>
          Todavía no hay una descripción escrita de esta estructura. Se añaden a
          medida que se escribe la parte descriptiva de cada libro.
        </p>
      </div>
    );
  return (
    <div className={styles.panel}>
      {d.text.map((p, i) => (
        <p key={i}>{inline(p)}</p>
      ))}
      <p className={styles.sources}>{d.sources.map(sourceLabel).join(" · ")}</p>
    </div>
  );
}

/** The «Descripción» toggle, styled like the other buttons of a selection card. */
export function DescriptionButton({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className: string;
}) {
  return (
    <button className={className} onClick={onClick} aria-pressed={open}>
      {open ? "Ocultar descripción" : "Descripción"}
    </button>
  );
}
