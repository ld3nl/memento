import {
  isValidDate,
  parseAndValidateDate,
  validateFormData,
} from "./validation";

describe("validation utilities", () => {
  describe("isValidDate", () => {
    it("validates correct dates", () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate("2023-01-01")).toBe(true);
      expect(isValidDate("2023-12-31")).toBe(true);
    });

    it("rejects invalid dates", () => {
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
      expect(isValidDate("")).toBe(false);
      expect(isValidDate("invalid-date")).toBe(false);
      expect(isValidDate("2023-13-01")).toBe(false);
    });
  });

  describe("parseAndValidateDate", () => {
    it("parses valid dates", () => {
      const result = parseAndValidateDate("2023-01-01");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBeGreaterThanOrEqual(2022);
      expect(result?.getFullYear()).toBeLessThanOrEqual(2023);
    });

    it("returns null for invalid dates", () => {
      expect(parseAndValidateDate("")).toBe(null);
      expect(parseAndValidateDate("invalid")).toBe(null);
      expect(parseAndValidateDate("2023-13-01")).toBe(null);
    });

    it("handles Date objects", () => {
      const date = new Date("2023-01-01");
      const result = parseAndValidateDate(date);
      expect(result).toEqual(date);
    });
  });

  describe("validateFormData", () => {
    it("validates correct form data", () => {
      const result = validateFormData("John Doe", "2023-01-01");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("allows empty name", () => {
      const result = validateFormData("", "2023-01-01");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects missing date", () => {
      const result = validateFormData("John", null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Date of birth is required");
    });

    it("rejects invalid date", () => {
      const result = validateFormData("John", "invalid-date");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid date format");
    });

    it("rejects whitespace-only name", () => {
      const result = validateFormData("   ", "2023-01-01");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name cannot be empty if provided");
    });

    it("accumulates multiple errors", () => {
      const result = validateFormData("  ", null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
