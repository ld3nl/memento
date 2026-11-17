import { render } from "@testing-library/react";
import { Week } from "./Week";

describe("Week", () => {
  it("renders a week cell", () => {
    const { container } = render(<Week weekIndex={1} isFilled={false} />);
    const weekElement = container.firstElementChild;
    expect(weekElement).toBeInstanceOf(HTMLElement);
    expect(weekElement?.tagName).toBe("DIV");
  });

  it("applies filled styling when isFilled is true", () => {
    const { container } = render(<Week weekIndex={1} isFilled={true} />);
    const weekElement = container.firstElementChild as HTMLElement;
    // StyleX mock joins style keys into className; production emits atomic classes.
    expect(weekElement.className).toMatch(/filled/);
  });

  it("does not apply filled styling when isFilled is false", () => {
    const { container } = render(<Week weekIndex={1} isFilled={false} />);
    const weekElement = container.firstElementChild as HTMLElement;
    expect(weekElement.className).not.toMatch(/\bfilled\b/);
  });

  it("displays year label when yearsAlive is provided", () => {
    const { container } = render(
      <Week weekIndex={1} isFilled={false} yearsAlive="25" />
    );
    const weekElement = container.querySelector('[title="25"]');
    expect(weekElement).toBeTruthy();
    expect(weekElement?.querySelector("span")?.textContent).toBe("25");
  });

  it("applies second-half margin for weeks after week 26", () => {
    const { container } = render(<Week weekIndex={27} isFilled={false} />);
    const weekElement = container.firstElementChild as HTMLElement;
    expect(weekElement.className).toMatch(/secondHalf/);
  });

  it("does not apply second-half margin for weeks 26 and below", () => {
    const { container } = render(<Week weekIndex={26} isFilled={false} />);
    const weekElement = container.firstElementChild as HTMLElement;
    expect(weekElement.className).not.toMatch(/secondHalf/);
  });

  it("renders current week with partial fill", () => {
    const { container } = render(
      <Week
        weekIndex={1}
        isFilled={false}
        isCurrentWeek={true}
        currentDayOfWeek={3}
      />
    );
    const weekElement = container.firstElementChild as HTMLElement;
    expect(weekElement).toHaveClass("current-week");
    expect(weekElement).toHaveAttribute("data-current-week-day", "3");
  });

  it("renders inner fill div with correct percentage for current week", () => {
    const { container } = render(
      <Week
        weekIndex={1}
        isFilled={false}
        isCurrentWeek={true}
        currentDayOfWeek={4}
      />
    );
    const fillDiv = container.querySelector(
      '[aria-hidden="true"]'
    ) as HTMLElement | null;
    expect(fillDiv).toBeTruthy();
    // 4/7 * 100 = ~57% — StyleX reads width from --week-fill
    expect(fillDiv?.style.getPropertyValue("--week-fill")).toBe("57%");
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <Week weekIndex={1} isFilled={false} className="custom-class" />
    );
    const weekElement = container.firstElementChild as HTMLElement;
    expect(weekElement).toHaveClass("custom-class");
  });
});
