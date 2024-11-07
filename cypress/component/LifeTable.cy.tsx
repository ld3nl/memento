import LifeTable from "../../components/LifeTable";

describe("<LifeTable />", () => {
  it("renders successfully", () => {
    cy.viewport(1920, 1080);
    cy.mount(<LifeTable dob="1999-11-17" />);
    cy.get("[data-cy=life-table]").should("exist");

    // Temporarily switch to 'base' mode for this test
    // Cypress.env("visualRegressionType", "base");
    cy.compareSnapshot("LifeTable", 0.2);
  });
});
