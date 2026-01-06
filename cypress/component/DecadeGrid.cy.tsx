import DecadeGrid from "../../components/DecadeGrid";

describe("DecadeGrid Component", () => {
  const defaultProps = {
    decadeLength: 10,
    weeks: Array.from({ length: 52 }, (_, i) => i + 1),
    yearsAlive: 25,
    yearIndex: 0,
    weeksFromLastBday: 10,
  };

  it("renders the correct number of year grids based on decadeLength", () => {
    cy.mount(<DecadeGrid {...defaultProps} />);

    cy.get("[data-cy=decade-grid]")
      .should("exist")
      .find("[data-cy=year-grid]")
      .should("have.length", defaultProps.decadeLength);
  });

  it("renders 52 weeks per year grid", () => {
    cy.mount(<DecadeGrid {...defaultProps} decadeLength={1} />);

    cy.get("[data-cy=year-grid]").first().children().should("have.length", 52);
  });

  it("renders correct number of year grids for partial decades", () => {
    cy.mount(<DecadeGrid {...defaultProps} decadeLength={3} />);

    cy.get("[data-cy=year-grid]").should("have.length", 3);
  });

  it("matches visual snapshot", () => {
    cy.mount(<DecadeGrid {...defaultProps} decadeLength={5} />);

    cy.get("[data-cy=decade-grid]").should("be.visible");
    cy.compareSnapshot("DecadeGrid", 0.2);
  });
});
