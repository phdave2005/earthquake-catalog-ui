import { render, screen, fireEvent } from '@testing-library/react';
import Home from './home';

test('renders page elements', () => {
	render(<Home />);

	const buttons = screen.getAllByRole('button');
	const selects = screen.getAllByRole('combobox');
	//const label = screen.getByLabelText('Language Used');

	expect(screen.getByRole('heading')).toBeInTheDocument();
	expect(screen.getByRole('main')).toBeInTheDocument();
	expect(screen.getByTestId('form')).toBeInTheDocument();
	expect(screen.getByRole('img')).toBeInTheDocument();
	expect(buttons).toHaveLength(8);

	let i;
	for(i = 0; i < buttons.length; i++) {
		expect(buttons[i]).toBeEnabled();
	}

	expect(selects).toHaveLength(5); 
	for(i = 0; i < selects.length; i++) {
		expect(selects[i]).toBeEnabled();
	}
});

test('makes each form section visible', () => {
	render(<Home />);

	const buttons = screen.getAllByRole('button');
	let i = 0,
		activeForms = [
			'formula',
			'lattice',
			'journal',
			'additional',
			'filters'
		],
		len = activeForms.length,
		activeForm;
	for(; i < len; i++) {
		activeForm = screen.getByTestId(activeForms[i]);
		fireEvent.click(buttons[i]);
		expect(activeForm.classList.contains("active")).toBe(true);
		expect(activeForm).toBeVisible();
	}

	// check chemical formula field
	fireEvent.click(buttons[5]); // reset
	fireEvent.click(buttons[0]);

	const inputs = screen.getAllByRole('textbox');
	inputs[0].value = 'AA';
	fireEvent.click(buttons[1]);
	expect(screen.getByTestId(activeForms[0]).classList.contains("active")).toBe(true);

	fireEvent.click(screen.getByTestId("reset-button"));
	expect(inputs[0].value).toHaveLength(0);

	inputs[0].value = 'C';
	fireEvent.click(buttons[1]);
	expect(screen.getByTestId(activeForms[1]).classList.contains("active")).toBe(true);

	fireEvent.click(screen.getByTestId("search-button"));
	expect(screen.getByTestId("processing")).toBeVisible();
});
