// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Ignore specific Vite virtual module dynamic import error seen in CI/headless
// This prevents Cypress from failing the test when module loading race occurs
// Reference: https://on.cypress.io/uncaught-exception-from-application
// Only ignore the known virtual module import failure
Cypress.on('uncaught:exception', (err) => {
  if (
    err &&
    err.message &&
    err.message.includes('virtual:tanstack-start-client-entry')
  ) {
    return false
  }
  // Let other errors fail the test
  return true
})
