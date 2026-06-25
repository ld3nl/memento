import { DECADE_LENGTH, WEEKS_PER_YEAR, YEARS_IN_LIFETIME } from "./constants";

/**
 * Life table calculation utilities
 */

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
 * Calculates the current decade year based on decade index and year index
 */
export const calculateDecadeYear = (
  decadeIndex: number,
  yearIndex: number,
  decadeLength: number = DECADE_LENGTH,
): number => {
  return decadeIndex + 1 + yearIndex * decadeLength;
};
