import { WEEKS_PER_YEAR } from "../../lib/constants";

export { isCurrentWeek, shouldWeekBeFilled } from "../../lib/life-table-utils";

/**
 * Determines if a year should show age label
 */
export const shouldShowYearLabel = (
  currentDecadeYear: number,
  weekIndex: number
): boolean => {
  return (
    weekIndex === WEEKS_PER_YEAR &&
    (currentDecadeYear % 5 === 0 || currentDecadeYear === 1)
  );
};
