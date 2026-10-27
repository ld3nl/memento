import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarWeeks,
  getDate,
  getMonth,
  intervalToDuration,
  parse,
} from "date-fns";
import {
  DECADE_LENGTH,
  DEFAULT_DATE_FORMAT,
  WEEKS_PER_YEAR,
  YEARS_IN_LIFETIME,
} from "./constants";
import { parseAndValidateDate } from "./validation";

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
 * Calculates years alive (for life table calculations)
 */
export const calculateYearsAlive = (dob: string | Date): number | null => {
  const dobDate = parseAndValidateDate(dob);
  if (!dobDate) return null;

  // Subtract 1 to account for current year
  return differenceInCalendarISOWeekYears(new Date(), dobDate) - 1;
};

/**
 * Weeks painted as filled on the 52-week life calendar, plus the empty
 * squares left in an 80-year grid. A calendar year is not 52 weeks, so this
 * is the square count, not the raw elapsed time.
 */
export const calculateLifeWeeks = (
  dob: string | Date
): {
  weeksLived: number;
  weeksRemaining: number;
  beyondGrid: boolean;
} | null => {
  const yearsAlive = calculateYearsAlive(dob);
  const weeksFromBirthday = calculateWeeksFromLastBirthday(dob);
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
 * Calculates weeks since the last birthday
 */
export const calculateWeeksFromLastBirthday = (
  dob: string | Date
): number | null => {
  const dobDate = parseAndValidateDate(dob);
  if (!dobDate) return null;

  const today = new Date();
  const currentYear = today.getFullYear();
  const birthMonth = getMonth(dobDate);
  const birthDay = getDate(dobDate);

  // Create this year's birthday
  const thisYearBirthday = new Date(currentYear, birthMonth, birthDay);

  // Calculate weeks difference
  let weekDiff = differenceInCalendarWeeks(today, thisYearBirthday);

  // If birthday hasn't occurred this year, use last year's birthday
  if (weekDiff < 0) {
    const lastBirthday = new Date(currentYear - 1, birthMonth, birthDay);
    weekDiff = differenceInCalendarWeeks(today, lastBirthday);
  }

  return Math.max(0, weekDiff);
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
export const getDaysIntoCurrentWeek = (dob: string | Date): number | null => {
  const dobDate = parseAndValidateDate(dob);
  if (!dobDate) return null;

  const today = new Date();
  const currentYear = today.getFullYear();
  const birthMonth = getMonth(dobDate);
  const birthDay = getDate(dobDate);

  // Create this year's birthday
  let lastBirthday = new Date(currentYear, birthMonth, birthDay);

  // If birthday hasn't occurred this year, use last year's
  if (lastBirthday > today) {
    lastBirthday = new Date(currentYear - 1, birthMonth, birthDay);
  }

  // Calculate total days since last birthday
  const diffTime = today.getTime() - lastBirthday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Get position within the current week (1-7)
  const daysIntoWeek = (diffDays % 7) + 1;

  return daysIntoWeek;
};
