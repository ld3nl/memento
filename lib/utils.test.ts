import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3");
  });

  it("handles conditional classes", () => {
    expect(cn("base-class", true && "conditional-class")).toBe(
      "base-class conditional-class",
    );
    expect(cn("base-class", false && "conditional-class")).toBe("base-class");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(null, undefined)).toBe("");
  });

  it("handles arrays and objects", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
    expect(cn({ active: true, disabled: false })).toBe("active");
  });
});
