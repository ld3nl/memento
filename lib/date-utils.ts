import { intervalToDuration, parse } from "date-fns";
import {
  DECADE_LENGTH,
  DEFAULT_DATE_FORMAT,
  WEEKS_PER_YEAR,
  YEARS_IN_LIFETIME,
} from "./constants";
import {
  DEFAULT_LIFE_WEEK_COUNT_MODE,
  gridProgress,
  type LifeWeekCountMode,
} from "./life-grid-time";
import { parseAndValidateDate } from "./validation";

function resolveWeekCountMode(mode?: LifeWeekCountMode): LifeWeekCountMode {
  return mode ?? DEFAULT_LIFE_WEEK_COUNT_MODE;
}

const LIFETIME_YEARS = YEARS_IN_LIFETIME * DECADE_LENGTH;
const LIFETIME_WEEKS = LIFETIME_YEARS * WEEKS_PER_YEAR;

/**
 * Date calculation utilities
 */

/**
 * Calculates the full age breakdown (years, months, days)
 */
export const calculateFullAge = (
  dob: string | Date,
  format: string = DEFAULT_DATE_FORMAT
): { years: number; months: number; days: number } | null => {
  const birthDate =
    typeof dob === "string" ? parse(dob, format, new Date()) : dob;

  const validatedDate = parseAndValidateDate(birthDate);
  if (!validatedDate) return null;

  const duration = intervalToDuration({
    start: validatedDate,
    end: new Date(),
  });

  return {
    years: duration.years ?? 0,
    months: duration.months ?? 0,
    days: duration.days ?? 0,
  };
};

/**
 * Gets a formatted age string
 */
export const getFormattedAge = (dob: string | Date): string | null => {
  const age = calculateFullAge(dob);
  if (!age) return null;

  return `${age.years} years, ${age.months} months, ${age.days} days`;
};

/**
 * Full rows behind the current one.
 * The birthday grid counts 52×7-day squares from the date of birth.
 * Calendar mode counts real birthdays, so the rows stay lined up.
 */
export const calculateYearsAlive = (
  dob: string | Date,
  asOf: Date = new Date(),
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): number | null => {
  return gridProgress(dob, asOf, mode)?.completedLifeYearRows ?? null;
};

/**
 * Filled squares on the 80×52 grid, and the empty squares left.
 * The birthday grid counts every 7 days since birth. Calendar mode counts
 * squares inside real birthday years instead.
 */
export const calculateLifeWeeks = (
  dob: string | Date,
  asOf: Date = new Date(),
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): {
  weeksLived: number;
  weeksRemaining: number;
  beyondGrid: boolean;
} | null => {
  const yearsAlive = calculateYearsAlive(dob, asOf, mode);
  const weeksFromBirthday = calculateWeeksFromLastBirthday(dob, asOf, mode);
  if (yearsAlive === null || weeksFromBirthday === null) return null;

  if (yearsAlive >= LIFETIME_YEARS) {
    return { weeksLived: LIFETIME_WEEKS, weeksRemaining: 0, beyondGrid: true };
  }

  const weeksIntoYear =
    yearsAlive >= 0
      ? Math.min(WEEKS_PER_YEAR, Math.max(0, weeksFromBirthday))
      : 0;
  const weeksLived = Math.max(yearsAlive, 0) * WEEKS_PER_YEAR + weeksIntoYear;

  return {
    weeksLived,
    weeksRemaining: LIFETIME_WEEKS - weeksLived,
    beyondGrid: false,
  };
};

/**
 * Full squares already finished in the current row.
 * The square being lived is the next one, drawn with a partial fill.
 */
export const calculateWeeksFromLastBirthday = (
  dob: string | Date,
  asOf: Date = new Date(),
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): number | null => {
  return (
    gridProgress(dob, asOf, resolveWeekCountMode(mode))?.weeksIntoLifeYear ??
    null
  );
};

/**
 * Gets the current day of the week (1-7, where 1 = Monday, 7 = Sunday)
 * This is used for styling the current week box with partial fill
 */
export const getCurrentDayOfWeek = (): number => {
  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Convert to 1-7 where 1 = Monday, 7 = Sunday
  return dayIndex === 0 ? 7 : dayIndex;
};

/**
 * Calculates days passed in the current week since the last birthday
 * Returns a value 1-7 representing which day of the current week we're in
 * This allows for partial week fill visualization in the life table
 */
export const getDaysIntoCurrentWeek = (
  dob: string | Date,
  asOf: Date = new Date(),
  mode: LifeWeekCountMode = DEFAULT_LIFE_WEEK_COUNT_MODE
): number | null => {
  const progress = gridProgress(dob, asOf, resolveWeekCountMode(mode));
  if (!progress) return null;
  if (progress.weekLength <= 7) return progress.daysIntoWeek;
  // The cell paints a 7-step bar. Scale an 8-day square onto that bar.
  return Math.max(
    1,
    Math.min(7, Math.round((progress.daysIntoWeek / progress.weekLength) * 7))
  );
};

export type { LifeWeekCountMode };
