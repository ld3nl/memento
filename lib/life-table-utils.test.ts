import {
  shouldWeekBeFilled,
  generateWeekIndices,
  generateDecadeConfig,
  shouldShowYearLabel,
  calculateDecadeYear,
} from "./life-table-utils";
import { WEEKS_PER_YEAR, DECADE_LENGTH, YEARS_IN_LIFETIME } from "./constants";

describe("life table utilities", () => {
  describe("shouldWeekBeFilled", () => {
    it("fills weeks for completed years", () => {
      // Person is 25 years old, checking year 20
      expect(shouldWeekBeFilled(25, 20, 1, 0)).toBe(true);
      expect(shouldWeekBeFilled(25, 20, 52, 0)).toBe(true);
    });

    it("does not fill weeks for future years", () => {
      // Person is 25 years old, checking year 30
      expect(shouldWeekBeFilled(25, 30, 1, 0)).toBe(false);
      expect(shouldWeekBeFilled(25, 30, 52, 0)).toBe(false);
    });

    it("partially fills current year based on weeks from birthday", () => {
      // Person is 25 years old, currently in year 26, 10 weeks from birthday
      expect(shouldWeekBeFilled(25, 26, 5, 10)).toBe(true); // Week 5 should be filled
      expect(shouldWeekBeFilled(25, 26, 10, 10)).toBe(true); // Week 10 should be filled
      expect(shouldWeekBeFilled(25, 26, 15, 10)).toBe(false); // Week 15 should not be filled
    });

    it("handles edge case of exact birthday", () => {
      expect(shouldWeekBeFilled(25, 26, 1, 1)).toBe(true);
      expect(shouldWeekBeFilled(25, 26, 1, 0)).toBe(false);
    });
  });

  describe("generateWeekIndices", () => {
    it("generates default week indices", () => {
      const result = generateWeekIndices();
      expect(result).toHaveLength(WEEKS_PER_YEAR);
      expect(result[0]).toBe(1);
      expect(result[WEEKS_PER_YEAR - 1]).toBe(WEEKS_PER_YEAR);
    });

    it("generates custom count of week indices", () => {
      const result = generateWeekIndices(10);
      expect(result).toHaveLength(10);
      expect(result[0]).toBe(1);
      expect(result[9]).toBe(10);
    });

    it("handles zero count", () => {
      const result = generateWeekIndices(0);
      expect(result).toHaveLength(0);
    });
  });

  describe("generateDecadeConfig", () => {
    it("generates correct decade configuration", () => {
      const result = generateDecadeConfig();

      expect(result.decadeLength).toBe(DECADE_LENGTH);
      expect(result.yearsInLifetime).toBe(YEARS_IN_LIFETIME);
      expect(result.weeks).toHaveLength(WEEKS_PER_YEAR);
      expect(result.weeks[0]).toBe(1);
      expect(result.weeks[WEEKS_PER_YEAR - 1]).toBe(WEEKS_PER_YEAR);
    });
  });

  describe("shouldShowYearLabel", () => {
    it("shows label for year 1", () => {
      expect(shouldShowYearLabel(1, WEEKS_PER_YEAR)).toBe(true);
    });

    it("shows label for multiples of 5 at end of year", () => {
      expect(shouldShowYearLabel(5, WEEKS_PER_YEAR)).toBe(true);
      expect(shouldShowYearLabel(10, WEEKS_PER_YEAR)).toBe(true);
      expect(shouldShowYearLabel(15, WEEKS_PER_YEAR)).toBe(true);
    });

    it("does not show label for non-multiples of 5", () => {
      expect(shouldShowYearLabel(2, WEEKS_PER_YEAR)).toBe(false);
      expect(shouldShowYearLabel(3, WEEKS_PER_YEAR)).toBe(false);
      expect(shouldShowYearLabel(7, WEEKS_PER_YEAR)).toBe(false);
    });

    it("does not show label when not at end of year", () => {
      expect(shouldShowYearLabel(5, 1)).toBe(false);
      expect(shouldShowYearLabel(10, 25)).toBe(false);
      expect(shouldShowYearLabel(1, 30)).toBe(false);
    });
  });

  describe("calculateDecadeYear", () => {
    it("calculates decade year correctly", () => {
      // First decade (0), first year (0) = year 1
      expect(calculateDecadeYear(0, 0)).toBe(1);

      // First decade (0), last year (9) = year 91 (0 + 1 + 9 * 10)
      expect(calculateDecadeYear(0, 9)).toBe(91);

      // Second decade (1), first year (0) = year 2 (1 + 1 + 0 * 10)
      expect(calculateDecadeYear(1, 0)).toBe(2);

      // Third decade (2), fifth year (4) = year 43 (2 + 1 + 4 * 10)
      expect(calculateDecadeYear(2, 4)).toBe(43);
    });

    it("handles custom decade length", () => {
      expect(calculateDecadeYear(0, 0, 5)).toBe(1);
      expect(calculateDecadeYear(1, 0, 5)).toBe(2);
      expect(calculateDecadeYear(2, 2, 5)).toBe(13); // 2 + 1 + 2 * 5
    });
  });
});
