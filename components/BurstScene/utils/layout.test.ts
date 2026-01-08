import { computeBurstItems, LayoutResult } from "./layout";

describe("BurstScene layout utilities", () => {
  describe("computeBurstItems", () => {
    const defaultParams = {
      totalWeeks: 100,
      maxRadius: 200,
      boxPx: 8,
      spacingPx: 6,
      yearsAlive: 25,
      weeksFromLastBday: 10,
    };

    it("returns items array and maxDelay", () => {
      const result = computeBurstItems(defaultParams);
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("maxDelay");
      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.maxDelay).toBe("number");
    });

    it("generates items up to totalWeeks or capacity", () => {
      const result = computeBurstItems(defaultParams);
      expect(result.items.length).toBeLessThanOrEqual(defaultParams.totalWeeks);
      expect(result.items.length).toBeGreaterThan(0);
    });

    it("marks past weeks as filled", () => {
      const result = computeBurstItems({
        ...defaultParams,
        yearsAlive: 1,
        weeksFromLastBday: 26,
      });

      // First year (index 0) should have filled weeks
      const firstYearItems = result.items.filter(
        (item) => item.yearIndex === 0,
      );
      firstYearItems.forEach((item) => {
        expect(item.isFilled).toBe(true);
      });
    });

    it("marks future weeks as not filled", () => {
      const result = computeBurstItems({
        ...defaultParams,
        yearsAlive: 0,
        weeksFromLastBday: 5,
      });

      // Items beyond week 5 of year 0 should not be filled
      const futureItems = result.items.filter(
        (item) => item.yearIndex === 0 && item.weekIndex > 5,
      );
      futureItems.forEach((item) => {
        expect(item.isFilled).toBe(false);
      });
    });

    it("identifies current week correctly", () => {
      const result = computeBurstItems({
        ...defaultParams,
        yearsAlive: 0,
        weeksFromLastBday: 10,
      });

      // Week 11 of year 0 should be current
      const currentWeekItems = result.items.filter(
        (item) => item.isCurrentWeek,
      );
      expect(currentWeekItems.length).toBe(1);
      expect(currentWeekItems[0].weekIndex).toBe(11);
      expect(currentWeekItems[0].yearIndex).toBe(0);
    });

    it("assigns unique IDs to all items", () => {
      const result = computeBurstItems(defaultParams);
      const ids = result.items.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("assigns colors to all items", () => {
      const result = computeBurstItems(defaultParams);
      result.items.forEach((item) => {
        expect(item.color).toBeDefined();
        expect(item.color.isColor).toBe(true);
      });
    });

    it("calculates delay values", () => {
      const result = computeBurstItems(defaultParams);
      result.items.forEach((item) => {
        expect(typeof item.delayMs).toBe("number");
        expect(item.delayMs).toBeGreaterThanOrEqual(0);
        expect(item.delayMs).toBeLessThanOrEqual(result.maxDelay);
      });
    });

    it("handles zero maxRadius", () => {
      const result = computeBurstItems({
        ...defaultParams,
        maxRadius: 0,
      });
      // Should still produce at least the center item
      expect(result.items.length).toBeLessThanOrEqual(1);
    });

    it("handles negative maxRadius gracefully", () => {
      const result = computeBurstItems({
        ...defaultParams,
        maxRadius: -100,
      });
      expect(result.items.length).toBe(0);
    });

    it("positions items with tx and ty coordinates", () => {
      const result = computeBurstItems(defaultParams);
      result.items.forEach((item) => {
        expect(typeof item.tx).toBe("number");
        expect(typeof item.ty).toBe("number");
      });
    });

    it("assigns rotation values to items", () => {
      const result = computeBurstItems(defaultParams);
      result.items.forEach((item) => {
        expect(typeof item.rotation).toBe("number");
      });
    });
  });
});
