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
 * Gets the suggested language based on browser settings
 */
export function getSuggestedLanguage(): string {
  try {
    const lang = navigator.language.toLowerCase();
    const baseLang = lang.split('-')[0];
    
    // Supported languages mapping
    const supportedLanguages = ['en', 'nl', 'de'];
    
    if (supportedLanguages.includes(baseLang)) {
      return baseLang;
    }
  } catch (e) {
    console.warn('Could not access navigator.language:', e);
  }
  return 'en'; // Default fallback
}

/**
 * Gets the suggested country based on browser language and locale
 */
export function getSuggestedCountry(): string {
  try {
    const lang = navigator.language.toLowerCase();
    const parts = lang.split('-');
    const baseLang = parts[0];
    const country = parts[1];
    
    // First try exact country match from locale (e.g., nl-NL, de-DE)
    if (country) {
      const countryUpper = country.toUpperCase();
      if (IBAN_SPECS[countryUpper]) {
        return countryUpper;
      }
    }
    
    // Smart language-to-country mapping
    const languageMapping: { [key: string]: string } = {
      'nl': 'NL',  // Dutch -> Netherlands
      'de': 'DE',  // German -> Germany  
      'fr': 'FR',  // French -> France
      'es': 'ES',  // Spanish -> Spain
      'it': 'IT',  // Italian -> Italy
      'en': 'NL'   // Default English to Netherlands for this tool
    };
    
    if (baseLang in languageMapping && IBAN_SPECS[languageMapping[baseLang]]) {
      return languageMapping[baseLang];
    }
    
    // Special handling for French-speaking Belgium
    if (baseLang === 'fr' && (lang.includes('be') || lang.includes('bru')) && IBAN_SPECS['BE']) {
      return 'BE';
    }
  } catch (e) {
    console.warn('Could not access navigator.language:', e);
  }
  return 'NL'; // Default fallback
}