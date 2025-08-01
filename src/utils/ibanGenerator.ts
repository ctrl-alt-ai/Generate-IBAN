import { IBAN_SPECS } from './constants';
import type { BankInfo } from './types';
import { CountryGeneratorFactory } from '../generators/CountryGeneratorFactory';
import { IBANError } from '../errors/IBANErrors';
import { generateRandomChars, calculateMod97Check } from './randomUtils';

// Re-export for backward compatibility
export { generateRandomChars, calculateMod97Check };


/**
 * Calculates IBAN check digits using mod-97 algorithm
 * @deprecated This function is now part of CountryGenerator - kept for backward compatibility
 */
export function calculateIBANCheckDigits(iban: string): string | null {
  const rearranged = iban.substring(4) + iban.substring(0, 4);
  let numerical = '';

  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged.charAt(i).toUpperCase();

    if (char >= 'A' && char <= 'Z') {
      numerical += (char.charCodeAt(0) - 55).toString();
    } else if (char >= '0' && char <= '9') {
      numerical += char;
    } else {
      console.error(`Invalid character in IBAN: ${char}`);
      return null;
    }
  }

  try {
    if (!/^\d+$/.test(numerical)) {
      throw new Error('Invalid characters found in numerical string for IBAN calculation.');
    }

    // Handle large numbers safely without BigInt
    let remainder = 0;
    for (let i = 0; i < numerical.length; i++) {
      remainder = (remainder * 10 + parseInt(numerical[i])) % 97;
    }

    const checkDigitInt = 98 - remainder;
    return checkDigitInt < 10 ? `0${checkDigitInt}` : `${checkDigitInt}`;
  } catch (e) {
    console.error('Error calculating IBAN check digits:', e, numerical);
    return null;
  }
}



// Initialize the factory once
let generatorFactory: CountryGeneratorFactory | null = null;

function getGeneratorFactory(): CountryGeneratorFactory {
  if (!generatorFactory) {
    generatorFactory = new CountryGeneratorFactory();
  }
  return generatorFactory;
}

/**
 * Generates a single IBAN for the specified country and bank
 * @deprecated Use the factory pattern directly for better error handling
 */
export function generateIBAN(country: string, bankInfo?: BankInfo | null): string | null {
  try {
    const factory = getGeneratorFactory();
    const generator = factory.getGenerator(country);
    return generator.generateIBAN(bankInfo);
  } catch (error) {
    if (error instanceof IBANError) {
      // Log error but return null for backward compatibility
      console.error(error.message);
      return null;
    }
    // Log unexpected errors
    console.error(`Unexpected error generating IBAN for ${country}:`, error);
    return null;
  }
}

/**
 * Formats an IBAN with spaces every 4 characters
 */
export function formatIBAN(iban: string): string {
  if (typeof iban !== 'string') return '';
  // Remove existing spaces and format with spaces every 4 characters
  const cleanIban = iban.replace(/\s/g, '');
  return cleanIban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Gets the suggested country based on browser language
 */
export function getSuggestedCountry(): string {
  try {
    const lang = navigator.language.toLowerCase();
    const baseLang = lang.split('-')[0];
    if (baseLang === 'nl' && IBAN_SPECS['NL']) return 'NL';
    if (baseLang === 'de' && IBAN_SPECS['DE']) return 'DE';
    if (baseLang === 'fr') {
      if ((lang.includes('be') || lang.includes('bru')) && IBAN_SPECS['BE']) return 'BE';
      if (IBAN_SPECS['FR']) return 'FR';
      if (IBAN_SPECS['BE']) return 'BE';
    }
    if (baseLang === 'es' && IBAN_SPECS['ES']) return 'ES';
    if (baseLang === 'it' && IBAN_SPECS['IT']) return 'IT';
  } catch (e) {
    console.warn('Could not access navigator.language:', e);
  }
  return 'NL';
}