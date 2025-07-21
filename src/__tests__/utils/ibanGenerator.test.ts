import { describe, test, expect } from '@jest/globals';
import { 
  generateIBAN, 
  formatIBAN, 
  getSuggestedCountry,
  generateRandomChars,
  calculateMod97Check 
} from '../../utils/ibanGenerator';
import type { BankInfo } from '../../utils/types';

// Mock navigator.language for getSuggestedCountry tests
const mockNavigator = (language: string) => {
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: {
      language: language,
    },
  });
};

describe('IBAN Generator Utils', () => {
  describe('generateIBAN', () => {
    test('should generate valid IBAN for Netherlands', () => {
      const iban = generateIBAN('NL');
      
      expect(iban).toBeDefined();
      expect(iban).toMatch(/^NL\d{2}[A-Z]{4}\d{10}$/);
      expect(iban!.length).toBe(18);
    });

    test('should generate valid IBAN for Germany', () => {
      const iban = generateIBAN('DE');
      
      expect(iban).toBeDefined();
      expect(iban).toMatch(/^DE\d{22}$/);
      expect(iban!.length).toBe(22);
    });

    test('should generate IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'ABN AMRO', code: 'ABNA' };
      const iban = generateIBAN('NL', bankInfo);
      
      expect(iban).toBeDefined();
      expect(iban).toMatch(/^NL\d{2}ABNA\d{10}$/);
    });

    test('should return null for unsupported country', () => {
      const iban = generateIBAN('XX');
      expect(iban).toBeNull();
    });

    test('should generate different IBANs on multiple calls', () => {
      const iban1 = generateIBAN('NL');
      const iban2 = generateIBAN('NL');
      
      expect(iban1).not.toBe(iban2);
    });

    test('should handle null bank info', () => {
      const iban = generateIBAN('NL', null);
      
      expect(iban).toBeDefined();
      expect(iban).toMatch(/^NL\d{2}[A-Z]{4}\d{10}$/);
    });
  });

  describe('formatIBAN', () => {
    test('should format IBAN with spaces every 4 characters', () => {
      const formatted = formatIBAN('NL91ABNA0417164300');
      expect(formatted).toBe('NL91 ABNA 0417 1643 00');
    });

    test('should handle already formatted IBAN', () => {
      const formatted = formatIBAN('NL91 ABNA 0417 1643 00');
      expect(formatted).toBe('NL91 ABNA 0417 1643 00');
    });

    test('should handle empty string', () => {
      const formatted = formatIBAN('');
      expect(formatted).toBe('');
    });

    test('should handle non-string input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = formatIBAN(null as any);
      expect(formatted).toBe('');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted2 = formatIBAN(undefined as any);
      expect(formatted2).toBe('');
    });

    test('should handle short strings', () => {
      const formatted = formatIBAN('NL91');
      expect(formatted).toBe('NL91');
    });
  });

  describe('generateRandomChars', () => {
    test('should generate numeric characters', () => {
      const result = generateRandomChars(10, 'numeric');
      
      expect(result.length).toBe(10);
      expect(result).toMatch(/^\d{10}$/);
    });

    test('should generate alpha upper characters', () => {
      const result = generateRandomChars(4, 'alphaUpper');
      
      expect(result.length).toBe(4);
      expect(result).toMatch(/^[A-Z]{4}$/);
    });

    test('should generate alphanumeric upper characters', () => {
      const result = generateRandomChars(6, 'alphanumericUpper');
      
      expect(result.length).toBe(6);
      expect(result).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('should handle short form types', () => {
      const numeric = generateRandomChars(5, 'n');
      expect(numeric).toMatch(/^\d{5}$/);

      const alphanumeric = generateRandomChars(5, 'c');
      expect(alphanumeric).toMatch(/^[A-Z0-9]{5}$/);
    });

    test('should return empty string for zero length', () => {
      const result = generateRandomChars(0);
      expect(result).toBe('');
    });

    test('should return empty string for negative length', () => {
      const result = generateRandomChars(-1);
      expect(result).toBe('');
    });

    test('should throw error for invalid character type', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generateRandomChars(5, 'invalid' as any);
      }).toThrow();
    });

    test('should generate different results on multiple calls', () => {
      const result1 = generateRandomChars(10, 'numeric');
      const result2 = generateRandomChars(10, 'numeric');
      
      // Should be very unlikely to be the same (1 in 10^10 chance)
      expect(result1).not.toBe(result2);
    });
  });

  describe('calculateMod97Check', () => {
    test('should calculate mod-97 check for valid input', () => {
      const result = calculateMod97Check('123456789');
      
      expect(result).toMatch(/^\d{2}$/);
      expect(parseInt(result)).toBeGreaterThan(0);
      expect(parseInt(result)).toBeLessThanOrEqual(97);
    });

    test('should handle edge cases', () => {
      const result1 = calculateMod97Check('0');
      expect(result1).toMatch(/^\d{2}$/);
      
      const result2 = calculateMod97Check('97');
      expect(result2).toBe('01');
    });

    test('should return "00" for invalid input', () => {
      expect(calculateMod97Check('')).toBe('00');
      expect(calculateMod97Check('abc')).toBe('00');
      expect(calculateMod97Check('12a34')).toBe('00');
    });

    test('should handle null/undefined input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(calculateMod97Check(null as any)).toBe('00');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(calculateMod97Check(undefined as any)).toBe('00');
    });

    test('should be deterministic', () => {
      const input = '123456789';
      const result1 = calculateMod97Check(input);
      const result2 = calculateMod97Check(input);
      
      expect(result1).toBe(result2);
    });
  });

  describe('getSuggestedCountry', () => {
    afterEach(() => {
      // Restore original navigator
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).navigator;
      Object.defineProperty(window, 'navigator', {
        writable: true,
        value: navigator,
      });
    });

    test('should suggest NL for Dutch language', () => {
      mockNavigator('nl-NL');
      const country = getSuggestedCountry();
      expect(country).toBe('NL');
    });

    test('should suggest DE for German language', () => {
      mockNavigator('de-DE');
      const country = getSuggestedCountry();
      expect(country).toBe('DE');
    });

    test('should suggest BE for Belgian French', () => {
      mockNavigator('fr-BE');
      const country = getSuggestedCountry();
      expect(country).toBe('BE');
    });

    test('should suggest FR for French language', () => {
      mockNavigator('fr-FR');
      const country = getSuggestedCountry();
      expect(country).toBe('FR');
    });

    test('should suggest ES for Spanish language', () => {
      mockNavigator('es-ES');
      const country = getSuggestedCountry();
      expect(country).toBe('ES');
    });

    test('should suggest IT for Italian language', () => {
      mockNavigator('it-IT');
      const country = getSuggestedCountry();
      expect(country).toBe('IT');
    });

    test('should default to NL for unsupported language', () => {
      mockNavigator('ja-JP');
      const country = getSuggestedCountry();
      expect(country).toBe('NL');
    });

    test('should handle missing navigator gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).navigator;
      const country = getSuggestedCountry();
      expect(country).toBe('NL');
    });
  });
});