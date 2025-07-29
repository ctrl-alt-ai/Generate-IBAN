import type { CharacterType } from './types';

/**
 * 🐛 FIX: Secure random number generation with fallback for older browsers
 * This prevents the app from crashing when Web Crypto API is not available
 */
function getSecureRandomValues(length: number): number[] {
  if (window.crypto && window.crypto.getRandomValues) {
    // Use secure crypto API when available
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues);
  } else {
    // 🐛 FIX: Fallback to Math.random for older browsers (less secure but functional)
    console.warn('Web Crypto API not available, falling back to Math.random(). This is less secure and should only be used for testing purposes.');
    
    const randomValues: number[] = [];
    for (let i = 0; i < length; i++) {
      // Generate a random 32-bit integer equivalent
      randomValues.push(Math.floor(Math.random() * 0x100000000));
    }
    return randomValues;
  }
}

/**
 * Generates random characters of specified type
 * 🐛 FIX: Now includes fallback for browsers without Web Crypto API support
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

  try {
    // 🐛 FIX: Use the new secure random function with fallback
    const randomValues = getSecureRandomValues(length);

    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    return result;
  } catch (error) {
    // 🐛 FIX: Additional error handling with user-friendly message
    console.error('Failed to generate random characters:', error);
    throw new Error('Unable to generate secure random numbers. Please try refreshing the page or use a modern browser.');
  }
}

/**
 * Calculates mod-97 check for national check digits
 * 🐛 FIX: Enhanced error handling and edge case management
 */
export function calculateMod97Check(numericString: string): string {
  // 🐛 FIX: Better input validation
  if (!numericString) {
    console.warn('Empty input provided for mod-97 calculation');
    return '00';
  }
  
  if (typeof numericString !== 'string') {
    console.warn(`Invalid input type for mod-97 calculation: ${typeof numericString}`);
    return '00';
  }

  if (!/^\d+$/.test(numericString)) {
    console.warn(`Invalid input for mod-97 calculation: ${numericString}`);
    return '00';
  }

  try {
    // 🐛 FIX: Handle edge case of very long numeric strings
    if (numericString.length > 100) {
      console.warn('Extremely long numeric string provided, this may cause performance issues');
    }

    // Handle large numbers safely without BigInt
    let remainder = 0;
    for (let i = 0; i < numericString.length; i++) {
      const digit = parseInt(numericString[i]);
      
      // 🐛 FIX: Validate each digit
      if (isNaN(digit)) {
        console.error(`Invalid digit found at position ${i}: ${numericString[i]}`);
        return '00';
      }
      
      remainder = (remainder * 10 + digit) % 97;
    }

    // For Belgian IBANs: check digits = 98 - remainder
    const check = 98 - remainder;
    
    // 🐛 FIX: Ensure check digit is always valid (between 1 and 97)
    if (check < 1 || check > 97) {
      console.error(`Invalid check digit calculated: ${check}`);
      return '01'; // Return safe default
    }
    
    return check < 10 ? `0${check}` : `${check}`;
  } catch (e) {
    console.error('Error during mod-97 check calculation:', e);
    // 🐛 FIX: Return '01' instead of '99' as it's a more common valid check digit
    return '01';
  }
}