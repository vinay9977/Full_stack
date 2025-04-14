describe('Authentication Tests', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      cy.clearLocalStorage();
      cy.visit('/');
    });
  
    it('should register a new user account', () => {
      // Navigate to register page
      cy.contains('Login').click();
      cy.contains('Register here').click();
  
      // Generate a unique username with timestamp
      const timestamp = new Date().getTime();
      const username = `testuser${timestamp}`;
  
      // Fill in registration form
      cy.get('#username').type(username);
      cy.get('#email').type(`${username}@example.com`);
      cy.get('#first_name').type('Test');
      cy.get('#last_name').type('User');
      cy.get('#password').type('Password123!');
      cy.get('#password2').type('Password123!');
  
      // Mock successful registration response
      cy.intercept('POST', '**/auth/register/', {
        statusCode: 201,
        body: {
          username,
          email: `${username}@example.com`,
          first_name: 'Test',
          last_name: 'User'
        }
      }).as('registerRequest');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify the request was made correctly
      cy.wait('@registerRequest').its('request.body').should('include', {
        username,
        email: `${username}@example.com`
      });
  
      // Verify we're redirected to login page
      cy.contains('Login').should('be.visible');
    });
  
    it('should login and maintain a persistent session', () => {
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
      }).as('loginRequest');
  
      // Mock profile response
      cy.intercept('GET', '**/auth/profile/', {
        statusCode: 200,
        body: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      }).as('profileRequest');
  
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
      }).as('cartRequest');
  
      // Navigate to login page
      cy.contains('Login').click();
  
      // Fill in login form
      cy.get('#username').type('testuser');
      cy.get('#password').type('password123');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for login API request
      cy.wait('@loginRequest');
  
      // Verify user is logged in (greeting is displayed)
      cy.contains('Welcome, Test!').should('be.visible');
      cy.contains('Logout').should('be.visible');
  
      // Verify tokens are in localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('access_token')).to.eq('fake-access-token');
        expect(window.localStorage.getItem('refresh_token')).to.eq('fake-refresh-token');
      });
  
      // Refresh the page
      cy.reload();
  
      // After reload, user should still be logged in
      cy.contains('Welcome, Test!').should('be.visible');
      cy.contains('Logout').should('be.visible');
    });
  
    it('should navigate through the site correctly', () => {
      // Click on Home link
      cy.contains('Home').click();
      cy.contains('About ShopEase').should('be.visible');
      cy.contains('Featured Categories').should('be.visible');
  
      // Click on Products link
      cy.contains('Products').click();
      cy.contains('Product List').should('be.visible');
      cy.contains('Contact Us').should('be.visible');
  
      // Mock products response
      cy.intercept('GET', '**/api/products/', {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Laptop',
            price: '999.99',
            category: 1,
            category_name: 'Electronics',
            description: 'Powerful laptop',
            in_stock: true
          },
          {
            id: 2,
            name: 'T-shirt',
            price: '19.99',
            category: 2,
            category_name: 'Clothing',
            description: 'Comfortable cotton t-shirt',
            in_stock: true
          }
        ]
      }).as('productsRequest');
  
      // Products should be loaded
      cy.wait('@productsRequest');
      cy.contains('Laptop').should('be.visible');
      cy.contains('T-shirt').should('be.visible');
  
      // Try the dark/light mode toggle
      cy.contains('🌙 Dark Mode').click();
      cy.contains('☀️ Light Mode').should('be.visible');
      
      // Toggle back
      cy.contains('☀️ Light Mode').click();
      cy.contains('🌙 Dark Mode').should('be.visible');
    });
  });