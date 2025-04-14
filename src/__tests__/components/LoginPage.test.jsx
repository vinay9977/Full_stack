import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../components/LoginPage';
import * as apiService from '../../services/api';

// Mock the api service
jest.mock('../../services/api');

describe('LoginPage Component Tests', () => {
  const mockOnLogin = jest.fn();
  const mockSetCurrentPage = jest.fn();
  
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });
  
  test('renders login form correctly', () => {
    render(
      <LoginPage
        onLogin={mockOnLogin}
        setCurrentPage={mockSetCurrentPage}
      />
    );
    
    // Check form elements
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });
  
  test('input fields update state correctly', () => {
    render(
      <LoginPage
        onLogin={mockOnLogin}
        setCurrentPage={mockSetCurrentPage}
      />
    );
    
    // Get form inputs
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Change input values
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check that values were updated
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });
  
  test('displays error message on failed login', async () => {
    // Mock login to return an error
    apiService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <LoginPage
        onLogin={mockOnLogin}
        setCurrentPage={mockSetCurrentPage}
      />
    );
    
    // Get form inputs
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Fill in form and submit
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
    
    // Check that login function was called with correct arguments
    expect(apiService.login).toHaveBeenCalledWith('testuser', 'wrongpassword');
    
    // The onLogin callback should not have been called
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
  
  test('register link redirects to register page', () => {
    render(
      <LoginPage
        onLogin={mockOnLogin}
        setCurrentPage={mockSetCurrentPage}
      />
    );
    
    // Click on register here link
    fireEvent.click(screen.getByText(/register here/i));
    
    // Check that we navigated to register page
    expect(mockSetCurrentPage).toHaveBeenCalledWith('register');
  });
});