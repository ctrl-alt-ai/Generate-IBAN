import { IBAN_SPECS } from './constants';
import type { BankInfo } from './types';
import { CountryGeneratorFactory } from '../generators/CountryGeneratorFactory';
import { IBANError } from '../errors/IBANErrors';
import { generateRandomChars, calculateMod97Check } from './randomUtils';
import { getBrowserLanguage } from './platformUtils';

// Re-export for backward compatibility
export { generateRandomChars, calculateMod97Check };

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
 * @throws {IBANError} When generation fails or country is not supported
 */
export function generateIBAN(country: string, bankInfo?: BankInfo | null): string {
  const factory = getGeneratorFactory();
  const generator = factory.getGenerator(country);
  return generator.generateIBAN(bankInfo);
}

/**
 * Generates a single IBAN for the specified country and bank (legacy version)
 * @deprecated Use generateIBAN() which throws proper errors instead of returning null
 */
export function generateIBANLegacy(country: string, bankInfo?: BankInfo | null): string | null {
  try {
    return generateIBAN(country, bankInfo);
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
    const lang = getBrowserLanguage();
    if (!lang) {
      return 'NL'; // Default fallback
    }
    
    const langLower = lang.toLowerCase();
    const baseLang = langLower.split('-')[0];
    
    if (baseLang === 'nl' && IBAN_SPECS['NL']) return 'NL';
    if (baseLang === 'de' && IBAN_SPECS['DE']) return 'DE';
    if (baseLang === 'fr') {
      if ((langLower.includes('be') || langLower.includes('bru')) && IBAN_SPECS['BE']) return 'BE';
      if (IBAN_SPECS['FR']) return 'FR';
      if (IBAN_SPECS['BE']) return 'BE';
    }
    if (baseLang === 'es' && IBAN_SPECS['ES']) return 'ES';
    if (baseLang === 'it' && IBAN_SPECS['IT']) return 'IT';
  } catch {
    // Silently handle errors - browser language detection is not critical
  }
  return 'NL';
}