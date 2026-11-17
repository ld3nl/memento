import { render } from "@testing-library/react";
import { YearGrid } from "./YearGrid";

describe("YearGrid", () => {
  const defaultProps = {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1) as readonly number[],
    yearsAlive: 25,
    currentDecadeYear: 26,
    weeksFromLastBday: 10,
    daysIntoCurrentWeek: 3,
  };

  it("renders the year grid container", () => {
    const { container } = render(<YearGrid {...defaultProps} />);
    const grid = container.querySelector('[data-cy="year-grid"]');
    expect(grid).toBeTruthy();
  });

  it("renders correct number of weeks", () => {
    const { container } = render(<YearGrid {...defaultProps} />);
    const grid = container.querySelector('[data-cy="year-grid"]');
    expect(grid?.children.length).toBe(52);
  });

  it("marks past weeks as filled in current year", () => {
    const { container } = render(<YearGrid {...defaultProps} />);
    const cells = Array.from(
      container.querySelector('[data-cy="year-grid"]')?.children ?? []
    ) as HTMLElement[];
    // Weeks 1-10 should be filled (weeksFromLastBday = 10)
    for (let i = 0; i < 10; i++) {
      expect(cells[i]?.className).toMatch(/filled/);
    }
  });

  it("marks future weeks as not filled", () => {
    const { container } = render(<YearGrid {...defaultProps} />);
    const cells = Array.from(
      container.querySelector('[data-cy="year-grid"]')?.children ?? []
    ) as HTMLElement[];
    // Weeks after 11 should not be filled (index 11+)
    for (let i = 11; i < 52; i++) {
      expect(cells[i]?.className).not.toMatch(/\bfilled\b/);
    }
  });

  it("marks current week correctly", () => {
    const { container } = render(<YearGrid {...defaultProps} />);
    const cells = Array.from(
      container.querySelector('[data-cy="year-grid"]')?.children ?? []
    ) as HTMLElement[];
    // Week 11 is current (weeksFromLastBday + 1) → index 10
    expect(cells[10]?.className).toMatch(/current-week/);
  });

  it("fills all weeks for completed years", () => {
    const { container } = render(
      <YearGrid {...defaultProps} currentDecadeYear={20} />
    );
    const cells = Array.from(
      container.querySelector('[data-cy="year-grid"]')?.children ?? []
    ) as HTMLElement[];
    for (const cell of cells) {
      expect(cell.className).toMatch(/filled/);
    }
  });

  it("does not fill any weeks for future years", () => {
    const { container } = render(
      <YearGrid {...defaultProps} currentDecadeYear={30} />
    );
    const cells = Array.from(
      container.querySelector('[data-cy="year-grid"]')?.children ?? []
    ) as HTMLElement[];
    for (const cell of cells) {
      expect(cell.className).not.toMatch(/\bfilled\b/);
    }
  });

  it("shows year label on last week for year 1", () => {
    const { container } = render(
      <YearGrid {...defaultProps} currentDecadeYear={1} />
    );
    const lastWeek = container.querySelector(
      '[data-cy="year-grid"] > :last-child'
    );
    expect(lastWeek?.getAttribute("title")).toBe("1");
    expect(lastWeek?.querySelector("span")?.textContent).toBe("1");
  });

  it("shows year label on last week for multiples of 5", () => {
    const { container } = render(
      <YearGrid {...defaultProps} currentDecadeYear={5} />
    );
    const lastWeek = container.querySelector(
      '[data-cy="year-grid"] > :last-child'
    );
    expect(lastWeek?.getAttribute("title")).toBe("5");
    expect(lastWeek?.querySelector("span")?.textContent).toBe("5");
  });
});
