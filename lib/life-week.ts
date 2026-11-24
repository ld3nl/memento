import {
  format,
  formatISO,
  getISOWeek,
  getISOWeekYear,
  getMonth,
} from "date-fns";
import type { LifeWeekCountMode } from "./life-grid-time";
import { DEFAULT_LIFE_WEEK_COUNT_MODE, gridWeekSpan } from "./life-grid-time";

export type LifeWeekDetail = {
  /** ISO week of the day this square starts. */
  isoWeek: number;
  isoYear: number;
  /** Completed years at the start of this row. Row 1 is age 0. */
  ageYears: number;
  /** Local timestamp of the week’s first day, kept for later use. */
  stamp: string;
  /** First day through last day of the square, with the month. */
  span: string;
  /** Inclusive first day, yyyy-mm-dd. */
  startDay: string;
  /** Inclusive last day, yyyy-mm-dd. */
  endDay: string;
  label: string;
  ageLabel: string;
};

/**
 * A table square is one of 52 weeks in a life-year, counted from the birthday.
 * The label is the calendar week that square opens on.
 */
export function lifeWeekDays(
  dob: Date,
  lifeYear: number,
  weekIndex: number,
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): { startDay: string; endDay: string } {
  const { start, end } = weekBounds(dob, lifeYear, weekIndex, mode);
  return {
    startDay: format(start, "yyyy-MM-dd"),
    endDay: format(end, "yyyy-MM-dd"),
  };
}

export function describeLifeWeek(
  dob: Date,
  lifeYear: number,
  weekIndex: number,
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): LifeWeekDetail {
  const { start: weekStart, end: weekEnd } = weekBounds(
    dob,
    lifeYear,
    weekIndex,
    mode
  );
  const isoWeek = getISOWeek(weekStart);
  const isoYear = getISOWeekYear(weekStart);
  const ageYears = Math.max(0, lifeYear - 1);

  return {
    isoWeek,
    isoYear,
    ageYears,
    stamp: formatISO(weekStart),
    span: formatWeekSpan(weekStart, weekEnd),
    startDay: format(weekStart, "yyyy-MM-dd"),
    endDay: format(weekEnd, "yyyy-MM-dd"),
    label: `Week ${isoWeek} ${isoYear}`,
    ageLabel: `${ageYears} ${ageYears === 1 ? "year" : "years"} old`,
  };
}

function weekBounds(
  dob: Date,
  lifeYear: number,
  weekIndex: number,
  mode: LifeWeekCountMode
): { start: Date; end: Date } {
  return gridWeekSpan(dob, lifeYear, weekIndex, mode);
}

function formatWeekSpan(start: Date, end: Date): string {
  const startDay = format(start, "d");
  const endDay = format(end, "d");
  if (getMonth(start) === getMonth(end)) {
    return `${startDay} – ${endDay} ${format(start, "MMM")}`;
  }
  return `${startDay} ${format(start, "MMM")} – ${endDay} ${format(end, "MMM")}`;
}
