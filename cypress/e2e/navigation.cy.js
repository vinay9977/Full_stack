describe('Site Navigation', () => {
    beforeEach(() => {
      // Visit the home page before each test
      cy.visit('/')
    })
  
    it('should navigate between pages correctly', () => {
      // Check initial home page content is visible
      cy.contains('About ShopEase').should('be.visible')
      cy.contains('Featured Categories').should('be.visible')
      
      // Navigate to Products page
      cy.contains('Products').click()
      cy.contains('Product List').should('be.visible')
      cy.contains('Contact Us').should('be.visible')
      
      // Navigate to Login page
      cy.contains('Login').click()
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.contains('button', 'Login').should('be.visible')
      
      // Navigate back to Home page
      cy.contains('Home').click()
      cy.contains('About ShopEase').should('be.visible')
    })
  
    it('should toggle dark/light theme', () => {
      // Check initial theme
      cy.get('.app').should('have.class', 'dark-mode')
      
      // Toggle to light mode
      cy.get('#theme-toggle').click()
      cy.get('.app').should('have.class', 'light-mode')
      cy.get('#theme-toggle').should('contain', '☀️ Light Mode')
      
      // Toggle back to dark mode
      cy.get('#theme-toggle').click()
      cy.get('.app').should('have.class', 'dark-mode')
      cy.get('#theme-toggle').should('contain', '🌙 Dark Mode')
    })
  })
  