import { render, screen } from "@testing-library/react";
import { LifeTable } from "./LifeTable";

// Mock the date utilities to have predictable test results
jest.mock("../../lib/date-utils", () => ({
  calculateYearsAlive: jest.fn(() => 25),
  calculateWeeksFromLastBirthday: jest.fn(() => 10),
  getDaysIntoCurrentWeek: jest.fn(() => 3),
}));

jest.mock("../../lib/life-table-utils", () => ({
  generateDecadeConfig: jest.fn(() => ({
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    yearsInLifetime: 10,
    decadeLength: 10,
  })),
}));

jest.mock("../../lib/validation", () => ({
  isValidDate: jest.fn((date) => !!date && date !== "invalid"),
}));

// Mock DecadeGrid to simplify testing
jest.mock("../DecadeGrid", () => ({
  __esModule: true,
  default: ({ yearIndex }: { yearIndex: number }) => (
    <div data-testid={`decade-grid-${yearIndex}`}>DecadeGrid {yearIndex}</div>
  ),
}));

describe("LifeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the life table container", () => {
    render(<LifeTable dob="1990-01-15" />);
    const lifeTable = document.querySelector('[data-cy="life-table"]');
    expect(lifeTable).toBeInTheDocument();
  });

  it("renders correct number of decade grids", () => {
    render(<LifeTable dob="1990-01-15" />);
    // yearsInLifetime is mocked to 10
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`decade-grid-${i}`)).toBeInTheDocument();
    }
  });

  it("returns null when dob is missing", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const { container } = render(<LifeTable dob="" />);
    expect(container.firstChild).toBeNull();
    consoleSpy.mockRestore();
  });

  it("returns null when dob is invalid", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const { container } = render(<LifeTable dob="invalid" />);
    expect(container.firstChild).toBeNull();
    consoleSpy.mockRestore();
  });

  it("accepts Date object as dob", () => {
    render(<LifeTable dob={new Date("1990-01-15")} />);
    const lifeTable = document.querySelector('[data-cy="life-table"]');
    expect(lifeTable).toBeInTheDocument();
  });
});
