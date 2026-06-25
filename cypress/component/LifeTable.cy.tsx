import LifeTable from "../../components/LifeTable";

describe("LifeTable Component", () => {
  it("renders life table grid for valid date of birth", () => {
    cy.viewport(1920, 1080);
    cy.mount(<LifeTable dob="1999-11-17" />);

    cy.get("[data-cy=life-table]").should("exist");
    cy.get("[data-cy=decade-grid]").should("have.length.at.least", 1);
  });

  it("renders nothing for missing date of birth", () => {
    cy.mount(<LifeTable dob="" />);

    cy.get("[data-cy=life-table]").should("not.exist");
  });

  it("renders nothing for invalid date of birth", () => {
    cy.mount(<LifeTable dob="invalid-date" />);

    cy.get("[data-cy=life-table]").should("not.exist");
  });

  it("matches visual snapshot", () => {
    cy.viewport(1920, 1080);
    cy.mount(<LifeTable dob="1999-11-17" />);

    cy.get("[data-cy=life-table]").should("be.visible");
    cy.compareSnapshot("LifeTable", 0.2);
  });
});
