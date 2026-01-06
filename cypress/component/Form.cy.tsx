import Form from "../../components/Form";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import mockRouter from "next-router-mock";

describe("Form Component", () => {
  const TEST_DOB = "1998-12-01";

  const renderForm = () => {
    cy.mount(
      <MemoryRouterProvider>
        <Form />
      </MemoryRouterProvider>,
    );
  };

  it("renders the form with all required elements", () => {
    renderForm();

    cy.get("[data-cy=bday-form]").should("exist");
    cy.get("[data-cy=inline-name-input]").should("exist");
    cy.get("[data-cy=birthday-input]").should("exist");
    cy.get("[data-cy=generate-table-button]").should("exist");
  });

  it("accepts and displays name input", () => {
    renderForm();

    cy.get("[data-cy=inline-name-input]")
      .type("John Doe")
      .should("have.value", "John Doe");
  });

  it("accepts and displays birthday input", () => {
    renderForm();

    cy.get("[data-cy=birthday-input]")
      .type(TEST_DOB)
      .should("have.value", TEST_DOB);
  });

  it("displays formatted age when birthday is entered", () => {
    renderForm();

    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=birthday-input]").blur();

    cy.get("[data-cy=age]")
      .should("exist")
      .invoke("text")
      .should("match", /\d+ years, \d+ months, \d+ days young\?/);
  });

  it("disables submit button when birthday is not entered/invalid", () => {
    renderForm();
    cy.get("[data-cy=generate-table-button]").should("be.disabled");
  });

  it("enables submit button when birthday is entered", () => {
    renderForm();
    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=birthday-input]").blur();
    cy.get("[data-cy=generate-table-button]").should("not.be.disabled");
  });

  it("submits the form and navigates", () => {
    renderForm();

    cy.get("[data-cy=inline-name-input]").type("John Doe");
    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=birthday-input]").blur();

    cy.get("[data-cy=generate-table-button]").click();

    // Verify navigation
    cy.wrap(null).should(() => {
      expect(mockRouter.asPath).to.contain("/table/1998/12/01");
      expect(mockRouter.asPath).to.contain("name=John%20Doe");
    });
  });

  it("allows checking the save checkbox", () => {
    renderForm();
    cy.get("[data-cy=input-checkbox-save]").check().should("be.checked");
  });

  it.skip("matches visual snapshot with all fields filled", () => {
    renderForm();
    cy.get("[data-cy=inline-name-input]").type("John Doe");
    cy.get("[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=input-checkbox-save]").check();
    cy.get("[data-cy=bday-form]").click(); // Ensure focus logic or simply snapshot
    cy.compareSnapshot("Form", 0.2);
  });
});
