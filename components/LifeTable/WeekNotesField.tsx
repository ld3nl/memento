"use client";

import * as stylex from "@stylexjs/stylex";
import {
  type FocusEvent,
  type KeyboardEvent,
  useContext,
  useRef,
  useState,
} from "react";
import {
  formatSpanDay,
  formatSpanRange,
  inkPaint,
  LEDGER_INKS,
  matchSpans,
  usedInkIds,
  type WeekSpan,
} from "../../lib/week-notes";
import { tokens } from "../../styles/tokens.stylex";
import { WeekNotesContext } from "../Week/week-notes-context";

const styles = stylex.create({
  block: {
    marginTop: "1.5rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    paddingTop: "0.875rem",
  },
  label: {
    margin: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.kicker,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: tokens.secondary,
  },
  list: {
    margin: 0,
    marginTop: "0.75rem",
    padding: 0,
    listStyle: "none",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "0.75rem",
    rowGap: "0.375rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.line,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  },
  name: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flex: "1 1 8rem",
    minWidth: "8rem",
  },
  swatchAnchor: {
    position: "relative",
    flexShrink: 0,
  },
  swatchButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.25rem",
    height: "1.25rem",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    cursor: "pointer",
  },
  swatch: {
    width: "0.5rem",
    height: "0.5rem",
    flexShrink: 0,
  },
  palette: {
    position: "absolute",
    zIndex: 3,
    top: "100%",
    left: 0,
    display: "flex",
    gap: "0.375rem",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
    padding: "0.375rem",
  },
  chip: {
    width: "0.875rem",
    height: "0.875rem",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "transparent",
    padding: 0,
    cursor: "pointer",
  },
  chipOn: {
    borderColor: tokens.accent,
  },
  chipTaken: {
    opacity: 0.28,
    cursor: "default",
  },
  nameText: {
    fontFamily: tokens.fontSans,
    fontSize: "0.875rem",
    lineHeight: 1.3,
    color: tokens.primary,
    overflowWrap: "anywhere",
  },
  range: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    marginLeft: "auto",
  },
  dash: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1,
    color: tokens.secondary,
  },
  day: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":focus-within": tokens.accent,
    },
    backgroundColor: tokens.surfaceRaised,
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    paddingLeft: "0.375rem",
    paddingRight: "0.375rem",
    cursor: "pointer",
    boxShadow: {
      default: "none",
      ":focus-within": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
    },
  },
  dayText: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1.2,
    color: tokens.primary,
    fontVariantNumeric: "tabular-nums",
  },
  dayInput: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    margin: 0,
    borderWidth: 0,
    padding: 0,
    opacity: 0,
    cursor: "pointer",
  },
  remove: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.5rem",
    height: "1.5rem",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "1.125rem",
    lineHeight: 1,
    color: tokens.secondary,
    cursor: "pointer",
  },
  anchor: {
    position: "relative",
    marginTop: "0.75rem",
  },
  shell: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":focus-within": tokens.accent,
    },
    backgroundColor: tokens.surfaceRaised,
    boxShadow: {
      default: "none",
      ":focus-within": `0 0 0 4px color-mix(in oklab, ${tokens.accent} 20%, transparent)`,
    },
  },
  field: {
    display: "flex",
    alignItems: "center",
    minHeight: "2.75rem",
    padding: "0.375rem 0.5rem",
    cursor: "text",
  },
  input: {
    flex: "1 1 auto",
    width: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    fontFamily: tokens.fontSans,
    fontSize: "0.875rem",
    lineHeight: 1.4,
    color: tokens.primary,
    outline: "none",
    "::placeholder": {
      color: tokens.secondary,
    },
  },
  menuPanel: {
    position: "absolute",
    zIndex: 2,
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "0.25rem",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
  },
  menuLabel: {
    margin: 0,
    paddingTop: "0.5rem",
    paddingBottom: "0.25rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.kicker,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: tokens.trackingLabel,
    textTransform: "uppercase",
    color: tokens.secondary,
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "9rem",
    overflowY: "auto",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    borderWidth: 0,
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: "transparent",
    backgroundColor: "transparent",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    textAlign: "left",
    cursor: "pointer",
  },
  optionOn: {
    backgroundColor: tokens.line,
  },
  optionName: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1.3,
    color: tokens.primary,
  },
  optionRange: {
    marginLeft: "auto",
    fontFamily: tokens.fontMono,
    fontSize: "0.6875rem",
    lineHeight: 1.3,
    color: tokens.secondary,
    fontVariantNumeric: "tabular-nums",
  },
  hint: {
    marginTop: "0.5rem",
    marginBottom: 0,
    fontFamily: tokens.fontMono,
    fontSize: "0.6875rem",
    lineHeight: 1.4,
    color: tokens.secondary,
  },
  when: {
    marginLeft: "auto",
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
    lineHeight: 1.3,
    color: tokens.secondary,
    fontVariantNumeric: "tabular-nums",
  },
});

export function WeekNotesField({
  lifeYear,
  weekIndex,
}: {
  lifeYear: number;
  weekIndex: number;
}) {
  const notes = useContext(WeekNotesContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [held, setHeld] = useState<string[]>([]);
  const [colorOpen, setColorOpen] = useState<string | null>(null);
  if (!notes) return null;

  const taken = usedInkIds(notes.spans);

  const covering = notes.marksFor(lifeYear, weekIndex);
  const visible = new Set([...held, ...covering.map(span => span.id)]);
  const rows = notes.spans
    .filter(span => visible.has(span.id))
    .toSorted(
      (a, b) => a.start.localeCompare(b.start) || a.label.localeCompare(b.label)
    );
  const matches = matchSpans(notes.known, draft, rows);
  const show = open && matches.length > 0;
  const highlighted = active >= 0 ? matches[active] : undefined;
  const browsing = draft.trim() === "";

  function commit(labels: string[]) {
    if (!notes) return;
    for (const label of labels) notes.add(lifeYear, weekIndex, label);
  }

  function commitDraft() {
    const label = draft.trim();
    if (!label) return;
    commit([label]);
    setDraft("");
    setActive(-1);
  }

  function choose(span: WeekSpan) {
    commit([span.label]);
    setDraft("");
    setActive(-1);
    setOpen(true);
    inputRef.current?.focus();
  }

  function changeRange(id: string, start: string, end: string) {
    setHeld(current => (current.includes(id) ? current : [...current, id]));
    notes?.setRange(id, start, end);
  }

  function remove(id: string) {
    setHeld(current => current.filter(item => item !== id));
    notes?.remove(id);
  }

  if (notes.readOnly) {
    return (
      <div {...stylex.props(styles.block)}>
        <p {...stylex.props(styles.label)} id="week-note-label">
          Record
        </p>
        {rows.length > 0 ? (
          <ul {...stylex.props(styles.list)}>
            {rows.map(span => {
              const swatch = stylex.props(styles.swatch);
              return (
                <li key={span.id} {...stylex.props(styles.row)}>
                  <span {...stylex.props(styles.name)}>
                    <span
                      {...swatch}
                      style={{
                        ...swatch.style,
                        backgroundColor: inkPaint(span.color),
                      }}
                      aria-hidden="true"
                    />
                    <span {...stylex.props(styles.nameText)}>{span.label}</span>
                  </span>
                  <span {...stylex.props(styles.when)}>
                    {formatSpanRange(span)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p {...stylex.props(styles.hint)}>No public mark this week.</p>
        )}
      </div>
    );
  }

  return (
    <form
      {...stylex.props(styles.block)}
      onSubmit={event => {
        event.preventDefault();
        if (show && highlighted) {
          choose(highlighted);
          return;
        }
        commitDraft();
      }}
    >
      <p {...stylex.props(styles.label)} id="week-note-label">
        Note
      </p>
      {rows.length > 0 ? (
        <ul {...stylex.props(styles.list)}>
          {rows.map(span => (
            <li key={span.id} {...stylex.props(styles.row)}>
              <span {...stylex.props(styles.name)}>
                <InkMenu
                  label={span.label}
                  color={span.color}
                  open={colorOpen === span.id}
                  taken={taken}
                  onToggle={() =>
                    setColorOpen(current =>
                      current === span.id ? null : span.id
                    )
                  }
                  onClose={() => setColorOpen(null)}
                  onPick={color => {
                    notes.setColor(span.id, color);
                    setColorOpen(null);
                  }}
                />
                <span {...stylex.props(styles.nameText)}>{span.label}</span>
              </span>
              <span {...stylex.props(styles.range)}>
                <DayField
                  value={span.start}
                  min={notes.lifeStart}
                  max={notes.lifeEnd}
                  label={`Start of ${span.label}`}
                  onChange={start => changeRange(span.id, start, span.end)}
                />
                <span {...stylex.props(styles.dash)} aria-hidden="true">
                  –
                </span>
                <DayField
                  value={span.end}
                  min={notes.lifeStart}
                  max={notes.lifeEnd}
                  label={`End of ${span.label}`}
                  onChange={end => changeRange(span.id, span.start, end)}
                />
                <button
                  type="button"
                  {...stylex.props(styles.remove)}
                  aria-label={`Remove ${span.label}`}
                  onClick={() => remove(span.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div {...stylex.props(styles.anchor)}>
        <div {...stylex.props(styles.shell)}>
          <label {...stylex.props(styles.field)} htmlFor="week-note-input">
            <input
              ref={inputRef}
              {...stylex.props(styles.input)}
              id="week-note-input"
              data-cy="week-note-input"
              role="combobox"
              aria-labelledby="week-note-label"
              aria-expanded={show}
              aria-controls="week-note-list"
              aria-autocomplete="list"
              aria-activedescendant={
                show && highlighted
                  ? `week-note-opt-${matches.indexOf(highlighted)}`
                  : undefined
              }
              value={draft}
              placeholder={rows.length === 0 ? "Add a note" : "Add another"}
              onFocus={() => setOpen(true)}
              onChange={event => {
                const raw = event.target.value;
                setOpen(true);
                setActive(0);
                if (!raw.includes(",")) {
                  setDraft(raw);
                  return;
                }
                const parts = raw.split(",");
                const rest = parts.pop() ?? "";
                commit(parts);
                setDraft(rest);
                setActive(-1);
              }}
              onKeyDown={event => {
                if (event.key === "ArrowDown" && matches.length > 0) {
                  event.preventDefault();
                  setOpen(true);
                  setActive(index => Math.min(matches.length - 1, index + 1));
                  return;
                }
                if (event.key === "ArrowUp" && matches.length > 0) {
                  event.preventDefault();
                  setOpen(true);
                  setActive(index => Math.max(0, index - 1));
                  return;
                }
                if (event.key === "Escape" && show) {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                  return;
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (show && highlighted) {
                    choose(highlighted);
                    return;
                  }
                  if (show && draft.trim() && matches[0]) {
                    choose(matches[0]);
                    return;
                  }
                  commitDraft();
                }
              }}
              onBlur={() => {
                setOpen(false);
                commitDraft();
              }}
            />
          </label>
        </div>
        {show ? (
          <div {...stylex.props(styles.menuPanel)}>
            {browsing ? (
              <p {...stylex.props(styles.menuLabel)}>Used before</p>
            ) : null}
            <div
              {...stylex.props(styles.menu)}
              id="week-note-list"
              role="listbox"
            >
              {matches.map((span, index) => (
                <button
                  key={span.id}
                  type="button"
                  id={`week-note-opt-${index}`}
                  role="option"
                  aria-selected={span.id === highlighted?.id}
                  {...stylex.props(
                    styles.option,
                    span.id === highlighted?.id && styles.optionOn
                  )}
                  style={
                    span.id === highlighted?.id
                      ? { borderLeftColor: inkPaint(span.color) }
                      : undefined
                  }
                  onMouseDown={event => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(span)}
                >
                  <span
                    {...stylex.props(styles.swatch)}
                    style={{ backgroundColor: inkPaint(span.color) }}
                    aria-hidden="true"
                  />
                  <span {...stylex.props(styles.optionName)}>{span.label}</span>
                  <span {...stylex.props(styles.optionRange)}>
                    {formatSpanDay(span.start)} – {formatSpanDay(span.end)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <p {...stylex.props(styles.hint)}>
        {notes.remembered
          ? "Comma or Enter adds a note. Dates paint every week between them. Saved on this device."
          : "Comma or Enter adds a note. Dates paint every week between them. Kept for this visit."}
      </p>
    </form>
  );
}

function InkMenu({
  label,
  color,
  open,
  taken,
  onToggle,
  onClose,
  onPick,
}: {
  label: string;
  color: string;
  open: boolean;
  taken: ReadonlySet<string>;
  onToggle: () => void;
  onClose: () => void;
  onPick: (color: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  function leave(event: FocusEvent<HTMLButtonElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    onClose();
  }
  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  }
  return (
    <div ref={rootRef} {...stylex.props(styles.swatchAnchor)}>
      <button
        type="button"
        {...stylex.props(styles.swatchButton)}
        aria-label={`Color of ${label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
        onBlur={leave}
        onKeyDown={onKey}
      >
        <span
          {...stylex.props(styles.swatch)}
          style={{ backgroundColor: inkPaint(color) }}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          {...stylex.props(styles.palette)}
          role="listbox"
          aria-label="Colors"
        >
          {LEDGER_INKS.map(ink => {
            const mine = ink.id === color;
            const blocked = taken.has(ink.id) && !mine;
            return (
              <button
                key={ink.id}
                type="button"
                role="option"
                aria-selected={mine}
                aria-disabled={blocked}
                disabled={blocked}
                aria-label={ink.name}
                {...stylex.props(
                  styles.chip,
                  mine && styles.chipOn,
                  blocked && styles.chipTaken
                )}
                style={{ backgroundColor: inkPaint(ink.id) }}
                onMouseDown={event => event.preventDefault()}
                onClick={() => onPick(ink.id)}
                onBlur={leave}
                onKeyDown={onKey}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function DayField({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: string;
  min: string | null;
  max: string | null;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <label {...stylex.props(styles.day)}>
      <span {...stylex.props(styles.dayText)} aria-hidden="true">
        {formatSpanDay(value)}
      </span>
      <input
        {...stylex.props(styles.dayInput)}
        type="date"
        value={value}
        min={min ?? undefined}
        max={max ?? undefined}
        aria-label={label}
        onChange={event => {
          const next = event.target.value;
          if (next) onChange(next);
        }}
      />
    </label>
  );
}
