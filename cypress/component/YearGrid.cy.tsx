import YearGrid from "../../components/YearGrid";

describe("YearGrid Component", () => {
  const defaultProps = {
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    yearsAlive: 30,
    currentDecadeYear: 31,
    weeksFromLastBday: 10,
  };

  it("renders a grid with 52 weeks", () => {
    cy.mount(<YearGrid {...defaultProps} />);

    cy.get("[data-cy=year-grid]")
      .should("exist")
      .children()
      .should("have.length", 52);
  });

  it("fills the correct number of weeks based on weeksFromLastBday", () => {
    cy.mount(<YearGrid {...defaultProps} />);

    cy.get("[data-cy=year-grid]")
      .find(".bg-black")
      .should("have.length", defaultProps.weeksFromLastBday);
  });

  it("fills all weeks when currentDecadeYear is less than yearsAlive", () => {
    cy.mount(
      <YearGrid {...defaultProps} currentDecadeYear={25} yearsAlive={30} />,
    );

    cy.get("[data-cy=year-grid]").find(".bg-black").should("have.length", 52);
  });

  it("fills no weeks when currentDecadeYear is greater than yearsAlive", () => {
    cy.mount(
      <YearGrid {...defaultProps} currentDecadeYear={35} yearsAlive={30} />,
    );

    cy.get("[data-cy=year-grid]").find(".bg-black").should("have.length", 0);
  });
});
