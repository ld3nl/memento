import {
  birthDateFromPathSegments,
  extractNameFromUrl,
  generateLifeTableUrl,
  parseDateFromUrl,
} from "./url-utils";

describe("url utilities", () => {
  describe("generateLifeTableUrl", () => {
    it("generates URL with date only", () => {
      const result = generateLifeTableUrl("2023-01-15");
      expect(result).toBe("/table/2023/01/15");
    });

    it("generates URL with date and name", () => {
      const result = generateLifeTableUrl("2023-01-15", "John Doe");
      expect(result).toBe("/table/2023/01/15?name=John%20Doe");
    });

    it("handles null date", () => {
      const result = generateLifeTableUrl(null);
      expect(result).toBe("/table");
    });

    it("handles null date with name", () => {
      const result = generateLifeTableUrl(null, "John Doe");
      expect(result).toBe("/table?name=John%20Doe");
    });

    it("trims whitespace from name", () => {
      const result = generateLifeTableUrl("2023-01-15", "  John Doe  ");
      expect(result).toBe("/table/2023/01/15?name=John%20Doe");
    });

    it("ignores empty name", () => {
      const result = generateLifeTableUrl("2023-01-15", "");
      expect(result).toBe("/table/2023/01/15");
    });

    it("ignores whitespace-only name", () => {
      const result = generateLifeTableUrl("2023-01-15", "   ");
      expect(result).toBe("/table/2023/01/15");
    });
  });

  describe("parseDateFromUrl", () => {
    it("parses valid date segments", () => {
      const result = parseDateFromUrl(["2023", "01", "15"]);
      expect(result).toBe("2023-01-15");
    });

    it("pads single digit month and day", () => {
      const result = parseDateFromUrl(["2023", "1", "5"]);
      expect(result).toBe("2023-01-05");
    });

    it("returns null for insufficient segments", () => {
      expect(parseDateFromUrl(["2023"])).toBe(null);
      expect(parseDateFromUrl(["2023", "01"])).toBe(null);
      expect(parseDateFromUrl([])).toBe(null);
    });

    it("returns null for empty segments", () => {
      expect(parseDateFromUrl(["", "01", "15"])).toBe(null);
      expect(parseDateFromUrl(["2023", "", "15"])).toBe(null);
      expect(parseDateFromUrl(["2023", "01", ""])).toBe(null);
    });
  });

  describe("birthDateFromPathSegments", () => {
    it("builds a local calendar date", () => {
      const result = birthDateFromPathSegments(["2023", "1", "5"]);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(5);
    });

    it("rejects impossible dates", () => {
      expect(birthDateFromPathSegments(["2023", "2", "31"])).toBe(null);
    });
  });

  describe("extractNameFromUrl", () => {
    it("extracts name from search params", () => {
      const params = new URLSearchParams("name=John%20Doe");
      const result = extractNameFromUrl(params);
      expect(result).toBe("John Doe");
    });

    it("returns null when no name param", () => {
      const params = new URLSearchParams("other=value");
      const result = extractNameFromUrl(params);
      expect(result).toBe(null);
    });

    it("returns null for empty name", () => {
      const params = new URLSearchParams("name=");
      const result = extractNameFromUrl(params);
      expect(result).toBe(null);
    });

    it("trims whitespace from name", () => {
      const params = new URLSearchParams("name=%20%20John%20Doe%20%20");
      const result = extractNameFromUrl(params);
      expect(result).toBe("John Doe");
    });

    it("returns null for whitespace-only name", () => {
      const params = new URLSearchParams("name=%20%20%20");
      const result = extractNameFromUrl(params);
      expect(result).toBe(null);
    });
  });
});
