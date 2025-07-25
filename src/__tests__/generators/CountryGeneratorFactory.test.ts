import { describe, test, expect, beforeEach } from '@jest/globals';
import { CountryGeneratorFactory } from '../../generators/CountryGeneratorFactory';
import { CountryNotSupportedError } from '../../errors/IBANErrors';
import type { BankInfo } from '../../utils/types';

describe('CountryGeneratorFactory', () => {
  let factory: CountryGeneratorFactory;

  beforeEach(() => {
    factory = new CountryGeneratorFactory();
  });

  test('should create generators for all supported countries', () => {
    const supportedCountries = ['NL', 'DE', 'BE', 'FR', 'ES', 'IT', 'AT', 'CH', 'LU', 'PT', 'GB', 'SE', 'NO', 'DK'];
    const availableCountries = factory.getAvailableCountries();
    
    expect(availableCountries.sort()).toEqual(supportedCountries.sort());
  });

  test('should return generator for supported country', () => {
    const generator = factory.getGenerator('NL');
    expect(generator).toBeDefined();
    
    const iban = generator.generateIBAN();
    expect(iban).toMatch(/^NL\d{2}[A-Z]{4}\d{10}$/); // NL + 2 check digits + 4 bank letters + 10 account digits
  });

  test('should throw error for unsupported country', () => {
    expect(() => {
      factory.getGenerator('XX');
    }).toThrow(CountryNotSupportedError);
  });

  test('should check if country is supported', () => {
    expect(factory.isCountrySupported('NL')).toBe(true);
    expect(factory.isCountrySupported('DE')).toBe(true);
    expect(factory.isCountrySupported('XX')).toBe(false);
  });

  test('should generate different IBANs for same country', () => {
    const generator = factory.getGenerator('NL');
    const iban1 = generator.generateIBAN();
    const iban2 = generator.generateIBAN();
    
    expect(iban1).not.toBe(iban2);
  });

  test('should generate IBAN with bank info', () => {
    const generator = factory.getGenerator('NL');
    const bankInfo: BankInfo = { name: 'ING', code: 'INGB' };
    const iban = generator.generateIBAN(bankInfo);
    
    expect(iban).toMatch(/^NL\d{2}INGB\d{10}$/);
  });

  test('should generate IBANs for all supported countries', () => {
    const supportedCountries = ['NL', 'DE', 'BE', 'FR', 'ES', 'IT', 'AT', 'CH', 'LU', 'PT', 'GB', 'SE', 'NO', 'DK'];
    
    supportedCountries.forEach(country => {
      const generator = factory.getGenerator(country);
      const iban = generator.generateIBAN();
      
      expect(iban).toBeDefined();
      expect(iban.startsWith(country)).toBe(true);
    });
  });
});