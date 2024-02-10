import { render, screen, fireEvent } from '@testing-library/react'
import Settings from './user-settings'

test('renders page elements', () => {
	render(<Settings />);

	const button = screen.getByRole('button');
	const select = screen.getByRole('combobox');
	const label = screen.getByLabelText('Language Used');

	expect(screen.getAllByRole('heading')).toHaveLength(2);
	expect(screen.getByRole('main')).toBeInTheDocument();
	expect(button).toBeInTheDocument();
	expect(select).toBeInTheDocument();
	expect(label).toBeInTheDocument();

	expect(button).toBeEnabled();
	expect(select).toBeEnabled();

	expect(screen.getByText('Settings')).toBeInTheDocument();
});

test('updates local storage', () => {
	render(<Settings />);

	const button = screen.getByRole('button');

	expect(window.localStorage.getItem("language-used")).toBeNull();
	fireEvent.click(button);
	expect(window.localStorage.getItem("language-used")).toEqual('en');
});
