import { render, screen } from '@testing-library/react';
import App from './App';

test('renders links', () => {
  render(<App />);
  let link;
  
  link = screen.getByText(/about dvp/i);
  expect(link).toBeInTheDocument();

  link = screen.getByText(/about cod/i);
  expect(link).toBeInTheDocument();

  link = screen.getByText(/PhDave LLC/i);
  expect(link).toBeInTheDocument();

  expect(screen.getAllByRole('heading')).toHaveLength(2);
});
