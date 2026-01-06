import Form from "../../components/Form";

describe("Form Component", () => {
  const TEST_DOB = "1998-12-01";

  it("renders the form with all required elements", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=bday-form]").should("exist");
    cy.get("[data-cy=inline-name-input]").should("exist");
    cy.get("[data-cy=birthday-input]").should("exist");
    cy.get("[data-cy=generate-table-button]").should("exist");
  });

  it("accepts and displays name input", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=inline-name-input]")
      .type("John Doe")
      .should("have.value", "John Doe");
  });

  it("accepts and displays birthday input", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=birthday-input]")
      .type(TEST_DOB)
      .should("have.value", TEST_DOB);
  });

  it("displays formatted age when birthday is entered", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=age]")
      .should("exist")
      .invoke("text")
      .should("match", /\d+ years, \d+ months, \d+ days young\?/);
  });

  it("disables submit button when birthday is not entered", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=generate-table-button]").should("be.disabled");
  });

  it("enables submit button when birthday is entered", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=generate-table-button]").should("not.be.disabled");
  });

  it("generates correct form action URL with name and date", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=inline-name-input]").type("John Doe");
    cy.get("[data-cy=birthday-input]").type(TEST_DOB);

    cy.get("[data-cy=bday-form]").should(
      "have.attr",
      "action",
      "/table/1998/12/01?name=John%20Doe",
    );
  });

  it("allows checking the save checkbox", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=input-checkbox-save]").check().should("be.checked");
  });

  it("matches visual snapshot with all fields filled", () => {
    cy.mount(<Form />);

    cy.get("[data-cy=inline-name-input]").type("John Doe");
    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=input-checkbox-save]").check();

    cy.compareSnapshot("Form", 0.2);
  });
});
