describe('Product Interaction Tests', () => {
    beforeEach(() => {
      // Mock products response for all tests
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
          },
          {
            id: 3,
            name: 'Coffee Mug',
            price: '9.99',
            category: 3,
            category_name: 'Home & Kitchen',
            description: 'Ceramic coffee mug',
            in_stock: true
          }
        ]
      }).as('productsRequest');
  
      cy.visit('/');
    });
  
    it('should add products to cart and update cart count', () => {
      // Mock cart API response for non-logged in users
      // (For logged-in users, we would mock the API response)
      
      // Navigate to products page
      cy.contains('Products').click();
      cy.wait('@productsRequest');
      
      // Initially cart should be empty
      cy.get('#cart-icon span').should('have.text', '0');
      
      // Add a product to cart
      cy.contains('tr', 'Laptop')
        .find('button')
        .click();
      
      // Cart count should update to 1
      cy.get('#cart-icon span').should('have.text', '1');
      
      // Add another product
      cy.contains('tr', 'T-shirt')
        .find('button')
        .click();
      
      // Cart count should update to 2
      cy.get('#cart-icon span').should('have.text', '2');
      
      // Add the same product again
      cy.contains('tr', 'T-shirt')
        .find('button')
        .click();
      
      // Cart count should now be 3 (1 laptop + 2 t-shirts)
      cy.get('#cart-icon span').should('have.text', '3');
      
      // Refresh the page
      cy.reload();
      cy.wait('@productsRequest');
      
      // Cart should persist after page reload (for non-logged in users)
      cy.get('#cart-icon span').should('have.text', '3');
    });
  
    it('should submit a contact form correctly', () => {
      // Navigate to products page which has the contact form
      cy.contains('Products').click();
      cy.wait('@productsRequest');
      
      // Mock contact form submission
      cy.intercept('POST', '**/api/contact/', {
        statusCode: 201,
        body: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message',
          created_at: '2025-04-13T10:00:00Z'
        }
      }).as('contactSubmission');
      
      // Fill in the contact form
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('This is a test message from Cypress E2E testing. Please ignore.');
      
      // Submit the form
      cy.contains('button', 'Submit').click();
      
      // Wait for form submission
      cy.wait('@contactSubmission').its('request.body').should('deep.equal', {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from Cypress E2E testing. Please ignore.'
      });
      
      // Check for success message
      cy.contains('Thanks for your message!').should('be.visible');
      
      // Form should be reset
      cy.get('#name').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#message').should('have.value', '');
    });
  });