
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with header', () => {
  render(<App />);
  const headerElement = screen.getByText(/welcome to shopease/i);
  expect(headerElement).toBeInTheDocument();
});