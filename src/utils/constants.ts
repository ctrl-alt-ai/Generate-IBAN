import type { IBANSpecs, CountryNames, BankData } from './types';
import { ConfigLoader } from '../config/ConfigLoader';

// Get configuration from the loader
const configLoader = ConfigLoader.getInstance();

// Export configuration for backward compatibility
export const IBAN_SPECS: IBANSpecs = configLoader.getIBANSpecs();
export const COUNTRY_NAMES: CountryNames = configLoader.getCountryNames();
export const BANK_DATA: BankData = configLoader.getBankData();