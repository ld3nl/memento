import { DECADE_LENGTH, WEEKS_PER_YEAR, YEARS_IN_LIFETIME } from "./constants";

/**
 * Life table calculation utilities
 */

/**
 * Determines if a week should be filled based on age and current position
 */
export const shouldWeekBeFilled = (
  yearsAlive: number,
  currentDecadeYear: number,
  weekIndex: number,
  weeksFromLastBday: number,
): boolean => {
  return (
    yearsAlive >= currentDecadeYear ||
    (yearsAlive + 1 === currentDecadeYear && weeksFromLastBday >= weekIndex)
  );
};

/**
 * Generates an array of week indices
 */
export const generateWeekIndices = (
  count: number = WEEKS_PER_YEAR,
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
 * Determines if a year should show age label
 */
export const shouldShowYearLabel = (
  currentDecadeYear: number,
  weekIndex: number,
): boolean => {
  return (
    weekIndex === WEEKS_PER_YEAR &&
    (currentDecadeYear % 5 === 0 || currentDecadeYear === 1)
  );
};

/**
 * Calculates the current decade year based on decade index and year index
 */
export const calculateDecadeYear = (
  decadeIndex: number,
  yearIndex: number,
  decadeLength: number = DECADE_LENGTH,
): number => {
  return decadeIndex + 1 + yearIndex * decadeLength;
};
