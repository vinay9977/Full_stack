import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { login, register, getUserProfile } from '../../services/api';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

// Reset mock adapter after each test
afterEach(() => {
  mock.reset();
});

describe('Authentication API Tests', () => {
  const baseURL = 'http://localhost:8000';
  
  test('login should return user token on successful authentication', async () => {
    // Prepare mock response
    const mockResponse = {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      }
    };
    
    // Mock the POST request
    mock.onPost(`${baseURL}/auth/token/`).reply(200, mockResponse);
    
    // Execute the login function
    const response = await login('testuser', 'password123');
    
    // Verify the response
    expect(response.data).toEqual(mockResponse);
  });
  
  test('register should create a new user account', async () => {
    // User data for registration
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securepass123',
      password2: 'securepass123',
      first_name: 'New',
      last_name: 'User'
    };
    
    // Expected response after successful registration
    const mockResponse = {
      username: 'newuser',
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User'
    };
    
    // Mock the POST request
    mock.onPost(`${baseURL}/auth/register/`).reply(201, mockResponse);
    
    // Execute the register function
    const response = await register(userData);
    
    // Verify the response
    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(201);
  });
  
  test('getUserProfile should return the authenticated user profile', async () => {
    // Expected user profile data
    const mockUserProfile = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    };
    
    // Set up local storage with access token (simulating authenticated user)
    localStorage.setItem('access_token', 'mock-access-token');
    
    // Mock the GET request with authentication header
    mock.onGet(`${baseURL}/auth/profile/`).reply(config => {
      // Verify that the request contains the Authorization header with the token
      if (config.headers && config.headers.Authorization === 'Bearer mock-access-token') {
        return [200, mockUserProfile];
      }
      return [401, { detail: 'Authentication credentials were not provided.' }];
    });
    
    // Execute the getUserProfile function
    const response = await getUserProfile();
    
    // Verify the response
    expect(response.data).toEqual(mockUserProfile);
    
    // Clean up
    localStorage.removeItem('access_token');
  });
});