import { render } from "@testing-library/react";
import { LifeTable } from "./LifeTable";

describe("LifeTable", () => {
  it("renders the life table container", () => {
    const { container } = render(<LifeTable dob="1990-01-15" />);
    const lifeTable = container.querySelector('[data-cy="life-table"]');
    expect(lifeTable).toBeTruthy();
  });

  it("renders eight decade grids for a full life table", () => {
    const { container } = render(<LifeTable dob="1990-01-15" />);
    const decades = container.querySelectorAll('[data-cy="decade-grid"]');
    // generateDecadeConfig → 8 decades × 10 years
    expect(decades.length).toBe(8);
  });

  it("returns null when dob is missing", () => {
    const consoleSpy = console.error;
    console.error = () => {};
    const { container } = render(<LifeTable dob="" />);
    expect(container.firstChild).toBeNull();
    console.error = consoleSpy;
  });

  it("returns null when dob is invalid", () => {
    const consoleSpy = console.error;
    console.error = () => {};
    const { container } = render(<LifeTable dob="invalid" />);
    expect(container.firstChild).toBeNull();
    console.error = consoleSpy;
  });

  it("accepts Date object as dob", () => {
    const { container } = render(<LifeTable dob={new Date("1990-01-15")} />);
    const lifeTable = container.querySelector('[data-cy="life-table"]');
    expect(lifeTable).toBeTruthy();
  });
});
