/**
 * Application constants
 */

// Date and time constants
export const WEEKS_PER_YEAR = 52;
export const DECADE_LENGTH = 10;
export const YEARS_IN_LIFETIME = 8;

// Form constants
export const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

// UI constants
export const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

// Grid layout constants
export const GRID_CONFIG = {
  maxWidth: "52rem",
  columns: 52,
  weekSize: "size-2",
} as const;
