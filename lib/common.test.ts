import { calculateFullAge, generateUrl, getYearsAlive } from "./common";

// Mock the current date for consistent testing
const MOCK_TODAY = new Date("2024-06-15T10:00:00Z");

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterAll(() => {
  jest.useRealTimers();
});

describe("common utilities (deprecated)", () => {
  // Mock console.error to avoid noise in tests
  const consoleSpy = jest.spyOn(console, "error").mockImplementation();

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("calculateFullAge (deprecated)", () => {
    it("calculates age correctly", () => {
      const result = calculateFullAge("1990-01-15");
      expect(result).toEqual({
        years: 34,
        months: 5,
        days: 0,
      });
    });

    it("handles custom format", () => {
      const result = calculateFullAge("15/01/1990", "dd/MM/yyyy");
      expect(result).toEqual({
        years: 34,
        months: 5,
        days: 0,
      });
    });
  });

  describe("getYearsAlive (deprecated)", () => {
    it("returns formatted age string", () => {
      const result = getYearsAlive("1990-01-15");
      expect(result).toBe("34 years, 5 months, 0 days");
    });

    it("logs error for empty date", () => {
      const result = getYearsAlive("");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith("Enter valid date");
    });

    it("logs error for null date", () => {
      const result = getYearsAlive(null as any);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith("Enter valid date");
    });
  });

  describe("generateUrl (deprecated)", () => {
    it("generates URL with date only", () => {
      const result = generateUrl("2023-01-15");
      expect(result).toBe("/table/2023/01/15");
    });

    it("generates URL with date and name", () => {
      const result = generateUrl("2023-01-15", "John Doe");
      expect(result).toBe("/table/2023/01/15?name=John%20Doe");
    });

    it("handles null date", () => {
      const result = generateUrl(null);
      expect(result).toBe("/table");
    });
  });
});
