import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
} from "./date-utils";
import {
  dateLifeImage,
  lifeImageAlt,
  lifeOgImage,
  paintLifeGrid,
} from "./life-og";
import { shouldWeekBeFilled } from "./life-table-utils";
import { lifeWeekDays } from "./life-week";
import { getLife } from "./lives";
import { LEDGER_INKS } from "./week-notes";

const LIVED = "#dc2626";
const EMPTY = "#3f3f46";

function tableLived(
  dob: Date,
  asOf: Date,
  year: number,
  week: number,
  mode?: "birthday-grid" | "calendar"
): boolean {
  const yearsAlive = calculateYearsAlive(dob, asOf, mode);
  const weeksFromLastBday = calculateWeeksFromLastBirthday(dob, asOf, mode);
  if (yearsAlive === null || weeksFromLastBday === null) return false;
  return shouldWeekBeFilled(yearsAlive, year, week, weeksFromLastBday);
}

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

  it("paints a lived week with no chapter in red", () => {
    if (!life) throw new Error("missing life");
    const asOf = new Date(2026, 10, 16);
    const grid = paintLifeGrid(life, asOf);
    const dob = new Date(1971, 5, 28);
    let found = false;

    for (let year = 1; year <= 80 && !found; year++) {
      for (let week = 1; week <= 52; week++) {
        const days = lifeWeekDays(dob, year, week);
        if (
          days.startDay <= "2026-09-28" ||
          !tableLived(dob, asOf, year, week)
        ) {
          continue;
        }
        expect(grid[year - 1]?.[week - 1]).toBe(LIVED);
        found = true;
      }
    }

    expect(found).toBe(true);
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

  it("paints a birthdate with no chapters in red and empty", () => {
    const grid = paintLifeGrid(
      { born: "1971-06-28", name: "Life in weeks" },
      new Date(2026, 10, 16)
    );
    expect(grid[0]?.[0]).toBe(LIVED);
    expect(grid[79]?.[51]).toBe(EMPTY);
  });

  it("paints 17 December 1987 with the same squares as the life table", () => {
    const asOf = new Date(2026, 10, 23);
    const dob = new Date(1987, 11, 17);
    const grid = paintLifeGrid(
      { born: "1987-12-17", name: "Life in weeks" },
      asOf
    );
    let lived = 0;

    for (let year = 1; year <= 80; year++) {
      for (let week = 1; week <= 52; week++) {
        const on = tableLived(dob, asOf, year, week);
        expect(grid[year - 1]?.[week - 1]).toBe(on ? LIVED : EMPTY);
        if (on) lived += 1;
      }
    }

    const yearsAlive = calculateYearsAlive(dob, asOf) ?? 0;
    const weeksFromLastBday = calculateWeeksFromLastBirthday(dob, asOf) ?? 0;
    expect(lived).toBe(yearsAlive * 52 + weeksFromLastBday);
  });

  it("lines 17 December 1987 up with the real birthday", () => {
    const asOf = new Date(2026, 10, 24);
    const dob = new Date(1987, 11, 17);
    const grid = paintLifeGrid(
      { born: "1987-12-17", name: "Life in weeks" },
      asOf,
      "calendar"
    );

    expect(grid[38]?.[47]).toBe(LIVED);
    expect(grid[38]?.[48]).toBe(EMPTY);
    expect(grid[39]?.[0]).toBe(EMPTY);

    for (let year = 1; year <= 80; year++) {
      for (let week = 1; week <= 52; week++) {
        const on = tableLived(dob, asOf, year, week, "calendar");
        expect(grid[year - 1]?.[week - 1]).toBe(on ? LIVED : EMPTY);
      }
    }
  });

  it("describes the picture without a name", () => {
    expect(lifeImageAlt("1971-06-28")).toContain("28 June 1971");
    expect(lifeImageAlt("1971-06-28")).not.toMatch(/Elon/);
  });

  it("renders a plain birthdate as a png", async () => {
    const response = dateLifeImage(
      new Date(1971, 5, 28),
      new Date(2026, 10, 16)
    );
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    expect(bytes.byteLength).toBeGreaterThan(1000);
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
