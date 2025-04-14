describe('User Authentication', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/')
      cy.contains('Login').click()
      
      // Clear local storage to ensure clean state
      cy.clearLocalStorage()
    })
  
    it('should display validation errors on empty form submission', () => {
      // Try to submit empty form
      cy.contains('button', 'Login').click()
      
      // Browser validation should kick in (HTML5 validation)
      // Check that we're still on the login page
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
    })
  
    it('should display error message on invalid credentials', () => {
      // Mock failed login response
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 401,
        body: {
          detail: 'No active account found with the given credentials'
        }
      }).as('loginRequest')
      
      // Fill in login form
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      
      // Submit form
      cy.contains('button', 'Login').click()
      
      // Wait for API request
      cy.wait('@loginRequest')
      
      // Check error message is displayed
      cy.contains('Invalid username or password').should('be.visible')
    })
  
    it('should log in successfully and persist session', () => {
      // Mock successful login response
      cy.intercept('POST', '**/auth/token/', {
        statusCode: 200,
        body: {
          access: 'fake-access-token',
          refresh: 'fake-refresh-token',
          user: {
            id: 1,
            username: 'testuser',
            first_name: 'Test',
            last_name: 'User'
          }
        }
      }).as('loginRequest')
      
      // Mock profile response for after login
      cy.intercept('GET', '**/auth/profile/', {
        statusCode: 200,
        body: {
          id: 1,
          username: 'testuser',
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
      
      // Fill in login form
      cy.get('#username').type('testuser')
      cy.get('#password').type('correctpassword')
      
      // Submit form
      cy.contains('button', 'Login').click()
      
      // Wait for API request
      cy.wait('@loginRequest')
      
      // Check that we're redirected to home page
      cy.contains('About ShopEase').should('be.visible')
      
      // Check that user greeting is displayed
      cy.contains('Welcome, Test!').should('be.visible')
      
      // Check that Logout link is displayed (not Login)
      cy.contains('Logout').should('be.visible')
      cy.contains('a', 'Login').should('not.exist')
      
      // Check localStorage contains tokens
      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.eq('fake-access-token')
        expect(win.localStorage.getItem('refresh_token')).to.eq('fake-refresh-token')
      })
      
      // Refresh the page to check if session persists
      cy.reload()
      
      // After reload, user should still be logged in
      cy.contains('Welcome, Test!').should('be.visible')
      cy.contains('Logout').should('be.visible')
    })
  })