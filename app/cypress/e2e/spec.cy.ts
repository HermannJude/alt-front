describe('E2E tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  it('should display the dashboard page', () => {
    cy.get('[data-testid="dashboard-link"]').should('be.visible')
    cy.get('[data-testid="tools-link"]').should('be.visible')
    cy.get('[data-testid="analytics-link"]').should('be.visible')
  })
  it('navigation link should be active', () => {
    cy.get('[data-testid="dashboard-link"]').should('have.class', 'is-active')
  })
  it('should display kpi cards', () => {
    cy.get('[data-testid="kpi-card-values"]').should('have.length', 4)
  })
  it('should display kpi cards with loaded data', () => {
    cy.intercept('GET', '**/analytics', { fixture: 'kpi.json' })
    cy.get('[data-testid="kpi-card-values"]')
      .eq(0)
      .invoke('text')
      .then((text) => {
        const normalizedText = text.replace(/\s/g, ' ') // Normalizing spaces
        expect(normalizedText).to.include('€17 928/€30 000')
      })
  })

  it('should display recent tools table loaded with data', () => {
    cy.intercept('GET', '**/tools?_sort=updated_at&_order=desc&_limit=1000', {
      fixture: 'tools.json',
    }).as('getAnalytics')

    cy.wait('@getAnalytics')

    cy.get('[data-testid="recent-tools-table"]').should('be.visible')

    cy.get('[data-testid="recent-tools-table"] tbody tr').should(
      'have.length',
      10,
    )
  })
})
