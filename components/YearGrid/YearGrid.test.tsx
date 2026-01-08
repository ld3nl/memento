import { render, screen } from "@testing-library/react";
import { YearGrid } from "./YearGrid";

// Mock the Week component
jest.mock("../Week", () => ({
  __esModule: true,
  default: ({ weekIndex, isFilled, isCurrentWeek, yearsAlive }: any) => (
    <div
      data-testid={`week-${weekIndex}`}
      data-filled={isFilled}
      data-current={isCurrentWeek}
      data-year={yearsAlive}
    >
      Week {weekIndex}
    </div>
  ),
}));

describe("YearGrid", () => {
  const defaultProps = {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1) as readonly number[],
    yearsAlive: 25,
    currentDecadeYear: 26,
    weeksFromLastBday: 10,
    daysIntoCurrentWeek: 3,
  };

  it("renders the year grid container", () => {
    render(<YearGrid {...defaultProps} />);
    const grid = document.querySelector('[data-cy="year-grid"]');
    expect(grid).toBeInTheDocument();
  });

  it("renders correct number of weeks", () => {
    render(<YearGrid {...defaultProps} />);
    for (let i = 1; i <= 52; i++) {
      expect(screen.getByTestId(`week-${i}`)).toBeInTheDocument();
    }
  });

  it("marks past weeks as filled in current year", () => {
    render(<YearGrid {...defaultProps} />);
    // Weeks 1-10 should be filled (weeksFromLastBday = 10)
    for (let i = 1; i <= 10; i++) {
      const week = screen.getByTestId(`week-${i}`);
      expect(week).toHaveAttribute("data-filled", "true");
    }
  });

  it("marks future weeks as not filled", () => {
    render(<YearGrid {...defaultProps} />);
    // Weeks after 11 should not be filled
    for (let i = 12; i <= 52; i++) {
      const week = screen.getByTestId(`week-${i}`);
      expect(week).toHaveAttribute("data-filled", "false");
    }
  });

  it("marks current week correctly", () => {
    render(<YearGrid {...defaultProps} />);
    // Week 11 should be the current week (weeksFromLastBday + 1)
    const currentWeek = screen.getByTestId("week-11");
    expect(currentWeek).toHaveAttribute("data-current", "true");
  });

  it("fills all weeks for completed years", () => {
    const props = {
      ...defaultProps,
      currentDecadeYear: 20, // Past year
    };
    render(<YearGrid {...props} />);
    // All weeks should be filled for a completed year
    for (let i = 1; i <= 52; i++) {
      const week = screen.getByTestId(`week-${i}`);
      expect(week).toHaveAttribute("data-filled", "true");
    }
  });

  it("does not fill any weeks for future years", () => {
    const props = {
      ...defaultProps,
      currentDecadeYear: 30, // Future year
    };
    render(<YearGrid {...props} />);
    // No weeks should be filled for a future year
    for (let i = 1; i <= 52; i++) {
      const week = screen.getByTestId(`week-${i}`);
      expect(week).toHaveAttribute("data-filled", "false");
    }
  });

  it("shows year label on last week for year 1", () => {
    const props = {
      ...defaultProps,
      currentDecadeYear: 1,
    };
    render(<YearGrid {...props} />);
    const lastWeek = screen.getByTestId("week-52");
    expect(lastWeek).toHaveAttribute("data-year", "1");
  });

  it("shows year label on last week for multiples of 5", () => {
    const props = {
      ...defaultProps,
      currentDecadeYear: 5,
    };
    render(<YearGrid {...props} />);
    const lastWeek = screen.getByTestId("week-52");
    expect(lastWeek).toHaveAttribute("data-year", "5");
  });
});
