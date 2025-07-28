/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IBANForm } from '../../components/IBANForm';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock the constants to avoid external dependencies
jest.mock('../../utils/constants', () => ({
  COUNTRY_NAMES: {
    'NL': 'Netherlands',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy'
  },
  BANK_DATA: {
    'NL': {
      'ABNANL2A': { name: 'ABN AMRO' },
      'INGBNL2A': { name: 'ING' }
    },
    'DE': {
      'DEUTDEFF': { name: 'Deutsche Bank' },
      'COBADEFF': { name: 'Commerzbank' }
    },
    'FR': {
      'BNPAFRPP': { name: 'BNP Paribas' },
      'SOGEFRPP': { name: 'Société Générale' }
    },
    'IT': {
      'BCITITMM': { name: 'UniCredit' },
      'INTESA': { name: 'Intesa Sanpaolo' }
    }
  }
}));

const mockOnGenerate = jest.fn();

const renderIBANForm = (props = {}) => {
  const defaultProps = {
    onGenerate: mockOnGenerate,
    isGenerating: false,
    errors: {}
  };

  return render(
    <I18nextProvider i18n={i18n}>
      <IBANForm {...defaultProps} {...props} />
    </I18nextProvider>
  );
};

describe('IBANForm Dropdown Interactions', () => {
  beforeEach(() => {
    mockOnGenerate.mockClear();
  });

  test('should handle rapid country switching', async () => {
    const user = userEvent.setup({ delay: null });
    renderIBANForm();

    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;

    // Initial state should be NL
    expect(countrySelect.value).toBe('NL');

    // Rapidly switch countries
    await act(async () => {
      await user.selectOptions(countrySelect, 'DE');
    });
    
    await waitFor(() => {
      expect(countrySelect.value).toBe('DE');
    });

    // Rapidly switch again
    await act(async () => {
      await user.selectOptions(countrySelect, 'FR');
    });

    await waitFor(() => {
      expect(countrySelect.value).toBe('FR');
    });

    // Bank dropdown should be present and functional
    await waitFor(() => {
      const bankSelect = screen.getByLabelText(/bank/i) as HTMLSelectElement;
      expect(bankSelect).toBeDefined();
      expect(bankSelect.options.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  test('should handle multiple consecutive changes', async () => {
    const user = userEvent.setup({ delay: 10 });
    renderIBANForm();

    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;

    // Sequence of rapid changes
    const countries = ['DE', 'FR', 'IT', 'NL'];
    
    for (const country of countries) {
      await act(async () => {
        await user.selectOptions(countrySelect, country);
      });

      await waitFor(() => {
        expect(countrySelect.value).toBe(country);
      });

      // Ensure bank dropdown is still present and functional
      await waitFor(() => {
        const bankSelect = screen.getByLabelText(/bank/i) as HTMLSelectElement;
        expect(bankSelect).toBeDefined();
        expect(bankSelect.options.length).toBeGreaterThan(0);
      }, { timeout: 1000 });
    }
  });
});