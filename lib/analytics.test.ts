import { birthDecade } from "./analytics";

describe("analytics", () => {
  it("keeps a birth year as a decade", () => {
    expect(birthDecade("1971-06-28")).toBe("1970s");
    expect(birthDecade("2009-12-16")).toBe("2000s");
    expect(birthDecade("not-a-date")).toBeNull();
  });
});
