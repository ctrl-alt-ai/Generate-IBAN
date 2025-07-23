import { IBAN_SPECS } from './constants';

/**
 * Validates an IBAN string according to ISO 13616 standard
 */
export function validateIBAN(iban: string): {
  isValid: boolean;
  errors: string[];
  formatted?: string;
  country?: string;
  bankCode?: string;
  accountNumber?: string;
} {
  const errors: string[] = [];
  
  if (!iban || typeof iban !== 'string') {
    return { isValid: false, errors: ['IBAN is required'] };
  }

  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format validation
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban)) {
    errors.push('IBAN format is invalid. Expected format: CC##AAAA... (where C=country, #=check digit, A=alphanumeric)');
  }

  if (cleanIban.length < 15 || cleanIban.length > 34) {
    errors.push('IBAN length must be between 15 and 34 characters');
  }

  // Extract country code
  const countryCode = cleanIban.substring(0, 2);
  const bban = cleanIban.substring(4);

  // Check if country is supported
  const spec = IBAN_SPECS[countryCode];
  if (!spec) {
    errors.push(`Country code '${countryCode}' is not supported`);
  } else {
    // Check length for specific country
    if (cleanIban.length !== spec.length) {
      errors.push(`IBAN length for ${countryCode} should be ${spec.length} characters, got ${cleanIban.length}`);
    }
  }

  // Validate check digits using mod-97 algorithm
  let isChecksumValid = false;
  try {
    isChecksumValid = validateIBANChecksum(cleanIban);
    if (!isChecksumValid) {
      errors.push('IBAN checksum is invalid');
    }
  } catch {
    errors.push('Failed to validate IBAN checksum');
  }

  const isValid = errors.length === 0;

  const result: {
    isValid: boolean;
    errors: string[];
    formatted?: string;
    country?: string;
    bankCode?: string;
    accountNumber?: string;
  } = {
    isValid,
    errors
  };

  if (isValid) {
    result.formatted = formatIBAN(cleanIban);
    result.country = countryCode;
    
    if (spec) {
      // Extract bank code and account number based on country specification
      let offset = 0;
      
      // Extract bank code
      result.bankCode = bban.substring(offset, offset + spec.bankCodeLength);
      offset += spec.bankCodeLength;
      
      // Skip branch code if present
      if (spec.branchCodeLength) {
        offset += spec.branchCodeLength;
      }
      
      // Extract account number
      result.accountNumber = bban.substring(offset, offset + spec.accountLength);
    }
  }

  return result;
}

/**
 * Validates IBAN checksum using mod-97 algorithm
 */
function validateIBANChecksum(iban: string): boolean {
  // Move the first 4 characters to the end
  const rearranged = iban.substring(4) + iban.substring(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numerical = '';
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged.charAt(i);
    if (char >= 'A' && char <= 'Z') {
      numerical += (char.charCodeAt(0) - 55).toString();
    } else {
      numerical += char;
    }
  }

  // Calculate mod 97
  let remainder = 0;
  for (let i = 0; i < numerical.length; i++) {
    remainder = (remainder * 10 + parseInt(numerical[i])) % 97;
  }

  return remainder === 1;
}

/**
 * Formats an IBAN with spaces every 4 characters
 */
function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Extracts country name from IBAN
 */
export function getCountryFromIBAN(iban: string): string | null {
  if (!iban || iban.length < 2) return null;
  
  const countryCode = iban.substring(0, 2).toUpperCase();
  return IBAN_SPECS[countryCode] ? countryCode : null;
}

/**
 * Gets detailed information about an IBAN
 */
export function getIBANInfo(iban: string): {
  country?: string;
  countryName?: string;
  bankCode?: string;
  accountNumber?: string;
  checkDigits?: string;
  bban?: string;
} {
  if (!iban || iban.length < 4) return {};
  
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  const countryCode = cleanIban.substring(0, 2);
  const checkDigits = cleanIban.substring(2, 4);
  const bban = cleanIban.substring(4);
  
  const spec = IBAN_SPECS[countryCode];
  const result: {
    country: string;
    checkDigits: string;
    bban: string;
    bankCode?: string;
    accountNumber?: string;
  } = {
    country: countryCode,
    checkDigits,
    bban
  };

  if (spec) {
    let offset = 0;
    result.bankCode = bban.substring(offset, offset + spec.bankCodeLength);
    offset += spec.bankCodeLength;
    
    if (spec.branchCodeLength) {
      offset += spec.branchCodeLength;
    }
    
    result.accountNumber = bban.substring(offset, offset + spec.accountLength);
  }

  return result;
}