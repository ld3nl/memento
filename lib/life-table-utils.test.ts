import {
  generateWeekIndices,
  generateDecadeConfig,
  calculateDecadeYear,
} from "./life-table-utils";
import { WEEKS_PER_YEAR, DECADE_LENGTH, YEARS_IN_LIFETIME } from "./constants";

describe("life table utilities", () => {
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
