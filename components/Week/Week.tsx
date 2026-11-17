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

export const Week = ({
  weekIndex,
  isFilled,
  yearsAlive,
  className,
  isCurrentWeek,
  currentDayOfWeek,
  lifeYear,
  tabStop,
}: WeekProps) => {
  const yearTick = yearTickFor(yearsAlive);
  const inspect = useContext(WeekInspectContext);
  const weekNotes = useContext(WeekNotesContext);
  const inspectable = lifeYear !== undefined && inspect !== null;
  const marks =
    inspectable && lifeYear !== undefined
      ? (weekNotes?.marksFor(lifeYear, weekIndex) ?? EMPTY_WEEK_SPANS)
      : EMPTY_WEEK_SPANS;
  const noteHover =
    marks.length > 0 && lifeYear !== undefined
      ? (weekNotes?.hoverFor(lifeYear, weekIndex) ?? null)
      : null;
  const markColor = marks[0]?.color;
  const fillPercentage = currentWeekFill(isCurrentWeek, currentDayOfWeek);
  const showFill = Boolean(isCurrentWeek && currentDayOfWeek);
  const isLived = Boolean(isFilled || isCurrentWeek);

  const stylexProps = stylex.props(
    styles.cell,
    inspectable && styles.hit,
    !isLived && styles.emptyBorder,
    Boolean(isFilled && !isCurrentWeek) && styles.filled,
    weekIndex > 26 && styles.secondHalf
  );

  const markerClasses = [
    stylexProps.className,
    isCurrentWeek ? "current-week" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shared = {
    ...stylexProps,
    className: markerClasses,
    ...(markColor
      ? {
          style: { ...stylexProps.style, backgroundColor: inkPaint(markColor) },
        }
      : {}),
    ...(noteHover
      ? { title: noteHover }
      : yearsAlive
        ? { title: yearsAlive }
        : {}),
    ...(yearsAlive ? { "data-tick": yearTick } : {}),
    ...(showFill ? { "data-current-week-day": currentDayOfWeek } : {}),
  };

  const inner = (
    <>
      {showFill && !markColor ? (
        <div
          {...stylex.props(styles.fillBar)}
          style={{ ["--week-fill" as string]: `${fillPercentage}%` }}
          aria-hidden="true"
        />
      ) : null}
      {yearTick && yearsAlive ? (
        <span
          {...stylex.props(
            styles.tick,
            yearTick === "origin" && styles.tickOrigin,
            yearTick === "decade" && styles.tickDecade
          )}
        >
          {yearsAlive}
        </span>
      ) : null}
    </>
  );

  return (
    <div
      {...shared}
      {...(inspectable
        ? {
            tabIndex: isCurrentWeek || tabStop ? 0 : -1,
            "data-life-year": lifeYear,
            "data-week-index": weekIndex,
            onClick: () => inspect(lifeYear, weekIndex),
            onKeyDown: moveWeekFocus,
          }
        : {})}
    >
      {inner}
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
