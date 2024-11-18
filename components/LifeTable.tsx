"use client";
import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarWeeks,
  getDate,
  getMonth,
  isValid,
} from "date-fns";
import DecadeGrid from "./DecadeGrid";

import { LifeTableProps } from "../lib/types";

const TODAY = new Date();

// Type for the week calculation function
type DateInput = Date | string | number;

/**
 * Calculates weeks since the last birthday
 * @param dobDate - Date of birth
 * @returns number of weeks or null if invalid input
 */
const calculate_weeks_from_birthday = (dobDate: DateInput): number | null => {
  try {
    const parsedDate = new Date(dobDate);

    // Validate input date
    if (!isValid(parsedDate)) {
      console.error("Invalid date input:", dobDate);
      return null;
    }

    const currentYear = TODAY.getFullYear();
    const birthMonth = getMonth(parsedDate);
    const birthDay = getDate(parsedDate);

    // Normalize dates to midnight to avoid timezone issues
    // todo: check if this is necessary
    const today = new Date();
    const thisYearBirthday = new Date(currentYear, birthMonth, birthDay);

    // Calculate the difference in weeks between today and this year's birthday
    let weekDiff = differenceInCalendarWeeks(today, thisYearBirthday);

    // If birthday hasn't occurred this year, calculate weeks since last year's birthday
    if (weekDiff < 0) {
      const lastBirthday = new Date(currentYear - 1, birthMonth, birthDay);
      weekDiff = differenceInCalendarWeeks(today, lastBirthday);
    }

    // Return the positive number of weeks since last birthday
    return weekDiff;
  } catch (error) {
    console.error("Error calculating weeks:", error);
    return null;
  }
};

const LifeTable = ({ dob }: LifeTableProps) => {
  // Validate input DOB
  if (!dob) {
    console.error("Missing date of birth");
    return null;
  }

  const dobDate = new Date(dob);
  if (!isValid(dobDate)) {
    console.error("Invalid date of birth:", dob);
    return null;
  }

  // Calculate years alive (subtract 1 to account for current year)
  const yearsAlive = differenceInCalendarISOWeekYears(TODAY, dobDate) - 1;
  const weeksFromBirthday = calculate_weeks_from_birthday(dobDate);

  // Return null if weeks calculation failed
  if (weeksFromBirthday === null) {
    return null;
  }

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
            yeasAlive={yearsAlive}
            yearIndex={yearIndex}
            weeksFromLastBday={weeksFromBirthday}
          />
        </div>
      ))}
    </>
  );
};

export default LifeTable;
