import * as stylex from "@stylexjs/stylex";
import { Week } from "../Week/Week";
import {
  isCurrentWeek as isCurrentWeekFn,
  shouldShowYearLabel,
  shouldWeekBeFilled,
} from "./utils";
import type { YearGridProps } from "./YearGrid.types";

const styles = stylex.create({
  root: {
    display: "grid",
    marginInline: "auto",
    width: "52rem",
    gridTemplateColumns: "repeat(52, minmax(0, 1fr))",
  },
});

// YearGrid component to display a grid of weeks for a year
export const YearGrid = ({
  weeks,
  yearsAlive,
  currentDecadeYear,
  weeksFromLastBday,
  daysIntoCurrentWeek,
}: YearGridProps) => {
  return (
    <div data-cy="year-grid" {...stylex.props(styles.root)}>
      {weeks.map(weekIndex => {
        // Determine if the week should be filled using utility function
        const isFilled = shouldWeekBeFilled(
          yearsAlive,
          currentDecadeYear,
          weekIndex,
          weeksFromLastBday
        );

        // Determine if this is the current week (actively being lived)
        const isCurrentWeek = isCurrentWeekFn(
          yearsAlive,
          currentDecadeYear,
          weekIndex,
          weeksFromLastBday
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
