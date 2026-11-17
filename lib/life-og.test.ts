import { lifeOgImage, paintLifeGrid } from "./life-og";
import { lifeWeekDays } from "./life-week";
import { getLife } from "./lives";
import { LEDGER_INKS } from "./week-notes";

const dark = (id: string) => LEDGER_INKS.find(ink => ink.id === id)?.dark;

describe("life share image", () => {
  const life = getLife("elon-musk");

  it("paints the birth week with the opening chapter", () => {
    if (!life) throw new Error("missing life");
    const grid = paintLifeGrid(life);
    expect(grid).toHaveLength(80);
    expect(grid[0]).toHaveLength(52);
    expect(grid[0]?.[0]).toBe(dark("olive"));
    expect(grid[79]?.[51]).toBe("#3f3f46");
  });

  it("keeps the chapter color on a week that also has an event", () => {
    if (!life) throw new Error("missing life");
    const grid = paintLifeGrid(life);
    const dob = new Date(1971, 5, 28);
    let found = false;

    for (let year = 1; year <= 80 && !found; year++) {
      for (let week = 1; week <= 52; week++) {
        const days = lifeWeekDays(dob, year, week);
        if (days.startDay <= "2008-09-28" && days.endDay >= "2008-09-28") {
          expect(grid[year - 1]?.[week - 1]).toBe(dark("green"));
          found = true;
          break;
        }
      }
    }

    expect(found).toBe(true);
  });

  it("renders a png", async () => {
    if (!life) throw new Error("missing life");
    const response = lifeOgImage(life);
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
