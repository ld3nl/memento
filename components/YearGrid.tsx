import Week from "./Week";

import { YearGridProps } from "../lib/types";

const YearGrid = ({
  weeks,
  yeasAlive,
  currentDecadeYear,
  weeksFromLastBday,
}: YearGridProps) => {
  return (
    <div className={`grid grid-cols-52 w-[52rem] mx-auto`}>
      {weeks.map((weekIndex) => {
        const isFilled =
          yeasAlive >= currentDecadeYear ||
          (yeasAlive + 1 === currentDecadeYear &&
            weeksFromLastBday >= weekIndex);

        return (
          <Week key={weekIndex} weekIndex={weekIndex} isFilled={isFilled} />
        );
      })}
    </div>
  );
};

export default YearGrid;
