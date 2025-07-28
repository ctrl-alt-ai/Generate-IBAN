import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IBANForm } from '../../components/IBANForm';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

/**
 * Mock constants to create isolated, predictable test environment
 * This prevents external dependencies from affecting test results
 * and ensures consistent test data across different environments
 */
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

// Mock callback function for form submission testing
const mockOnGenerate = jest.fn();

/**
 * Helper function to render IBANForm with default props and i18n context
 * Provides consistent setup for all test cases
 */
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

/**
 * Test suite focused on dropdown interaction behavior and rapid state changes
 * These tests verify the fixes for dropdown closure issues during rapid switching
 * between countries and banks, ensuring smooth user experience
 */
describe('IBANForm Dropdown Interactions', () => {
  beforeEach(() => {
    // Reset mock function call history before each test
    mockOnGenerate.mockClear();
  });

  /**
   * Test case: Rapid country switching behavior
   * Verifies that the form can handle quick consecutive country changes
   * without dropdown closure issues or race conditions
   */
  test('should handle rapid country switching', async () => {
    const user = userEvent.setup({ delay: null });
    renderIBANForm();

    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;

    // Verify initial state matches expected default
    expect(countrySelect.value).toBe('NL');

    // Perform rapid country switching to test dropdown stability
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

    // Verify bank dropdown remains functional after rapid country changes
    await waitFor(() => {
      const bankSelect = screen.getByLabelText(/bank/i) as HTMLSelectElement;
      expect(bankSelect).toBeDefined();
      expect(bankSelect.options.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  /**
   * Test case: Multiple consecutive dropdown changes
   * Tests a sequence of rapid changes across different countries
   * to ensure consistent behavior and proper state management
   */
  test('should handle multiple consecutive changes', async () => {
    const user = userEvent.setup({ delay: 10 });
    renderIBANForm();

    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;

    // Test sequence of countries with different bank configurations
    const countries = ['DE', 'FR', 'IT', 'NL'];
    
    for (const country of countries) {
      await act(async () => {
        await user.selectOptions(countrySelect, country);
      });

      await waitFor(() => {
        expect(countrySelect.value).toBe(country);
      });

      // Verify bank dropdown maintains functionality throughout the sequence
      await waitFor(() => {
        const bankSelect = screen.getByLabelText(/bank/i) as HTMLSelectElement;
        expect(bankSelect).toBeDefined();
        expect(bankSelect.options.length).toBeGreaterThan(0);
      }, { timeout: 1000 });
    }
  });
});