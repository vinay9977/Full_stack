import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component Tests', () => {
  test('renders footer with copyright text', () => {
    render(<Footer />);
    
    // Check if the copyright text is present
    expect(screen.getByText(/© 2025 ShopEase. All rights reserved./i)).toBeInTheDocument();
  });
});