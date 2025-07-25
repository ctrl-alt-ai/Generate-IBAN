import { ValidationError } from '../errors/IBANErrors';
import { ConfigLoader } from '../config/ConfigLoader';
import type { FormData, BankInfo } from './types';

/**
 * Maximum number of IBANs that can be generated in a single request
 */
export const MAX_QUANTITY = 100;

/**
 * Validation utilities for IBAN generation
 */
export class ValidationUtils {
  private static configLoader = ConfigLoader.getInstance();

  /**
   * Validates country code
   */
  static validateCountryCode(countryCode: string): void {
    if (!countryCode || typeof countryCode !== 'string') {
      throw new ValidationError('Country code is required and must be a string');
    }

    if (!this.configLoader.isCountrySupported(countryCode)) {
      throw new ValidationError(`Unsupported country code: ${countryCode}`);
    }
  }

  /**
   * Validates bank information
   */
  static validateBankInfo(bankInfo: BankInfo | null | undefined, countryCode: string): void {
    if (!bankInfo) {
      return; // Bank info is optional
    }

    if (typeof bankInfo !== 'object') {
      throw new ValidationError('Bank info must be an object');
    }

    if (!bankInfo.code || typeof bankInfo.code !== 'string') {
      throw new ValidationError('Bank code is required and must be a string');
    }

    if (!bankInfo.name || typeof bankInfo.name !== 'string') {
      throw new ValidationError('Bank name is required and must be a string');
    }

    // Validate that the bank exists for the country
    const countryBanks = this.configLoader.getCountryBanks(countryCode);
    const bankExists = Object.values(countryBanks).some(
      (bank) => bank.code === bankInfo.code || bank.name === bankInfo.name
    );

    if (Object.keys(countryBanks).length > 0 && !bankExists) {
      throw new ValidationError(`Bank ${bankInfo.name} (${bankInfo.code}) not found for country ${countryCode}`);
    }
  }

  /**
   * Validates IBAN generation quantity
   */
  static validateQuantity(quantity: number): void {
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      throw new ValidationError('Quantity must be an integer');
    }

    if (quantity < 1) {
      throw new ValidationError('Quantity must be at least 1');
    }

    if (quantity > MAX_QUANTITY) {
      throw new ValidationError(`Quantity must not exceed ${MAX_QUANTITY}`);
    }
  }

  /**
   * Validates form data for IBAN generation
   */
  static validateFormData(formData: FormData): void {
    if (!formData || typeof formData !== 'object') {
      throw new ValidationError('Form data is required');
    }

    this.validateCountryCode(formData.country);
    this.validateQuantity(formData.quantity);
    
    // Get bank info for validation if bank is specified
    if (formData.bank) {
      const countryBanks = this.configLoader.getCountryBanks(formData.country);
      const bankInfo = countryBanks[formData.bank];
      this.validateBankInfo(bankInfo, formData.country);
    }
  }

  /**
   * Validates IBAN format (basic structure check)
   */
  static validateIBANFormat(iban: string): boolean {
    if (!iban || typeof iban !== 'string') {
      return false;
    }

    // Remove spaces and convert to uppercase
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();

    // Basic format check: 2-letter country code + 2-digit check + up to 30 alphanumeric
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(cleanIban);
  }

  /**
   * Validates if an IBAN has the correct length for its country
   */
  static validateIBANLength(iban: string, countryCode?: string): boolean {
    if (!this.validateIBANFormat(iban)) {
      return false;
    }

    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    const ibanCountry = countryCode || cleanIban.substring(0, 2);
    
    const spec = this.configLoader.getCountrySpec(ibanCountry);
    if (!spec) {
      return false;
    }

    return cleanIban.length === spec.length;
  }
}