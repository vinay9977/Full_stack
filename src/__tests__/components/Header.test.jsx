import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component Tests', () => {
  const mockSetCurrentPage = jest.fn();
  const mockToggleTheme = jest.fn();
  const mockOnLogout = jest.fn();
  
  test('renders correctly with no user logged in', () => {
    render(
      <Header 
        cartCount={2}
        toggleTheme={mockToggleTheme}
        darkMode={true}
        setCurrentPage={mockSetCurrentPage}
        user={null}
        onLogout={mockOnLogout}
      />
    );
    
    // Check if main elements are rendered
    expect(screen.getByText('Welcome to ShopEase')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // Check theme toggle button
    expect(screen.getByText(/🌙 Dark Mode/i)).toBeInTheDocument();
    
    // Check cart count
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Logout button should not be present
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
  
  test('renders correctly with user logged in', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User'
    };
    
    render(
      <Header 
        cartCount={0}
        toggleTheme={mockToggleTheme}
        darkMode={false}
        setCurrentPage={mockSetCurrentPage}
        user={mockUser}
        onLogout={mockOnLogout}
      />
    );
    
    // Check user greeting
    expect(screen.getByText('Welcome, Test!')).toBeInTheDocument();
    
    // Check if logout link is rendered instead of login
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    
    // Check theme toggle button in light mode
    expect(screen.getByText(/☀️ Light Mode/i)).toBeInTheDocument();
  });
  
  test('navigation links change current page', () => {
    render(
      <Header 
        cartCount={0}
        toggleTheme={mockToggleTheme}
        darkMode={true}
        setCurrentPage={mockSetCurrentPage}
        user={null}
        onLogout={mockOnLogout}
      />
    );
    
    // Click home link
    fireEvent.click(screen.getByText('Home'));
    expect(mockSetCurrentPage).toHaveBeenCalledWith('home');
    
    // Click products link
    fireEvent.click(screen.getByText('Products'));
    expect(mockSetCurrentPage).toHaveBeenCalledWith('products');
    
    // Click login link
    fireEvent.click(screen.getByText('Login'));
    expect(mockSetCurrentPage).toHaveBeenCalledWith('login');
  });
});