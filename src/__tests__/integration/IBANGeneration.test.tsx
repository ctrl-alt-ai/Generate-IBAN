import { describe, test, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Basic integration test for generation flow

describe('IBAN Generation Flow', () => {
  test('should generate IBAN end-to-end', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/country/i), 'NL');
    await user.selectOptions(screen.getByLabelText(/bank/i), 'ABNA');
    await user.clear(screen.getByLabelText(/quantity/i));
    await user.type(screen.getByLabelText(/quantity/i), '2');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByText(/generated ibans/i)).toBeInTheDocument();
    });

    const textareas = screen.getAllByRole('textbox');
    const resultsTextarea = textareas.find(ta => ta.value.includes('NL'));
    expect(resultsTextarea?.value.split('\n')).toHaveLength(2);
  });
});

