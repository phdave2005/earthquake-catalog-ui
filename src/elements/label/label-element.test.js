import { render, screen } from '@testing-library/react'
import LabelElement from './label-element'

test('renders label', () => {
	render(<LabelElement />);
	expect(screen.getByTestId('label')).toBeInTheDocument();
});
