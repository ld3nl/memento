const TEST_DOB = "1998-12-01";

// Test suite for <Form /> component
describe("<Form />", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  // Test case for rendering the form
  it("renders the form", () => {
    // see: https://on.cypress.io/mounting-react
    // cy.mount(<Form />);
    cy.get("form").should("exist");
  });

  // Test case for checking the name input field
  it("handles name input", () => {
    // cy.mount(<Form />);
    cy.get("input[data-cy=inline-name-input]").should("exist");
    cy.get("input[data-cy=inline-name-input]").type("John Doe");
    cy.get("input[data-cy=inline-name-input]").should("have.value", "John Doe");
  });

  // Test case for checking the birthday input field
  // Test case for checking the birthday input field
  it("handles birthday input", () => {
    // cy.mount(<Form />);
    cy.get("input[data-cy=birthday-input]").should("exist");
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("input[data-cy=birthday-input]").should("have.value", TEST_DOB);
  });

  // Test case for checking the age display based on the birthday input
  it("displays the correct age based on birthday input", () => {
    // cy.mount(<Form />);
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
    // cy.mount(<Form />);
    cy.get("button[data-cy=generate-table-button]").should("be.disabled");
  });

  it("button is enabled when birthday is entered", () => {
    // cy.mount(<Form />);
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("button[data-cy=generate-table-button]").should("not.be.disabled");
  });

  // screenshot test with all the form filled
  it("screenshot with all fields filled", () => {
    // cy.mount(<Form />);
    cy.get("input[data-cy=inline-name-input]").type("John Doe");
    cy.get("input[data-cy=birthday-input]").type(TEST_DOB);
    cy.get("input[data-cy=input-checkbox-save]").check();
    // cy.get("button[data-cy=generate-table-button]").click();

    // Temporarily switch to 'base' mode for this test
    Cypress.env("visualRegressionType", "base");

    cy.compareSnapshot();
  });
});

// Cypress doesn't automatically run the server for E2E tests because:
// 1. It allows flexibility in server setup (e.g., different environments, configurations)
// 2. It separates concerns between test runner and application server
// 3. It enables testing against existing deployed environments
//
// To run the server for E2E tests:
// 1. Use Cypress's `start-server-and-test` package
// 2. Configure `baseUrl` in cypress.config.js and start the server separately
// 3. Use Cypress's `cy.exec()` to start the server programmatically before tests
