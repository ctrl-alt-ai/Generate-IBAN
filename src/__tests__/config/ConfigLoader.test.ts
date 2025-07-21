import { describe, test, expect } from '@jest/globals';
import { ConfigLoader } from '../../config/ConfigLoader';

describe('ConfigLoader', () => {
  let configLoader: ConfigLoader;

  beforeEach(() => {
    configLoader = ConfigLoader.getInstance();
  });

  test('should be a singleton', () => {
    const instance1 = ConfigLoader.getInstance();
    const instance2 = ConfigLoader.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  test('should load IBAN specifications', () => {
    const specs = configLoader.getIBANSpecs();
    
    expect(specs).toBeDefined();
    expect(specs.NL).toBeDefined();
    expect(specs.NL.length).toBe(18);
    expect(specs.NL.bankCodeLength).toBe(4);
    expect(specs.NL.accountLength).toBe(10);
  });

  test('should load country names', () => {
    const countryNames = configLoader.getCountryNames();
    
    expect(countryNames).toBeDefined();
    expect(countryNames.NL).toBe('Netherlands');
    expect(countryNames.DE).toBe('Germany');
  });

  test('should load bank data', () => {
    const bankData = configLoader.getBankData();
    
    expect(bankData).toBeDefined();
    expect(bankData.NL).toBeDefined();
    expect(bankData.NL.ABNA).toBeDefined();
    expect(bankData.NL.ABNA.name).toBe('ABN AMRO');
  });

  test('should get country specification', () => {
    const nlSpec = configLoader.getCountrySpec('NL');
    
    expect(nlSpec).toBeDefined();
    expect(nlSpec?.length).toBe(18);
    
    const invalidSpec = configLoader.getCountrySpec('XX');
    expect(invalidSpec).toBeUndefined();
  });

  test('should get country name', () => {
    expect(configLoader.getCountryName('NL')).toBe('Netherlands');
    expect(configLoader.getCountryName('XX')).toBe('XX'); // fallback to country code
  });

  test('should get country banks', () => {
    const nlBanks = configLoader.getCountryBanks('NL');
    
    expect(nlBanks).toBeDefined();
    expect(nlBanks.ABNA).toBeDefined();
    
    const invalidBanks = configLoader.getCountryBanks('XX');
    expect(invalidBanks).toEqual({});
  });

  test('should get available countries', () => {
    const countries = configLoader.getAvailableCountries();
    
    expect(countries).toContain('NL');
    expect(countries).toContain('DE');
    expect(countries).toContain('BE');
    expect(countries).toContain('FR');
    expect(countries).toContain('ES');
    expect(countries).toContain('IT');
  });

  test('should check if country is supported', () => {
    expect(configLoader.isCountrySupported('NL')).toBe(true);
    expect(configLoader.isCountrySupported('XX')).toBe(false);
  });

  test('should return immutable copies of configuration', () => {
    const specs1 = configLoader.getIBANSpecs();
    const specs2 = configLoader.getIBANSpecs();
    
    // Should be different objects (deep copies)
    expect(specs1).not.toBe(specs2);
    
    // But with same content
    expect(specs1).toEqual(specs2);
  });
});