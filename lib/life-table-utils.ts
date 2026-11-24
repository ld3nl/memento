import { DECADE_LENGTH, WEEKS_PER_YEAR, YEARS_IN_LIFETIME } from "./constants";

/**
 * Life table calculation utilities
 */

/**
 * Generates an array of week indices
 */
export const generateWeekIndices = (
  count: number = WEEKS_PER_YEAR
): readonly number[] => {
  return Array.from({ length: count }, (_, i) => i + 1);
};

/**
 * Generates decade configuration for life table
 */
export const generateDecadeConfig = () => ({
  decadeLength: DECADE_LENGTH,
  yearsInLifetime: YEARS_IN_LIFETIME,
  weeks: generateWeekIndices(),
});

/**
 * A square is filled when its life-year is already complete, or when it is
 * the current life-year and that week is on or before the weeks since the
 * last birthday. `currentDecadeYear` and `weekIndex` are 1-based.
 */
export const shouldWeekBeFilled = (
  yearsAlive: number,
  currentDecadeYear: number,
  weekIndex: number,
  weeksFromLastBday: number
): boolean => {
  return (
    yearsAlive >= currentDecadeYear ||
    (yearsAlive + 1 === currentDecadeYear && weeksFromLastBday >= weekIndex)
  );
};

/**
 * The week being lived: the first square after the filled ones, in the
 * current life-year. The table paints it as a partial bar.
 */
export const isCurrentWeek = (
  yearsAlive: number,
  currentDecadeYear: number,
  weekIndex: number,
  weeksFromLastBday: number
): boolean => {
  return (
    yearsAlive + 1 === currentDecadeYear && weeksFromLastBday + 1 === weekIndex
  );
};

/**
 * Calculates the current decade year based on decade index and year index
 */
export const calculateDecadeYear = (
  decadeIndex: number,
  yearIndex: number,
  decadeLength: number = DECADE_LENGTH
): number => {
  return decadeIndex + 1 + yearIndex * decadeLength;
};
