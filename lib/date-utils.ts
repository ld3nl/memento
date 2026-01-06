import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarWeeks,
  getDate,
  getMonth,
  intervalToDuration,
  parse,
} from "date-fns";
import { DEFAULT_DATE_FORMAT } from "./constants";
import { parseAndValidateDate } from "./validation";

/**
 * Date calculation utilities
 */

/**
 * Calculates the full age breakdown (years, months, days)
 */
export const calculateFullAge = (
  dob: string | Date,
  format: string = DEFAULT_DATE_FORMAT,
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
 * Calculates weeks since the last birthday
 */
export const calculateWeeksFromLastBirthday = (
  dob: string | Date,
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
