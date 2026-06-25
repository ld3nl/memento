import { WEEKS_PER_YEAR } from "../../lib/constants";

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
 * Determines if a week is the current week (actively being lived)
 * This is the first unfilled week after all filled weeks
 */
export const isCurrentWeek = (
  yearsAlive: number,
  currentDecadeYear: number,
  weekIndex: number,
  weeksFromLastBday: number,
): boolean => {
  // Current week is in the current year (yearsAlive + 1) and is the next week after weeksFromLastBday
  return (
    yearsAlive + 1 === currentDecadeYear && weeksFromLastBday + 1 === weekIndex
  );
};

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
