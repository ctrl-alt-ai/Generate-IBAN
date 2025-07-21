import type { IBANSpecs, CountryNames, BankData } from '../utils/types';

// Import JSON files statically (they'll be bundled at build time)
import ibanSpecsData from './iban-specs.json';
import countryNamesData from './country-names.json';
import bankDataData from './bank-data.json';

/**
 * Configuration loader for IBAN generation settings
 * Loads configuration from JSON files to enable easier updates without code changes
 */
export class ConfigLoader {
  private static instance: ConfigLoader;
  private ibanSpecs: IBANSpecs;
  private countryNames: CountryNames;
  private bankData: BankData;

  private constructor() {
    // Load configuration from JSON files
    this.ibanSpecs = ibanSpecsData as IBANSpecs;
    this.countryNames = countryNamesData as CountryNames;
    this.bankData = bankDataData as BankData;
  }

  /**
   * Get singleton instance of ConfigLoader
   */
  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  /**
   * Get IBAN specifications for all countries
   */
  public getIBANSpecs(): IBANSpecs {
    return { ...this.ibanSpecs };
  }

  /**
   * Get country display names
   */
  public getCountryNames(): CountryNames {
    return { ...this.countryNames };
  }

  /**
   * Get bank data for all countries
   */
  public getBankData(): BankData {
    return { ...this.bankData };
  }

  /**
   * Get IBAN specification for a specific country
   */
  public getCountrySpec(countryCode: string) {
    return this.ibanSpecs[countryCode];
  }

  /**
   * Get country name for a specific country code
   */
  public getCountryName(countryCode: string): string {
    return this.countryNames[countryCode] || countryCode;
  }

  /**
   * Get banks for a specific country
   */
  public getCountryBanks(countryCode: string) {
    return this.bankData[countryCode] || {};
  }

  /**
   * Get all available country codes
   */
  public getAvailableCountries(): string[] {
    return Object.keys(this.ibanSpecs);
  }

  /**
   * Check if a country is supported
   */
  public isCountrySupported(countryCode: string): boolean {
    return countryCode in this.ibanSpecs;
  }
}