import { render, screen } from '@testing-library/react';
import About from './about';

test('renders form elements', () => {
	render(<About />);

	expect(screen.getByRole('heading')).toBeInTheDocument();
	expect(screen.getByRole('img')).toBeInTheDocument();
	expect(screen.getByRole('main')).toBeInTheDocument();

	expect(screen.getByText('About')).toBeInTheDocument();
});
