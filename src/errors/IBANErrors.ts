/**
 * Custom error types for IBAN generation
 */

export class IBANError extends Error {
  public code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'IBANError';
    this.code = code;
  }
}

export class CountryNotSupportedError extends IBANError {
  constructor(countryCode: string) {
    super(`IBAN specification not found for country: ${countryCode}`, 'COUNTRY_NOT_SUPPORTED');
    this.name = 'CountryNotSupportedError';
  }
}

export class ValidationError extends IBANError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class GenerationError extends IBANError {
  constructor(message: string, countryCode?: string) {
    super(countryCode ? `${message} for country ${countryCode}` : message, 'GENERATION_ERROR');
    this.name = 'GenerationError';
  }
}