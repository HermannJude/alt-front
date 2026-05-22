describe('E2E tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/analytics', { fixture: 'kpi.json' })
    cy.intercept('GET', '**/tools', {
      fixture: 'tools.json',
    })

    cy.visit('http://localhost:3000')
  })

  function getFirstToolRow() {
    return cy
      .get('[data-testid="recent-tools-table"] tbody tr')
      .first()
      .invoke('text')
      .then((text) => text.replace(/\s+/g, ' ').trim())
  }

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
    cy.get('[data-testid="kpi-card-values"]')
      .eq(0)
      .closest('article')
      .invoke('text')
      .then((text) => {
        const normalizedText = text.replace(/\s/g, ' ')
        expect(normalizedText).to.include('Monthly Budget')
        expect(normalizedText).to.include('€17 928/€30 000')
        expect(normalizedText).to.include('2.0%')
      })
  })

  it('should display recent tools table loaded with data', () => {
    cy.get('[data-testid="recent-tools-table"]').should('be.visible')
    cy.contains('tr', 'Figma')
      .should('be.visible')
      .and('contain.text', 'Engineering')
      .and('contain.text', '26')
      .and('contain.text', '534')
  })

  it('should sort recent tools by monthly cost', () => {
    cy.contains('button', 'Monthly Cost').click()

    getFirstToolRow().should('contain', 'ChatGPT')

    cy.contains('button', 'Monthly Cost').click()

    getFirstToolRow().should('contain', 'Slack')
  })
})
