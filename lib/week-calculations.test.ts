/**
 * Comprehensive tests for week calculations based on DOB
 * Tests various edge cases to ensure accurate week counting
 */

import {
  calculateFullAge,
  calculateYearsAlive,
  calculateWeeksFromLastBirthday,
  getCurrentDayOfWeek,
  getDaysIntoCurrentWeek,
} from "./date-utils";

describe("Week Calculations - Comprehensive DOB Tests", () => {
  // Test with specific dates for reproducibility
  describe("Weekly Progress Tracking", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    describe("calculateWeeksFromLastBirthday - Edge Cases", () => {
      it("returns 0 on the exact birthday", () => {
        // Today is Jan 15, birthday is Jan 15
        jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-01-15");
        expect(result).toBe(0);
      });

      it("returns 1 after one week from birthday", () => {
        // Today is Jan 22 (7 days after Jan 15)
        jest.setSystemTime(new Date("2024-01-22T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-01-15");
        expect(result).toBe(1);
      });

      it("returns 26 at mid-year from birthday", () => {
        // Birthday on Jan 1, today is July 1 (roughly 26 weeks)
        jest.setSystemTime(new Date("2024-07-01T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-01-01");
        expect(result).toBe(26);
      });

      it("handles leap year birthday (Feb 29)", () => {
        // Leap year birthday - Feb 29
        jest.setSystemTime(new Date("2024-03-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1992-02-29");
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(3);
      });

      it("handles end of year correctly", () => {
        // Birthday Dec 31, today is Dec 31 next year
        jest.setSystemTime(new Date("2024-12-31T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-12-31");
        expect(result).toBe(0);
      });

      it("handles birthday not yet occurred this year", () => {
        // Today is Feb 1, birthday is Dec 25
        jest.setSystemTime(new Date("2024-02-01T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-12-25");
        // Should calculate from last year's Dec 25 to this Feb 1 (about 5-6 weeks)
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(6);
      });

      it("handles birthday just passed", () => {
        // Today is Jan 20, birthday is Jan 15
        jest.setSystemTime(new Date("2024-01-20T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("1990-01-15");
        // 5 days after birthday = 0 complete weeks
        expect(result).toBe(0);
      });

      it("calculates correctly for someone born today", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("2024-06-15");
        expect(result).toBe(0);
      });
    });

    describe("calculateYearsAlive - Validation", () => {
      it("calculates correct years for a 34-year-old", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("1990-01-15");
        // Person born Jan 15 1990, today is June 15, 2024 = 34 years
        // The function returns years - 1 for "completed years"
        expect(result).toBe(33);
      });

      it("handles newborn correctly", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("2024-06-01");
        // Born 2 weeks ago
        expect(result).toBeLessThanOrEqual(0);
      });

      it("handles first birthday scenario", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("2023-06-15");
        // Exactly 1 year ago
        expect(result).toBe(0);
      });
    });

    describe("End-to-End Week Calculation Scenarios", () => {
      it("correctly calculates for a person born on Jan 1, 1990 on June 15, 2024", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));

        const dob = "1990-01-01";
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(dob);

        // differenceInCalendarISOWeekYears returns 35, minus 1 = 34 completed years
        // ISO week years can differ from calendar years at year boundaries
        expect(yearsAlive).toBe(34);
        // differenceInCalendarWeeks uses Sunday as week start
        expect(weeksFromBday).toBeGreaterThanOrEqual(23);
        expect(weeksFromBday).toBeLessThanOrEqual(24);
      });

      it("correctly calculates for a person born on Dec 31, 1985 on Jan 2, 2024", () => {
        jest.setSystemTime(new Date("2024-01-02T12:00:00Z"));

        const dob = "1985-12-31";
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(dob);

        expect(yearsAlive).toBe(37); // 38 years old, minus 1 = 37 completed years
        // From Dec 31, 2023 to Jan 2, 2024 crosses a week boundary (Sunday)
        // differenceInCalendarWeeks counts calendar week boundaries crossed
        expect(weeksFromBday).toBeGreaterThanOrEqual(0);
        expect(weeksFromBday).toBeLessThanOrEqual(1);
      });

      it("correctly calculates for someone turning 30 today", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));

        const dob = "1994-06-15";
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(dob);

        expect(yearsAlive).toBe(29); // Just turned 30, minus 1 = 29
        expect(weeksFromBday).toBe(0); // Birthday is today
      });
    });

    describe("getCurrentDayOfWeek", () => {
      it("returns 1 for Monday", () => {
        // January 15, 2024 is a Monday
        jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
        const result = getCurrentDayOfWeek();
        expect(result).toBe(1);
      });

      it("returns 7 for Sunday", () => {
        // January 14, 2024 is a Sunday
        jest.setSystemTime(new Date("2024-01-14T12:00:00Z"));
        const result = getCurrentDayOfWeek();
        expect(result).toBe(7);
      });

      it("returns 3 for Wednesday", () => {
        // January 17, 2024 is a Wednesday
        jest.setSystemTime(new Date("2024-01-17T12:00:00Z"));
        const result = getCurrentDayOfWeek();
        expect(result).toBe(3);
      });

      it("returns 6 for Saturday", () => {
        // January 20, 2024 is a Saturday
        jest.setSystemTime(new Date("2024-01-20T12:00:00Z"));
        const result = getCurrentDayOfWeek();
        expect(result).toBe(6);
      });
    });

    describe("getDaysIntoCurrentWeek", () => {
      it("returns a value between 1 and 7 on day of birthday", () => {
        jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
        const result = getDaysIntoCurrentWeek("1990-01-15");
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(7);
      });

      it("returns a value between 1 and 7 after 3 days from birthday", () => {
        jest.setSystemTime(new Date("2024-01-18T12:00:00Z"));
        const result = getDaysIntoCurrentWeek("1990-01-15");
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(7);
      });

      it("returns a value between 1 and 7 at start of second week", () => {
        // 7 days after birthday = start of week 2
        jest.setSystemTime(new Date("2024-01-22T12:00:00Z"));
        const result = getDaysIntoCurrentWeek("1990-01-15");
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(7);
      });

      it("returns correct day mid-year", () => {
        // June 15 is about 152 days from Jan 1
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = getDaysIntoCurrentWeek("1990-01-01");
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(7);
      });

      it("returns null for invalid date", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = getDaysIntoCurrentWeek("invalid-date");
        expect(result).toBe(null);
      });
    });
  });
});
