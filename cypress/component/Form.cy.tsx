import Form from "../../components/Form";

const TEST_DOB = "1998-12-01";
// Test suite for <Form /> component
describe("<Form />", () => {
  // Test case for rendering the form
  it("renders the form", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Form />);
    cy.get("form").should("exist");
  });

  // Test case for checking the name input field
  it("handles name input", () => {
    cy.mount(<Form />);
    cy.get("input[data-cy=inline-name-input]").should("exist");
    cy.get("input[data-cy=inline-name-input]").type("John Doe");
    cy.get("input[data-cy=inline-name-input]").should("have.value", "John Doe");
  });

  // Test case for checking the birthday input field
  // Test case for checking the birthday input field
  it("handles birthday input", () => {
    cy.mount(<Form />);
    cy.get("input[data-cy=birthday-input]").should("exist");
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("input[data-cy=birthday-input]").should("have.value", TEST_DOB);
  });

  // Test case for checking the age display based on the birthday input
  it("displays the correct age based on birthday input", () => {
    cy.mount(<Form />);
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("[data-cy=age]").should("exist");

    //   const testDate = new Date(2024, 9, 2).getTime(); // October 3, 2023
    //   cy.clock(testDate);

    //   cy.clock(testDate).then((clock) => {
    //     cy.log(new Date().toDateString()); // This logs the date set by cy.clock
    //     cy.window().then((win) => {
    //       win.console.log("Current Date:", new Date().toDateString());
    //     });
    //     cy.get("[data-cy=age]").should(
    //       "have.text",
    //       "24 years, 10 months, 1 days young?"
    //     );
    //   });

    // age should contain `# years, # months, # days young?`
    cy.get("[data-cy=age]").contains(/\d+ years, \d+ months, \d+ days young\?/);
  });

  // data-cy="generate-table-button"
  it("button is disabled when no birthday is entered", () => {
    cy.mount(<Form />);
    cy.get("button[data-cy=generate-table-button]").should("be.disabled");
  });

  it("button is enabled when birthday is entered", () => {
    cy.mount(<Form />);
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("button[data-cy=generate-table-button]").should("not.be.disabled");
  });

  // screenshot test with all the form filled
  it("screenshot with all fields filled", () => {
    cy.mount(<Form />);
    cy.get("input[data-cy=inline-name-input]").type("John Doe");
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("input[data-cy=input-checkbox-save]").check();
    // Emulate form submission
    // error `Cannot GET /table/1998/12/01`
    // cy.get("button[data-cy=generate-table-button]").click();

    cy.get("button[data-cy=generate-table-button]").should("not.be.disabled");

    // should have action="/table/1998/12/01?name=John%20Doe"
    cy.get('form[data-cy="bday-form"]').should(
      "have.attr",
      "action",
      "/table/1998/12/01?name=John%20Doe",
    );

    // Temporarily switch to 'base' mode for this test
    // Cypress.env("visualRegressionType", "base");

    cy.compareSnapshot("Form", 0.2);
  });
});
