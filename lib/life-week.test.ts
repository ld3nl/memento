import { describeLifeWeek } from "./life-week";

describe("describeLifeWeek", () => {
  const dob = new Date(1990, 0, 1);

  it("names the calendar week the life-year square starts on", () => {
    const first = describeLifeWeek(dob, 1, 1);
    expect(first.label).toBe("Week 1 1990");
    expect(first.ageLabel).toBe("0 years old");
    expect(first.stamp.startsWith("1990-01-01")).toBe(true);
    expect(first.span).toBe("1 – 7 Jan");
    expect(first.startDay).toBe("1990-01-01");
    expect(first.endDay).toBe("1990-01-07");
  });

  it("names both months when the square crosses a month", () => {
    const week = describeLifeWeek(new Date(1990, 0, 29), 1, 1);
    expect(week.span).toBe("29 Jan – 4 Feb");
  });

  it("counts age from completed birthdays, not the row number", () => {
    const week = describeLifeWeek(dob, 5, 1);
    expect(week.ageYears).toBe(4);
    expect(week.ageLabel).toBe("4 years old");
  });
});
