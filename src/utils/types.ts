export interface IBANSpec {
  length: number;
  bankCodeLength: number;
  accountLength: number;
  bankCodeType: 'alphaUpper' | 'numeric' | 'alphanumericUpper';
  accountType: 'numeric' | 'alphanumericUpper';
  branchCodeLength?: number;
  branchCodeType?: 'numeric' | 'alphanumericUpper';
  nationalCheckLength?: number;
  nationalCheckType?: 'alphaUpper' | 'numeric' | 'alphanumericUpper';
}

export interface BankInfo {
  name: string;
  code: string;
}

export interface CountryBanks {
  [key: string]: BankInfo;
}

export interface IBANSpecs {
  [countryCode: string]: IBANSpec;
}

export interface CountryNames {
  [countryCode: string]: string;
}

export interface BankData {
  [countryCode: string]: CountryBanks;
}

export type CharacterType = 'alphaUpper' | 'alpha' | 'alphanumericUpper' | 'alphanumeric' | 'numeric' | 'n' | 'c';

export interface FormData {
  country: string;
  bank?: string;
  quantity: number;
}

export interface GeneratedResult {
  iban: string;
  formatted: string;
}