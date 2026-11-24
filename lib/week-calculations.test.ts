/**
 * Comprehensive tests for week calculations based on DOB
 * Tests various edge cases to ensure accurate week counting
 */

import {
  calculateFullAge,
  calculateLifeWeeks,
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
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

    describe("calculateWeeksFromLastBirthday - calendar mode", () => {
      it("returns 0 on the exact birthday", () => {
        jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-01-15",
          new Date("2024-01-15T12:00:00Z"),
          "calendar"
        );
        expect(result).toBe(0);
      });

      it("returns 1 after one week from birthday", () => {
        jest.setSystemTime(new Date("2024-01-22T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-01-15",
          new Date("2024-01-22T12:00:00Z"),
          "calendar"
        );
        expect(result).toBe(1);
      });

      it("counts finished squares halfway through a real year", () => {
        jest.setSystemTime(new Date("2024-07-01T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-01-01",
          new Date("2024-07-01T12:00:00Z"),
          "calendar"
        );
        expect(result).toBe(25);
      });

      it("handles leap year birthday (Feb 29)", () => {
        jest.setSystemTime(new Date("2024-03-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1992-02-29",
          new Date("2024-03-15T12:00:00Z"),
          "calendar"
        );
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(3);
      });

      it("handles end of year correctly", () => {
        jest.setSystemTime(new Date("2024-12-31T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-12-31",
          new Date("2024-12-31T12:00:00Z"),
          "calendar"
        );
        expect(result).toBe(0);
      });

      it("handles birthday not yet occurred this year", () => {
        jest.setSystemTime(new Date("2024-02-01T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-12-25",
          new Date("2024-02-01T12:00:00Z"),
          "calendar"
        );
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(6);
      });

      it("handles birthday just passed", () => {
        jest.setSystemTime(new Date("2024-01-20T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday(
          "1990-01-15",
          new Date("2024-01-20T12:00:00Z"),
          "calendar"
        );
        expect(result).toBe(0);
      });
    });

    describe("calculateWeeksFromLastBirthday - birthday grid", () => {
      it("calculates correctly for someone born today", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateWeeksFromLastBirthday("2024-06-15");
        expect(result).toBe(0);
      });
    });

    describe("calculateYearsAlive - Validation", () => {
      it("uses calendar age as completed life-year rows", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("1990-01-15");
        expect(result).toBe(34);
      });

      it("keeps the same life-year row in calendar mode", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const grid = calculateYearsAlive("1990-01-15");
        const calendar = calculateYearsAlive(
          "1990-01-15",
          new Date("2024-06-15T12:00:00Z"),
          "calendar"
        );
        expect(calendar).toBe(grid);
        expect(calendar).toBe(34);
      });

      it("handles newborn correctly", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("2024-06-01");
        // Born 2 weeks ago
        expect(result).toBeLessThanOrEqual(0);
      });

      it("marks the first life-year complete after the first birthday", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));
        const result = calculateYearsAlive("2023-06-15");
        expect(result).toBe(1);
      });
    });

    describe("End-to-End Week Calculation Scenarios", () => {
      it("correctly calculates for a person born on Jan 1, 1990 on June 15, 2024", () => {
        jest.setSystemTime(new Date(2024, 5, 15, 12, 0, 0));

        const dob = new Date(1990, 0, 1);
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(dob);

        expect(yearsAlive).toBe(34);
        expect(weeksFromBday).toBe(29);
      });

      it("correctly calculates for a person born on Dec 31, 1985 on Jan 2, 2024", () => {
        jest.setSystemTime(new Date("2024-01-02T12:00:00Z"));

        const dob = "1985-12-31";
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(
          dob,
          new Date("2024-01-02T12:00:00Z"),
          "calendar"
        );

        expect(yearsAlive).toBe(38);
        expect(weeksFromBday).toBeGreaterThanOrEqual(0);
        expect(weeksFromBday).toBeLessThanOrEqual(1);
      });

      it("counts seven-day squares for 17 Dec 1987, not calendar weeks", () => {
        jest.setSystemTime(new Date(2026, 9, 26, 12, 0, 0));

        const dob = new Date(1987, 11, 17);
        const age = calculateFullAge(dob);
        const life = calculateLifeWeeks(dob);

        expect(age).toMatchObject({ years: 38, months: 10, days: 9 });
        expect(life).toEqual({
          weeksLived: 2027,
          weeksRemaining: 2133,
          beyondGrid: false,
        });
      });

      it("fills the whole grid once the 80th year is complete", () => {
        jest.setSystemTime(new Date(2026, 9, 26, 12, 0, 0));
        const life = calculateLifeWeeks(new Date(1940, 0, 1));
        expect(life).toEqual({
          weeksLived: 80 * 52,
          weeksRemaining: 0,
          beyondGrid: true,
        });
      });

      it("correctly calculates for someone turning 30 today", () => {
        jest.setSystemTime(new Date("2024-06-15T12:00:00Z"));

        const dob = "1994-06-15";
        const yearsAlive = calculateYearsAlive(dob);
        const weeksFromBday = calculateWeeksFromLastBirthday(
          dob,
          new Date("2024-06-15T12:00:00Z"),
          "calendar"
        );

        expect(yearsAlive).toBe(30);
        expect(weeksFromBday).toBe(0);
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
