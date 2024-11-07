// cypress/support/mockNextNavigation.js
export const mockUseRouter = () => {
  cy.stub(require("next/navigation"), "useRouter").returns({
    push: cy.stub(), // Mock push function
    prefetch: cy.stub(),
    pathname: "/",
    query: {},
  });
};
