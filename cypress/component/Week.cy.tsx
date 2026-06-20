import Week from '../../components/Week'

describe('Week Component', () => {
  it('renders a filled week with correct styling', () => {
    cy.mount(<Week weekIndex={1} isFilled={true} />)

    cy.get("[class*='size-2']").should('exist').and('have.class', 'bg-black')
  })

  it('renders an unfilled week without fill styling', () => {
    cy.mount(<Week weekIndex={1} isFilled={false} />)

    cy.get("[class*='size-2']")
      .should('exist')
      .and('not.have.class', 'bg-black')
  })

  it('displays year label when yearsAlive prop is provided', () => {
    cy.mount(<Week weekIndex={1} isFilled={false} yearsAlive="25" />)

    cy.get("[class*='size-2']").should('have.attr', 'title', '25')
  })

  it('does not display year label when yearsAlive prop is omitted', () => {
    cy.mount(<Week weekIndex={1} isFilled={false} />)

    cy.get("[class*='size-2']").should('not.have.attr', 'title')
  })

  it('applies ml-auto class when weekIndex is greater than 26', () => {
    cy.mount(<Week weekIndex={27} isFilled={false} />)

    cy.get("[class*='size-2']").should('have.class', 'ml-auto')
  })
})
