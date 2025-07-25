import type { CharacterType } from './types';
import { getSecureRandom } from './platformUtils';

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
    // Return default value silently - no console pollution in production
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
  } catch {
    // Return fallback value silently - no console pollution in production
    return '99';
  }
}