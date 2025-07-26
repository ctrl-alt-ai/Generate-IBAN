/**
 * Platform-agnostic utilities for browser and Node.js environments
 * Provides abstraction layer for environment-specific APIs
 */

/**
 * Platform-agnostic random number generation
 */
export function getSecureRandom(length: number): Uint32Array {
  const array = new Uint32Array(length);
  
  // Browser environment
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    window.crypto.getRandomValues(array);
    return array;
  }
  
  // Node.js environment
  if (typeof global !== 'undefined' && typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const crypto = require('crypto');
      const buffer = crypto.randomBytes(length * 4);
      for (let i = 0; i < length; i++) {
        array[i] = buffer.readUInt32BE(i * 4);
      }
      return array;
    } catch {
      // Fallback if crypto module is not available
    }
  }
  
  // Fallback for environments without secure random (not recommended for production)
  // Note: This fallback should not be used in production environments
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 0xFFFFFFFF);
  }
  return array;
}

/**
 * Platform-agnostic browser language detection
 */
export function getBrowserLanguage(): string | null {
  // Browser environment
  if (typeof window !== 'undefined' && window.navigator) {
    return window.navigator.language;
  }
  
  // Node.js environment - check environment variables
  if (typeof process !== 'undefined' && process.env) {
    return process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || null;
  }
  
  return null;
}

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Check if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && 
         process.versions !== undefined && 
         typeof process.versions.node === 'string';
}

/**
 * Check if secure crypto is available
 */
export function isSecureCryptoAvailable(): boolean {
  // Browser crypto
  if (isBrowser() && window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return true;
  }
  
  // Node.js crypto
  if (isNode()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('crypto');
      return true;
    } catch {
      return false;
    }
  }
  
  return false;
}