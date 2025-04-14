ShopEase Testing Documentation
This document provides an overview of the testing features implemented for the ShopEase application and instructions on how to run the tests.

Testing Overview
Our testing suite for ShopEase includes:

Frontend Component Tests - Using Jest and React Testing Library
End-to-End Tests - Using Cypress
Frontend Component Tests
We have implemented unit tests for the following React components:

Header Component
Rendering with/without logged-in user
Navigation functionality
Theme toggle functionality
LoginPage Component
Form rendering and validation
Error handling for failed login
Successful login flow
Navigation to register page
HomePage Component
Correct rendering of content
Category carousel navigation
ProductsPage Component
Product listing display
Adding products to cart
Contact form validation and submission
RegisterPage Component
Form rendering and validation
Error handling
Successful registration flow
End-to-End Tests
Our Cypress E2E tests cover:

Site Navigation
Moving between different pages
Theme toggling (dark/light mode)
Featured category carousel
Login Flow
Form validation
Error handling for invalid credentials
Successful login
Session persistence
Registration Flow
Form validation
Password matching
Successful registration and redirection
Products Page Functionality
Product list display
Adding products to cart
Contact form submission
Running the Tests
Prerequisites
Node.js (v14 or higher)
npm
Installation
Clone the repository and navigate to the project directory
Install dependencies:
npm install
Running Frontend Component Tests
To run all component tests:

npm run test:component
This will run all Jest tests for the React components.

Running End-to-End Tests
To run Cypress E2E tests in headless mode:

npm run test:e2e
To open Cypress Test Runner for interactive testing:

npm run cypress:open
Running All Tests
To run both component and E2E tests:

npm run test
Test Files Location
Component Tests: src/__tests__/components/
Header.test.jsx
LoginPage.test.jsx
HomePage.test.jsx
ProductsPage.test.jsx
RegisterPage.test.jsx
End-to-End Tests: cypress/e2e/
navigation.cy.js
login-flow.cy.js
registration-flow.cy.js
products-page.cy.js
Support Files:
cypress/support/commands.js - Custom Cypress commands
cypress/support/e2e.js - E2E support file
src/__mocks__/ - Mock files for component tests
src/setupTests.js - Jest setup file
Configuration Files
jest.config.js - Jest configuration
babel.config.js - Babel configuration
cypress.config.js - Cypress configuration
Test Coverage
The current test suite covers:

UI Components: Testing rendering and user interactions
State Management: Testing component state changes
Form Validation: Testing input validation and error states
API Integration: Mocking API calls to test integration
User Flows: Testing complete user journeys
Best Practices Implemented
Independent Tests: Each test is self-contained and doesn't rely on other tests
Descriptive Test Names: Test names clearly describe what is being tested
Mock External Dependencies: API calls are mocked to isolate tests
Proper Assertions: Each test has clear expectations and assertions
Testing Both Success and Error Paths: Testing both normal operation and error handling
Future Improvements
Increase Coverage: Add tests for remaining components
Visual Regression Testing: Add tests to prevent UI regressions
Accessibility Testing: Ensure application meets accessibility standards
Performance Testing: Add tests for application performance
