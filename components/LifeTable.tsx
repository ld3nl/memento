import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarISOWeeks,
  subDays,
} from "date-fns";
import DecadeGrid from "./DecadeGrid";

import { LifeTableProps } from "../lib/types";

const LifeTable = ({ dob }: LifeTableProps) => {
  const today = new Date();
  const lastYear = subDays(today, 365).getFullYear();

  const weeksFromLastBday = differenceInCalendarISOWeeks(
    new Date(),
    new Date(lastYear, 12, 17)
  );

  const yeasAlive = differenceInCalendarISOWeekYears(today, new Date(dob)) - 1;

  // loop 52 weeks
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const decadeLength = 10;
  const yearsInLifetime = 8;

  return (
    <>
      {Array.from({ length: yearsInLifetime }, (_, yearIndex) => (
        <div
          key={`year-${yearIndex}`}
          className="grid gap-y-2 mb-4"
          data-cy={"life-table"}
        >
          <DecadeGrid
            decadeLength={decadeLength}
            weeks={weeks}
            yeasAlive={yeasAlive}
            yearIndex={yearIndex}
            weeksFromLastBday={weeksFromLastBday}
          />
        </div>
      ))}
    </>
  );
};

export default LifeTable;
