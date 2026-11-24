import { differenceInDays } from "date-fns";
import {
  calculateLifeWeeks,
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
} from "./date-utils";
import { gridProgress, gridWeekSpan, lifeAnniversary } from "./life-grid-time";
import { describeLifeWeek, lifeWeekDays } from "./life-week";

describe("life week geometry", () => {
  const dob = new Date(1987, 11, 17);
  const asOf = new Date(2026, 10, 24);
  const birthday = new Date(2026, 11, 17);

  it("places 17 Dec 1987 on the seven-day square that contains 24 Nov 2026", () => {
    const progress = gridProgress(dob, asOf, "birthday-grid");
    expect(progress?.currentLifeYear).toBe(40);
    expect(progress?.currentWeekIndex).toBe(4);
    expect(progress?.daysIntoWeek).toBe(6);

    const yearsAlive = calculateYearsAlive(dob, asOf);
    const weeksFrom = calculateWeeksFromLastBirthday(dob, asOf);
    expect(yearsAlive).toBe(39);
    expect(weeksFrom).toBe(3);

    const current = lifeWeekDays(dob, 40, 4);
    expect(current).toEqual({
      startDay: "2026-11-19",
      endDay: "2026-11-25",
    });
    expect(current.startDay <= "2026-11-24").toBe(true);
    expect(current.endDay >= "2026-11-24").toBe(true);

    const birthdayWeek = lifeWeekDays(dob, 40, 8);
    expect(birthdayWeek).toEqual({
      startDay: "2026-12-17",
      endDay: "2026-12-23",
    });
    expect(differenceInDays(birthday, asOf)).toBe(23);

    const detail = describeLifeWeek(dob, 40, 4);
    expect(detail.span).toBe("19 – 25 Nov");
    expect(detail.startDay).toBe(current.startDay);
  });

  it("splits the real year across 52 squares when calendar mode is on", () => {
    const progress = gridProgress(dob, asOf, "calendar");
    expect(progress?.completedLifeYearRows).toBe(38);
    expect(progress?.currentLifeYear).toBe(39);
    expect(progress?.currentWeekIndex).toBe(49);
    expect(progress?.daysIntoWeek).toBe(7);

    const yearStart = lifeWeekDays(dob, 39, 1, "calendar");
    const yearEnd = lifeWeekDays(dob, 39, 52, "calendar");
    const nextBirthday = lifeWeekDays(dob, 40, 1, "calendar");
    expect(yearStart.startDay).toBe("2025-12-17");
    expect(yearEnd.endDay).toBe("2026-12-16");
    expect(nextBirthday.startDay).toBe("2026-12-17");

    const current = lifeWeekDays(dob, 39, 49, "calendar");
    expect(current.startDay <= "2026-11-24").toBe(true);
    expect(current.endDay >= "2026-11-24").toBe(true);
    expect(describeLifeWeek(dob, 39, 49, "calendar").startDay).toBe(
      current.startDay
    );

    let covered = 0;
    let previousEnd = "";
    for (let week = 1; week <= 52; week++) {
      const span = gridWeekSpan(dob, 39, week, "calendar");
      const days = differenceInDays(span.end, span.start) + 1;
      expect(days === 7 || days === 8).toBe(true);
      covered += days;
      if (previousEnd) {
        expect(differenceInDays(span.start, new Date(previousEnd))).toBe(1);
      }
      previousEnd = span.end.toDateString();
    }
    expect(covered).toBe(
      differenceInDays(lifeAnniversary(dob, 39), lifeAnniversary(dob, 38))
    );
    expect(calculateLifeWeeks(dob, asOf, "calendar")?.weeksLived).toBe(
      38 * 52 + 48
    );
  });
});
