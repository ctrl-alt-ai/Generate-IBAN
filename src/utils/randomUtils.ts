import type { CharacterType } from './types';
import { getSecureRandom, isSecureCryptoAvailable } from './platformUtils';

/**
 * Generates random characters of specified type
 */
export function generateRandomChars(length: number, type: CharacterType = 'numeric'): string {
  if (length <= 0) return '';

  let result = '';
  const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeric = '0123456789';
  const alphanumericUpper = alphaUpper + numeric;
  let chars: string;
  const lowerType = type?.toLowerCase();

  switch (lowerType) {
    case 'alphaupper':
    case 'alpha':
      chars = alphaUpper;
      break;
    case 'alphanumericupper':
    case 'alphanumeric':
    case 'c':
      chars = alphanumericUpper;
      break;
    case 'numeric':
    case 'n':
      chars = numeric;
      break;
    default:
      throw new Error(`Invalid character type: ${type}`);
  }

  if (!isSecureCryptoAvailable()) {
    throw new Error('Secure random number generation is not supported in this environment. Please use a modern browser or Node.js environment that supports secure random generation.');
  }

  const randomValues = getSecureRandom(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}

/**
 * Calculates mod-97 check for national check digits
 */
export function calculateMod97Check(numericString: string): string {
  if (!numericString || !/^\d+$/.test(numericString)) {
    console.warn(`Invalid input for mod-97 calculation: ${numericString}`);
    return '00';
  }

  try {
    // Handle large numbers safely without BigInt
    let remainder = 0;
    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
    }

    // For Belgian IBANs: check digits = 98 - remainder
    const check = 98 - remainder;
    return check < 10 ? `0${check}` : `${check}`;
  } catch (e) {
    console.error('Error during mod-97 check calculation:', e);
    return '99';
  }
}