const TEST_DOB = '1998-12-01'

describe('Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/') // Uses baseUrl from cypress.config.ts
  })

  it('renders the form', () => {
    cy.get('form').should('exist')
  })

  it('handles name input', () => {
    cy.get('input[data-cy=inline-name-input]')
      .should('exist')
      .type('John Doe')
      .should('have.value', 'John Doe')
  })

  it('handles birthday input', () => {
    cy.get('input[data-cy=birthday-input]')
      .should('exist')
      .type(TEST_DOB)
      .should('have.value', TEST_DOB)
  })

  it('displays the correct age based on birthday input', () => {
    cy.get('input[data-cy=birthday-input]').type(TEST_DOB)
    cy.get('[data-cy=age]')
      .should('exist')
      .contains(/\d+ years, \d+ months, \d+ days young\?/)
  })

  it('button is disabled when no birthday is entered', () => {
    cy.get('button[data-cy=generate-table-button]').should('be.disabled')
  })

  it('button is enabled when birthday is entered', () => {
    cy.get('input[data-cy=birthday-input]').type(TEST_DOB)
    cy.get('button[data-cy=generate-table-button]').should('not.be.disabled')
  })

  it('screenshot with all fields filled', () => {
    cy.get('input[data-cy=inline-name-input]').type('John Doe')
    cy.get('input[data-cy=birthday-input]').type(TEST_DOB)
    cy.get('input[data-cy=input-checkbox-save]').check()

    // Set to 'base' mode for baseline capture
    Cypress.env('visualRegressionType', 'base')
    cy.compareSnapshot('form-filled')
  })
})
