import * as stylex from "@stylexjs/stylex";
import { type KeyboardEvent, useContext } from "react";
import { EMPTY_WEEK_SPANS, inkPaint } from "../../lib/week-notes";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";
import type { WeekProps } from "./Week.types";
import { WeekInspectContext } from "./week-inspect";
import { WeekNotesContext } from "./week-notes-context";

type YearTick = "origin" | "decade" | "mark";

function yearTickFor(yearsAlive: string | undefined): YearTick | undefined {
  const yearNumber = yearsAlive ? Number(yearsAlive) : Number.NaN;
  if (!Number.isFinite(yearNumber)) return undefined;
  if (yearNumber === 1) return "origin";
  if (yearNumber % 10 === 0) return "decade";
  return "mark";
}

function currentWeekFill(
  isCurrentWeek: boolean | undefined,
  currentDayOfWeek: number | undefined
) {
  if (!isCurrentWeek || !currentDayOfWeek) return 0;
  return Math.round((currentDayOfWeek / 7) * 100);
}

const styles = stylex.create({
  cell: {
    position: "relative",
    width: "0.5rem",
    height: "0.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  hit: {
    cursor: "pointer",
  },
  emptyBorder: {
    borderColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.border,
    },
  },
  filled: {
    backgroundColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
  },
  secondHalf: {
    marginLeft: "auto",
  },
  fillBar: {
    position: "absolute",
    inset: 0,
    transformOrigin: "left center",
    backgroundColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
    width: "var(--week-fill)",
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  tick: {
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    left: "100%",
    zIndex: 1,
    marginLeft: "0.625rem",
    transform: "translateY(-50%)",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: {
      default: `color-mix(in oklab, ${tokens.secondary} 70%, transparent)`,
      [breakpoints.dark]: `color-mix(in oklab, ${tokens.border} 80%, transparent)`,
    },
    paddingLeft: "0.375rem",
    fontFamily: tokens.fontMono,
    fontSize: tokens.tick,
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: tokens.trackingTick,
    color: {
      default: tokens.secondary,
      [breakpoints.dark]: tokens.secondary,
    },
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  tickOrigin: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.tickLg,
    lineHeight: 1,
    fontWeight: 400,
    letterSpacing: tokens.trackingTickSoft,
    fontStyle: "italic",
    color: {
      default: tokens.primary,
      [breakpoints.dark]: tokens.quiet,
    },
  },
  tickDecade: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.tickLg,
    lineHeight: 1,
    fontWeight: 400,
    letterSpacing: tokens.trackingTickSoft,
    fontStyle: "italic",
    // Match production Tailwind cascade: decade label is accent in light,
    // but `dark:after:text-secondary` wins over `data-[tick=decade]:after:text-accent`.
    color: {
      default: tokens.accent,
      [breakpoints.dark]: tokens.secondary,
    },
    borderLeftColor: tokens.accent,
  },
});

function tickStyle(yearTick: YearTick | undefined) {
  if (yearTick === "origin") {
    return stylex.props(styles.tick, styles.tickOrigin);
  }
  if (yearTick === "decade") {
    return stylex.props(styles.tick, styles.tickDecade);
  }
  return stylex.props(styles.tick);
}

function WeekFill({ percent }: { percent: number }) {
  return (
    <div
      {...stylex.props(styles.fillBar)}
      style={{ ["--week-fill" as string]: `${percent}%` }}
      aria-hidden="true"
    />
  );
}

function WeekTick({ yearTick, label }: { yearTick: YearTick; label: string }) {
  return <span {...tickStyle(yearTick)}>{label}</span>;
}

type WeekView = {
  className: string;
  style?: { backgroundColor?: string };
  title?: string;
  tick?: YearTick;
  day?: number;
  fillPercent: number | null;
  inspect: {
    tabIndex: number;
    "data-life-year": number;
    "data-week-index": number;
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  } | null;
};

function weekView(
  props: WeekProps,
  inspect: ((lifeYear: number, weekIndex: number) => void) | null,
  marks: { color?: string }[],
  noteHover: string | null
): WeekView {
  const yearTick = yearTickFor(props.yearsAlive);
  const lived = Boolean(props.isFilled || props.isCurrentWeek);
  const painted = stylex.props(
    styles.cell,
    props.lifeYear !== undefined && inspect !== null && styles.hit,
    !lived && styles.emptyBorder,
    Boolean(props.isFilled && !props.isCurrentWeek) && styles.filled,
    props.weekIndex > 26 && styles.secondHalf
  );
  const className = [
    painted.className,
    props.isCurrentWeek && "current-week",
    props.className,
  ]
    .filter(Boolean)
    .join(" ");
  const showFill = Boolean(props.isCurrentWeek && props.currentDayOfWeek);
  return {
    className,
    style: marks[0]?.color
      ? { ...painted.style, backgroundColor: inkPaint(marks[0].color) }
      : painted.style,
    title: noteHover ?? props.yearsAlive,
    tick: yearTick,
    day: showFill ? props.currentDayOfWeek : undefined,
    fillPercent:
      showFill && !marks[0]?.color
        ? currentWeekFill(props.isCurrentWeek, props.currentDayOfWeek)
        : null,
    inspect:
      props.lifeYear !== undefined && inspect !== null
        ? {
            tabIndex: props.isCurrentWeek || props.tabStop ? 0 : -1,
            "data-life-year": props.lifeYear,
            "data-week-index": props.weekIndex,
            onClick: () => inspect(props.lifeYear as number, props.weekIndex),
            onKeyDown: moveWeekFocus,
          }
        : null,
  };
}

export const Week = (props: WeekProps) => {
  const inspect = useContext(WeekInspectContext);
  const weekNotes = useContext(WeekNotesContext);
  const lifeYear = props.lifeYear;
  const marks =
    lifeYear !== undefined && inspect !== null
      ? (weekNotes?.marksFor(lifeYear, props.weekIndex) ?? EMPTY_WEEK_SPANS)
      : EMPTY_WEEK_SPANS;
  const noteHover =
    marks.length > 0 && lifeYear !== undefined
      ? (weekNotes?.hoverFor(lifeYear, props.weekIndex) ?? null)
      : null;
  const view = weekView(props, inspect, marks, noteHover);

  return (
    <div
      className={view.className}
      style={view.style}
      title={view.title}
      data-tick={view.tick}
      data-current-week-day={view.day}
      {...(view.inspect ?? {})}
    >
      {view.fillPercent !== null ? (
        <WeekFill percent={view.fillPercent} />
      ) : null}
      {view.tick && props.yearsAlive ? (
        <WeekTick yearTick={view.tick} label={props.yearsAlive} />
      ) : null}
    </div>
  );
};

function moveWeekFocus(event: KeyboardEvent<HTMLDivElement>) {
  const table = event.currentTarget.closest<HTMLElement>(
    "[data-cy='life-table']"
  );
  if (!table) return;

  const current = event.currentTarget;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    current.click();
    return;
  }

  const row = current.closest<HTMLElement>("[data-cy='year-grid']");
  if (!row) return;
  const rows = [
    ...table.querySelectorAll<HTMLElement>("[data-cy='year-grid']"),
  ];
  const rowIndex = rows.indexOf(row);
  const cells = [...row.querySelectorAll<HTMLDivElement>("[data-week-index]")];
  const col = cells.indexOf(current);

  let next: HTMLDivElement | undefined;
  if (event.key === "ArrowRight") next = cells[col + 1];
  else if (event.key === "ArrowLeft") next = cells[col - 1];
  else if (event.key === "ArrowDown") {
    next =
      rows[rowIndex + 1]?.querySelectorAll<HTMLDivElement>("[data-week-index]")[
        col
      ];
  } else if (event.key === "ArrowUp") {
    next =
      rows[rowIndex - 1]?.querySelectorAll<HTMLDivElement>("[data-week-index]")[
        col
      ];
  } else if (event.key === "Home") next = cells[0];
  else if (event.key === "End") next = cells[cells.length - 1];
  else return;

  if (!next || next === current) return;
  event.preventDefault();
  current.tabIndex = -1;
  next.tabIndex = 0;
  next.focus();
}
