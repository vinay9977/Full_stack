import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import * as apiService from '../../services/api';

// Mock the api service
jest.mock('../../services/api');

describe('App Component Tests', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('renders loading state initially', () => {
    // Mock API calls to never resolve during this test
    apiService.getUserProfile.mockImplementation(() => new Promise(() => {}));
    
    render(<App />);
    
    // Check that loading message is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('renders home page when no user is logged in', async () => {
    // Mock getUserProfile to simulate no token
    apiService.getUserProfile.mockRejectedValue(new Error('No token'));
    
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Check that home page is rendered
    expect(screen.getByText('About ShopEase')).toBeInTheDocument();
    expect(screen.getByText('Featured Categories')).toBeInTheDocument();
    
    // Check that login link is shown (not logout)
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    
    // No user greeting should be shown
    expect(screen.queryByText(/welcome, /i)).not.toBeInTheDocument();
  });
  
  test('renders with user data when token is valid', async () => {
    // Mock user profile response
    const mockUserData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    };
    
    // Mock empty cart response
    const mockCartData = {
      id: 1,
      items: [],
      total: 0
    };
    
    // Set mock implementations
    apiService.getUserProfile.mockResolvedValue({ data: mockUserData });
    apiService.getCart.mockResolvedValue({ data: mockCartData });
    
    // Add token to localStorage
    localStorage.setItem('access_token', 'mock-token');
    
    render(<App />);
    
    // Wait for loading to complete and user data to be loaded
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText(/welcome, test!/i)).toBeInTheDocument();
    });
    
    // Check that logout link is shown (not login)
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});