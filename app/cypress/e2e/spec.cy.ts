describe('E2E tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  // Do not auto-visit; visit explicitly in each test so intercepts
  // can be registered before navigation to avoid request races
  beforeEach(() => {})
  it('should display the dashboard page', () => {
    cy.get('[data-testid="dashboard-link"]').should('be.visible')
    cy.get('[data-testid="tools-link"]').should('be.visible')
    cy.get('[data-testid="analytics-link"]').should('be.visible')
  })
  it('navigation link should be active', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-testid="dashboard-link"]').should('have.class', 'is-active')
  })
  it('should display kpi cards', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-testid="kpi-card-values"]').should('have.length', 4)
  })
  it('should display kpi cards with loaded data', () => {
    cy.intercept('GET', '**/analytics', { fixture: 'kpi.json' })
    cy.visit('http://localhost:3000')
    cy.get('[data-testid="kpi-card-values"]')
      .eq(0)
      .invoke('text')
      .then((text) => {
        const normalizedText = text.replace(/\s/g, ' ') // Normalizing spaces
        expect(normalizedText).to.include('€17 928/€30 000')
      })
  })

  it('should display recent tools table loaded with data', () => {
    cy.intercept('GET', '**/tools*', { fixture: 'tools.json' }).as('getTools')
    cy.intercept('GET', '**/analytics', { fixture: 'kpi.json' }).as('getKpis')

    // visit dashboard after registering intercept so initial requests are caught
    cy.visit('http://localhost:3000')

    // Wait for rendered table instead of relying on network alias timing
    cy.get('[data-testid="recent-tools-table"]', { timeout: 10000 }).should(
      'be.visible',
    )

    cy.get('[data-testid="recent-tools-table"] tbody tr', {
      timeout: 10000,
    }).should('have.length', 10)
  })
})
