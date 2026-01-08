"use client";

import {
  isCurrentWeek as isCurrentWeekFn,
  shouldShowYearLabel,
  shouldWeekBeFilled,
} from "./utils";
import type { YearGridProps } from "./YearGrid.types";
import Week from "../Week";

// YearGrid component to display a grid of weeks for a year
export const YearGrid = ({
  weeks,
  yearsAlive,
  currentDecadeYear,
  weeksFromLastBday,
  daysIntoCurrentWeek,
}: YearGridProps) => {
  return (
    <div data-cy="year-grid" className={"mx-auto grid w-208 grid-cols-52"}>
      {weeks.map((weekIndex) => {
        // Determine if the week should be filled using utility function
        const isFilled = shouldWeekBeFilled(
          yearsAlive,
          currentDecadeYear,
          weekIndex,
          weeksFromLastBday,
        );

        // Determine if this is the current week (actively being lived)
        const isCurrentWeek = isCurrentWeekFn(
          yearsAlive,
          currentDecadeYear,
          weekIndex,
          weeksFromLastBday,
        );

        // Determine if year label should be shown using utility function
        const showYearLabel = shouldShowYearLabel(currentDecadeYear, weekIndex);

        return (
          <Week
            key={weekIndex}
            weekIndex={weekIndex}
            isFilled={isFilled}
            isCurrentWeek={isCurrentWeek}
            currentDayOfWeek={isCurrentWeek ? daysIntoCurrentWeek : undefined}
            {...(showYearLabel ? { yearsAlive: `${currentDecadeYear}` } : {})}
          />
        );
      })}
    </div>
  );
};

export default YearGrid;
