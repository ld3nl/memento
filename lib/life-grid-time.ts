import { addDays, addWeeks, differenceInDays } from "date-fns";
import { WEEKS_PER_YEAR } from "./constants";
import { parseAndValidateDate } from "./validation";

/**
 * `birthday-grid` counts seven-day squares from the date of birth. A real
 * year is longer than 52 weeks, so birthdays drift across the row.
 * `calendar` splits each birthday-to-birthday span (365 or 366 days)
 * across the same 52 squares, so every birthday starts column 1.
 */
export type LifeWeekCountMode = "birthday-grid" | "calendar";

export const DEFAULT_LIFE_WEEK_COUNT_MODE: LifeWeekCountMode = "birthday-grid";

export type LifeWeekSpan = {
  start: Date;
  end: Date;
};

/** Anniversary `years` after `dob`. 29 Feb falls on 1 Mar when that year has no 29 Feb. */
export function lifeAnniversary(dob: Date, years: number): Date {
  return new Date(dob.getFullYear() + years, dob.getMonth(), dob.getDate());
}

/**
 * Inclusive dates for one square.
 * Calendar mode divides the days from this birthday to the next by 52.
 */
export function gridWeekSpan(
  dob: Date,
  lifeYear: number,
  weekIndex: number,
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): LifeWeekSpan {
  if (mode === "calendar") {
    const yearStart = lifeAnniversary(dob, lifeYear - 1);
    const yearDays = differenceInDays(
      lifeAnniversary(dob, lifeYear),
      yearStart
    );
    const startOffset = Math.floor(
      ((weekIndex - 1) * yearDays) / WEEKS_PER_YEAR
    );
    const endOffset = Math.floor((weekIndex * yearDays) / WEEKS_PER_YEAR) - 1;
    return {
      start: addDays(yearStart, startOffset),
      end: addDays(yearStart, Math.max(startOffset, endOffset)),
    };
  }

  const start = addWeeks(
    dob,
    (lifeYear - 1) * WEEKS_PER_YEAR + (weekIndex - 1)
  );
  return { start, end: addDays(start, 6) };
}

export type GridProgress = {
  /** Full rows before the current one. */
  completedLifeYearRows: number;
  /** Full squares before the current one in this row (0–51). */
  weeksIntoLifeYear: number;
  /** 1-based day inside the current square. */
  daysIntoWeek: number;
  /** 7 on the birthday grid. 7 or 8 when a real year is split by 52. */
  weekLength: number;
  currentLifeYear: number;
  currentWeekIndex: number;
};

function completedAnniversaries(dob: Date, asOf: Date): number {
  let years = asOf.getFullYear() - dob.getFullYear();
  const anniversary = new Date(
    asOf.getFullYear(),
    dob.getMonth(),
    dob.getDate()
  );
  if (anniversary > asOf) years -= 1;
  return Math.max(0, years);
}

/** 0-based square for a 0-based day offset inside a span of `yearDays`. */
function calendarWeekIndex(dayOffset: number, yearDays: number): number {
  if (yearDays <= 0) return 0;
  const index = Math.ceil(((dayOffset + 1) * WEEKS_PER_YEAR) / yearDays) - 1;
  return Math.min(WEEKS_PER_YEAR - 1, Math.max(0, index));
}

export function gridProgress(
  dob: string | Date,
  asOf: Date = new Date(),
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): GridProgress | null {
  const dobDate = parseAndValidateDate(dob);
  if (!dobDate) return null;

  const totalDays = differenceInDays(asOf, dobDate);
  if (totalDays < 0) return null;

  if (mode === "calendar") {
    const rows = completedAnniversaries(dobDate, asOf);
    const yearStart = lifeAnniversary(dobDate, rows);
    const yearDays = differenceInDays(
      lifeAnniversary(dobDate, rows + 1),
      yearStart
    );
    const daysSince = Math.min(
      Math.max(0, differenceInDays(asOf, yearStart)),
      Math.max(0, yearDays - 1)
    );
    const weekZero = calendarWeekIndex(daysSince, yearDays);
    const span = gridWeekSpan(dobDate, rows + 1, weekZero + 1, "calendar");
    const weekLength = differenceInDays(span.end, span.start) + 1;
    const daysInto = differenceInDays(asOf, span.start) + 1;
    return {
      completedLifeYearRows: rows,
      weeksIntoLifeYear: weekZero,
      daysIntoWeek: Math.min(weekLength, Math.max(1, daysInto)),
      weekLength,
      currentLifeYear: rows + 1,
      currentWeekIndex: weekZero + 1,
    };
  }

  const totalWeeks = Math.floor(totalDays / 7);
  const rows = Math.floor(totalWeeks / WEEKS_PER_YEAR);
  const into = totalWeeks % WEEKS_PER_YEAR;
  return {
    completedLifeYearRows: rows,
    weeksIntoLifeYear: into,
    daysIntoWeek: (totalDays % 7) + 1,
    weekLength: 7,
    currentLifeYear: rows + 1,
    currentWeekIndex: into + 1,
  };
}
