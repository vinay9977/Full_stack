// Login command (reusable)
Cypress.Commands.add('login', (username, password) => {
    // Mock successful login response
    cy.intercept('POST', '**/auth/token/', {
      statusCode: 200,
      body: {
        access: 'fake-access-token',
        refresh: 'fake-refresh-token',
        user: {
          id: 1,
          username: username,
          first_name: 'Test',
          last_name: 'User'
        }
      }
    }).as('loginRequest')
    
    // Mock profile response
    cy.intercept('GET', '**/auth/profile/', {
      statusCode: 200,
      body: {
        id: 1,
        username: username,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      }
    }).as('profileRequest')
    
    // Mock empty cart response
    cy.intercept('GET', '**/api/cart/', {
      statusCode: 200,
      body: {
        id: 1,
        items: [],
        total: 0,
        created_at: '2025-04-01T12:00:00Z',
        updated_at: '2025-04-01T12:00:00Z'
      }
    }).as('cartRequest')
    
    // Visit login page
    cy.visit('/')
    cy.contains('Login').click()
    
    // Fill in login form
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    
    // Submit form
    cy.contains('button', 'Login').click()
    
    // Wait for login to complete
    cy.wait('@loginRequest')
    
    // Verify user is logged in
    cy.contains('Welcome, Test!').should('be.visible')
  })
  